import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import type { CustomerSegmentType } from '../types';
import { Users, Crown, AlertTriangle, Sparkles, Send } from 'lucide-react';

interface CustomerInsightsViewProps {
  onTriggerWinBack?: (clientName: string) => void;
}

export const CustomerInsightsView: React.FC<CustomerInsightsViewProps> = ({ onTriggerWinBack }) => {
  const { customers, customerInsights, launchQuickCampaign } = useSalon();
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegmentType | 'All'>('All');

  const filteredCustomers = selectedSegment === 'All'
    ? customers
    : customers.filter(c => c.segment === selectedSegment);

  const atRiskList = customers.filter(c => c.churnRiskLevel === 'High' || c.segment === 'At-Risk');

  const handleWinBackClick = (clientName: string) => {
    launchQuickCampaign(
      'At-Risk Win-Back',
      'At-Risk',
      'Free $45 Deep Keratin Hair Treatment Voucher'
    );
    if (onTriggerWinBack) onTriggerWinBack(clientName);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header Card */}
      <div className="clean-card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(99,102,241,0.03) 100%)', border: '1px solid rgba(168,85,247,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Big-Chain Customer Intelligence
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.2rem 0' }}>
              Customer Insights, RFM & LTV Analytics
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: 0 }}>
              Automated RFM client segmentation, 12-month Lifetime Value (LTV) forecasting, churn risk detection, and sentiment analysis.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg 12-Mo LTV</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#a855f7' }}>${customerInsights.avgLifetimeValue.toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>At-Risk Revenue Exposure</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-red)' }}>${customerInsights.atRiskRevenueValue.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Segment Filter Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
        <div
          className="clean-card"
          onClick={() => setSelectedSegment('All')}
          style={{
            cursor: 'pointer',
            border: selectedSegment === 'All' ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
            background: selectedSegment === 'All' ? 'rgba(37,99,235,0.06)' : 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>All Tracked Profiles</span>
            <Users size={14} className="text-blue" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.3rem' }}>{customerInsights.totalCustomers} Clients</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Complete salon CRM base</div>
        </div>

        <div
          className="clean-card"
          onClick={() => setSelectedSegment('VIP Champions')}
          style={{
            cursor: 'pointer',
            border: selectedSegment === 'VIP Champions' ? '2px solid #a855f7' : '1px solid var(--border-subtle)',
            background: selectedSegment === 'VIP Champions' ? 'rgba(168,85,247,0.06)' : 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a855f7' }}>VIP Champions</span>
            <Crown size={14} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.3rem' }}>{customerInsights.segmentCounts['VIP Champions'] || 0} Clients</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>High frequency, top 10% spenders</div>
        </div>

        <div
          className="clean-card"
          onClick={() => setSelectedSegment('At-Risk')}
          style={{
            cursor: 'pointer',
            border: selectedSegment === 'At-Risk' ? '2px solid var(--accent-red)' : '1px solid var(--border-subtle)',
            background: selectedSegment === 'At-Risk' ? 'rgba(239,68,68,0.06)' : 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-red)' }}>At-Risk / Churning</span>
            <AlertTriangle size={14} style={{ color: 'var(--accent-red)' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.3rem', color: 'var(--accent-red)' }}>{customerInsights.segmentCounts['At-Risk'] || 0} Clients</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Absent &gt;60 days from normal cycle</div>
        </div>

        <div
          className="clean-card"
          onClick={() => setSelectedSegment('New Opportunities')}
          style={{
            cursor: 'pointer',
            border: selectedSegment === 'New Opportunities' ? '2px solid #22c55e' : '1px solid var(--border-subtle)',
            background: selectedSegment === 'New Opportunities' ? 'rgba(34,197,94,0.06)' : 'var(--bg-card)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22c55e' }}>New Opportunities</span>
            <Sparkles size={14} style={{ color: '#22c55e' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '0.3rem' }}>{customerInsights.segmentCounts['New Opportunities'] || 0} Clients</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>1 visit, high upside potential</div>
        </div>
      </div>

      {/* Urgent At-Risk Churn Watchlist Banner */}
      {atRiskList.length > 0 && (
        <div className="clean-card" style={{ borderLeft: '4px solid var(--accent-red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} className="text-red" />
              <div className="card-title" style={{ fontSize: '0.95rem' }}>Automated Churn Prevention Watchlist</div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-red)' }}>
              {atRiskList.length} High-Risk Clients Flagged
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {atRiskList.map(client => (
              <div
                key={client.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {client.name} <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>({client.email})</span>
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
                    Last Visit: <strong>{client.lastVisitDate} ({client.daysSinceLastVisit} days ago)</strong> | Favorite: {client.favoriteService}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--accent-red)' }}>
                      {client.churnRiskScore}% Churn Risk
                    </div>
                    <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>
                      12-Mo LTV: ${client.predicted12MonthLTV}
                    </div>
                  </div>

                  <button
                    className="btn-blue"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.725rem' }}
                    onClick={() => handleWinBackClick(client.name)}
                  >
                    <Send size={11} /> 1-Click Win Back AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Directory & LTV Leaderboard Table */}
      <div className="clean-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div className="card-title">Customer LTV & Behavioral Segments</div>
            <div className="card-sub">Showing {filteredCustomers.length} client profiles</div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="clean-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Segment</th>
                <th>Total Visits</th>
                <th>Avg Ticket</th>
                <th>Lifetime Spend</th>
                <th>Predicted 12-Mo LTV</th>
                <th>Last Visit</th>
                <th>Churn Risk</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(c => {
                let segBadgeClass = 'badge-blue';
                if (c.segment === 'VIP Champions') segBadgeClass = 'badge-purple';
                if (c.segment === 'At-Risk') segBadgeClass = 'badge-red';
                if (c.segment === 'New Opportunities') segBadgeClass = 'badge-green';

                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{c.phone}</div>
                    </td>
                    <td>
                      <span className={`menu-badge ${segBadgeClass}`} style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>
                        {c.segment}
                      </span>
                    </td>
                    <td>{c.totalVisits} visits</td>
                    <td>${c.averageTicket}</td>
                    <td>${c.lifetimeSpend.toLocaleString()}</td>
                    <td>
                      <strong style={{ color: 'var(--accent-blue)' }}>${c.predicted12MonthLTV.toLocaleString()}</strong>
                    </td>
                    <td>{c.lastVisitDate} ({c.daysSinceLastVisit}d ago)</td>
                    <td>
                      <span className={`risk-pill risk-${c.churnRiskLevel.toLowerCase()}`}>
                        {c.churnRiskLevel} ({c.churnRiskScore}%)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
