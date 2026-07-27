import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type {
  Appointment,
  StaffMember,
  HealthSafetyLog,
  ActionModalState,
  ChatMessage,
  RiskScoreResult,
  ComplianceSummary
} from '../types';
import { scoreAppointment } from '../lib/scoringEngine';
import { calculateComplianceSummary } from '../lib/complianceEngine';
import { handleCopilotQuery, toolDraftReminder } from '../lib/copilotAgent';
import {
  fetchAppointmentsApi,
  createAppointmentApi,
  fetchComplianceApi,
  createLicenseApi,
  createComplianceLogApi,
  checkBackendHealth
} from '../services/api';

interface SalonContextType {
  appointments: Appointment[];
  staffList: StaffMember[];
  healthLogs: HealthSafetyLog[];
  weatherSim: 'Clear' | 'Rain' | 'Thunderstorm';
  setWeatherSim: (weather: 'Clear' | 'Rain' | 'Thunderstorm') => void;
  scoredAppointments: Array<{ appointment: Appointment; result: RiskScoreResult }>;
  complianceSummary: ComplianceSummary;
  chatMessages: ChatMessage[];
  actionModal: ActionModalState;
  isBackendConnected: boolean;
  closeActionModal: () => void;
  openActionModal: (modal: Omit<ActionModalState, 'isOpen'>) => void;
  sendCopilotMessage: (prompt: string) => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'clientHistory'> & { totalVisits?: number; pastNoShows?: number; pastCancellations?: number }) => void;
  triggerDraftAction: (category: 'appointment' | 'compliance', id: string) => void;
  addComplianceItem: (item: { staffId?: string; title: string; category: any; expiryDate: string; licenseNumber?: string }) => void;
}

const initialAppointments: Appointment[] = [
  {
    id: 'APT-101',
    clientName: 'Jessica Miller',
    clientPhone: '(555) 234-5678',
    clientEmail: 'jessica.m@example.com',
    serviceName: 'Balayage & Full Color Treatment',
    servicePrice: 220,
    serviceDurationMin: 150,
    appointmentDate: '2026-07-28',
    appointmentTime: '15:30',
    dayOfWeek: 'Friday',
    bookingLeadTimeDays: 18,
    channel: 'third-party',
    clientHistory: {
      totalVisits: 2,
      pastNoShows: 1,
      pastCancellations: 1
    },
    status: 'scheduled'
  },
  {
    id: 'APT-102',
    clientName: 'Marcus Vance',
    clientPhone: '(555) 876-5432',
    clientEmail: 'marcus.vance@example.com',
    serviceName: "Men's Executive Haircut & Beard Sculpt",
    servicePrice: 65,
    serviceDurationMin: 45,
    appointmentDate: '2026-07-27',
    appointmentTime: '11:00',
    dayOfWeek: 'Tuesday',
    bookingLeadTimeDays: 1,
    channel: 'walk-in',
    clientHistory: {
      totalVisits: 14,
      pastNoShows: 0,
      pastCancellations: 0
    },
    status: 'scheduled'
  },
  {
    id: 'APT-103',
    clientName: 'Samantha Reed',
    clientPhone: '(555) 345-6789',
    clientEmail: 'samantha.r@example.com',
    serviceName: 'HydraFacial Glow & LED Therapy',
    servicePrice: 175,
    serviceDurationMin: 75,
    appointmentDate: '2026-07-28',
    appointmentTime: '17:00',
    dayOfWeek: 'Friday',
    bookingLeadTimeDays: 12,
    channel: 'app',
    clientHistory: {
      totalVisits: 0,
      pastNoShows: 0,
      pastCancellations: 0
    },
    status: 'scheduled'
  },
  {
    id: 'APT-104',
    clientName: 'Elena Rostova',
    clientPhone: '(555) 901-2345',
    clientEmail: 'elena.r@example.com',
    serviceName: 'Gel Nail Extensions & Nail Art',
    servicePrice: 95,
    serviceDurationMin: 60,
    appointmentDate: '2026-07-27',
    appointmentTime: '14:00',
    dayOfWeek: 'Tuesday',
    bookingLeadTimeDays: 4,
    channel: 'phone',
    clientHistory: {
      totalVisits: 8,
      pastNoShows: 0,
      pastCancellations: 1
    },
    status: 'scheduled'
  },
  {
    id: 'APT-105',
    clientName: 'David Chen',
    clientPhone: '(555) 456-7890',
    clientEmail: 'david.c@example.com',
    serviceName: 'Keratin Smoothing Treatment',
    servicePrice: 250,
    serviceDurationMin: 180,
    appointmentDate: '2026-07-29',
    appointmentTime: '10:00',
    dayOfWeek: 'Saturday',
    bookingLeadTimeDays: 21,
    channel: 'third-party',
    clientHistory: {
      totalVisits: 3,
      pastNoShows: 2,
      pastCancellations: 0
    },
    status: 'scheduled'
  }
];

