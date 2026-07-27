import React from 'react';
import { useSalon } from '../context/SalonContext';
import {
  LayoutDashboard,
  Calendar,
  ShieldCheck,
  MessageSquare,
  Users,
  Sliders,
  Globe
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
    <aside className="compact-sidebar">
      <div className="sidebar-brand">
        <div className="brand-dot" />
        <span className="brand-name">Front Desk Copilot</span>
      </div>

      <nav className="sidebar-menu">
        <div className="menu-label">Main</div>
        <button
          className={`menu-btn ${activeTab === 'landing' ? 'active' : ''}`}
          onClick={() => setActiveTab('landing')}
        >
          <Globe size={14} /> Landing Page
        </button>

        <button
          className={`menu-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={14} /> Overview
        </button>

        <div className="menu-label">Operations</div>
        <button
          className={`menu-btn ${activeTab === 'predictor' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictor')}
        >
          <Calendar size={14} /> No-Show Predictor
          {highRiskCount > 0 && <span className="menu-badge badge-blue">{highRiskCount}</span>}
        </button>

        <button
          className={`menu-btn ${activeTab === 'compliance' ? 'active' : ''}`}
          onClick={() => setActiveTab('compliance')}
        >
          <ShieldCheck size={14} /> Compliance Hub
          {expiredCount > 0 && <span className="menu-badge badge-red">{expiredCount}</span>}
        </button>

        <button
          className={`menu-btn ${activeTab === 'copilot' ? 'active' : ''}`}
          onClick={() => setActiveTab('copilot')}
        >
          <MessageSquare size={14} /> Assistant Desk
        </button>

        <button
          className={`menu-btn ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          <Users size={14} /> Client Records
        </button>

        <div className="menu-label">System</div>
        <button
          className={`menu-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Sliders size={14} /> Settings
        </button>
      </nav>

      <div className="sidebar-foot">
        <div>Luxe & Glow Salon</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.675rem' }}>Front Desk Active</div>
      </div>
    </aside>
  );
};
