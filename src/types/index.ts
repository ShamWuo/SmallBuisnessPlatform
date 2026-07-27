export type BookingChannel = 'walk-in' | 'app' | 'phone' | 'third-party';

export type RiskTier = 'Low' | 'Medium' | 'High';

export type ComplianceCategory = 'License' | 'Certification' | 'Health & Safety' | 'Insurance';

export type ComplianceStatus = 'COMPLIANT' | 'EXPIRING_SOON' | 'EXPIRED';

export interface ClientHistory {
  totalVisits: number;
  pastNoShows: number;
  pastCancellations: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceName: string;
  servicePrice: number;
  serviceDurationMin: number;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
  dayOfWeek: string;
  bookingLeadTimeDays: number;
  channel: BookingChannel;
  clientHistory: ClientHistory;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  weatherSimulated?: 'Clear' | 'Rain' | 'Thunderstorm';
}

export interface RiskFactor {
  title: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface RiskScoreResult {
  appointmentId: string;
  score: number; // 0 - 100
  tier: RiskTier;
  factors: RiskFactor[];
  suggestedAction: 'send_reminder' | 'request_deposit' | 'overbook_slot' | 'double_confirm_sms';
  suggestedActionLabel: string;
  suggestedActionDescription: string;
  weatherImpact?: string;
  estimatedLossRisk: number;
}

export interface StaffLicense {
  id: string;
  staffId: string;
  staffName: string;
  title: string;
  licenseNumber: string;
  issuingAuthority: string;
  expiryDate: string;
  status: ComplianceStatus;
  daysUntilExpiry: number;
  category: 'License' | 'Certification';
}

export interface HealthSafetyLog {
  id: string;
  title: string;
  category: ComplianceCategory;
  lastInspectedDate: string;
  nextRenewalDate: string;
  status: ComplianceStatus;
  daysUntilExpiry: number;
  responsibleStaff: string;
  documentRef: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatarUrl: string;
  licenses: StaffLicense[];
}

export interface ComplianceSummary {
  totalItems: number;
  compliantCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  healthIndex: number; // 0 - 100 percentage
  expiringOrExpiredItems: Array<StaffLicense | HealthSafetyLog>;
}

export interface ActionModalState {
  isOpen: boolean;
  type: 'sms_reminder' | 'deposit_request' | 'owner_email' | 'double_confirm';
  title: string;
  recipient: string;
  messageContent: string;
  targetId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  toolCallName?: string;
  actionCard?: {
    type: 'appointment_risk' | 'compliance_alert' | 'draft_preview' | 'general_summary' | 'demand_alert' | 'marketing_draft';
    title: string;
    payload: any;
  };
}

// --- Enterprise Intelligence Additions ---

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface HourlyDemandSlot {
  hour: number; // 8 to 20 (8 AM to 8 PM)
  hourLabel: string;
  predictedDemandPct: number; // 0 - 100%
  expectedBookings: number;
  capacityLimit: number;
  status: 'Peak' | 'Optimal' | 'Off-Peak' | 'Surge';
  revenuePotential: number;
}

export interface DayDemandForecast {
  day: DayOfWeek;
  date: string; // YYYY-MM-DD
  overallDemandPct: number;
  peakHours: string[];
  offPeakHours: string[];
  slots: HourlyDemandSlot[];
  recommendedStaffCount: number;
  actualStaffCount: number;
  weatherFactor: string;
}

export interface StaffingRecommendation {
  day: DayOfWeek;
  timeSlot: string;
  requiredStaff: number;
  currentStaff: number;
  actionRequired: 'Add Staff' | 'Optimal' | 'Overstaffed';
  reasoning: string;
}

export interface SupplyRequirement {
  id: string;
  itemName: string;
  category: 'Hair Color' | 'Treatment Formulas' | 'Skincare' | 'Sanitation & Disinfectant';
  currentStockUnits: number;
  projectedDemandUnits: number;
  unit: string;
  status: 'Sufficient' | 'Low Stock' | 'Critical Reorder';
  reorderQuantity: number;
  estimatedCost: number;
}

// --- Customer Insights & LTV Types ---

export type CustomerSegmentType = 'VIP Champions' | 'Loyal Regulars' | 'At-Risk' | 'New Opportunities';

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: CustomerSegmentType;
  totalVisits: number;
  lifetimeSpend: number;
  averageTicket: number;
  lastVisitDate: string; // YYYY-MM-DD
  daysSinceLastVisit: number;
  predicted12MonthLTV: number;
  churnRiskScore: number; // 0 - 100%
  churnRiskLevel: 'Low' | 'Medium' | 'High';
  favoriteService: string;
  npsScore?: number;
  recentReviewSentiment?: 'Positive' | 'Neutral' | 'Negative';
  notes?: string;
}

export interface CustomerInsightsSummary {
  totalCustomers: number;
  segmentCounts: Record<CustomerSegmentType, number>;
  avgLifetimeValue: number;
  totalAtRiskCount: number;
  atRiskRevenueValue: number;
  overallSentimentScore: number; // 0 - 100
  topRequestedServices: Array<{ serviceName: string; bookingShare: number }>;
}

// --- AI Marketing Automation Types ---

export type CampaignType = 'Off-Peak Filler' | 'At-Risk Win-Back' | 'VIP Loyalty Reward' | 'Rainy Day Special';

export interface MarketingCampaign {
  id: string;
  title: string;
  type: CampaignType;
  targetSegment: CustomerSegmentType | 'All';
  channel: 'SMS' | 'Email' | 'Both';
  discountOffer: string; // e.g. "20% OFF" or "Free Treatment Add-on"
  scheduledSlotTime?: string; // e.g. "Tuesday 9am-12pm"
  status: 'Active' | 'Scheduled' | 'Completed' | 'Draft';
  messageText: string;
  recipientsCount: number;
  conversionsCount: number;
  conversionRatePct: number;
  revenueGenerated: number;
  campaignCost: number;
  roiMultiplier: number;
  createdAt: string;
}

export interface AutomatedTriggerRule {
  id: string;
  name: string;
  condition: string; // e.g. "Demand Forecast < 40% 48h prior"
  action: string; // e.g. "Send 15% discount SMS to At-Risk Segment"
  isEnabled: boolean;
  timesTriggered: number;
  revenueRescued: number;
}

