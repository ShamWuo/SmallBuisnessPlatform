import type { Appointment, CustomerInsightsSummary, CustomerProfile, CustomerSegmentType } from '../types';

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'CUST-001',
    name: 'Jessica Miller',
    email: 'jessica.m@example.com',
    phone: '(555) 234-5678',
    segment: 'At-Risk',
    totalVisits: 6,
    lifetimeSpend: 1320,
    averageTicket: 220,
    lastVisitDate: '2026-05-10',
    daysSinceLastVisit: 77,
    predicted12MonthLTV: 2400,
    churnRiskScore: 78,
    churnRiskLevel: 'High',
    favoriteService: 'Balayage & Full Color Treatment',
    npsScore: 9,
    recentReviewSentiment: 'Positive',
    notes: 'Long overdue for 6-week root retouch & gloss refresh.'
  },
  {
    id: 'CUST-002',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    phone: '(555) 876-5432',
    segment: 'VIP Champions',
    totalVisits: 14,
    lifetimeSpend: 910,
    averageTicket: 65,
    lastVisitDate: '2026-07-02',
    daysSinceLastVisit: 24,
    predicted12MonthLTV: 1560,
    churnRiskScore: 12,
    churnRiskLevel: 'Low',
    favoriteService: 'Men’s Executive Haircut & Beard Sculpt',
    npsScore: 10,
    recentReviewSentiment: 'Positive',
    notes: 'Books every 3 weeks precisely. Prefers afternoon slots.'
  },
  {
    id: 'CUST-003',
    name: 'Samantha Reed',
    email: 'samantha.r@example.com',
    phone: '(555) 345-6789',
    segment: 'New Opportunities',
    totalVisits: 1,
    lifetimeSpend: 175,
    averageTicket: 175,
    lastVisitDate: '2026-06-28',
    daysSinceLastVisit: 28,
    predicted12MonthLTV: 1400,
    churnRiskScore: 35,
    churnRiskLevel: 'Medium',
    favoriteService: 'HydraFacial Glow & LED Therapy',
    npsScore: 8,
    recentReviewSentiment: 'Positive',
    notes: 'First visit trial. Highly responsive to skincare package offers.'
  },
  {
    id: 'CUST-004',
    name: 'Elena Rostova',
    email: 'elena.r@example.com',
    phone: '(555) 901-2345',
    segment: 'Loyal Regulars',
    totalVisits: 8,
    lifetimeSpend: 760,
    averageTicket: 95,
    lastVisitDate: '2026-07-14',
    daysSinceLastVisit: 12,
    predicted12MonthLTV: 1140,
    churnRiskScore: 18,
    churnRiskLevel: 'Low',
    favoriteService: 'Gel Nail Extensions & Nail Art',
    npsScore: 9,
    recentReviewSentiment: 'Positive',
    notes: 'Consistent bi-weekly nail appointments.'
  },
  {
    id: 'CUST-005',
    name: 'David Chen',
    email: 'david.c@example.com',
    phone: '(555) 456-7890',
    segment: 'At-Risk',
    totalVisits: 3,
    lifetimeSpend: 750,
    averageTicket: 250,
    lastVisitDate: '2026-04-18',
    daysSinceLastVisit: 99,
    predicted12MonthLTV: 2000,
    churnRiskScore: 85,
    churnRiskLevel: 'High',
    favoriteService: 'Keratin Smoothing Treatment',
    npsScore: 6,
    recentReviewSentiment: 'Neutral',
    notes: 'Has missed 2 booking cycles. High ticket value client.'
  },
  {
    id: 'CUST-006',
    name: 'Rachel Adams',
    email: 'rachel.a@example.com',
    phone: '(555) 678-9012',
    segment: 'VIP Champions',
    totalVisits: 18,
    lifetimeSpend: 3240,
    averageTicket: 180,
    lastVisitDate: '2026-07-20',
    daysSinceLastVisit: 6,
    predicted12MonthLTV: 3600,
    churnRiskScore: 5,
    churnRiskLevel: 'Low',
    favoriteService: 'Full Highlights & Blowout Package',
    npsScore: 10,
    recentReviewSentiment: 'Positive',
    notes: 'Top 1% spender in salon. Always purchases retail products.'
  }
];

export function computeCustomerInsights(
  customers: CustomerProfile[],
  appointments: Appointment[]
): CustomerInsightsSummary {
  const totalCustomers = customers.length;
  
  const segmentCounts: Record<CustomerSegmentType, number> = {
    'VIP Champions': 0,
    'Loyal Regulars': 0,
    'At-Risk': 0,
    'New Opportunities': 0
  };

  let totalLTV = 0;
  let totalAtRiskCount = 0;
  let atRiskRevenueValue = 0;

  customers.forEach(c => {
    segmentCounts[c.segment] = (segmentCounts[c.segment] || 0) + 1;
    totalLTV += c.predicted12MonthLTV;

    if (c.churnRiskLevel === 'High' || c.segment === 'At-Risk') {
      totalAtRiskCount++;
      atRiskRevenueValue += c.predicted12MonthLTV;
    }
  });

  const avgLifetimeValue = Math.round(totalLTV / (totalCustomers || 1));

  // Service distribution synthesis
  const serviceCounts: Record<string, number> = {};
  appointments.forEach(a => {
    serviceCounts[a.serviceName] = (serviceCounts[a.serviceName] || 0) + 1;
  });

  const topRequestedServices = Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([serviceName, count]) => ({
      serviceName,
      bookingShare: Math.round((count / (appointments.length || 1)) * 100)
    }));

  return {
    totalCustomers,
    segmentCounts,
    avgLifetimeValue,
    totalAtRiskCount,
    atRiskRevenueValue,
    overallSentimentScore: 92, // 92% positive sentiment
    topRequestedServices
  };
}
