import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Sparkles, AlertTriangle, CheckCircle, Info, Calendar, DollarSign, Clock, MessageSquare, CloudRain } from 'lucide-react';

export const NoShowPredictorView: React.FC = () => {
  const { scoredAppointments, triggerDraftAction, weatherSim } = useSalon();
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [expandedAptId, setExpandedAptId] = useState<string | null>('APT-101'); // expanded by default

  const filtered = scoredAppointments.filter(item => {
    if (selectedRiskFilter === 'All') return true;
    return item.result.tier === selectedRiskFilter;
  });

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h2>No-Show Risk Predictor</h2>
          <p className="view-description">
            Evaluates lead time, client attendance history, appointment metadata, booking channel, and weather forecast to predict no-show probability.
          </p>
        </div>
        
        <div className="filter-group">
          <span className="filter-label">Filter Tier:</span>
          {(['All', 'High', 'Medium', 'Low'] as const).map(tier => (
            <button
              key={tier}
              className={`filter-chip ${selectedRiskFilter === tier ? 'active' : ''}`}
              onClick={() => setSelectedRiskFilter(tier)}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {weatherSim !== 'Clear' && (
        <div className="weather-alert-banner">
          <CloudRain className="icon-weather" size={20} />
          <div>
            <strong>Active Signal Adjustment: {weatherSim} Simulation</strong>
            <div>Weather factor is adding +{weatherSim === 'Thunderstorm' ? '20' : '10'} risk points across upcoming appointments.</div>
          </div>
        </div>
      )}

      {/* Appointment Cards / Table */}
      <div className="appointments-grid">
        {filtered.map(({ appointment: apt, result }) => {
          const isExpanded = expandedAptId === apt.id;

          return (
            <div key={apt.id} className={`appointment-card risk-border-${result.tier.toLowerCase()}`}>
              <div className="apt-card-header" onClick={() => setExpandedAptId(isExpanded ? null : apt.id)}>
                <div className="client-info">
                  <div className="client-name">{apt.clientName}</div>
                  <div className="service-name">{apt.serviceName} • ${apt.servicePrice} ({apt.serviceDurationMin}m)</div>
                </div>

                <div className="apt-meta-chips">
                  <span className="meta-chip"><Calendar size={13} /> {apt.dayOfWeek} at {apt.appointmentTime}</span>
                  <span className="meta-chip"><Clock size={13} /> Booked {apt.bookingLeadTimeDays}d ago</span>
                  <span className={`channel-chip channel-${apt.channel}`}>{apt.channel}</span>
                </div>

                <div className="risk-score-display">
                  <div className="score-number-container">
                    <span className={`score-value score-${result.tier.toLowerCase()}`}>{result.score}</span>
                    <span className="score-max">/100</span>
                  </div>
                  <span className={`risk-tier-badge tier-${result.tier.toLowerCase()}`}>
                    {result.tier === 'High' && <AlertTriangle size={13} />}
                    {result.tier === 'Low' && <CheckCircle size={13} />}
                    {result.tier} Risk
                  </span>
                </div>
              </div>

              {/* Collapsible Signal & Action Details */}
              {isExpanded && (
                <div className="apt-card-details">
                  <div className="details-grid">
                    {/* Signal Breakdown Column */}
                    <div className="details-col">
                      <div className="col-title"><Info size={14} /> Risk Signals Evaluated</div>
                      <ul className="factors-list">
                        {result.factors.map((factor, idx) => (
                          <li key={idx} className={`factor-item ${factor.impact}`}>
                            <span className="factor-title">{factor.title}</span>
                            <span className="factor-desc">{factor.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Client History & Action Column */}
                    <div className="details-col action-col">
                      <div className="col-title"><DollarSign size={14} /> Client History & Financial Impact</div>
                      
                      <div className="client-stats-box">
                        <div className="stat-pill">
                          <span className="stat-pill-label">Total Visits</span>
                          <span className="stat-pill-val">{apt.clientHistory.totalVisits}</span>
                        </div>
                        <div className="stat-pill">
                          <span className="stat-pill-label">Past No-Shows</span>
                          <span className="stat-pill-val text-danger">{apt.clientHistory.pastNoShows}</span>
                        </div>
                        <div className="stat-pill">
                          <span className="stat-pill-label">Past Cancels</span>
                          <span className="stat-pill-val">{apt.clientHistory.pastCancellations}</span>
                        </div>
                      </div>

                      <div className="loss-impact-box">
                        <span>Revenue Loss Risk:</span>
                        <strong>${result.estimatedLossRisk}</strong>
                      </div>

                      <div className="recommendation-box">
                        <div className="rec-title">
                          <Sparkles size={14} /> Copilot Recommended Action:
                        </div>
                        <div className="rec-action-label">{result.suggestedActionLabel}</div>
                        <div className="rec-desc">{result.suggestedActionDescription}</div>

                        <button
                          className="btn-action-trigger"
                          onClick={() => triggerDraftAction('appointment', apt.id)}
                        >
                          <MessageSquare size={15} /> Execute Action (Draft Message)
                        </button>
                      </div>
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
