import React from 'react';
import { MARKET_BENCHMARKS } from '../lib/marketBenchmarkEngine';
import { Sparkles } from 'lucide-react';

export const MarketBenchmarksView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Banner */}
      <div className="clean-card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(56,189,248,0.06) 0%, rgba(168,85,247,0.03) 100%)', border: '1px solid var(--border-blue)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Competitor & Regional Market Radar
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.2rem 0' }}>
              Local Market Benchmarks vs Regional Chains
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: 0 }}>
              Benchmarking your salon against regional chains, top 10% industry performers, and local metro average metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Benchmark Metric Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {MARKET_BENCHMARKS.map((bm, index) => {
          let badgeColor = 'var(--accent-blue)';
          if (bm.status === 'Outperforming') badgeColor = '#22c55e';
          if (bm.status === 'Opportunity Area') badgeColor = '#eab308';

          return (
            <div key={index} className="clean-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{bm.metricName}</div>
                <span className="menu-badge" style={{ background: 'rgba(255,255,255,0.05)', color: badgeColor, border: `1px solid ${badgeColor}`, padding: '0.25rem 0.6rem', fontSize: '0.725rem' }}>
                  {bm.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--bg-input)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', textTransform: 'uppercase', fontWeight: 600 }}>Luxe & Glow</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '0.2rem' }}>{bm.yourSalonValue}</div>
                </div>

                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Metro Average</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.2rem' }}>{bm.metroAverageValue}</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#a855f7', textTransform: 'uppercase', fontWeight: 600 }}>Top 10% Regional Chain</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#a855f7', marginTop: '0.2rem' }}>{bm.top10PercentChainValue}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={13} className="text-blue" />
                <span>AI Insight: {bm.aiInsight}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
