import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Zap, ArrowRight, TrendingUp, Bot } from 'lucide-react';
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
    <div className="landing-container">
      <header className="landing-header">
        <div className="flex items-center gap-2">
          <div className="sidebar-brand-icon">
            <Sparkles size={20} />
          </div>
          <span className="font-bold text-lg">Front Desk Copilot</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-obsidian" onClick={onLaunchPlatform}>
            Demo Features
          </button>
          <button className="btn-electric" onClick={onLaunchPlatform}>
            Launch Workspace <ArrowRight size={15} />
          </button>
        </div>
      </header>

      <section className="landing-hero">
        <div>
          <div className="hero-pill">
            <Zap size={14} /> AI Operations Assistant for Salons & Spas
          </div>
          <h1 className="hero-title">
            Stop No-Shows & Expiry Penalties with <span className="gradient-text-blue">Front Desk Copilot</span>
          </h1>
          <p className="hero-sub">
            The single-agent intelligence engine that predicts high-risk bookings, automates deposit requests, and audits state board license compliance—in real time.
          </p>
          <div className="hero-cta-group">
            <button className="btn-electric" style={{ padding: '0.8rem 1.75rem', fontSize: '1rem' }} onClick={onLaunchPlatform}>
              Open Live Platform <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="hero-preview-card">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-electric uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={14} /> Live Heuristic Predictor Demo
            </span>
            <span className={`risk-tier-badge tier-${demoScore.tier.toLowerCase()}`}>
              {demoScore.tier} Risk ({demoScore.score}/100)
            </span>
          </div>

          <div className="text-sm font-bold mb-1">Interactive Signal Adjustment:</div>
          <div className="form-stacked text-xs gap-2 mb-4">
            <div>
              <label className="text-secondary">Lead Time (Days): {demoLeadTime}d</label>
              <input
                type="range"
                min="1"
                max="30"
                value={demoLeadTime}
                onChange={e => setDemoLeadTime(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-secondary">Past No-Shows on Record: {demoNoShows}</label>
              <input
                type="range"
                min="0"
                max="3"
                value={demoNoShows}
                onChange={e => setDemoNoShows(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-2 mt-1">
              <button
                className={`filter-chip ${demoChannel === 'walk-in' ? 'active' : ''}`}
                onClick={() => setDemoChannel('walk-in')}
              >
                Walk-In (-10)
              </button>
              <button
                className={`filter-chip ${demoChannel === 'phone' ? 'active' : ''}`}
                onClick={() => setDemoChannel('phone')}
              >
                Phone (0)
              </button>
              <button
                className={`filter-chip ${demoChannel === 'third-party' ? 'active' : ''}`}
                onClick={() => setDemoChannel('third-party')}
              >
                3rd Party (+16)
              </button>
            </div>
          </div>

          <div className="obsidian-card p-3 text-xs">
            <div className="font-bold text-electric mb-1">Copilot Action Recommendation:</div>
            <div className="font-extrabold text-sm">{demoScore.suggestedActionLabel}</div>
            <div className="text-tertiary mt-1">{demoScore.suggestedActionDescription}</div>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <TrendingUp size={24} />
          </div>
          <h3 className="feature-title">No-Show Risk Predictor</h3>
          <p className="feature-desc">
            Evaluates lead-times, past attendance ratios, weekend peak hours, and weather forecasts to assign actionable risk scores to every upcoming appointment.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <ShieldCheck size={24} />
          </div>
          <h3 className="feature-title">Compliance Hub</h3>
          <p className="feature-desc">
            Proactively audits cosmetology license renewal dates, specialty certificates, and sanitation inspection logs before state board audits occur.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Bot size={24} />
          </div>
          <h3 className="feature-title">Shared Agent Copilot</h3>
          <p className="feature-desc">
            Single natural language assistant connected to shared salon tables. Instantly answers questions, analyzes individual risks, and drafts communications.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="obsidian-card p-8 border-accent">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold mb-2">Estimate Your Salon's Revenue Recovery</h2>
            <p className="text-secondary text-sm">See how much lost no-show revenue Front Desk Copilot recovers annually.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-secondary">Monthly Appointments: {monthlyBookings}</label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={monthlyBookings}
                  onChange={e => setMonthlyBookings(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="font-bold text-secondary">Avg Service Ticket ($): ${avgTicketPrice}</label>
                <input
                  type="range"
                  min="40"
                  max="400"
                  step="5"
                  value={avgTicketPrice}
                  onChange={e => setAvgTicketPrice(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="font-bold text-secondary">Current No-Show Rate: {noShowRate}%</label>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={noShowRate}
                  onChange={e => setNoShowRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="col-span-2 obsidian-card bg-surface p-6 text-center border-accent">
              <div className="text-xs font-bold text-tertiary uppercase tracking-wider">Estimated Annual Revenue Saved</div>
              <div className="text-4xl font-extrabold text-electric my-2">${annualSavedWithCopilot.toLocaleString()}</div>
              <div className="text-xs text-secondary mb-4">Based on 75% reduction in empty-slot no-shows via automated deposit requests & SMS confirmations.</div>
              <button className="btn-electric w-full justify-center" onClick={onLaunchPlatform}>
                Start Saving Revenue Today
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-xs text-tertiary border-t border-subtle mt-12">
        Front Desk Copilot • Obsidian Web Platform • Built with React & TypeScript
      </footer>
    </div>
  );
};
