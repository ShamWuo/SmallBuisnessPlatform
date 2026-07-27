import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import type { DayOfWeek } from '../types';
import { TrendingUp, Users, Package, Zap, Sun, CloudRain, CloudLightning } from 'lucide-react';

interface DemandForecastingViewProps {
  onLaunchCampaign?: (timeSlot: string) => void;
}

export const DemandForecastingView: React.FC<DemandForecastingViewProps> = ({ onLaunchCampaign }) => {
  const { demandForecast, staffingRecommendations, supplyRequirements, weatherSim, setWeatherSim, launchQuickCampaign } = useSalon();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Friday');

  const currentDayForecast = demandForecast.find(d => d.day === selectedDay) || demandForecast[0];

  const handleQuickLaunch = (hourLabel: string) => {
    launchQuickCampaign(
      'Off-Peak Filler',
      'All',
      '20% OFF Any Haircut or Facial',
      `${selectedDay} ${hourLabel}`
    );
    if (onLaunchCampaign) onLaunchCampaign(`${selectedDay} ${hourLabel}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="clean-card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(99,102,241,0.03) 100%)', border: '1px solid var(--border-blue)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Big-Chain Predictive Intelligence
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.2rem 0' }}>
              AI Demand & Capacity Forecasting
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', margin: 0 }}>
              7-day hourly booking curve prediction, weather impact modeling, AI staffing optimization, and consumable supply replenishment.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>Weather Signal Sim:</span>
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

      {/* 7-Day Selector Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
        {demandForecast.map(df => {
          const isSelected = df.day === selectedDay;
          let badgeColor = 'var(--accent-blue)';
          if (df.overallDemandPct > 75) badgeColor = 'var(--accent-red)';
          else if (df.overallDemandPct < 45) badgeColor = 'var(--text-dim)';

          return (
            <button
              key={df.day}
              onClick={() => setSelectedDay(df.day)}
              className="clean-card"
              style={{
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'rgba(37,99,235,0.06)' : 'var(--bg-card)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isSelected ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                {df.day.substring(0, 3)}
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.2rem 0' }}>
                {df.overallDemandPct}%
              </div>
              <div style={{ fontSize: '0.675rem', color: badgeColor, fontWeight: 600 }}>
                {df.overallDemandPct > 75 ? 'Peak Day' : df.overallDemandPct < 45 ? 'Slow Day' : 'Optimal'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Hourly Heatmap Card */}
      <div className="clean-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} className="text-blue" />
              {selectedDay} Hourly Demand Curve ({currentDayForecast.date})
            </div>
            <div className="card-sub">
              Weather Impact: <strong>{currentDayForecast.weatherFactor}</strong> | Recommended Staff: <strong>{currentDayForecast.recommendedStaffCount} Stylists</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.725rem', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#94a3b8' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#334155' }} /> Off-Peak (&lt;45%)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#3b82f6' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} /> Optimal (45-84%)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> Peak/Surge (&ge;85%)
            </span>
          </div>
        </div>

        {/* Hourly Slot Heat Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {currentDayForecast.slots.map(slot => {
            let barColor = 'var(--accent-blue)';
            if (slot.status === 'Peak' || slot.status === 'Surge') barColor = 'var(--accent-red)';
            if (slot.status === 'Off-Peak') barColor = 'var(--text-dim)';

            return (
              <div
                key={slot.hour}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr 140px 140px',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: slot.status === 'Off-Peak' ? 'rgba(255,255,255,0.02)' : 'var(--bg-input)'
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  {slot.hourLabel}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Demand Index</span>
                    <span style={{ fontWeight: 700, color: barColor }}>{slot.predictedDemandPct}% ({slot.expectedBookings} / {slot.capacityLimit} slots)</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${slot.predictedDemandPct}%`, background: barColor, borderRadius: '4px', transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                <div style={{ fontSize: '0.775rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Est. Revenue: </span>
                  <span style={{ fontWeight: 700 }}>${slot.revenuePotential}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {slot.status === 'Off-Peak' ? (
                    <button
                      className="btn-ghost"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem', color: 'var(--accent-blue)' }}
                      onClick={() => handleQuickLaunch(slot.hourLabel)}
                    >
                      <Zap size={11} /> Fill Slot AI
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.725rem', fontWeight: 600, color: barColor }}>
                      {slot.status} Capacity
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Staffing AI & Inventory Forecast */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {/* Staffing Optimization */}
        <div className="clean-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Users size={16} className="text-blue" />
            <div className="card-title">AI Staffing & Shift Optimizer</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {staffingRecommendations.map((rec, i) => (
              <div
                key={i}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: rec.actionRequired === 'Add Staff' ? 'rgba(239, 68, 68, 0.08)' : rec.actionRequired === 'Overstaffed' ? 'rgba(234, 179, 8, 0.08)' : 'var(--bg-input)',
                  borderLeft: `3px solid ${rec.actionRequired === 'Add Staff' ? '#ef4444' : rec.actionRequired === 'Overstaffed' ? '#eab308' : '#22c55e'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.825rem' }}>{rec.day} — {rec.timeSlot}</span>
                  <span style={{
                    fontSize: '0.675rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    background: rec.actionRequired === 'Add Staff' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)',
                    color: rec.actionRequired === 'Add Staff' ? '#f87171' : '#facc15'
                  }}>
                    {rec.actionRequired}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Current Staff: {rec.currentStaff} | Required: {rec.requiredStaff}
                </div>
                <div style={{ fontSize: '0.725rem', marginTop: '0.35rem', fontStyle: 'italic', color: 'var(--text-dim)' }}>
                  "{rec.reasoning}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consumable Inventory Projections */}
        <div className="clean-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Package size={16} className="text-blue" />
            <div className="card-title">Consumable Supply Demand Forecast</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {supplyRequirements.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: item.status === 'Critical Reorder' ? '1px solid rgba(239,68,68,0.4)' : '1px solid transparent'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{item.itemName}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Category: {item.category} | Current Stock: <strong>{item.currentStockUnits} {item.unit}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: item.status === 'Critical Reorder' ? 'var(--accent-red)' : item.status === 'Low Stock' ? '#eab308' : '#22c55e'
                  }}>
                    {item.status}
                  </div>
                  {item.reorderQuantity > 0 && (
                    <div style={{ fontSize: '0.675rem', color: 'var(--text-dim)' }}>
                      Reorder: +{item.reorderQuantity} (${item.estimatedCost})
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
