import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, TrendingUp, MessageSquare } from 'lucide-react';
import { scoreAppointment } from '../lib/scoringEngine';
import type { Appointment } from '../types';

interface LandingPageProps {
  onLaunchPlatform: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchPlatform }) => {
  const [monthlyBookings, setMonthlyBookings] = useState(150);
  const [avgTicketPrice, setAvgTicketPrice] = useState(140);
  const [noShowRate, setNoShowRate] = useState(12);

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
  const annualSavedWithCopilot = Math.round(monthlyRevenueLost * 12 * 0.75);

  return (
    <div className="landing-shell">
      <header className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <div className="brand-dot" /> Front Desk Copilot
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-ghost" onClick={onLaunchPlatform}>View Demo</button>
          <button className="btn-blue" onClick={onLaunchPlatform}>
            Open Platform <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <section className="landing-hero-section">
        <div>
          <h1 className="hero-heading">
            Intelligent Front Desk Operations for Salons & Spas
          </h1>
          <p className="hero-description">
            Predict high-risk booking no-shows, automate deposit reminders, and maintain staff cosmetology license compliance in one effortless platform.
          </p>
          <button className="btn-blue" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }} onClick={onLaunchPlatform}>
            Open Workspace <ArrowRight size={15} />
          </button>
        </div>

        <div className="clean-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)' }}>
              Live Predictor Scoring
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
            <div style={{ color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '0.2rem' }}>Recommended Action:</div>
            <div style={{ fontWeight: 700 }}>{demoScore.suggestedActionLabel}</div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '1rem auto 3rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="clean-card">
          <TrendingUp size={20} className="text-blue" style={{ marginBottom: '0.5rem' }} />
          <div className="card-title">No-Show Predictor</div>
          <div className="card-sub">Evaluates appointment lead times, client history, time of day, and weather forecast signals.</div>
        </div>

        <div className="clean-card">
          <ShieldCheck size={20} className="text-blue" style={{ marginBottom: '0.5rem' }} />
          <div className="card-title">Compliance Hub</div>
          <div className="card-sub">Proactively tracks staff cosmetology licenses, specialty certificates, and sanitation audits.</div>
        </div>

        <div className="clean-card">
          <MessageSquare size={20} className="text-blue" style={{ marginBottom: '0.5rem' }} />
          <div className="card-title">Copilot Assistant</div>
          <div className="card-sub">Natural language assistant that analyzes risk drivers and drafts client communications in 1 click.</div>
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto 4rem auto', padding: '0 1.5rem' }}>
        <div className="clean-card" style={{ padding: '1.75rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="card-title" style={{ fontSize: '1.1rem' }}>Revenue Recovery Estimator</div>
            <div className="card-sub">Calculate lost appointment revenue recovered annually.</div>
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
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Estimated Annual Revenue Recovered</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--accent-blue)', margin: '0.5rem 0' }}>${annualSavedWithCopilot.toLocaleString()}</div>
              <button className="btn-blue" style={{ width: '100%', justifyContent: 'center' }} onClick={onLaunchPlatform}>
                Open Platform Workspace
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
