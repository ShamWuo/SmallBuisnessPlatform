import React from 'react';
import { useSalon } from '../context/SalonContext';
import { MessageSquare, Sun, CloudRain, CloudLightning, ArrowRight, TrendingUp, Sparkles, Megaphone } from 'lucide-react';
import type { PlatformTab } from './Sidebar';

interface OverviewDashboardViewProps {
  onNavigate: (tab: PlatformTab) => void;
}

export const OverviewDashboardView: React.FC<OverviewDashboardViewProps> = ({ onNavigate }) => {
  const {
    scoredAppointments,
    complianceSummary,
    weatherSim,
    setWeatherSim,
    triggerDraftAction,
    customerInsights,
    campaigns,
    demandForecast
  } = useSalon();

  const highRisks = scoredAppointments.filter(s => s.result.tier === 'High');
  const totalLossExposure = scoredAppointments.reduce((acc, curr) => acc + curr.result.estimatedLossRisk, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'Active');
  const totalCampaignRev = campaigns.reduce((sum, c) => sum + c.revenueGenerated, 0);
  const fridayForecast = demandForecast.find(d => d.day === 'Friday');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div className="clean-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(168,85,247,0.03) 100%)' }}>
        <div>
          <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
            Enterprise AI Intelligence Desk
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.2rem 0' }}>
            Luxe & Glow Executive Control Room
          </h2>
          <div className="card-sub">Combining Demand Forecasting, Customer Insights, AI Marketing, and Compliance into one workspace.</div>
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
              <CloudRain size={12} /> Rain (-15%)
            </button>
            <button
              className={`weather-chip ${weatherSim === 'Thunderstorm' ? 'active' : ''}`}
              onClick={() => setWeatherSim('Thunderstorm')}
            >
              <CloudLightning size={12} /> Storm (-35%)
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('demand')}>
          <div className="metric-header">
            <span className="metric-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <TrendingUp size={13} className="text-blue" /> Peak Demand
            </span>
            <span className="menu-badge badge-blue">Friday 2-5PM</span>
          </div>
          <div className="metric-val text-blue">{fridayForecast ? fridayForecast.overallDemandPct : 85}%</div>
          <div className="metric-sub">Forecasted weekend capacity</div>
        </div>

        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('insights')}>
          <div className="metric-header">
            <span className="metric-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={13} style={{ color: '#a855f7' }} /> At-Risk Exposure
            </span>
            <span className="menu-badge badge-purple">{customerInsights.totalAtRiskCount} Clients</span>
          </div>
          <div className="metric-val" style={{ color: '#a855f7' }}>${customerInsights.atRiskRevenueValue.toLocaleString()}</div>
          <div className="metric-sub">Potential annual churn risk</div>
        </div>

        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('marketing')}>
          <div className="metric-header">
            <span className="metric-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Megaphone size={13} style={{ color: '#22c55e' }} /> AI Marketing ROI
            </span>
            <span className="menu-badge badge-green">{activeCampaigns.length} Active</span>
          </div>
          <div className="metric-val" style={{ color: '#22c55e' }}>+${totalCampaignRev.toLocaleString()}</div>
          <div className="metric-sub">Rescued revenue from campaigns</div>
        </div>

        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('predictor')}>
          <div className="metric-header">
            <span className="metric-title">No-Show Risk</span>
            <span className={`risk-pill ${highRisks.length > 0 ? 'risk-high' : 'risk-low'}`}>
              {highRisks.length} High Risk
            </span>
          </div>
          <div className="metric-val">${totalLossExposure}</div>
          <div className="metric-sub">{scoredAppointments.length} bookings scored</div>
        </div>
      </div>

      {/* Quick Access Modules Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="clean-card" style={{ cursor: 'pointer', transition: 'all 0.15s ease' }} onClick={() => onNavigate('demand')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={16} className="text-blue" /> Demand & Capacity Forecast
            </div>
            <ArrowRight size={14} className="text-blue" />
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
            7-day hourly demand heatmaps, peak capacity warnings, staff schedule optimizer, and supply reorder forecasts.
          </p>
        </div>

        <div className="clean-card" style={{ cursor: 'pointer', transition: 'all 0.15s ease' }} onClick={() => onNavigate('insights')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7' }}>
              <Sparkles size={16} /> Customer Insights & LTV
            </div>
            <ArrowRight size={14} style={{ color: '#a855f7' }} />
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
            Automated RFM segmentation, 12-month client LTV predictor, churn prevention watchlist, and review sentiment analytics.
          </p>
        </div>

        <div className="clean-card" style={{ cursor: 'pointer', transition: 'all 0.15s ease' }} onClick={() => onNavigate('marketing')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#22c55e' }}>
              <Megaphone size={16} /> Automated AI Marketing
            </div>
            <ArrowRight size={14} style={{ color: '#22c55e' }} />
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
            1-click off-peak slot filler campaigns, automated retention triggers, rainy day flash sales, and ROI calculators.
          </p>
        </div>
      </div>

      {/* Split Operations Grid */}
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
