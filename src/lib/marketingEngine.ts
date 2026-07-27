import type { AutomatedTriggerRule, CampaignType, CustomerSegmentType, MarketingCampaign } from '../types';

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'CMP-201',
    title: 'Slow Tuesday Morning Fill-Up',
    type: 'Off-Peak Filler',
    targetSegment: 'All',
    channel: 'SMS',
    discountOffer: '20% OFF Any Service',
    scheduledSlotTime: 'Tuesday 9:00 AM - 12:00 PM',
    status: 'Active',
    messageText: '✨ Luxe & Glow Flash Perk: Book any haircut or facial this Tuesday morning between 9am-12pm & enjoy 20% OFF! Reply YES to claim your spot.',
    recipientsCount: 84,
    conversionsCount: 14,
    conversionRatePct: 16.7,
    revenueGenerated: 1680,
    campaignCost: 12,
    roiMultiplier: 140,
    createdAt: '2026-07-25'
  },
  {
    id: 'CMP-202',
    title: 'At-Risk Client VIP Win-Back',
    type: 'At-Risk Win-Back',
    targetSegment: 'At-Risk',
    channel: 'Both',
    discountOffer: 'Free Keratin Hair Mask Add-On ($45 Value)',
    status: 'Active',
    messageText: 'We miss you at Luxe & Glow! We saved a complimentary $45 Deep Keratin Hair Treatment for your next appointment this month. Book today with code WELCOME45.',
    recipientsCount: 42,
    conversionsCount: 9,
    conversionRatePct: 21.4,
    revenueGenerated: 1980,
    campaignCost: 25,
    roiMultiplier: 79.2,
    createdAt: '2026-07-22'
  },
  {
    id: 'CMP-203',
    title: 'Rainy Day Pamper Push',
    type: 'Rainy Day Special',
    targetSegment: 'Loyal Regulars',
    channel: 'SMS',
    discountOffer: '$25 Spa Gift Voucher',
    status: 'Completed',
    messageText: '🌧️ Rainy day special! Warm up with our HydraFacial & Scalp Massage package today with a bonus $25 voucher. 4 slots left today!',
    recipientsCount: 30,
    conversionsCount: 6,
    conversionRatePct: 20.0,
    revenueGenerated: 1050,
    campaignCost: 8,
    roiMultiplier: 131,
    createdAt: '2026-07-18'
  }
];

export const INITIAL_TRIGGERS: AutomatedTriggerRule[] = [
  {
    id: 'TRG-301',
    name: 'Automatic Off-Peak Tuesday/Wednesday Slot Filler',
    condition: 'Demand Forecast < 40% 48 hours prior',
    action: 'Send 20% OFF SMS campaign to segment: All active clients',
    isEnabled: true,
    timesTriggered: 12,
    revenueRescued: 4320
  },
  {
    id: 'TRG-302',
    name: 'Automated 60-Day Churn Prevention Alert',
    condition: 'Client days since last visit > 60 days',
    action: 'Auto-generate personalized $30 Win-Back voucher email',
    isEnabled: true,
    timesTriggered: 28,
    revenueRescued: 6720
  },
  {
    id: 'TRG-303',
    name: 'Rainy Day Hydro-Facial Flash Promo',
    condition: 'Weather simulation changes to Rain or Thunderstorm',
    action: 'Launch instant 15% discount text to Spa & Skincare regulars',
    isEnabled: true,
    timesTriggered: 5,
    revenueRescued: 1850
  }
];

export function createCampaignDraft(
  type: CampaignType,
  targetSegment: CustomerSegmentType | 'All',
  offer: string,
  timeSlot?: string
): MarketingCampaign {
  let title = '';
  let messageText = '';

  switch (type) {
    case 'Off-Peak Filler':
      title = `AI Fill-Up: ${timeSlot || 'Off-Peak Hours'}`;
      messageText = `⚡ Exclusive Luxe & Glow Flash Special: Get ${offer} when you book your slot during ${timeSlot || 'off-peak hours'}! Limited spots remaining. Reply BOOK to reserve.`;
      break;
    case 'At-Risk Win-Back':
      title = `AI Win-Back: ${targetSegment} Segment`;
      messageText = `🌸 We’d love to welcome you back to Luxe & Glow! Take advantage of ${offer} on your next visit this week. Use code REFRESH at booking.`;
      break;
    case 'VIP Loyalty Reward':
      title = `VIP Exclusive Perk: ${targetSegment}`;
      messageText = `👑 As one of our most valued clients, enjoy ${offer} on your upcoming reservation! Thank you for being part of the Luxe & Glow family.`;
      break;
    case 'Rainy Day Special':
      title = `Rainy Day Warmup: ${offer}`;
      messageText = `🌧️ Rain in the forecast! Turn today into a self-care day with ${offer}. Slots open now at Luxe & Glow!`;
      break;
  }

  return {
    id: `CMP-${Date.now()}`,
    title,
    type,
    targetSegment,
    channel: 'SMS',
    discountOffer: offer,
    scheduledSlotTime: timeSlot,
    status: 'Draft',
    messageText,
    recipientsCount: targetSegment === 'At-Risk' ? 42 : targetSegment === 'VIP Champions' ? 35 : 120,
    conversionsCount: 0,
    conversionRatePct: 0,
    revenueGenerated: 0,
    campaignCost: 15,
    roiMultiplier: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };
}
