import type { Appointment, RiskScoreResult, RiskTier, RiskFactor } from '../types';

/**
 * No-Show Risk Predictor Engine
 * Uses an explainable weighted heuristic model based on booking signals.
 */
export function scoreAppointment(apt: Appointment): RiskScoreResult {
  let score = 25; // baseline neutral score
  const factors: RiskFactor[] = [];

  // 1. Client History Analysis (Strongest Signal)
  const totalVisits = apt.clientHistory.totalVisits;
  const pastNoShows = apt.clientHistory.pastNoShows;
  const pastCancellations = apt.clientHistory.pastCancellations;

  if (totalVisits === 0) {
    score += 18;
    factors.push({
      title: 'First-Time Client',
      impact: 'negative',
      description: 'First appointment with no established attendance history (+18 risk points).'
    });
  } else {
    const noShowRate = pastNoShows / totalVisits;
    const cancelRate = pastCancellations / totalVisits;

    if (noShowRate >= 0.25) {
      const added = Math.min(45, Math.round(noShowRate * 100));
      score += added;
      factors.push({
        title: 'High Historical No-Show Rate',
        impact: 'negative',
        description: `Client missed ${pastNoShows} of ${totalVisits} past appointments (${Math.round(noShowRate * 100)}% no-show rate, +${added} risk points).`
      });
    } else if (noShowRate > 0) {
      score += 15;
      factors.push({
        title: 'Previous No-Show On Record',
        impact: 'negative',
        description: `Client has ${pastNoShows} recorded no-show in history (+15 risk points).`
      });
    }

    if (cancelRate >= 0.3) {
      score += 10;
      factors.push({
        title: 'Frequent Last-Minute Cancellations',
        impact: 'negative',
        description: `Client has canceled ${Math.round(cancelRate * 100)}% of past bookings (+10 risk points).`
      });
    }

    if (totalVisits >= 6 && noShowRate === 0) {
      score -= 22;
      factors.push({
        title: 'Loyal Repeat Client',
        impact: 'positive',
        description: `Flawless history across ${totalVisits} completed visits (-22 risk points).`
      });
    }
  }

  // 2. Booking Lead Time Signal
  const leadTime = apt.bookingLeadTimeDays;
  if (leadTime > 14) {
    const added = totalVisits < 3 ? 20 : 10;
    score += added;
    factors.push({
      title: 'Extended Booking Lead Time',
      impact: 'negative',
      description: `Booked ${leadTime} days in advance; higher risk of scheduling conflicts (+${added} risk points).`
    });
  } else if (leadTime <= 1) {
    score -= 10;
    factors.push({
      title: 'Short Lead-Time / Walk-In',
      impact: 'positive',
      description: `Booked within 24 hours of appointment (-10 risk points).`
    });
  }

  // 3. Booking Channel Signal
  if (apt.channel === 'third-party') {
    score += 16;
    factors.push({
      title: 'Third-Party Aggregator Channel',
      impact: 'negative',
      description: 'Booked via discount/3rd party app; correlated with lower engagement (+16 risk points).'
    });
  } else if (apt.channel === 'walk-in') {
    score -= 12;
    factors.push({
      title: 'Direct Walk-In Channel',
      impact: 'positive',
      description: 'In-person walk-in booking (-12 risk points).'
    });
  }

  // 4. Service Metadata & Price Point
  if (apt.servicePrice >= 150 && leadTime > 5 && (totalVisits === 0 || pastNoShows > 0)) {
    score += 12;
    factors.push({
      title: 'High-Value Service Commitment',
      impact: 'negative',
      description: `$${apt.servicePrice} premium service booked ahead without prior deposit (+12 risk points).`
    });
  }

  // 5. Day & Time Signal
  const isWeekendPeak = apt.dayOfWeek === 'Friday' || apt.dayOfWeek === 'Saturday';
  const hour = parseInt(apt.appointmentTime.split(':')[0], 10) || 12;
  if (isWeekendPeak && hour >= 16) {
    score += 8;
    factors.push({
      title: 'Weekend Evening Slot',
      impact: 'negative',
      description: `${apt.dayOfWeek} at ${apt.appointmentTime} has higher competing social events (+8 risk points).`
    });
  }

  // 6. Weather Signal Simulation
  if (apt.weatherSimulated === 'Thunderstorm') {
    score += 20;
    factors.push({
      title: 'Severe Weather Forecast',
      impact: 'negative',
      description: 'Forecasted thunderstorm / heavy rain on appointment date (+20 risk points).'
    });
  } else if (apt.weatherSimulated === 'Rain') {
    score += 10;
    factors.push({
      title: 'Rainy Weather Forecast',
      impact: 'negative',
      description: 'Light rain expected on appointment date (+10 risk points).'
    });
  }

  // Clamp final score
  const finalScore = Math.min(98, Math.max(5, Math.round(score)));

  // Tier classification
  let tier: RiskTier = 'Low';
  if (finalScore >= 65) {
    tier = 'High';
  } else if (finalScore >= 38) {
    tier = 'Medium';
  }

  // Determine suggested action
  let suggestedAction: RiskScoreResult['suggestedAction'] = 'send_reminder';
  let suggestedActionLabel = 'Send 24h SMS Reminder';
  let suggestedActionDescription = 'Standard automated text reminder day before appointment.';

  if (tier === 'High') {
    if (apt.servicePrice >= 100) {
      suggestedAction = 'request_deposit';
      suggestedActionLabel = 'Request $30 Deposit';
      suggestedActionDescription = 'Send deposit link to secure appointment slot and reduce no-show probability.';
    } else {
      suggestedAction = 'overbook_slot';
      suggestedActionLabel = 'Flag for Waitlist Overbook';
      suggestedActionDescription = 'Mark slot as eligible for waitlist backup in front-desk scheduling calendar.';
    }
  } else if (tier === 'Medium') {
    suggestedAction = 'double_confirm_sms';
    suggestedActionLabel = 'Send 2-Way SMS Double-Confirm';
    suggestedActionDescription = 'Prompt client to reply "YES" to confirm attendance within 12 hours.';
  }

  const estimatedLossRisk = Math.round((finalScore / 100) * apt.servicePrice);

  return {
    appointmentId: apt.id,
    score: finalScore,
    tier,
    factors,
    suggestedAction,
    suggestedActionLabel,
    suggestedActionDescription,
    weatherImpact: apt.weatherSimulated || 'Clear',
    estimatedLossRisk
  };
}
