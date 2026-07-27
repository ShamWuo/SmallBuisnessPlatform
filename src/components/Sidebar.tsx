import React from 'react';
import { useSalon } from '../context/SalonContext';
import {
  LayoutDashboard,
  Calendar,
  ShieldCheck,
  MessageSquare,
  Users,
  Sliders,
  Globe,
  TrendingUp,
  Sparkles,
  Megaphone,
  DollarSign,
  BarChart2,
  Store
} from 'lucide-react';

export type PlatformTab =
  | 'landing'
  | 'overview'
  | 'demand'
  | 'insights'
  | 'marketing'
  | 'pricing'
  | 'benchmarks'
  | 'predictor'
  | 'compliance'
  | 'copilot'
  | 'clients'
  | 'settings';

interface SidebarProps {
  activeTab: PlatformTab;
  setActiveTab: (tab: PlatformTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { scoredAppointments, complianceSummary, customerInsights, campaigns } = useSalon();

  const highRiskCount = scoredAppointments.filter(s => s.result.tier === 'High').length;
  const expiredCount = complianceSummary.expiredCount;
  const atRiskClientCount = customerInsights.totalAtRiskCount;
  const activeCampaignsCount = campaigns.filter(c => c.status === 'Active').length;

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
          <LayoutDashboard size={14} /> Executive Hub
        </button>

        <div className="menu-label">Enterprise AI</div>
        <button
          className={`menu-btn ${activeTab === 'demand' ? 'active' : ''}`}
          onClick={() => setActiveTab('demand')}
        >
          <TrendingUp size={14} /> Demand Forecast
        </button>

        <button
          className={`menu-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <Sparkles size={14} /> Customer Insights
          {atRiskClientCount > 0 && <span className="menu-badge badge-purple">{atRiskClientCount}</span>}
        </button>

        <button
          className={`menu-btn ${activeTab === 'marketing' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketing')}
        >
          <Megaphone size={14} /> AI Marketing
          {activeCampaignsCount > 0 && <span className="menu-badge badge-green">{activeCampaignsCount}</span>}
        </button>

        <button
          className={`menu-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          <DollarSign size={14} /> Dynamic Pricing
        </button>

        <button
          className={`menu-btn ${activeTab === 'benchmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('benchmarks')}
        >
          <BarChart2 size={14} /> Market Radar
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
          <Store size={12} className="text-blue" /> Soho Flagship
        </div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.675rem' }}>Multi-Store Mode Active</div>
      </div>
    </aside>
  );
};


