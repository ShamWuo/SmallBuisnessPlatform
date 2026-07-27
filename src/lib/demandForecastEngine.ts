import type { Appointment, DayDemandForecast, DayOfWeek, HourlyDemandSlot, StaffingRecommendation, SupplyRequirement } from '../types';

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const HOUR_LABELS: Record<number, string> = {
  8: '8:00 AM',
  9: '9:00 AM',
  10: '10:00 AM',
  11: '11:00 AM',
  12: '12:00 PM',
  13: '1:00 PM',
  14: '2:00 PM',
  15: '3:00 PM',
  16: '4:00 PM',
  17: '5:00 PM',
  18: '6:00 PM',
  19: '7:00 PM',
  20: '8:00 PM'
};

// Base demand curves by day of week (historical baseline for salons)
const BASE_DEMAND_PATTERN: Record<DayOfWeek, Record<number, number>> = {
  Monday: { 8: 15, 9: 25, 10: 40, 11: 45, 12: 50, 13: 45, 14: 40, 15: 35, 16: 30, 17: 25, 18: 20, 19: 15, 20: 10 },
  Tuesday: { 8: 20, 9: 35, 10: 55, 11: 60, 12: 55, 13: 50, 14: 65, 15: 55, 16: 45, 17: 40, 18: 30, 19: 20, 20: 15 },
  Wednesday: { 8: 25, 9: 45, 10: 60, 11: 65, 12: 60, 13: 55, 14: 70, 15: 60, 16: 50, 17: 45, 18: 35, 19: 25, 20: 15 },
  Thursday: { 8: 30, 9: 50, 10: 70, 11: 75, 12: 70, 13: 65, 14: 75, 15: 80, 16: 85, 17: 75, 18: 55, 19: 40, 20: 25 },
  Friday: { 8: 40, 9: 65, 10: 85, 11: 90, 12: 80, 13: 85, 14: 95, 15: 98, 16: 95, 17: 90, 18: 75, 19: 60, 20: 40 },
  Saturday: { 8: 50, 9: 80, 10: 95, 11: 100, 12: 95, 13: 90, 14: 95, 15: 90, 16: 85, 17: 70, 18: 50, 19: 35, 20: 20 },
  Sunday: { 8: 20, 9: 40, 10: 60, 11: 70, 12: 75, 13: 70, 14: 65, 15: 50, 16: 35, 17: 25, 18: 15, 19: 10, 20: 5 }
};

export function generate7DayDemandForecast(
  appointments: Appointment[],
  weatherSim: 'Clear' | 'Rain' | 'Thunderstorm' = 'Clear'
): DayDemandForecast[] {
  let weatherMultiplier = 1.0;
  if (weatherSim === 'Rain') weatherMultiplier = 0.85;
  if (weatherSim === 'Thunderstorm') weatherMultiplier = 0.65;

  return DAYS_OF_WEEK.map((day, index) => {
    const baseCurve = BASE_DEMAND_PATTERN[day];
    
    // Count scheduled appointments for this day
    const dayAppointments = appointments.filter(a => a.dayOfWeek === day);
    
    const slots: HourlyDemandSlot[] = Object.keys(HOUR_LABELS).map(hStr => {
      const hour = parseInt(hStr, 10);
      const basePct = baseCurve[hour] || 30;
      
      // Check appointments booked in this hour
      const bookedInHour = dayAppointments.filter(a => {
        const aptHour = parseInt(a.appointmentTime.split(':')[0], 10);
        return aptHour === hour;
      }).length;

      // Combine historical baseline curve + real appointment volume + weather factor
      const simulatedBoost = bookedInHour * 20;
      const rawDemand = Math.round((basePct * weatherMultiplier) + simulatedBoost);
      const finalDemand = Math.min(100, Math.max(10, rawDemand));

      let status: HourlyDemandSlot['status'] = 'Optimal';
      if (finalDemand >= 85) status = 'Peak';
      else if (finalDemand >= 95) status = 'Surge';
      else if (finalDemand < 45) status = 'Off-Peak';

      const capacityLimit = 6; // Max 6 client slots per hour across stylists
      const expectedBookings = Math.round((finalDemand / 100) * capacityLimit);
      const revenuePotential = expectedBookings * 125; // avg ticket $125

      return {
        hour,
        hourLabel: HOUR_LABELS[hour],
        predictedDemandPct: finalDemand,
        expectedBookings,
        capacityLimit,
        status,
        revenuePotential
      };
    });

    const overallDemandPct = Math.round(
      slots.reduce((sum, s) => sum + s.predictedDemandPct, 0) / slots.length
    );

    const peakHours = slots
      .filter(s => s.status === 'Peak' || s.status === 'Surge')
      .map(s => s.hourLabel);

    const offPeakHours = slots
      .filter(s => s.status === 'Off-Peak')
      .map(s => s.hourLabel);

    // Dynamic staffing recommendation
    const recommendedStaffCount = overallDemandPct > 75 ? 5 : overallDemandPct > 50 ? 4 : 3;
    const actualStaffCount = (index % 2 === 0) ? recommendedStaffCount : recommendedStaffCount - 1;

    return {
      day,
      date: `2026-07-${27 + index}`,
      overallDemandPct,
      peakHours,
      offPeakHours,
      slots,
      recommendedStaffCount,
      actualStaffCount,
      weatherFactor: weatherSim === 'Clear' ? 'Optimal (+0%)' : weatherSim === 'Rain' ? 'Rain Dip (-15%)' : 'Severe Weather (-35%)'
    };
  });
}

