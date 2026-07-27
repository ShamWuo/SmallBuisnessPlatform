import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Sparkles, AlertTriangle, CheckCircle, Info, Calendar, DollarSign, Clock, MessageSquare, CloudRain } from 'lucide-react';

export const NoShowPredictorView: React.FC = () => {
  const { scoredAppointments, triggerDraftAction, weatherSim } = useSalon();
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [expandedAptId, setExpandedAptId] = useState<string | null>('APT-101');

  const filtered = scoredAppointments.filter(item => {
    if (selectedRiskFilter === 'All') return true;
    return item.result.tier === selectedRiskFilter;
  });

  return (
    <div>
      <div className="clean-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
        <div>
          <div className="card-title">No-Show Risk Predictor</div>
          <div className="card-sub">Assesses booking lead times, attendance history, weekend peaks, and weather forecast signals.</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Tier:</span>
          {(['All', 'High', 'Medium', 'Low'] as const).map(tier => (
            <button
              key={tier}
              className={`weather-chip ${selectedRiskFilter === tier ? 'active' : ''}`}
              onClick={() => setSelectedRiskFilter(tier)}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {weatherSim !== 'Clear' && (
        <div style={{ background: 'var(--accent-blue-bg)', border: '1px solid var(--border-blue)', color: 'var(--accent-blue)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
          <CloudRain size={16} />
          <span>Active Forecast Signal: {weatherSim} simulation (+{weatherSim === 'Thunderstorm' ? '20' : '10'} risk points)</span>
        </div>
      )}

      {/* Cards List */}
      <div>
        {filtered.map(({ appointment: apt, result }) => {
          const isExpanded = expandedAptId === apt.id;

          return (
            <div key={apt.id} className="risk-card">
              <div className="risk-card-head" onClick={() => setExpandedAptId(isExpanded ? null : apt.id)}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{apt.clientName}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{apt.serviceName} • ${apt.servicePrice} ({apt.serviceDurationMin}m)</div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Calendar size={12} /> {apt.dayOfWeek} {apt.appointmentTime}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={12} /> {apt.bookingLeadTimeDays}d lead
                  </span>
                  <span className={`channel-chip channel-${apt.channel}`}>{apt.channel}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{result.score}/100</span>
                  <span className={`risk-pill risk-${result.tier.toLowerCase()}`}>
                    {result.tier === 'High' && <AlertTriangle size={11} />}
                    {result.tier === 'Low' && <CheckCircle size={11} />}
                    {result.tier} Risk
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="risk-card-body">
                  <div>
                    <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Info size={12} /> Key Signals
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {result.factors.map((factor, idx) => (
                        <div key={idx} style={{ background: 'var(--bg-card)', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', borderLeft: `2px solid ${factor.impact === 'negative' ? 'var(--status-red)' : 'var(--status-green)'}`, fontSize: '0.75rem' }}>
                          <div style={{ fontWeight: 600 }}>{factor.title}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{factor.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <DollarSign size={12} /> Client Ratios & Action
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.65rem' }}>
                      <div style={{ background: 'var(--bg-card)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Visits</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{apt.clientHistory.totalVisits}</div>
                      </div>
                      <div style={{ background: 'var(--bg-card)', padding: '0.35rem', borderRadius: 'var(--radius-sm)', flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>No-Shows</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--status-red)' }}>{apt.clientHistory.pastNoShows}</div>
                      </div>
                    </div>

                    <div style={{ background: 'var(--accent-blue-bg)', border: '1px solid var(--border-blue)', borderRadius: 'var(--radius-sm)', padding: '0.65rem' }}>
                      <div style={{ fontSize: '0.675rem', fontWeight: 600, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Sparkles size={11} /> Recommended Action:
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', margin: '0.2rem 0' }}>{result.suggestedActionLabel}</div>
                      <button
                        className="btn-blue"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.3rem' }}
                        onClick={() => triggerDraftAction('appointment', apt.id)}
                      >
                        <MessageSquare size={12} /> Execute Action (Draft Message)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
