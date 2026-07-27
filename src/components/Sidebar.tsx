import React from 'react';
import { useSalon } from '../context/SalonContext';
import {
  Sparkles,
  LayoutDashboard,
  ShieldAlert,
  Bot,
  Users,
  Settings,
  Globe,
  ChevronRight
} from 'lucide-react';

export type PlatformTab = 'landing' | 'overview' | 'predictor' | 'compliance' | 'copilot' | 'clients' | 'settings';

interface SidebarProps {
  activeTab: PlatformTab;
  setActiveTab: (tab: PlatformTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { scoredAppointments, complianceSummary } = useSalon();

  const highRiskCount = scoredAppointments.filter(s => s.result.tier === 'High').length;
  const expiredCount = complianceSummary.expiredCount;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <div className="sidebar-brand-title">Front Desk Copilot</div>
          <div className="sidebar-brand-tag">Obsidian Platform</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Public View</div>
        <button
          className={`nav-item ${activeTab === 'landing' ? 'active' : ''}`}
          onClick={() => setActiveTab('landing')}
        >
          <Globe size={18} /> Marketing Landing
        </button>

        <div className="nav-section-label">Operations Workspace</div>
        <button
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={18} /> Overview Dashboard
        </button>

        <button
          className={`nav-item ${activeTab === 'predictor' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictor')}
        >
          <Sparkles size={18} /> No-Show Predictor
          {highRiskCount > 0 && <span className="nav-item-badge badge-blue">{highRiskCount} Risk</span>}
        </button>

        <button
          className={`nav-item ${activeTab === 'compliance' ? 'active' : ''}`}
          onClick={() => setActiveTab('compliance')}
        >
          <ShieldAlert size={18} /> Compliance Hub
          {expiredCount > 0 && <span className="nav-item-badge badge-red">{expiredCount} Expired</span>}
        </button>

        <button
          className={`nav-item ${activeTab === 'copilot' ? 'active' : ''}`}
          onClick={() => setActiveTab('copilot')}
        >
          <Bot size={18} /> Copilot AI Assistant
        </button>

        <button
          className={`nav-item ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          <Users size={18} /> Client Directory
        </button>

        <div className="nav-section-label">Configuration</div>
        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={18} /> Salon & Signal Settings
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="salon-status-card">
          <div className="salon-status-dot" />
          <div className="flex-1">
            <div className="salon-name">Luxe & Glow Spa</div>
            <div className="salon-plan">Pro License • Active</div>
          </div>
          <ChevronRight size={14} className="text-tertiary" />
        </div>
      </div>
    </aside>
  );
};
