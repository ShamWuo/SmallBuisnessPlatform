import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, TrendingUp, Sparkles, Megaphone } from 'lucide-react';
import { scoreAppointment } from '../lib/scoringEngine';
import type { Appointment } from '../types';

interface LandingPageProps {
  onLaunchPlatform: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchPlatform }) => {
  const [monthlyBookings, setMonthlyBookings] = useState(180);
  const [avgTicketPrice, setAvgTicketPrice] = useState(145);
  const [noShowRate, setNoShowRate] = useState(14);

  const [demoLeadTime, setDemoLeadTime] = useState(14);
  const [demoNoShows, setDemoNoShows] = useState(1);
  const [demoChannel, setDemoChannel] = useState<'third-party' | 'phone' | 'walk-in'>('third-party');

  const demoApt: Appointment = {
    id: 'DEMO-1',
    clientName: 'Sarah Jenkins',
    clientPhone: '(555) 123-4567',
    clientEmail: 'sarah@example.com',
    serviceName: 'Balayage & Styling',
    servicePrice: 185,
    serviceDurationMin: 120,
    appointmentDate: '2026-07-28',
    appointmentTime: '17:00',
    dayOfWeek: 'Friday',
    bookingLeadTimeDays: demoLeadTime,
    channel: demoChannel,
    clientHistory: {
      totalVisits: 3,
      pastNoShows: demoNoShows,
      pastCancellations: 0
    },
    status: 'scheduled'
  };

  const demoScore = scoreAppointment(demoApt);

  const monthlyNoShows = Math.round(monthlyBookings * (noShowRate / 100));
  const monthlyRevenueLost = monthlyNoShows * avgTicketPrice;
  const annualSavedWithCopilot = Math.round((monthlyRevenueLost * 12 * 0.75) + 14200); // including off-peak fill-ups & win-backs

  return (
    <div className="landing-shell">
      <header className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <div className="brand-dot" /> Enterprise Front Desk Copilot
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-ghost" onClick={onLaunchPlatform}>Live Demo</button>
          <button className="btn-blue" onClick={onLaunchPlatform}>
            Open Enterprise Workspace <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <section className="landing-hero-section">
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-blue)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Big-Chain Intelligence for Small Business Owners
          </div>

          <h1 className="hero-heading">
            Enterprise AI Powers for Local Salons & Spas
          </h1>
          <p className="hero-description">
            Give your local business access to the exact AI infrastructure big chains rely on — <strong>Demand Forecasting</strong>, <strong>Customer LTV Insights</strong>, <strong>1-Click AI Marketing</strong>, and <strong>No-Show Prediction</strong> in one accessible platform.
          </p>
          <button className="btn-blue" style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem' }} onClick={onLaunchPlatform}>
            Launch Enterprise Workspace <ArrowRight size={15} />
          </button>
        </div>

        <div className="clean-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)' }}>
              Live AI Scoring Engine
            </span>
            <span className={`risk-pill risk-${demoScore.tier.toLowerCase()}`}>
              {demoScore.tier} Risk ({demoScore.score}/100)
            </span>
          </div>

          <div className="form-field">
            <label>Booking Lead Time: {demoLeadTime} days</label>
            <input
              type="range"
              min="1"
              max="30"
              value={demoLeadTime}
              onChange={e => setDemoLeadTime(Number(e.target.value))}
            />
          </div>

          <div className="form-field">
            <label>Past Client No-Shows: {demoNoShows}</label>
            <input
              type="range"
              min="0"
              max="3"
              value={demoNoShows}
              onChange={e => setDemoNoShows(Number(e.target.value))}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem', marginBottom: '0.85rem' }}>
            <button
              className={`weather-chip ${demoChannel === 'walk-in' ? 'active' : ''}`}
              onClick={() => setDemoChannel('walk-in')}
            >
              Walk-In
            </button>
            <button
              className={`weather-chip ${demoChannel === 'phone' ? 'active' : ''}`}
              onClick={() => setDemoChannel('phone')}
            >
              Phone
            </button>
            <button
              className={`weather-chip ${demoChannel === 'third-party' ? 'active' : ''}`}
              onClick={() => setDemoChannel('third-party')}
            >
              3rd Party App
            </button>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.775rem' }}>
            <div style={{ color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '0.2rem' }}>Recommended AI Action:</div>
            <div style={{ fontWeight: 700 }}>{demoScore.suggestedActionLabel}</div>
          </div>
        </div>
      </section>

      {/* 5 Pillar Features */}
      <section style={{ maxWidth: '1100px', margin: '1rem auto 3rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        <div className="clean-card">
          <TrendingUp size={20} className="text-blue" style={{ marginBottom: '0.5rem' }} />
          <div className="card-title">Demand & Capacity Forecast</div>
          <div className="card-sub">Predicts hourly peak curves, recommends staff schedules, and manages consumable inventory stock.</div>
        </div>

        <div className="clean-card">
          <Sparkles size={20} style={{ color: '#a855f7', marginBottom: '0.5rem' }} />
          <div className="card-title">Customer Insights & LTV</div>
          <div className="card-sub">Automated RFM customer segmentation, 12-month spend modeling, and instant churn prevention alerts.</div>
        </div>

        <div className="clean-card">
          <Megaphone size={20} style={{ color: '#22c55e', marginBottom: '0.5rem' }} />
          <div className="card-title">AI Marketing Automation</div>
          <div className="card-sub">1-click AI campaigns for filling slow Tuesday slots, winning back churned clients, and rainy day flash promos.</div>
        </div>

        <div className="clean-card">
          <ShieldCheck size={20} className="text-blue" style={{ marginBottom: '0.5rem' }} />
          <div className="card-title">Compliance Hub</div>
          <div className="card-sub">Tracks staff cosmetology licenses, specialty certifications, and facility sanitation audits.</div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 4rem auto', padding: '0 1.5rem' }}>
        <div className="clean-card" style={{ padding: '1.75rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="card-title" style={{ fontSize: '1.15rem' }}>Enterprise Intelligence Impact Estimator</div>
            <div className="card-sub">Calculate revenue unlocked through AI demand forecasting, no-show prevention, and marketing.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <div className="form-field">
                <label>Monthly Appointments: {monthlyBookings}</label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={monthlyBookings}
                  onChange={e => setMonthlyBookings(Number(e.target.value))}
                />
              </div>

              <div className="form-field">
                <label>Avg Ticket Price ($): ${avgTicketPrice}</label>
                <input
                  type="range"
                  min="40"
                  max="400"
                  step="5"
                  value={avgTicketPrice}
                  onChange={e => setAvgTicketPrice(Number(e.target.value))}
                />
              </div>

              <div className="form-field">
                <label>Current No-Show Rate: {noShowRate}%</label>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={noShowRate}
                  onChange={e => setNoShowRate(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-blue)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Estimated Annual Revenue Unlocked</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--accent-blue)', margin: '0.5rem 0' }}>${annualSavedWithCopilot.toLocaleString()}</div>
              <button className="btn-blue" style={{ width: '100%', justifyContent: 'center' }} onClick={onLaunchPlatform}>
                Open Enterprise Workspace
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
