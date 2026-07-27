export interface PricingRule {

  id: string;
  serviceName: string;
  basePrice: number;
  surgePrice: number;
  offPeakPrice: number;
  peakWindow: string;
  offPeakWindow: string;
  isSurgeEnabled: boolean;
  estMonthlyUplift: number;
}

export const INITIAL_PRICING_RULES: PricingRule[] = [
  {
    id: 'PRC-01',
    serviceName: 'Balayage & Full Color Treatment',
    basePrice: 220,
    surgePrice: 250,
    offPeakPrice: 190,
    peakWindow: 'Friday & Saturday 1:00 PM - 6:00 PM',
    offPeakWindow: 'Tuesday & Wednesday 9:00 AM - 12:00 PM',
    isSurgeEnabled: true,
    estMonthlyUplift: 1440
  },
  {
    id: 'PRC-02',
    serviceName: 'Keratin Smoothing Treatment',
    basePrice: 250,
    surgePrice: 285,
    offPeakPrice: 215,
    peakWindow: 'Saturday 10:00 AM - 3:00 PM',
    offPeakWindow: 'Wednesday 10:00 AM - 1:00 PM',
    isSurgeEnabled: true,
    estMonthlyUplift: 1050
  },
  {
    id: 'PRC-03',
    serviceName: 'HydraFacial Glow & LED Therapy',
    basePrice: 175,
    surgePrice: 195,
    offPeakPrice: 150,
    peakWindow: 'Thursday & Friday 4:00 PM - 7:00 PM',
    offPeakWindow: 'Monday & Tuesday 10:00 AM - 1:00 PM',
    isSurgeEnabled: false,
    estMonthlyUplift: 880
  },
  {
    id: 'PRC-04',
    serviceName: 'Gel Nail Extensions & Nail Art',
    basePrice: 95,
    surgePrice: 110,
    offPeakPrice: 80,
    peakWindow: 'Friday & Saturday 12:00 PM - 5:00 PM',
    offPeakWindow: 'Tuesday 11:00 AM - 2:00 PM',
    isSurgeEnabled: true,
    estMonthlyUplift: 620
  }
];

export function calculatePricingUplift(rules: PricingRule[]): number {
  return rules
    .filter(r => r.isSurgeEnabled)
    .reduce((sum, r) => sum + r.estMonthlyUplift, 0);
}
