import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Users, Search, AlertTriangle, CheckCircle } from 'lucide-react';

export const ClientDirectoryView: React.FC = () => {
  const { appointments, scoredAppointments } = useSalon();
  const [searchTerm, setSearchTerm] = useState('');

  const clientMap = new Map();
  appointments.forEach(apt => {
    if (!clientMap.has(apt.clientName)) {
      const scored = scoredAppointments.find(s => s.appointment.id === apt.id);
      clientMap.set(apt.clientName, {
        name: apt.clientName,
        phone: apt.clientPhone,
        email: apt.clientEmail,
        history: apt.clientHistory,
        channel: apt.channel,
        latestService: apt.serviceName,
        riskTier: scored ? scored.result.tier : 'Low',
        riskScore: scored ? scored.result.score : 20
      });
    }
  });

  const clients = Array.from(clientMap.values()).filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clean-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={16} className="text-blue" /> Client Records & Attendance History
          </div>
          <div className="card-sub">Client attendance ratios and booking channel habits.</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-input)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <Search size={13} style={{ color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Filter client..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', fontSize: '0.775rem', color: 'var(--text-main)', outline: 'none' }}
          />
        </div>
      </div>

      <table className="clean-table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Contact</th>
            <th>Total Visits</th>
            <th>No-Shows / Cancels</th>
            <th>Channel</th>
            <th>Current Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c, i) => {
            const noShowRate = c.history.totalVisits > 0 ? Math.round((c.history.pastNoShows / c.history.totalVisits) * 100) : 0;
            return (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.name}</td>
                <td>{c.phone}</td>
                <td style={{ fontWeight: 500 }}>{c.history.totalVisits} visits</td>
                <td>
                  <span className={c.history.pastNoShows > 0 ? 'text-red font-bold' : ''}>
                    {c.history.pastNoShows} no-shows ({noShowRate}%)
                  </span> / {c.history.pastCancellations} cancels
                </td>
                <td><span className={`channel-chip channel-${c.channel}`}>{c.channel}</span></td>
                <td>
                  <span className={`risk-pill risk-${c.riskTier.toLowerCase()}`}>
                    {c.riskTier === 'High' ? <AlertTriangle size={11} /> : <CheckCircle size={11} />}
                    {c.riskScore}/100 ({c.riskTier})
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
