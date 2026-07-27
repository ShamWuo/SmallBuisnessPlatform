import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Sparkles, ShieldAlert, MessageSquare, CloudRain, Sun, CloudLightning, ArrowRight } from 'lucide-react';
import type { PlatformTab } from './Sidebar';

interface OverviewDashboardViewProps {
  onNavigate: (tab: PlatformTab) => void;
}

export const OverviewDashboardView: React.FC<OverviewDashboardViewProps> = ({ onNavigate }) => {
  const { scoredAppointments, complianceSummary, weatherSim, setWeatherSim, triggerDraftAction } = useSalon();

  const highRisks = scoredAppointments.filter(s => s.result.tier === 'High');
  const totalLossExposure = scoredAppointments.reduce((acc, curr) => acc + curr.result.estimatedLossRisk, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Weather Signal Controls */}
      <div className="obsidian-card flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            Salon Operations Command Center
          </h2>
          <p className="text-xs text-secondary mt-1">
            Real-time no-show risk scoring & state board compliance health monitoring.
          </p>
        </div>

        <div className="weather-sim-container">
          <span className="weather-label">Forecast Signal:</span>
          <div className="weather-buttons">
            <button
              className={`weather-btn ${weatherSim === 'Clear' ? 'active' : ''}`}
              onClick={() => setWeatherSim('Clear')}
            >
              <Sun size={13} /> Clear
            </button>
            <button
              className={`weather-btn ${weatherSim === 'Rain' ? 'active' : ''}`}
              onClick={() => setWeatherSim('Rain')}
            >
              <CloudRain size={13} /> Rain (+10)
            </button>
            <button
              className={`weather-btn ${weatherSim === 'Thunderstorm' ? 'active' : ''}`}
              onClick={() => setWeatherSim('Thunderstorm')}
            >
              <CloudLightning size={13} /> Storm (+20)
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-dashboard">
        <div className="obsidian-card">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-tertiary uppercase">No-Show Revenue Risk</span>
            <span className={`risk-tag ${highRisks.length > 0 ? 'high' : 'low'}`}>
              {highRisks.length} High Risk
            </span>
          </div>
          <div className="text-2xl font-extrabold text-electric">${totalLossExposure}</div>
          <div className="text-xs text-tertiary mt-1">{scoredAppointments.length} upcoming appointments analyzed</div>
        </div>

        <div className="obsidian-card">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-tertiary uppercase">Compliance Index</span>
            <span className={`compliance-tag ${complianceSummary.expiredCount > 0 ? 'expired' : 'good'}`}>
              {complianceSummary.healthIndex}% Compliant
            </span>
          </div>
          <div className="text-2xl font-extrabold">
            {complianceSummary.compliantCount}/{complianceSummary.totalItems} Verified
          </div>
          <div className="text-xs text-tertiary mt-1">
            {complianceSummary.expiredCount > 0 ? (
              <span className="text-danger font-bold flex items-center gap-1">
                <ShieldAlert size={12} /> {complianceSummary.expiredCount} expired requirement(s)!
              </span>
            ) : (
              'All staff licenses up to date'
            )}
          </div>
        </div>

        <div className="obsidian-card">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-tertiary uppercase">Copilot Readiness</span>
            <span className="copilot-tag">Single Agent Active</span>
          </div>
          <div className="text-2xl font-extrabold text-electric">4 Agent Tools</div>
          <div className="text-xs text-tertiary mt-1">Score • Risks • Compliance • Drafts</div>
        </div>
      </div>

      {/* Split View: Urgent Risks + Urgent Compliance Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* At-Risk Appointments */}
        <div className="obsidian-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="text-electric" size={16} /> Highest No-Show Risks
            </h3>
            <button className="btn-obsidian text-xs" onClick={() => onNavigate('predictor')}>
              View Matrix <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-3">
            {highRisks.slice(0, 3).map(({ appointment: apt, result }) => (
              <div key={apt.id} className="p-3 rounded bg-obsidian border border-subtle flex justify-between items-center">
                <div>
                  <div className="font-bold text-sm">{apt.clientName}</div>
                  <div className="text-xs text-secondary">{apt.serviceName} • {apt.dayOfWeek} at {apt.appointmentTime}</div>
                  <div className="text-xs text-electric font-semibold mt-1">Rec: {result.suggestedActionLabel}</div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-danger">{result.score}/100</span>
                  <button
                    className="btn-action-trigger mt-1 text-xs"
                    onClick={() => triggerDraftAction('appointment', apt.id)}
                  >
                    <MessageSquare size={12} /> Draft
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Urgent Items */}
        <div className="obsidian-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <ShieldAlert className="text-danger" size={16} /> Urgent Compliance Renewal Items
            </h3>
            <button className="btn-obsidian text-xs" onClick={() => onNavigate('compliance')}>
              View Hub <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-3">
            {complianceSummary.expiringOrExpiredItems.slice(0, 3).map(item => {
              const isLicense = 'staffName' in item;
              const title = isLicense ? item.title : item.title;
              const target = isLicense ? item.staffName : item.responsibleStaff;

              return (
                <div key={item.id} className="p-3 rounded bg-obsidian border border-subtle flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm">{title}</div>
                    <div className="text-xs text-secondary">Responsible: {target}</div>
                    <div className="text-xs text-danger font-semibold mt-1">
                      Status: {item.status.replace('_', ' ')} ({item.daysUntilExpiry < 0 ? `${Math.abs(item.daysUntilExpiry)}d overdue` : `${item.daysUntilExpiry}d left`})
                    </div>
                  </div>

                  <button
                    className="btn-renew-alert text-xs"
                    onClick={() => triggerDraftAction('compliance', item.id)}
                  >
                    Draft Alert
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
