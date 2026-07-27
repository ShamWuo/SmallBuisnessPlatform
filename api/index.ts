import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initDatabase } from '../server/db';

dotenv.config();
initDatabase();

const app = express();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected', version: '2.0.0-enterprise', aiConfigured: Boolean(GEMINI_API_KEY) });
});

app.get('/api/appointments', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM appointments ORDER BY id DESC').all();
    const appointments = rows.map((r: any) => ({
      id: r.id,
      clientName: r.client_name,
      clientPhone: r.client_phone,
      clientEmail: r.client_email,
      serviceName: r.service_name,
      servicePrice: r.service_price,
      serviceDurationMin: r.service_duration_min,
      appointmentDate: r.appointment_date,
      appointmentTime: r.appointment_time,
      dayOfWeek: r.day_of_week,
      bookingLeadTimeDays: r.booking_lead_time_days,
      channel: r.channel,
      status: r.status,
      clientHistory: {
        totalVisits: r.total_visits,
        pastNoShows: r.past_no_shows,
        pastCancellations: r.past_cancellations
      }
    }));
    res.json(appointments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/appointments', (req, res) => {
  try {
    const body = req.body;
    const id = `APT-${Date.now().toString().slice(-4)}`;
    const stmt = db.prepare(`
      INSERT INTO appointments (id, client_name, client_phone, client_email, service_name, service_price, service_duration_min, appointment_date, appointment_time, day_of_week, booking_lead_time_days, channel, status, total_visits, past_no_shows, past_cancellations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.clientName,
      body.clientPhone || '(555) 000-1111',
      body.clientEmail || 'client@example.com',
      body.serviceName,
      body.servicePrice,
      body.serviceDurationMin || 60,
      body.appointmentDate,
      body.appointmentTime,
      body.dayOfWeek,
      body.bookingLeadTimeDays,
      body.channel,
      'scheduled',
      body.totalVisits || 0,
      body.pastNoShows || 0,
      body.pastCancellations || 0
    );

    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/staff', (req, res) => {
  try {
    const staffRows = db.prepare('SELECT * FROM staff').all();
    const licenseRows = db.prepare('SELECT * FROM staff_licenses').all();

    const staffList = staffRows.map((s: any) => {
      const licenses = licenseRows
        .filter((l: any) => l.staff_id === s.id)
        .map((l: any) => ({
          id: l.id,
          staffId: l.staff_id,
          staffName: l.staff_name,
          title: l.title,
          licenseNumber: l.license_number,
          issuingAuthority: l.issuing_authority,
          expiryDate: l.expiry_date,
          status: l.status,
          daysUntilExpiry: Math.round((new Date(l.expiry_date).getTime() - new Date('2026-07-27').getTime()) / (1000 * 3600 * 24)),
          category: l.category
        }));

      return {
        id: s.id,
        name: s.name,
        role: s.role,
        email: s.email,
        phone: s.phone,
        avatarUrl: s.avatar_url,
        licenses
      };
    });

    res.json(staffList);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customers', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM customers').all();
    const customers = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      segment: r.segment,
      totalVisits: r.total_visits,
      lifetimeSpend: r.lifetime_spend,
      averageTicket: r.average_ticket,
      lastVisitDate: r.last_visit_date,
      daysSinceLastVisit: Math.round((new Date('2026-07-27').getTime() - new Date(r.last_visit_date).getTime()) / (1000 * 3600 * 24)),
      predicted12MonthLTV: r.predicted_12mo_ltv,
      churnRiskScore: r.churn_risk_score,
      churnRiskLevel: r.churn_risk_level,
      favoriteService: r.favorite_service,
      notes: r.notes
    }));
    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/campaigns', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM marketing_campaigns ORDER BY created_at DESC').all();
    const campaigns = rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      targetSegment: r.target_segment,
      channel: r.channel,
      discountOffer: r.discount_offer,
      scheduledSlotTime: r.scheduled_slot_time,
      status: r.status,
      messageText: r.message_text,
      recipientsCount: r.recipients_count,
      conversionsCount: r.conversions_count,
      conversionRatePct: r.conversion_rate_pct,
      revenueGenerated: r.revenue_generated,
      campaignCost: r.campaign_cost,
      roiMultiplier: r.roi_multiplier,
      createdAt: r.created_at
    }));
    res.json(campaigns);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/campaigns', (req, res) => {
  try {
    const body = req.body;
    const id = `CMP-${Date.now().toString().slice(-4)}`;
    const recipients = body.targetSegment === 'At-Risk' ? 42 : body.targetSegment === 'VIP Champions' ? 35 : 120;
    const conversions = Math.round(recipients * 0.18);
    const revenue = conversions * 120;
    const cost = 15;

    const stmt = db.prepare(`
      INSERT INTO marketing_campaigns (id, title, type, target_segment, channel, discount_offer, scheduled_slot_time, status, message_text, recipients_count, conversions_count, conversion_rate_pct, revenue_generated, campaign_cost, roi_multiplier, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.title,
      body.type,
      body.targetSegment,
      body.channel || 'SMS',
      body.discountOffer,
      body.scheduledSlotTime || null,
      body.status || 'Active',
      body.messageText,
      recipients,
      conversions,
      18.0,
      revenue,
      cost,
      Math.round(revenue / cost),
      new Date().toISOString().split('T')[0]
    );

    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/copilot/query', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!GEMINI_API_KEY) {
      return res.json({ aiConfigured: false, fallbackMessage: 'API Key missing' });
    }

    const aptSummary = db.prepare('SELECT count(*) as count FROM appointments').get() as { count: number };
    const custSummary = db.prepare('SELECT count(*) as count FROM customers').get() as { count: number };
    const licenseSummary = db.prepare("SELECT count(*) as count FROM staff_licenses WHERE status='EXPIRED' OR status='EXPIRING_SOON'").get() as { count: number };

    const systemPrompt = `You are Front Desk Copilot, an AI assistant for Luxe & Glow Salon & Spa.
Salon Database Context:
- Total Appointments Tracked: ${aptSummary.count}
- Total Customers: ${custSummary.count}
- Urgent Compliance Alerts: ${licenseSummary.count}
User Question: "${prompt}"

Provide a concise, helpful, professional response (max 3 short bullet points or paragraphs) giving clear actionable advice for the salon manager.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    if (response.ok) {
      const data: any = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (aiText) return res.json({ success: true, aiResponseText: aiText });
    }

    res.json({ success: false, fallback: true });
  } catch (err: any) {
    res.json({ success: false, error: err.message });
  }
});

export default app;
