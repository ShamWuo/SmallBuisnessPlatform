import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import type { BookingChannel } from '../types';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { scoreAppointment } from '../lib/scoringEngine';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({ isOpen, onClose }) => {
  const { addAppointment, weatherSim } = useSalon();

  const [clientName, setClientName] = useState('Taylor Swift');
  const [clientPhone, setClientPhone] = useState('(555) 777-8888');
  const [serviceName, setServiceName] = useState('Full Highlights & Styling');
  const [servicePrice, setServicePrice] = useState(195);
  const [bookingLeadTimeDays, setBookingLeadTimeDays] = useState(16);
  const [channel, setChannel] = useState<BookingChannel>('third-party');
  const [dayOfWeek, setDayOfWeek] = useState('Friday');
  const [appointmentTime, setAppointmentTime] = useState('17:30');
  const [totalVisits, setTotalVisits] = useState(0);
  const [pastNoShows, setPastNoShows] = useState(0);
  const [pastCancellations, setPastCancellations] = useState(0);

  if (!isOpen) return null;

  const previewApt = {
    id: 'PREVIEW',
    clientName: clientName || 'New Client',
    clientPhone: clientPhone || '(555) 000-0000',
    clientEmail: 'client@example.com',
    serviceName: serviceName || 'Service',
    servicePrice: Number(servicePrice) || 50,
    serviceDurationMin: 60,
    appointmentDate: '2026-07-28',
    appointmentTime,
    dayOfWeek,
    bookingLeadTimeDays: Number(bookingLeadTimeDays) || 0,
    channel,
    clientHistory: {
      totalVisits: Number(totalVisits) || 0,
      pastNoShows: Number(pastNoShows) || 0,
      pastCancellations: Number(pastCancellations) || 0
    },
    status: 'scheduled' as const,
    weatherSimulated: weatherSim
  };

  const liveScore = scoreAppointment(previewApt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      clientName,
      clientPhone,
      clientEmail: 'client@example.com',
      serviceName,
      servicePrice: Number(servicePrice),
      serviceDurationMin: 60,
      appointmentDate: '2026-07-28',
      appointmentTime,
      dayOfWeek,
      bookingLeadTimeDays: Number(bookingLeadTimeDays),
      channel,
      totalVisits: Number(totalVisits),
      pastNoShows: Number(pastNoShows),
      pastCancellations: Number(pastCancellations),
      status: 'scheduled'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box wide" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <span>Booking Risk Analyzer</span>
          <button className="btn-ghost" style={{ padding: '0.2rem 0.4rem' }} onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content-body" style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '1.25rem' }}>
          <div>
            <div className="form-field">
              <label>Client Name & Phone:</label>
              <div className="flex-row">
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="Client Name"
                  className="flex-1"
                />
                <input
                  type="text"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  style={{ width: '130px' }}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Service & Price ($):</label>
              <div className="flex-row">
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={e => setServiceName(e.target.value)}
                  placeholder="Service Name"
                  className="flex-1"
                />
                <input
                  type="number"
                  required
                  value={servicePrice}
                  onChange={e => setServicePrice(Number(e.target.value))}
                  style={{ width: '80px' }}
                />
              </div>
            </div>

            <div className="flex-row">
              <div className="form-field flex-1">
                <label>Booking Channel:</label>
                <select value={channel} onChange={e => setChannel(e.target.value as BookingChannel)}>
                  <option value="walk-in">Walk-In (-10)</option>
                  <option value="phone">Phone (0)</option>
                  <option value="app">Mobile App (+5)</option>
                  <option value="third-party">3rd Party (+16)</option>
                </select>
              </div>

              <div className="form-field flex-1">
                <label>Lead Time (Days):</label>
                <input
                  type="number"
                  value={bookingLeadTimeDays}
                  onChange={e => setBookingLeadTimeDays(Number(e.target.value))}
                  min={0}
                  max={60}
                />
              </div>
            </div>

            <div className="flex-row">
              <div className="form-field flex-1">
                <label>Day of Week:</label>
                <select value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)}>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday (Peak)</option>
                  <option value="Saturday">Saturday (Peak)</option>
                </select>
              </div>

              <div className="form-field flex-1">
                <label>Time Slot:</label>
                <input
                  type="text"
                  value={appointmentTime}
                  onChange={e => setAppointmentTime(e.target.value)}
                  placeholder="17:30"
                />
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-blue)', marginTop: '0.5rem', marginBottom: '0.35rem' }}>
              Past Client History
            </div>
            <div className="flex-row">
              <div className="form-field flex-1">
                <label>Visits:</label>
                <input
                  type="number"
                  value={totalVisits}
                  onChange={e => setTotalVisits(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="form-field flex-1">
                <label>No-Shows:</label>
                <input
                  type="number"
                  value={pastNoShows}
                  onChange={e => setPastNoShows(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="form-field flex-1">
                <label>Cancels:</label>
                <input
                  type="number"
                  value={pastCancellations}
                  onChange={e => setPastCancellations(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Live Score Side Card */}
          <div style={{ background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
                Calculated Risk Score
              </div>
              
              <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: liveScore.tier === 'High' ? 'var(--status-red)' : liveScore.tier === 'Medium' ? 'var(--status-amber)' : 'var(--status-green)' }}>
                  {liveScore.score}
                </div>
                <div className={`risk-pill risk-${liveScore.tier.toLowerCase()}`} style={{ marginTop: '0.25rem' }}>
                  {liveScore.tier === 'High' ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                  {liveScore.tier} Risk
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', fontSize: '0.725rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Suggested Action:</div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{liveScore.suggestedActionLabel}</div>
              </div>
            </div>

            <button type="submit" className="btn-blue" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>
              Save Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
