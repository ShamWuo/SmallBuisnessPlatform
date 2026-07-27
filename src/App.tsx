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
import { CalendarPlus, ShieldCheck, Globe } from 'lucide-react';

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
    landing: 'Landing Page',
    overview: 'Overview Dashboard',
    predictor: 'No-Show Risk Predictor',
    compliance: 'Compliance Hub',
    copilot: 'Front Desk Assistant',
    clients: 'Client Records',
    settings: 'Settings'
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="main-wrapper">
        <header className="clean-topbar">
          <div className="topbar-heading">
            {titleMap[activeTab]}
          </div>

          <div className="topbar-actions">
            <button className="btn-ghost" onClick={() => setActiveTab('landing')}>
              <Globe size={13} /> Landing Page
            </button>
            <button className="btn-ghost" onClick={() => setIsNewComplianceOpen(true)}>
              <ShieldCheck size={13} /> Log License
            </button>
            <button className="btn-blue" onClick={() => setIsNewBookingOpen(true)}>
              <CalendarPlus size={13} /> + Booking Risk Scan
            </button>
          </div>
        </header>

        <main className="page-content">
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
