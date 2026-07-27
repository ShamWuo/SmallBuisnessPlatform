import React, { useState } from 'react';
import { INITIAL_PRICING_RULES, calculatePricingUplift } from '../lib/pricingEngine';
import type { PricingRule } from '../lib/pricingEngine';
import { ToggleLeft, ToggleRight } from 'lucide-react';

export const DynamicPricingView: React.FC = () => {
  const [rules, setRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);

  const toggleSurge = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isSurgeEnabled: !r.isSurgeEnabled } : r));
  };

  const monthlyUplift = calculatePricingUplift(rules);
  const annualUplift = monthlyUplift * 12;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Banner */}
      <div className="clean-card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(234,179,8,0.06) 0%, rgba(37,99,235,0.03) 100%)', border: '1px solid rgba(234,179,8,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Big-Chain Yield Management
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.2rem 0' }}>
              AI Dynamic Surge & Off-Peak Pricing
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: 0 }}>
              Automatically adjusts prices during peak weekend hours vs quiet off-peak slots to maximize salon yield & booking velocity.
            </p>
          </div>

          <div style={{ textAlign: 'right', background: 'var(--bg-card)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Annual Revenue Uplift</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#eab308' }}>+${annualUplift.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Pricing Rules Grid */}
      <div className="clean-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div className="card-title">Active Service Pricing Matrices</div>
            <div className="card-sub">Real-time surge and off-peak adjustments</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {rules.map(rule => (
            <div
              key={rule.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 140px 140px 120px',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: rule.isSurgeEnabled ? '1px solid rgba(234,179,8,0.3)' : '1px solid transparent'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{rule.serviceName}</div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Base: <strong>${rule.basePrice}</strong> | Surge Peak: <span style={{ color: '#ef4444', fontWeight: 700 }}>${rule.surgePrice}</span> | Off-Peak: <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>${rule.offPeakPrice}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Peak Window</div>
                <div style={{ fontSize: '0.725rem', fontWeight: 600, color: '#f87171' }}>{rule.peakWindow}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Off-Peak Window</div>
                <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--accent-blue)' }}>{rule.offPeakWindow}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Monthly Uplift</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#22c55e' }}>+${rule.estMonthlyUplift}/mo</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button
                  className="btn-ghost"
                  onClick={() => toggleSurge(rule.id)}
                  style={{ padding: '0.3rem 0.6rem', color: rule.isSurgeEnabled ? '#eab308' : 'var(--text-dim)' }}
                >
                  {rule.isSurgeEnabled ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.75rem' }}>
                      <ToggleRight size={20} /> Surge On
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.75rem' }}>
                      <ToggleLeft size={20} /> Standard
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
