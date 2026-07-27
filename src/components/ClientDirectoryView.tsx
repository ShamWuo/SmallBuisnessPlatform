import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { Users, Search, AlertTriangle, CheckCircle } from 'lucide-react';

export const ClientDirectoryView: React.FC = () => {
  const { appointments, scoredAppointments } = useSalon();
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique clients
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
    <div className="obsidian-card">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <Users className="text-electric" size={20} /> Client Attendance Directory
          </h2>
          <p className="text-xs text-secondary mt-1">
            Historical attendance records, no-show ratios, and booking channel habits.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-input px-3 py-1.5 rounded border border-subtle">
          <Search size={14} className="text-tertiary" />
          <input
            type="text"
            placeholder="Search client..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-xs text-primary focus:outline-none"
          />
        </div>
      </div>

      <table className="directory-table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Contact</th>
            <th>Total Visits</th>
            <th>No-Shows / Cancels</th>
            <th>Booking Channel</th>
            <th>Current Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c, i) => {
            const noShowRate = c.history.totalVisits > 0 ? Math.round((c.history.pastNoShows / c.history.totalVisits) * 100) : 0;
            return (
              <tr key={i}>
                <td className="font-bold text-primary">{c.name}</td>
                <td>{c.phone}</td>
                <td className="font-semibold">{c.history.totalVisits} visits</td>
                <td>
                  <span className={c.history.pastNoShows > 0 ? 'text-danger font-bold' : ''}>
                    {c.history.pastNoShows} no-shows ({noShowRate}%)
                  </span> / {c.history.pastCancellations} cancels
                </td>
                <td><span className={`channel-chip channel-${c.channel}`}>{c.channel}</span></td>
                <td>
                  <span className={`risk-tier-badge tier-${c.riskTier.toLowerCase()}`}>
                    {c.riskTier === 'High' ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
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
