import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'salon_database.db');
export const db = new Database(dbPath);

// Enable Foreign Keys & WAL mode for fast concurrent reads/writes
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      client_email TEXT NOT NULL,
      service_name TEXT NOT NULL,
      service_price REAL NOT NULL,
      service_duration_min INTEGER NOT NULL,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      day_of_week TEXT NOT NULL,
      booking_lead_time_days INTEGER NOT NULL,
      channel TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      total_visits INTEGER DEFAULT 0,
      past_no_shows INTEGER DEFAULT 0,
      past_cancellations INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      avatar_url TEXT
    );

    CREATE TABLE IF NOT EXISTS staff_licenses (
      id TEXT PRIMARY KEY,
      staff_id TEXT NOT NULL,
      staff_name TEXT NOT NULL,
      title TEXT NOT NULL,
      license_number TEXT NOT NULL,
      issuing_authority TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      status TEXT NOT NULL,
      category TEXT NOT NULL,
      FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS health_safety_logs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      last_inspected_date TEXT NOT NULL,
      next_renewal_date TEXT NOT NULL,
      status TEXT NOT NULL,
      responsible_staff TEXT NOT NULL,
      document_ref TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      segment TEXT NOT NULL,
      total_visits INTEGER NOT NULL,
      lifetime_spend REAL NOT NULL,
      average_ticket REAL NOT NULL,
      last_visit_date TEXT NOT NULL,
      predicted_12mo_ltv REAL NOT NULL,
      churn_risk_score INTEGER NOT NULL,
      churn_risk_level TEXT NOT NULL,
      favorite_service TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS marketing_campaigns (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      target_segment TEXT NOT NULL,
      channel TEXT NOT NULL,
      discount_offer TEXT NOT NULL,
      scheduled_slot_time TEXT,
      status TEXT NOT NULL,
      message_text TEXT NOT NULL,
      recipients_count INTEGER NOT NULL,
      conversions_count INTEGER NOT NULL,
      conversion_rate_pct REAL NOT NULL,
      revenue_generated REAL NOT NULL,
      campaign_cost REAL NOT NULL,
      roi_multiplier REAL NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS trigger_rules (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      condition TEXT NOT NULL,
      action TEXT NOT NULL,
      is_enabled INTEGER NOT NULL DEFAULT 1,
      times_triggered INTEGER NOT NULL DEFAULT 0,
      revenue_rescued REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS pricing_rules (
      id TEXT PRIMARY KEY,
      service_name TEXT NOT NULL,
      base_price REAL NOT NULL,
      surge_price REAL NOT NULL,
      off_peak_price REAL NOT NULL,
      peak_window TEXT NOT NULL,
      off_peak_window TEXT NOT NULL,
      is_surge_enabled INTEGER NOT NULL DEFAULT 1,
      est_monthly_uplift REAL NOT NULL
    );
  `);

  // Seed Data if DB is empty
  const countApts = db.prepare('SELECT count(*) as count FROM appointments').get() as { count: number };
  if (countApts.count === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  const insertApt = db.prepare(`
    INSERT INTO appointments (id, client_name, client_phone, client_email, service_name, service_price, service_duration_min, appointment_date, appointment_time, day_of_week, booking_lead_time_days, channel, status, total_visits, past_no_shows, past_cancellations)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertApt.run('APT-101', 'Jessica Miller', '(555) 234-5678', 'jessica.m@example.com', 'Balayage & Full Color Treatment', 220, 150, '2026-07-28', '15:30', 'Friday', 18, 'third-party', 'scheduled', 2, 1, 1);
  insertApt.run('APT-102', 'Marcus Vance', '(555) 876-5432', 'marcus.vance@example.com', 'Men’s Executive Haircut & Beard Sculpt', 65, 45, '2026-07-27', '11:00', 'Tuesday', 1, 'walk-in', 'scheduled', 14, 0, 0);
  insertApt.run('APT-103', 'Samantha Reed', '(555) 345-6789', 'samantha.r@example.com', 'HydraFacial Glow & LED Therapy', 175, 75, '2026-07-28', '17:00', 'Friday', 12, 'app', 'scheduled', 0, 0, 0);
  insertApt.run('APT-104', 'Elena Rostova', '(555) 901-2345', 'elena.r@example.com', 'Gel Nail Extensions & Nail Art', 95, 60, '2026-07-27', '14:00', 'Tuesday', 4, 'phone', 'scheduled', 8, 0, 1);
  insertApt.run('APT-105', 'David Chen', '(555) 456-7890', 'david.c@example.com', 'Keratin Smoothing Treatment', 250, 180, '2026-07-29', '10:00', 'Saturday', 21, 'third-party', 'scheduled', 3, 2, 0);

  // Staff
  const insertStaff = db.prepare('INSERT INTO staff (id, name, role, email, phone, avatar_url) VALUES (?, ?, ?, ?, ?, ?)');
  insertStaff.run('STF-01', 'Chloe Bennett', 'Master Hair Stylist & Colorist', 'chloe@luxeglow.com', '(555) 111-2222', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
  insertStaff.run('STF-02', 'David Sterling', 'Senior Esthetician & Skin Specialist', 'david.s@luxeglow.com', '(555) 333-4444', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80');
  insertStaff.run('STF-03', 'Aria Thorne', 'Lead Nail Technician', 'aria@luxeglow.com', '(555) 555-6666', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80');

  // Licenses
  const insertLic = db.prepare(`
    INSERT INTO staff_licenses (id, staff_id, staff_name, title, license_number, issuing_authority, expiry_date, status, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertLic.run('LIC-101', 'STF-01', 'Chloe Bennett', 'Senior Cosmetology License', 'COS-99482-NY', 'NYS Board of Cosmetology', '2026-07-15', 'EXPIRED', 'License');
  insertLic.run('LIC-102', 'STF-02', 'David Sterling', 'Master Esthetician Certificate', 'EST-44310-NY', 'NYS Division of Licensing Services', '2026-08-08', 'EXPIRING_SOON', 'Certification');
  insertLic.run('LIC-103', 'STF-03', 'Aria Thorne', 'Nail Specialty License', 'NL-88219-NY', 'NYS Board of Barbering & Cosmetology', '2027-05-20', 'COMPLIANT', 'License');

  // Health Safety
  const insertHealth = db.prepare(`
    INSERT INTO health_safety_logs (id, title, category, last_inspected_date, next_renewal_date, status, responsible_staff, document_ref)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertHealth.run('HSL-01', 'Autoclave Sterilization & Sanitation Audit', 'Health & Safety', '2026-06-01', '2026-08-01', 'EXPIRING_SOON', 'David Sterling', 'DOC-SAN-2026-06.pdf');
  insertHealth.run('HSL-02', 'Commercial General Liability Insurance Policy', 'Insurance', '2025-08-10', '2026-08-10', 'EXPIRING_SOON', 'Salon Owner', 'POL-GL-99482.pdf');
  insertHealth.run('HSL-03', 'City Health Department Annual Inspection Certificate', 'Health & Safety', '2026-01-15', '2027-01-15', 'COMPLIANT', 'Chloe Bennett', 'HEALTH-CERT-2026.pdf');

  // Customers
  const insertCust = db.prepare(`
    INSERT INTO customers (id, name, email, phone, segment, total_visits, lifetime_spend, average_ticket, last_visit_date, predicted_12mo_ltv, churn_risk_score, churn_risk_level, favorite_service, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertCust.run('CUST-001', 'Jessica Miller', 'jessica.m@example.com', '(555) 234-5678', 'At-Risk', 6, 1320, 220, '2026-05-10', 2400, 78, 'High', 'Balayage & Full Color Treatment', 'Overdue for retouch.');
  insertCust.run('CUST-002', 'Marcus Vance', 'marcus.vance@example.com', '(555) 876-5432', 'VIP Champions', 14, 910, 65, '2026-07-02', 1560, 12, 'Low', 'Men’s Executive Haircut & Beard Sculpt', 'Books every 3 weeks.');
  insertCust.run('CUST-003', 'Samantha Reed', 'samantha.r@example.com', '(555) 345-6789', 'New Opportunities', 1, 175, 175, '2026-06-28', 1400, 35, 'Medium', 'HydraFacial Glow & LED Therapy', 'Responsive to skincare.');

  // Campaigns
  const insertCmp = db.prepare(`
    INSERT INTO marketing_campaigns (id, title, type, target_segment, channel, discount_offer, scheduled_slot_time, status, message_text, recipients_count, conversions_count, conversion_rate_pct, revenue_generated, campaign_cost, roi_multiplier, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertCmp.run('CMP-201', 'Slow Tuesday Morning Fill-Up', 'Off-Peak Filler', 'All', 'SMS', '20% OFF Any Service', 'Tuesday 9:00 AM - 12:00 PM', 'Active', '✨ Luxe & Glow Flash Perk: Book any haircut or facial this Tuesday morning between 9am-12pm & enjoy 20% OFF! Reply YES to claim your spot.', 84, 14, 16.7, 1680, 12, 140, '2026-07-25');
  insertCmp.run('CMP-202', 'At-Risk Client VIP Win-Back', 'At-Risk Win-Back', 'At-Risk', 'Both', 'Free Keratin Hair Mask Add-On ($45 Value)', null, 'Active', 'We miss you at Luxe & Glow! We saved a complimentary $45 Deep Keratin Hair Treatment for your next appointment this month.', 42, 9, 21.4, 1980, 25, 79.2, '2026-07-22');

  // Trigger Rules
  const insertTrg = db.prepare(`
    INSERT INTO trigger_rules (id, name, condition, action, is_enabled, times_triggered, revenue_rescued)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertTrg.run('TRG-301', 'Automatic Off-Peak Tuesday/Wednesday Slot Filler', 'Demand Forecast < 40% 48 hours prior', 'Send 20% OFF SMS campaign to active clients', 1, 12, 4320);
  insertTrg.run('TRG-302', 'Automated 60-Day Churn Prevention Alert', 'Client days since last visit > 60 days', 'Auto-generate personalized $30 Win-Back voucher email', 1, 28, 6720);

  // Pricing Rules
  const insertPrc = db.prepare(`
    INSERT INTO pricing_rules (id, service_name, base_price, surge_price, off_peak_price, peak_window, off_peak_window, is_surge_enabled, est_monthly_uplift)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertPrc.run('PRC-01', 'Balayage & Full Color Treatment', 220, 250, 190, 'Friday & Saturday 1:00 PM - 6:00 PM', 'Tuesday & Wednesday 9:00 AM - 12:00 PM', 1, 1440);
  insertPrc.run('PRC-02', 'Keratin Smoothing Treatment', 250, 285, 215, 'Saturday 10:00 AM - 3:00 PM', 'Wednesday 10:00 AM - 1:00 PM', 1, 1050);
}
