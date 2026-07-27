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
    type: 'appointment_risk' | 'compliance_alert' | 'draft_preview' | 'general_summary';
    title: string;
    payload: any;
  };
}