const initialStaff: StaffMember[] = [
  {
    id: 'STF-01',
    name: 'Chloe Bennett',
    role: 'Master Hair Stylist & Colorist',
    email: 'chloe@luxeglow.com',
    phone: '(555) 111-2222',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    licenses: [
      {
        id: 'LIC-101',
        staffId: 'STF-01',
        staffName: 'Chloe Bennett',
        title: 'Senior Cosmetology License',
        licenseNumber: 'COS-99482-NY',
        issuingAuthority: 'NYS Board of Cosmetology',
        expiryDate: '2026-07-15',
        status: 'EXPIRED',
        daysUntilExpiry: -12,
        category: 'License'
      }
    ]
  },
  {
    id: 'STF-02',
    name: 'David Sterling',
    role: 'Senior Esthetician & Skin Specialist',
    email: 'david.s@luxeglow.com',
    phone: '(555) 333-4444',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    licenses: [
      {
        id: 'LIC-102',
        staffId: 'STF-02',
        staffName: 'David Sterling',
        title: 'Master Esthetician Certificate',
        licenseNumber: 'EST-44310-NY',
        issuingAuthority: 'NYS Division of Licensing Services',
        expiryDate: '2026-08-08',
        status: 'EXPIRING_SOON',
        daysUntilExpiry: 12,
        category: 'Certification'
      }
    ]
  },
  {
    id: 'STF-03',
    name: 'Aria Thorne',
    role: 'Lead Nail Technician',
    email: 'aria@luxeglow.com',
    phone: '(555) 555-6666',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    licenses: [
      {
        id: 'LIC-103',
        staffId: 'STF-03',
        staffName: 'Aria Thorne',
        title: 'Nail Specialty License',
        licenseNumber: 'NL-88219-NY',
        issuingAuthority: 'NYS Board of Barbering & Cosmetology',
        expiryDate: '2027-05-20',
        status: 'COMPLIANT',
        daysUntilExpiry: 297,
        category: 'License'
      }
    ]
  }
];

const initialHealthLogs: HealthSafetyLog[] = [
  {
    id: 'HSL-01',
    title: 'Autoclave Sterilization & Sanitation Audit',
    category: 'Health & Safety',
    lastInspectedDate: '2026-06-01',
    nextRenewalDate: '2026-08-01',
    status: 'EXPIRING_SOON',
    daysUntilExpiry: 5,
    responsibleStaff: 'David Sterling',
    documentRef: 'DOC-SAN-2026-06.pdf'
  },
  {
    id: 'HSL-02',
    title: 'Commercial General Liability Insurance Policy',
    category: 'Insurance',
    lastInspectedDate: '2025-08-10',
    nextRenewalDate: '2026-08-10',
    status: 'EXPIRING_SOON',
    daysUntilExpiry: 14,
    responsibleStaff: 'Salon Owner',
    documentRef: 'POL-GL-99482.pdf'
  },
  {
    id: 'HSL-03',
    title: 'City Health Department Annual Inspection Certificate',
    category: 'Health & Safety',
    lastInspectedDate: '2026-01-15',
    nextRenewalDate: '2027-01-15',
    status: 'COMPLIANT',
    daysUntilExpiry: 172,
    responsibleStaff: 'Chloe Bennett',
    documentRef: 'HEALTH-CERT-2026.pdf'
  }
];

