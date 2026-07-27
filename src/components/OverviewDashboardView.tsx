import React from 'react';
import { useSalon } from '../context/SalonContext';
import { MessageSquare, Sun, CloudRain, CloudLightning, ArrowRight } from 'lucide-react';
import type { PlatformTab } from './Sidebar';

interface OverviewDashboardViewProps {
  onNavigate: (tab: PlatformTab) => void;
}

export const OverviewDashboardView: React.FC<OverviewDashboardViewProps> = ({ onNavigate }) => {
  const { scoredAppointments, complianceSummary, weatherSim, setWeatherSim, triggerDraftAction } = useSalon();

  const highRisks = scoredAppointments.filter(s => s.result.tier === 'High');
  const totalLossExposure = scoredAppointments.reduce((acc, curr) => acc + curr.result.estimatedLossRisk, 0);

  return (
    <div>
      {/* Top Banner */}
      <div className="clean-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="card-title" style={{ fontSize: '1rem' }}>Salon Operations Overview</div>
          <div className="card-sub">Real-time no-show risk assessment and license compliance.</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>Forecast Signal:</span>
          <div className="weather-pill-group">
            <button
              className={`weather-chip ${weatherSim === 'Clear' ? 'active' : ''}`}
              onClick={() => setWeatherSim('Clear')}
            >
              <Sun size={12} /> Clear
            </button>
            <button
              className={`weather-chip ${weatherSim === 'Rain' ? 'active' : ''}`}
              onClick={() => setWeatherSim('Rain')}
            >
              <CloudRain size={12} /> Rain (+10)
            </button>
            <button
              className={`weather-chip ${weatherSim === 'Thunderstorm' ? 'active' : ''}`}
              onClick={() => setWeatherSim('Thunderstorm')}
            >
              <CloudLightning size={12} /> Storm (+20)
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">No-Show Revenue Exposure</span>
            <span className={`risk-pill ${highRisks.length > 0 ? 'risk-high' : 'risk-low'}`}>
              {highRisks.length} At Risk
            </span>
          </div>
          <div className="metric-val text-blue">${totalLossExposure}</div>
          <div className="metric-sub">{scoredAppointments.length} upcoming appointments analyzed</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Compliance Index</span>
            <span className={`risk-pill ${complianceSummary.expiredCount > 0 ? 'risk-high' : 'risk-low'}`}>
              {complianceSummary.healthIndex}% Compliant
            </span>
          </div>
          <div className="metric-val">
            {complianceSummary.compliantCount}/{complianceSummary.totalItems} Verified
          </div>
          <div className="metric-sub">
            {complianceSummary.expiredCount > 0 ? (
              <span className="text-red font-bold">
                {complianceSummary.expiredCount} requirement(s) expired!
              </span>
            ) : (
              'All licenses & logs valid'
            )}
          </div>
        </div>
      </div>

      {/* Split Grid */}
      <div className="two-col-grid">
        {/* At-Risk Appointments */}
        <div className="clean-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div className="card-title">Highest No-Show Risks</div>
            <button className="btn-ghost" style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }} onClick={() => onNavigate('predictor')}>
              View All <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {highRisks.slice(0, 3).map(({ appointment: apt, result }) => (
              <div key={apt.id} style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>{apt.clientName}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{apt.serviceName} • {apt.dayOfWeek} at {apt.appointmentTime}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--accent-blue)', fontWeight: 600, marginTop: '0.2rem' }}>Rec: {result.suggestedActionLabel}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--status-red)', fontSize: '0.9rem' }}>{result.score}/100</div>
                  <button
                    className="btn-ghost"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem', marginTop: '0.2rem' }}
                    onClick={() => triggerDraftAction('appointment', apt.id)}
                  >
                    <MessageSquare size={11} /> Draft
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Renewal Items */}
        <div className="clean-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div className="card-title">Urgent Compliance Renewals</div>
            <button className="btn-ghost" style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }} onClick={() => onNavigate('compliance')}>
              View Hub <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {complianceSummary.expiringOrExpiredItems.slice(0, 3).map(item => {
              const isLicense = 'staffName' in item;
              const title = isLicense ? item.title : item.title;
              const target = isLicense ? item.staffName : item.responsibleStaff;

              return (
                <div key={item.id} style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>{title}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Staff: {target}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--status-red)', fontWeight: 600, marginTop: '0.2rem' }}>
                      Status: {item.status.replace('_', ' ')} ({item.daysUntilExpiry < 0 ? `${Math.abs(item.daysUntilExpiry)}d overdue` : `${item.daysUntilExpiry}d remaining`})
                    </div>
                  </div>

                  <button
                    className="btn-ghost"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem', color: 'var(--status-red)' }}
                    onClick={() => triggerDraftAction('compliance', item.id)}
                  >
                    Draft Notice
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
