import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed data
const initialData = {
  appointments: [
    {
      id: 'APT-101',
      clientName: 'Jessica Miller',
      clientPhone: '(555) 234-5678',
      clientEmail: 'jessica.m@example.com',
      serviceName: 'Balayage & Full Color Treatment',
      servicePrice: 220,
      serviceDurationMin: 150,
      appointmentDate: '2026-07-28',
      appointmentTime: '15:30',
      dayOfWeek: 'Friday',
      bookingLeadTimeDays: 18,
      channel: 'third-party',
      clientHistory: { totalVisits: 2, pastNoShows: 1, pastCancellations: 1 },
      status: 'scheduled'
    },
    {
      id: 'APT-102',
      clientName: 'Marcus Vance',
      clientPhone: '(555) 876-5432',
      clientEmail: 'marcus.vance@example.com',
      serviceName: "Men's Executive Haircut & Beard Sculpt",
      servicePrice: 65,
      serviceDurationMin: 45,
      appointmentDate: '2026-07-27',
      appointmentTime: '11:00',
      dayOfWeek: 'Tuesday',
      bookingLeadTimeDays: 1,
      channel: 'walk-in',
      clientHistory: { totalVisits: 14, pastNoShows: 0, pastCancellations: 0 },
      status: 'scheduled'
    },
    {
      id: 'APT-103',
      clientName: 'Samantha Reed',
      clientPhone: '(555) 345-6789',
      clientEmail: 'samantha.r@example.com',
      serviceName: 'HydraFacial Glow & LED Therapy',
      servicePrice: 175,
      serviceDurationMin: 75,
      appointmentDate: '2026-07-28',
      appointmentTime: '17:00',
      dayOfWeek: 'Friday',
      bookingLeadTimeDays: 12,
      channel: 'app',
      clientHistory: { totalVisits: 0, pastNoShows: 0, pastCancellations: 0 },
      status: 'scheduled'
    },
    {
      id: 'APT-104',
      clientName: 'Elena Rostova',
      clientPhone: '(555) 901-2345',
      clientEmail: 'elena.r@example.com',
      serviceName: 'Gel Nail Extensions & Nail Art',
      servicePrice: 95,
      serviceDurationMin: 60,
      appointmentDate: '2026-07-27',
      appointmentTime: '14:00',
      dayOfWeek: 'Tuesday',
      bookingLeadTimeDays: 4,
      channel: 'phone',
      clientHistory: { totalVisits: 8, pastNoShows: 0, pastCancellations: 1 },
      status: 'scheduled'
    },
    {
      id: 'APT-105',
      clientName: 'David Chen',
      clientPhone: '(555) 456-7890',
      clientEmail: 'david.c@example.com',
      serviceName: 'Keratin Smoothing Treatment',
      servicePrice: 250,
      serviceDurationMin: 180,
      appointmentDate: '2026-07-29',
      appointmentTime: '10:00',
      dayOfWeek: 'Saturday',
      bookingLeadTimeDays: 21,
      channel: 'third-party',
      clientHistory: { totalVisits: 3, pastNoShows: 2, pastCancellations: 0 },
      status: 'scheduled'
    }
  ],
  staffList: [
    {
      id: 'STF-01',
      name: 'Chloe Bennett',
      role: 'Master Hair Stylist & Colorist',
      email: 'chloe@luxeglow.com',
      phone: '(555) 111-2222',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      licenses: [
        {
          id: 'LIC-101',
          staffId: 'STF-01',
          staffName: 'Chloe Bennett',
          title: 'Senior Cosmetology License',
          licenseNumber: 'COS-99482-NY',
          issuingAuthority: 'NYS Board of Cosmetology',
          expiryDate: '2026-07-15',
          status: 'EXPIRED',
          daysUntilExpiry: -12,
          category: 'License'
        }
      ]
    },
    {
      id: 'STF-02',
      name: 'David Sterling',
      role: 'Senior Esthetician & Skin Specialist',
      email: 'david.s@luxeglow.com',
      phone: '(555) 333-4444',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      licenses: [
        {
          id: 'LIC-102',
          staffId: 'STF-02',
          staffName: 'David Sterling',
          title: 'Master Esthetician Certificate',
          licenseNumber: 'EST-44310-NY',
          issuingAuthority: 'NYS Division of Licensing Services',
          expiryDate: '2026-08-08',
          status: 'EXPIRING_SOON',
          daysUntilExpiry: 12,
          category: 'Certification'
        }
      ]
    },
    {
      id: 'STF-03',
      name: 'Aria Thorne',
      role: 'Lead Nail Technician',
      email: 'aria@luxeglow.com',
      phone: '(555) 555-6666',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      licenses: [
        {
          id: 'LIC-103',
          staffId: 'STF-03',
          staffName: 'Aria Thorne',
          title: 'Nail Specialty License',
          licenseNumber: 'NL-88219-NY',
          issuingAuthority: 'NYS Board of Barbering & Cosmetology',
          expiryDate: '2027-05-20',
          status: 'COMPLIANT',
          daysUntilExpiry: 297,
          category: 'License'
        }
      ]
    }
  ],
  healthLogs: [
    {
      id: 'HSL-01',
      title: 'Autoclave Sterilization & Sanitation Audit',
      category: 'Health & Safety',
      lastInspectedDate: '2026-06-01',
      nextRenewalDate: '2026-08-01',
      status: 'EXPIRING_SOON',
      daysUntilExpiry: 5,
      responsibleStaff: 'David Sterling',
      documentRef: 'DOC-SAN-2026-06.pdf'
    },
    {
      id: 'HSL-02',
      title: 'Commercial General Liability Insurance Policy',
      category: 'Insurance',
      lastInspectedDate: '2025-08-10',
      nextRenewalDate: '2026-08-10',
      status: 'EXPIRING_SOON',
      daysUntilExpiry: 14,
      responsibleStaff: 'Salon Owner',
      documentRef: 'POL-GL-99482.pdf'
    },
    {
      id: 'HSL-03',
      title: 'City Health Department Annual Inspection Certificate',
      category: 'Health & Safety',
      lastInspectedDate: '2026-01-15',
      nextRenewalDate: '2027-01-15',
      status: 'COMPLIANT',
      daysUntilExpiry: 172,
      responsibleStaff: 'Chloe Bennett',
      documentRef: 'HEALTH-CERT-2026.pdf'
    }
  ]
};

