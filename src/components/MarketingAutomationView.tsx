import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { NewCampaignModal } from './NewCampaignModal';
import { Zap, ToggleLeft, ToggleRight, Plus } from 'lucide-react';

export const MarketingAutomationView: React.FC = () => {
  const { campaigns, triggerRules, toggleTriggerRule, launchQuickCampaign } = useSalon();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalRevenueGenerated = campaigns.reduce((sum, c) => sum + c.revenueGenerated, 0);
  const totalCampaignCost = campaigns.reduce((sum, c) => sum + c.campaignCost, 0);
  const avgROI = totalCampaignCost > 0 ? Math.round(totalRevenueGenerated / totalCampaignCost) : 100;
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversionsCount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div className="clean-card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(37,99,235,0.03) 100%)', border: '1px solid rgba(34,197,94,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Big-Chain Marketing Engine
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.2rem 0' }}>
              Automated AI Marketing & Off-Peak Filler
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: 0 }}>
              1-click targeted SMS & email campaigns, automated trigger rules for slow slots, at-risk win-backs, and transparent ROI tracking.
            </p>
          </div>

          <button className="btn-blue" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> Create AI Campaign
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
        <div className="clean-card">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Campaign Revenue</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e', marginTop: '0.2rem' }}>
            ${totalRevenueGenerated.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>From converted bookings</div>
        </div>

        <div className="clean-card">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Average Campaign ROI</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '0.2rem' }}>
            {avgROI}x Return
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Vs traditional ad channels</div>
        </div>

        <div className="clean-card">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Converted Bookings</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.2rem' }}>
            {totalConversions} Slots
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Across {campaigns.length} campaigns</div>
        </div>

        <div className="clean-card">
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Trigger Rules</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#a855f7', marginTop: '0.2rem' }}>
            {triggerRules.filter(t => t.isEnabled).length} Rules
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Autopilot marketing running</div>
        </div>
      </div>

      {/* Quick Launch Preset Actions */}
      <div className="clean-card" style={{ background: 'var(--bg-input)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
          ⚡ 1-Click AI Campaign Generators
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
          <button
            className="btn-ghost"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', justifyContent: 'flex-start', padding: '0.6rem 0.75rem' }}
            onClick={() => launchQuickCampaign('Off-Peak Filler', 'All', '20% OFF Slow Slots', 'Tuesday Morning')}
          >
            <Zap size={14} className="text-blue" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '0.775rem' }}>Tuesday Morning Filler</div>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>20% OFF flash text for slow 9-12pm slots</div>
            </div>
          </button>

          <button
            className="btn-ghost"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', justifyContent: 'flex-start', padding: '0.6rem 0.75rem' }}
            onClick={() => launchQuickCampaign('At-Risk Win-Back', 'At-Risk', '$45 Free Treatment Mask')}
          >
            <Zap size={14} style={{ color: 'var(--accent-red)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '0.775rem' }}>At-Risk Churn Win-Back</div>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Target absent clients with free perk</div>
            </div>
          </button>

          <button
            className="btn-ghost"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', justifyContent: 'flex-start', padding: '0.6rem 0.75rem' }}
            onClick={() => launchQuickCampaign('Rainy Day Special', 'Loyal Regulars', '$25 Spa Voucher')}
          >
            <Zap size={14} style={{ color: '#22c55e' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '0.775rem' }}>Rainy Day Weather Boost</div>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Instant SMS voucher during bad weather</div>
            </div>
          </button>
        </div>
      </div>

      {/* Active & Past Campaigns List */}
      <div className="clean-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div className="card-title">Marketing Campaigns ({campaigns.length})</div>
            <div className="card-sub">Real-time performance metrics and revenue tracking</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {campaigns.map(cmp => (
            <div
              key={cmp.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 140px 140px',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: cmp.status === 'Active' ? '1px solid rgba(37,99,235,0.3)' : '1px solid transparent'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{cmp.title}</span>
                  <span className={`menu-badge ${cmp.status === 'Active' ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '0.675rem' }}>
                    {cmp.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                  "{cmp.messageText}"
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  Target: <strong>{cmp.targetSegment}</strong> | Channel: <strong>{cmp.channel}</strong> | Offer: <strong>{cmp.discountOffer}</strong>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Recipients</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{cmp.recipientsCount} Sent</div>
                <div style={{ fontSize: '0.7rem', color: '#22c55e' }}>{cmp.conversionsCount} Converted ({cmp.conversionRatePct}%)</div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Revenue Rescued</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#22c55e' }}>${cmp.revenueGenerated.toLocaleString()}</div>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>Cost: ${cmp.campaignCost}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ROI Multiplier</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-blue)' }}>{cmp.roiMultiplier}x ROI</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Trigger Rules (Autopilot Marketing) */}
      <div className="clean-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Zap size={16} className="text-blue" />
          <div className="card-title">Autopilot Trigger Workflows</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {triggerRules.map(rule => (
            <div
              key={rule.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{rule.name}</div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  IF <strong>{rule.condition}</strong> &rarr; THEN <strong>{rule.action}</strong>
                </div>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                  Triggered {rule.timesTriggered} times | Total Revenue Rescued: <strong>${rule.revenueRescued.toLocaleString()}</strong>
                </div>
              </div>

              <button
                className="btn-ghost"
                onClick={() => toggleTriggerRule(rule.id)}
                style={{ padding: '0.3rem 0.6rem', color: rule.isEnabled ? '#22c55e' : 'var(--text-dim)' }}
              >
                {rule.isEnabled ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.75rem' }}>
                    <ToggleRight size={20} /> Active
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.75rem' }}>
                    <ToggleLeft size={20} /> Disabled
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <NewCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
