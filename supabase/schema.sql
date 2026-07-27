-- ==========================================
-- Small Business Platform PostgreSQL / Supabase Schema
-- ==========================================

-- 1. Create Enums
CREATE TYPE booking_channel AS ENUM ('walk-in', 'app', 'phone', 'third-party');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show');
CREATE TYPE compliance_status AS ENUM ('COMPLIANT', 'EXPIRING_SOON', 'EXPIRED');
CREATE TYPE compliance_category AS ENUM ('License', 'Certification', 'Health & Safety', 'Insurance');

-- 2. Staff Table
CREATE TABLE IF NOT EXISTS staff (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Staff Licenses Table
CREATE TABLE IF NOT EXISTS staff_licenses (
  id VARCHAR(50) PRIMARY KEY,
  staff_id VARCHAR(50) REFERENCES staff(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  issuing_authority VARCHAR(255) NOT NULL,
  expiry_date DATE NOT NULL,
  status compliance_status DEFAULT 'COMPLIANT',
  category VARCHAR(50) DEFAULT 'License',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Health & Safety / Compliance Logs Table
CREATE TABLE IF NOT EXISTS health_safety_logs (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category compliance_category NOT NULL,
  last_inspected_date DATE NOT NULL,
  next_renewal_date DATE NOT NULL,
  status compliance_status DEFAULT 'COMPLIANT',
  responsible_staff VARCHAR(255),
  document_ref VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(50) PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50) NOT NULL,
  client_email VARCHAR(255),
  service_name VARCHAR(255) NOT NULL,
  service_price NUMERIC(10, 2) NOT NULL,
  service_duration_min INT NOT NULL DEFAULT 60,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  day_of_week VARCHAR(20) NOT NULL,
  booking_lead_time_days INT DEFAULT 0,
  channel booking_channel DEFAULT 'walk-in',
  total_visits INT DEFAULT 0,
  past_no_shows INT DEFAULT 0,
  past_cancellations INT DEFAULT 0,
  status appointment_status DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_licenses_expiry ON staff_licenses(expiry_date);
CREATE INDEX IF NOT EXISTS idx_logs_renewal ON health_safety_logs(next_renewal_date);
