import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Sparkles, ShieldAlert, CloudRain, Sun, CloudLightning, CalendarPlus, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenNewBooking: () => void;
  onOpenNewCompliance: () => void;
  activeTab: 'predictor' | 'compliance' | 'copilot';
  setActiveTab: (tab: 'predictor' | 'compliance' | 'copilot') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewBooking,
  onOpenNewCompliance,
  activeTab,
  setActiveTab
}) => {
  const { scoredAppointments, complianceSummary, weatherSim, setWeatherSim } = useSalon();

  const highRiskCount = scoredAppointments.filter(s => s.result.tier === 'High').length;
  const totalLossExposure = scoredAppointments.reduce((acc, curr) => acc + curr.result.estimatedLossRisk, 0);

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-brand">
          <div className="brand-icon">
            <Sparkles className="icon-sparkle" />
          </div>
          <div>
            <div className="brand-title">
              Front Desk Copilot <span className="badge-demo">HACKATHON MVP</span>
            </div>
            <div className="brand-subtitle">Luxe & Glow Salon & Spa — AI Operations Assistant</div>
          </div>
        </div>

        {/* Global Weather Simulator Pill (Signal Input Toggle) */}
        <div className="weather-sim-container">
          <span className="weather-label">Forecast Signal:</span>
          <div className="weather-buttons">
            <button
              className={`weather-btn ${weatherSim === 'Clear' ? 'active' : ''}`}
              onClick={() => setWeatherSim('Clear')}
              title="Clear skies (Baseline weather signal)"
            >
              <Sun size={14} /> Clear
            </button>
            <button
              className={`weather-btn ${weatherSim === 'Rain' ? 'active' : ''}`}
              onClick={() => setWeatherSim('Rain')}
              title="Light Rain (+10 Risk Points)"
            >
              <CloudRain size={14} /> Rain
            </button>
            <button
              className={`weather-btn ${weatherSim === 'Thunderstorm' ? 'active' : ''}`}
              onClick={() => setWeatherSim('Thunderstorm')}
              title="Thunderstorm / Heavy Storm (+20 Risk Points)"
            >
              <CloudLightning size={14} /> Storm (+20 Risk)
            </button>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn-secondary" onClick={onOpenNewCompliance}>
            <ShieldCheck size={16} /> Log License / Cert
          </button>
          <button className="btn-primary" onClick={onOpenNewBooking}>
            <CalendarPlus size={16} /> + New Appointment Scan
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card stat-risk">
          <div className="stat-header">
            <span className="stat-title">No-Show Risk Exposure</span>
            <span className={`risk-tag ${highRiskCount > 0 ? 'high' : 'low'}`}>
              {highRiskCount} High Risk
            </span>
          </div>
          <div className="stat-value">${totalLossExposure} <span className="stat-unit">est. revenue risk</span></div>
          <div className="stat-sub">{scoredAppointments.length} upcoming appointments analyzed</div>
        </div>

        <div className="stat-card stat-compliance">
          <div className="stat-header">
            <span className="stat-title">Compliance Health Index</span>
            <span className={`compliance-tag ${complianceSummary.expiredCount > 0 ? 'expired' : 'good'}`}>
              {complianceSummary.healthIndex}% Compliant
            </span>
          </div>
          <div className="stat-value">
            {complianceSummary.compliantCount}/{complianceSummary.totalItems} <span className="stat-unit">requirements verified</span>
          </div>
          <div className="stat-sub">
            {complianceSummary.expiredCount > 0 ? (
              <span className="text-danger flex items-center gap-1">
                <ShieldAlert size={13} /> {complianceSummary.expiredCount} expired requirement(s)!
              </span>
            ) : (
              <span>All essential staff licenses up to date</span>
            )}
          </div>
        </div>

        <div className="stat-card stat-copilot">
          <div className="stat-header">
            <span className="stat-title">Agent Readiness</span>
            <span className="copilot-tag">Copilot Online</span>
          </div>
          <div className="stat-value">4 Agent Tools</div>
          <div className="stat-sub">Score • Risks • Compliance • Drafts</div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'predictor' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictor')}
        >
          <Sparkles size={16} /> 1. No-Show Predictor
          {highRiskCount > 0 && <span className="tab-badge">{highRiskCount}</span>}
        </button>
        <button
          className={`tab-btn ${activeTab === 'compliance' ? 'active' : ''}`}
          onClick={() => setActiveTab('compliance')}
        >
          <ShieldAlert size={16} /> 2. Compliance Tracker
          {complianceSummary.expiredCount > 0 && (
            <span className="tab-badge badge-danger">{complianceSummary.expiredCount}</span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === 'copilot' ? 'active' : ''}`}
          onClick={() => setActiveTab('copilot')}
        >
          💬 Front Desk Copilot Chat
        </button>
      </nav>
    </header>
  );
};