export function generateStaffingRecommendations(forecast: DayDemandForecast[]): StaffingRecommendation[] {
  const recommendations: StaffingRecommendation[] = [];

  forecast.forEach(dayForecast => {
    // Check peak slots
    const peakSlot = dayForecast.slots.find(s => s.status === 'Peak' || s.status === 'Surge');
    if (peakSlot && dayForecast.actualStaffCount < dayForecast.recommendedStaffCount) {
      recommendations.push({
        day: dayForecast.day,
        timeSlot: `${peakSlot.hourLabel} Peak Window`,
        requiredStaff: dayForecast.recommendedStaffCount,
        currentStaff: dayForecast.actualStaffCount,
        actionRequired: 'Add Staff',
        reasoning: `Predicted ${peakSlot.predictedDemandPct}% capacity demand during ${peakSlot.hourLabel}. Current ${dayForecast.actualStaffCount} stylists will create booking bottlenecks.`
      });
    }

    // Check off-peak slots
    const offPeakCount = dayForecast.slots.filter(s => s.status === 'Off-Peak').length;
    if (offPeakCount >= 5 && dayForecast.actualStaffCount > 3) {
      recommendations.push({
        day: dayForecast.day,
        timeSlot: 'Morning Off-Peak (8 AM - 11 AM)',
        requiredStaff: 2,
        currentStaff: dayForecast.actualStaffCount,
        actionRequired: 'Overstaffed',
        reasoning: `Demand drops to < 40%. Recommend shifting 1 staff member to Friday peak shift or launching AI Off-Peak campaign.`
      });
    }
  });

  if (recommendations.length === 0) {
    recommendations.push({
      day: 'Friday',
      timeSlot: '2:00 PM - 5:00 PM',
      requiredStaff: 4,
      currentStaff: 4,
      actionRequired: 'Optimal',
      reasoning: 'Staffing schedule perfectly matches forecasted booking demand curve.'
    });
  }

  return recommendations;
}

export function generateSupplyRequirements(appointments: Appointment[]): SupplyRequirement[] {
  // Calculate inventory usage based on scheduled services
  const colorBookings = appointments.filter(a => a.serviceName.toLowerCase().includes('color') || a.serviceName.toLowerCase().includes('balayage')).length;
  const keratinBookings = appointments.filter(a => a.serviceName.toLowerCase().includes('keratin')).length;
  const facialBookings = appointments.filter(a => a.serviceName.toLowerCase().includes('facial') || a.serviceName.toLowerCase().includes('glow')).length;

  return [
    {
      id: 'SUP-101',
      itemName: 'Platinum Blonde & Balayage Lightener (Kits)',
      category: 'Hair Color',
      currentStockUnits: 8,
      projectedDemandUnits: Math.max(12, colorBookings * 4 + 6),
      unit: 'kits',
      status: 'Low Stock',
      reorderQuantity: 15,
      estimatedCost: 280
    },
    {
      id: 'SUP-102',
      itemName: 'Complex Keratin Smoothing Treatment Vials',
      category: 'Treatment Formulas',
      currentStockUnits: 3,
      projectedDemandUnits: Math.max(8, keratinBookings * 3 + 5),
      unit: 'vials',
      status: 'Critical Reorder',
      reorderQuantity: 10,
      estimatedCost: 450
    },
    {
      id: 'SUP-103',
      itemName: 'HydraFacial Hyaluronic Infusion Solution',
      category: 'Skincare',
      currentStockUnits: 14,
      projectedDemandUnits: Math.max(9, facialBookings * 3 + 4),
      unit: 'bottles',
      status: 'Sufficient',
      reorderQuantity: 0,
      estimatedCost: 0
    },
    {
      id: 'SUP-104',
      itemName: 'Hospital-Grade Barbicide Sanitation Concentrate',
      category: 'Sanitation & Disinfectant',
      currentStockUnits: 2,
      projectedDemandUnits: 5,
      unit: 'gallons',
      status: 'Low Stock',
      reorderQuantity: 5,
      estimatedCost: 95
    }
  ];
}
