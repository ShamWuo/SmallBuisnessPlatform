import React, { useState } from 'react';
import { SalonProvider } from './context/SalonContext';
import { Sidebar } from './components/Sidebar';
import type { PlatformTab } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { OverviewDashboardView } from './components/OverviewDashboardView';
import { DemandForecastingView } from './components/DemandForecastingView';
import { CustomerInsightsView } from './components/CustomerInsightsView';
import { MarketingAutomationView } from './components/MarketingAutomationView';
import { DynamicPricingView } from './components/DynamicPricingView';
import { MarketBenchmarksView } from './components/MarketBenchmarksView';
import { NoShowPredictorView } from './components/NoShowPredictorView';
import { ComplianceTrackerView } from './components/ComplianceTrackerView';
import { CopilotChat } from './components/CopilotChat';
import { ClientDirectoryView } from './components/ClientDirectoryView';
import { SettingsView } from './components/SettingsView';
import { ActionModal } from './components/ActionModal';
import { NewBookingModal } from './components/NewBookingModal';
import { NewComplianceModal } from './components/NewComplianceModal';
import { SupplierPOModal } from './components/SupplierPOModal';
import { CalendarPlus, ShieldCheck, Megaphone, FileText, Store } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlatformTab>('landing');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isNewComplianceOpen, setIsNewComplianceOpen] = useState(false);
  const [isSupplierPOOpen, setIsSupplierPOOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState('Soho Flagship');

  if (activeTab === 'landing') {
    return (
      <LandingPage onLaunchPlatform={() => setActiveTab('overview')} />
    );
  }

  const titleMap: Record<PlatformTab, string> = {
    landing: 'Landing Page',
    overview: 'Executive Overview Dashboard',
    demand: 'AI Demand & Capacity Forecasting',
    insights: 'Customer Insights & LTV Analytics',
    marketing: 'Automated AI Marketing Engine',
    pricing: 'AI Dynamic Surge & Yield Pricing',
    benchmarks: 'Competitor & Regional Market Radar',
    predictor: 'No-Show Risk Predictor',
    compliance: 'Compliance Hub',
    copilot: 'Enterprise Front Desk Copilot',
    clients: 'Client Records & History',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-card)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', fontWeight: 600 }}>
              <Store size={12} className="text-blue" />
              <select
                value={currentStore}
                onChange={e => setCurrentStore(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
              >
                <option value="Soho Flagship">Soho Flagship</option>
                <option value="Brooklyn Heights">Brooklyn Heights Branch</option>
                <option value="Tribeca Spa">Tribeca Spa Suite</option>
              </select>
            </div>

            <button className="btn-ghost" onClick={() => setIsSupplierPOOpen(true)}>
              <FileText size={13} /> Order Stock PO
            </button>
            <button className="btn-ghost" onClick={() => setActiveTab('marketing')}>
              <Megaphone size={13} /> AI Marketing
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
          {activeTab === 'demand' && <DemandForecastingView onLaunchCampaign={() => setActiveTab('marketing')} />}
          {activeTab === 'insights' && <CustomerInsightsView onTriggerWinBack={() => setActiveTab('marketing')} />}
          {activeTab === 'marketing' && <MarketingAutomationView />}
          {activeTab === 'pricing' && <DynamicPricingView />}
          {activeTab === 'benchmarks' && <MarketBenchmarksView />}
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
      <SupplierPOModal
        isOpen={isSupplierPOOpen}
        onClose={() => setIsSupplierPOOpen(false)}
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