// Ensure data file exists
function loadDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, resetting to initial:', err);
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// REST Routes

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 2. Get all appointments
app.get('/api/appointments', (req, res) => {
  const db = loadDb();
  res.json(db.appointments);
});

// 3. Create appointment
app.post('/api/appointments', (req, res) => {
  const db = loadDb();
  const newAptData = req.body;
  const newId = `APT-${100 + db.appointments.length + 1}`;
  const newApt = {
    id: newId,
    clientName: newAptData.clientName,
    clientPhone: newAptData.clientPhone || '(555) 000-1111',
    clientEmail: newAptData.clientEmail || 'client@example.com',
    serviceName: newAptData.serviceName,
    servicePrice: newAptData.servicePrice,
    serviceDurationMin: newAptData.serviceDurationMin || 60,
    appointmentDate: newAptData.appointmentDate,
    appointmentTime: newAptData.appointmentTime,
    dayOfWeek: newAptData.dayOfWeek,
    bookingLeadTimeDays: newAptData.bookingLeadTimeDays,
    channel: newAptData.channel || 'walk-in',
    clientHistory: {
      totalVisits: newAptData.totalVisits ?? 0,
      pastNoShows: newAptData.pastNoShows ?? 0,
      pastCancellations: newAptData.pastCancellations ?? 0
    },
    status: 'scheduled'
  };

  db.appointments.unshift(newApt);
  saveDb(db);
  res.status(201).json(newApt);
});

// 4. Update appointment status
app.put('/api/appointments/:id', (req, res) => {
  const db = loadDb();
  const { id } = req.params;
  const index = db.appointments.findIndex(a => a.id.toLowerCase() === id.toLowerCase());
  if (index === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  db.appointments[index] = { ...db.appointments[index], ...req.body };
  saveDb(db);
  res.json(db.appointments[index]);
});

// 5. Get staff list
app.get('/api/staff', (req, res) => {
  const db = loadDb();
  res.json(db.staffList);
});

// 6. Add staff license
app.post('/api/staff/licenses', (req, res) => {
  const db = loadDb();
  const { staffId, title, licenseNumber, issuingAuthority, expiryDate, category } = req.body;
  const staff = db.staffList.find(s => s.id === staffId);
  if (!staff) {
    return res.status(404).json({ error: 'Staff member not found' });
  }

  const newLic = {
    id: `LIC-${Date.now()}`,
    staffId: staff.id,
    staffName: staff.name,
    title,
    licenseNumber: licenseNumber || `LIC-${Math.floor(10000 + Math.random() * 90000)}`,
    issuingAuthority: issuingAuthority || 'State Board',
    expiryDate,
    status: 'COMPLIANT',
    daysUntilExpiry: 30,
    category: category || 'License'
  };

  staff.licenses.push(newLic);
  saveDb(db);
  res.status(201).json(newLic);
});

// 7. Get health and safety logs
app.get('/api/compliance', (req, res) => {
  const db = loadDb();
  res.json({
    staffList: db.staffList,
    healthLogs: db.healthLogs
  });
});

// 8. Add health safety log
app.post('/api/compliance', (req, res) => {
  const db = loadDb();
  const { title, category, expiryDate, responsibleStaff } = req.body;
  const newLog = {
    id: `HSL-${Date.now()}`,
    title,
    category: category || 'Health & Safety',
    lastInspectedDate: new Date().toISOString().split('T')[0],
    nextRenewalDate: expiryDate,
    status: 'COMPLIANT',
    daysUntilExpiry: 30,
    responsibleStaff: responsibleStaff || 'Front Desk Manager',
    documentRef: 'DOC-UPLOADED.pdf'
  };

  db.healthLogs.push(newLog);
  saveDb(db);
  res.status(201).json(newLog);
});

app.listen(PORT, () => {
  console.log(`🚀 Small Business Platform Backend Server running on http://localhost:${PORT}`);
});
