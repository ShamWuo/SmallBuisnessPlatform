import React, { useState } from 'react';
import { SalonProvider } from './context/SalonContext';
import { Sidebar } from './components/Sidebar';
import type { PlatformTab } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { OverviewDashboardView } from './components/OverviewDashboardView';
import { NoShowPredictorView } from './components/NoShowPredictorView';
import { ComplianceTrackerView } from './components/ComplianceTrackerView';
import { CopilotChat } from './components/CopilotChat';
import { ClientDirectoryView } from './components/ClientDirectoryView';
import { SettingsView } from './components/SettingsView';
import { ActionModal } from './components/ActionModal';
import { NewBookingModal } from './components/NewBookingModal';
import { NewComplianceModal } from './components/NewComplianceModal';
import { Sparkles, CalendarPlus, ShieldCheck, Globe } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlatformTab>('landing');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isNewComplianceOpen, setIsNewComplianceOpen] = useState(false);

  if (activeTab === 'landing') {
    return (
      <LandingPage onLaunchPlatform={() => setActiveTab('overview')} />
    );
  }

  const titleMap: Record<PlatformTab, string> = {
    landing: 'Marketing Landing Page',
    overview: 'Executive Overview Dashboard',
    predictor: 'No-Show Risk Predictor',
    compliance: 'Compliance & License Hub',
    copilot: 'Copilot AI Assistant Desk',
    clients: 'Client Directory & Attendance',
    settings: 'Salon & Model Configuration'
  };

  return (
    <div className="platform-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title text-electric">
            <Sparkles size={18} /> {titleMap[activeTab]}
          </div>

          <div className="topbar-actions">
            <button className="btn-obsidian" onClick={() => setActiveTab('landing')}>
              <Globe size={14} /> Landing Page
            </button>
            <button className="btn-obsidian" onClick={() => setIsNewComplianceOpen(true)}>
              <ShieldCheck size={14} /> Log Cert
            </button>
            <button className="btn-electric" onClick={() => setIsNewBookingOpen(true)}>
              <CalendarPlus size={14} /> + Booking Scan
            </button>
          </div>
        </header>

        <main className="page-body">
          {activeTab === 'overview' && <OverviewDashboardView onNavigate={setActiveTab} />}
          {activeTab === 'predictor' && <NoShowPredictorView />}
          {activeTab === 'compliance' && <ComplianceTrackerView />}
          {activeTab === 'copilot' && <CopilotChat />}
          {activeTab === 'clients' && <ClientDirectoryView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      <ActionModal />
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
      />
      <NewComplianceModal
        isOpen={isNewComplianceOpen}
        onClose={() => setIsNewComplianceOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SalonProvider>
      <AppContent />
    </SalonProvider>
  );
}
