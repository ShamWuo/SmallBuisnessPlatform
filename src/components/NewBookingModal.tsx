import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import type { BookingChannel } from '../types';
import { X, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent" size={20} />
            <span className="modal-title">Real-Time Booking Risk Analyzer</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-grid">
          <div className="form-left">
            <div className="form-group">
              <label>Client Name & Phone:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="e.g. Taylor Swift"
                  className="flex-1"
                />
                <input
                  type="text"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  style={{ width: '140px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Service & Price ($):</label>
              <div className="flex gap-2">
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
                  style={{ width: '90px' }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Booking Channel:</label>
                <select value={channel} onChange={e => setChannel(e.target.value as BookingChannel)}>
                  <option value="walk-in">Walk-In (-10 Risk)</option>
                  <option value="phone">Phone Booking (0)</option>
                  <option value="app">Mobile App (+5 Risk)</option>
                  <option value="third-party">3rd Party Aggregator (+16 Risk)</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Booking Lead Time (Days):</label>
                <input
                  type="number"
                  value={bookingLeadTimeDays}
                  onChange={e => setBookingLeadTimeDays(Number(e.target.value))}
                  min={0}
                  max={60}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Day of Week:</label>
                <select value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)}>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday (Peak)</option>
                  <option value="Saturday">Saturday (Peak)</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Time Slot:</label>
                <input
                  type="text"
                  value={appointmentTime}
                  onChange={e => setAppointmentTime(e.target.value)}
                  placeholder="17:30"
                />
              </div>
            </div>

            <div className="form-section-title mt-3">Client Past History Signals</div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Total Past Visits:</label>
                <input
                  type="number"
                  value={totalVisits}
                  onChange={e => setTotalVisits(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="form-group flex-1">
                <label>Past No-Shows:</label>
                <input
                  type="number"
                  value={pastNoShows}
                  onChange={e => setPastNoShows(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="form-group flex-1">
                <label>Past Cancels:</label>
                <input
                  type="number"
                  value={pastCancellations}
                  onChange={e => setPastCancellations(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Real-time score calculator panel */}
          <div className="form-right live-score-panel">
            <div className="live-score-header">
              <Sparkles size={16} /> Live Agent Risk Score
            </div>
            
            <div className="live-score-main">
              <span className={`live-score-num score-${liveScore.tier.toLowerCase()}`}>
                {liveScore.score}
              </span>
              <span className="live-score-max">/100</span>
              <div className={`risk-tier-badge tier-${liveScore.tier.toLowerCase()} mt-2`}>
                {liveScore.tier === 'High' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                {liveScore.tier} No-Show Risk
              </div>
            </div>

            <div className="live-factors-box">
              <div className="box-title">Top Contributing Risk Drivers:</div>
              <ul>
                {liveScore.factors.map((f, i) => (
                  <li key={i} className={`factor-sm ${f.impact}`}>
                    {f.title}: {f.description}
                  </li>
                ))}
              </ul>
            </div>

            <div className="live-rec-box">
              <div className="rec-mini-title">Suggested Mitigation:</div>
              <div className="rec-mini-action">{liveScore.suggestedActionLabel}</div>
            </div>

            <button type="submit" className="btn-primary w-full mt-4">
              Save & Score Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