const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-init',
    sender: 'copilot',
    text: `👋 Welcome to **Front Desk Copilot**! I'm monitoring **Luxe & Glow Salon & Spa**.

I've identified **3 high-risk appointments** today and **2 urgent compliance items** (including Chloe Bennett's expired Cosmetology license).

How can I assist you right now?`,
    timestamp: '09:00 AM'
  }
];

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [healthLogs, setHealthLogs] = useState<HealthSafetyLog[]>(initialHealthLogs);
  const [weatherSim, setWeatherSim] = useState<'Clear' | 'Rain' | 'Thunderstorm'>('Clear');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const [actionModal, setActionModal] = useState<ActionModalState>({
    isOpen: false,
    type: 'sms_reminder',
    title: '',
    recipient: '',
    messageContent: ''
  });

  // Initial Sync from Backend API
  useEffect(() => {
    let isMounted = true;
    async function loadBackendData() {
      const isOnline = await checkBackendHealth();
      if (isMounted) setIsBackendConnected(isOnline);
      if (isOnline) {
        const fetchedApts = await fetchAppointmentsApi();
        if (fetchedApts && isMounted) {
          setAppointments(fetchedApts);
        }
        const fetchedComp = await fetchComplianceApi();
        if (fetchedComp && isMounted) {
          setStaffList(fetchedComp.staffList);
          setHealthLogs(fetchedComp.healthLogs);
        }
      }
    }
    loadBackendData();
  }, []);

  const scoredAppointments = useMemo(() => {
    return appointments.map(apt => {
      const aptWithWeather = { ...apt, weatherSimulated: weatherSim };
      return {
        appointment: aptWithWeather,
        result: scoreAppointment(aptWithWeather)
      };
    });
  }, [appointments, weatherSim]);

  const complianceSummary = useMemo(() => {
    return calculateComplianceSummary(staffList, healthLogs);
  }, [staffList, healthLogs]);

  const openActionModal = (modalData: Omit<ActionModalState, 'isOpen'>) => {
    setActionModal({ ...modalData, isOpen: true });
  };

  const closeActionModal = () => {
    setActionModal(prev => ({ ...prev, isOpen: false }));
  };

  const triggerDraftAction = (_category: 'appointment' | 'compliance', id: string) => {
    const draft = toolDraftReminder(id, { appointments, staffList, healthLogs });
    openActionModal({
      type: draft.type,
      title: draft.title,
      recipient: draft.recipient,
      messageContent: draft.text,
      targetId: id
    });
  };

  const sendCopilotMessage = (prompt: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const copilotResponse = handleCopilotQuery(prompt, { appointments, staffList, healthLogs });
      setChatMessages(prev => [...prev, copilotResponse]);
    }, 400);
  };

  const addAppointment = async (newAptData: Omit<Appointment, 'id' | 'clientHistory'> & { totalVisits?: number; pastNoShows?: number; pastCancellations?: number }) => {
    let createdOnApi: Appointment | null = null;
    if (isBackendConnected) {
      createdOnApi = await createAppointmentApi(newAptData);
    }

    const newId = createdOnApi ? createdOnApi.id : `APT-${100 + appointments.length + 1}`;
    const newApt: Appointment = createdOnApi || {
      id: newId,
      clientName: newAptData.clientName,
      clientPhone: newAptData.clientPhone || '(555) 000-1111',
      clientEmail: newAptData.clientEmail || 'client@example.com',
      serviceName: newAptData.serviceName,
      servicePrice: newAptData.servicePrice,
      serviceDurationMin: newAptData.serviceDurationMin || 60,
      appointmentDate: newAptData.appointmentDate,
      appointmentTime: newAptData.appointmentTime,
      dayOfWeek: newAptData.dayOfWeek,
      bookingLeadTimeDays: newAptData.bookingLeadTimeDays,
      channel: newAptData.channel,
      clientHistory: {
        totalVisits: newAptData.totalVisits ?? 0,
        pastNoShows: newAptData.pastNoShows ?? 0,
        pastCancellations: newAptData.pastCancellations ?? 0
      },
      status: 'scheduled'
    };

    setAppointments(prev => [newApt, ...prev]);
  };

  const addComplianceItem = async (itemData: { staffId?: string; title: string; category: any; expiryDate: string; licenseNumber?: string }) => {
    if (itemData.staffId) {
      if (isBackendConnected) {
        await createLicenseApi(itemData as any);
      }
      setStaffList(prev => prev.map(staff => {
        if (staff.id === itemData.staffId) {
          const newLic = {
            id: `LIC-${Date.now()}`,
            staffId: staff.id,
            staffName: staff.name,
            title: itemData.title,
            licenseNumber: itemData.licenseNumber || `LIC-${Math.floor(10000 + Math.random() * 90000)}`,
            issuingAuthority: 'State Board',
            expiryDate: itemData.expiryDate,
            status: 'COMPLIANT' as const,
            daysUntilExpiry: 30,
            category: itemData.category || 'License'
          };
          return { ...staff, licenses: [...staff.licenses, newLic] };
        }
        return staff;
      }));
    } else {
      if (isBackendConnected) {
        await createComplianceLogApi({ title: itemData.title, category: itemData.category, expiryDate: itemData.expiryDate });
      }
      const newLog: HealthSafetyLog = {
        id: `HSL-${Date.now()}`,
        title: itemData.title,
        category: itemData.category || 'Health & Safety',
        lastInspectedDate: new Date().toISOString().split('T')[0],
        nextRenewalDate: itemData.expiryDate,
        status: 'COMPLIANT',
        daysUntilExpiry: 30,
        responsibleStaff: 'Front Desk Manager',
        documentRef: 'DOC-UPLOADED.pdf'
      };
      setHealthLogs(prev => [...prev, newLog]);
    }
  };

  return (
    <SalonContext.Provider
      value={{
        appointments,
        staffList,
        healthLogs,
        weatherSim,
        setWeatherSim,
        scoredAppointments,
        complianceSummary,
        chatMessages,
        actionModal,
        isBackendConnected,
        closeActionModal,
        openActionModal,
        sendCopilotMessage,
        addAppointment,
        triggerDraftAction,
        addComplianceItem
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
