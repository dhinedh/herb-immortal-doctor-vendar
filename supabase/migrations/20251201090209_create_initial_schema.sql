/*
  # Herb Immortal - Initial Database Schema

  ## Overview
  Creates the complete database structure for the Herb Immortal doctor portal, including:
  - Doctor profiles and professional information
  - Booking and consultation management
  - Products and orders
  - Wallet and transactions
  - Chat and notifications

  ## New Tables

  ### 1. doctors
  Core doctor profile information
  - `id` (uuid, PK) - References auth.users
  - `email` (text)
  - `phone` (text)
  - `full_name` (text)
  - `preferred_name` (text)
  - `pronouns` (text)
  - `date_of_birth` (date)
  - `gender` (text)
  - `about` (text)
  - `work_best_with` (text)
  - `profile_photo_url` (text)
  - `onboarding_completed` (boolean)
  - `onboarding_step` (int)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. doctor_locations
  Practice locations for doctors
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `address_line1` (text)
  - `address_line2` (text)
  - `city` (text)
  - `state` (text)
  - `country` (text)
  - `postal_code` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `is_primary` (boolean)

  ### 3. doctor_professional_details
  Professional information and services
  - `doctor_id` (uuid, PK, FK)
  - `service_locations` (text[])
  - `services_provided_to` (text[])
  - `treatment_platforms` (text[])
  - `languages` (text[])
  - `total_experience_years` (int)
  - `specializations` (text[])

  ### 4. doctor_availability
  Weekly availability schedule
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `day_of_week` (int) - 0=Sunday, 6=Saturday
  - `is_available` (boolean)
  - `time_slots` (jsonb) - Array of {start_time, end_time}

  ### 5. doctor_education
  Educational qualifications
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `degree` (text)
  - `specialization` (text)
  - `institution` (text)
  - `country` (text)
  - `start_year` (int)
  - `end_year` (int)
  - `document_url` (text)

  ### 6. doctor_licenses
  Professional licenses
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `license_type` (text)
  - `issuing_authority` (text)
  - `license_number` (text)
  - `issue_date` (date)
  - `expiry_date` (date)
  - `document_url` (text)

  ### 7. doctor_certificates
  Additional certifications
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `title` (text)
  - `issued_by` (text)
  - `year` (int)
  - `document_url` (text)

  ### 8. doctor_media
  Profile media (clinic photos, videos)
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `media_type` (text) - 'clinic_photo', 'intro_video'
  - `url` (text)
  - `order_index` (int)

  ### 9. patients
  Patient information
  - `id` (uuid, PK) - References auth.users
  - `full_name` (text)
  - `email` (text)
  - `phone` (text)
  - `date_of_birth` (date)
  - `gender` (text)
  - `avatar_url` (text)
  - `created_at` (timestamptz)

  ### 10. bookings
  Consultation bookings
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `patient_id` (uuid, FK)
  - `consultation_type` (text) - 'video', 'chat', 'in_person', 'audio'
  - `date` (date)
  - `start_time` (time)
  - `end_time` (time)
  - `duration_minutes` (int)
  - `status` (text) - 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'
  - `primary_concern` (text)
  - `notes` (text)
  - `amount` (numeric)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 11. booking_attachments
  Files attached to bookings
  - `id` (uuid, PK)
  - `booking_id` (uuid, FK)
  - `file_name` (text)
  - `file_url` (text)
  - `file_type` (text)
  - `uploaded_by` (text) - 'doctor' or 'patient'
  - `uploaded_at` (timestamptz)

  ### 12. products
  Herbal products and services offered by doctors
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `name` (text)
  - `category` (text)
  - `description` (text)
  - `price` (numeric)
  - `type` (text) - 'herbal', 'digital', 'service'
  - `duration_days` (int)
  - `usage_instructions` (text)
  - `stock_quantity` (int)
  - `is_active` (boolean)
  - `image_urls` (text[])
  - `created_at` (timestamptz)

  ### 13. orders
  Product orders
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `patient_id` (uuid, FK)
  - `product_id` (uuid, FK)
  - `quantity` (int)
  - `total_amount` (numeric)
  - `status` (text) - 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  - `shipping_address` (jsonb)
  - `tracking_number` (text)
  - `order_date` (timestamptz)
  - `updated_at` (timestamptz)

  ### 14. wallet
  Doctor wallet accounts
  - `doctor_id` (uuid, PK, FK)
  - `balance` (numeric)
  - `total_earned` (numeric)
  - `total_withdrawn` (numeric)
  - `bank_account_info` (jsonb)
  - `upi_id` (text)
  - `updated_at` (timestamptz)

  ### 15. transactions
  Wallet transactions
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `type` (text) - 'credit', 'debit'
  - `amount` (numeric)
  - `description` (text)
  - `status` (text) - 'completed', 'pending', 'failed'
  - `reference_type` (text) - 'booking', 'order', 'payout'
  - `reference_id` (uuid)
  - `created_at` (timestamptz)

  ### 16. chats
  Chat conversations
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `patient_id` (uuid, FK)
  - `booking_id` (uuid, FK, nullable)
  - `last_message` (text)
  - `last_message_at` (timestamptz)
  - `unread_count_doctor` (int)
  - `unread_count_patient` (int)
  - `created_at` (timestamptz)

  ### 17. messages
  Individual chat messages
  - `id` (uuid, PK)
  - `chat_id` (uuid, FK)
  - `sender_type` (text) - 'doctor' or 'patient'
  - `sender_id` (uuid)
  - `content` (text)
  - `attachment_url` (text)
  - `attachment_type` (text)
  - `is_read` (boolean)
  - `created_at` (timestamptz)

  ### 18. notifications
  User notifications
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `type` (text) - 'booking', 'payment', 'system', 'chat'
  - `title` (text)
  - `description` (text)
  - `is_read` (boolean)
  - `action_url` (text)
  - `created_at` (timestamptz)

  ### 19. doctor_badges
  Achievement badges
  - `id` (uuid, PK)
  - `doctor_id` (uuid, FK)
  - `badge_type` (text) - 'top_healer', '100_patients', 'on_time_star'
  - `earned_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Doctors can only access their own data
  - Patients can only access their own data
  - Appropriate policies for read/write operations
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  phone text,
  full_name text NOT NULL,
  preferred_name text,
  pronouns text,
  date_of_birth date,
  gender text,
  about text,
  work_best_with text,
  profile_photo_url text,
  onboarding_completed boolean DEFAULT false,
  onboarding_step int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctor_locations table
CREATE TABLE IF NOT EXISTS doctor_locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  country text NOT NULL,
  postal_code text NOT NULL,
  latitude numeric,
  longitude numeric,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create doctor_professional_details table
CREATE TABLE IF NOT EXISTS doctor_professional_details (
  doctor_id uuid PRIMARY KEY REFERENCES doctors(id) ON DELETE CASCADE,
  service_locations text[] DEFAULT '{}',
  services_provided_to text[] DEFAULT '{}',
  treatment_platforms text[] DEFAULT '{}',
  languages text[] DEFAULT '{}',
  total_experience_years int DEFAULT 0,
  specializations text[] DEFAULT '{}',
  default_consultation_duration int DEFAULT 30,
  break_between_sessions int DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctor_availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week int NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_available boolean DEFAULT false,
  time_slots jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, day_of_week)
);

-- Create doctor_education table
CREATE TABLE IF NOT EXISTS doctor_education (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  degree text NOT NULL,
  specialization text,
  institution text NOT NULL,
  country text NOT NULL,
  start_year int NOT NULL,
  end_year int,
  document_url text,
  created_at timestamptz DEFAULT now()
);

-- Create doctor_licenses table
CREATE TABLE IF NOT EXISTS doctor_licenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  license_type text NOT NULL,
  issuing_authority text NOT NULL,
  license_number text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  document_url text,
  created_at timestamptz DEFAULT now()
);

-- Create doctor_certificates table
CREATE TABLE IF NOT EXISTS doctor_certificates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  issued_by text NOT NULL,
  year int NOT NULL,
  document_url text,
  created_at timestamptz DEFAULT now()
);

-- Create doctor_media table
CREATE TABLE IF NOT EXISTS doctor_media (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('clinic_photo', 'intro_video')),
  url text NOT NULL,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  date_of_birth date,
  gender text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  consultation_type text NOT NULL CHECK (consultation_type IN ('video', 'chat', 'in_person', 'audio')),
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration_minutes int NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  primary_concern text,
  notes text,
  amount numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create booking_attachments table
CREATE TABLE IF NOT EXISTS booking_attachments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  uploaded_by text NOT NULL CHECK (uploaded_by IN ('doctor', 'patient')),
  uploaded_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text,
  description text,
  price numeric(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('herbal', 'digital', 'service')),
  duration_days int,
  usage_instructions text,
  stock_quantity int DEFAULT 0,
  is_active boolean DEFAULT true,
  image_urls text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb,
  tracking_number text,
  order_date timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wallet table
CREATE TABLE IF NOT EXISTS wallet (
  doctor_id uuid PRIMARY KEY REFERENCES doctors(id) ON DELETE CASCADE,
  balance numeric(10,2) DEFAULT 0,
  total_earned numeric(10,2) DEFAULT 0,
  total_withdrawn numeric(10,2) DEFAULT 0,
  bank_account_info jsonb,
  upi_id text,
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('credit', 'debit')),
  amount numeric(10,2) NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  reference_type text CHECK (reference_type IN ('booking', 'order', 'payout')),
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  last_message text,
  last_message_at timestamptz DEFAULT now(),
  unread_count_doctor int DEFAULT 0,
  unread_count_patient int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, patient_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('doctor', 'patient')),
  sender_id uuid NOT NULL,
  content text NOT NULL,
  attachment_url text,
  attachment_type text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('booking', 'payment', 'system', 'chat')),
  title text NOT NULL,
  description text,
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Create doctor_badges table
CREATE TABLE IF NOT EXISTS doctor_badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  badge_type text NOT NULL CHECK (badge_type IN ('top_healer', '100_patients', 'on_time_star', '500_patients', 'excellent_rating')),
  earned_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, badge_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_doctor_id ON bookings(doctor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_patient_id ON bookings(patient_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_products_doctor_id ON products(doctor_id);
CREATE INDEX IF NOT EXISTS idx_orders_doctor_id ON orders(doctor_id);
CREATE INDEX IF NOT EXISTS idx_transactions_doctor_id ON transactions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_chats_doctor_id ON chats(doctor_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_notifications_doctor_id ON notifications(doctor_id);

-- Enable Row Level Security
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_professional_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctors
CREATE POLICY "Doctors can view own profile"
  ON doctors FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Doctors can update own profile"
  ON doctors FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Doctors can insert own profile"
  ON doctors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for doctor_locations
CREATE POLICY "Doctors can view own locations"
  ON doctor_locations FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own locations"
  ON doctor_locations FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own locations"
  ON doctor_locations FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own locations"
  ON doctor_locations FOR DELETE
  TO authenticated
  USING (doctor_id = auth.uid());

-- RLS Policies for doctor_professional_details
CREATE POLICY "Doctors can view own professional details"
  ON doctor_professional_details FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own professional details"
  ON doctor_professional_details FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own professional details"
  ON doctor_professional_details FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

-- RLS Policies for doctor_availability
CREATE POLICY "Doctors can view own availability"
  ON doctor_availability FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own availability"
  ON doctor_availability FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own availability"
  ON doctor_availability FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own availability"
  ON doctor_availability FOR DELETE
  TO authenticated
  USING (doctor_id = auth.uid());

-- RLS Policies for doctor_education
CREATE POLICY "Doctors can view own education"
  ON doctor_education FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own education"
  ON doctor_education FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own education"
  ON doctor_education FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own education"
  ON doctor_education FOR DELETE
  TO authenticated
  USING (doctor_id = auth.uid());

-- RLS Policies for doctor_licenses
CREATE POLICY "Doctors can view own licenses"
  ON doctor_licenses FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own licenses"
  ON doctor_licenses FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own licenses"
  ON doctor_licenses FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own licenses"
  ON doctor_licenses FOR DELETE
  TO authenticated
  USING (doctor_id = auth.uid());

-- RLS Policies for doctor_certificates
CREATE POLICY "Doctors can view own certificates"
  ON doctor_certificates FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own certificates"
  ON doctor_certificates FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own certificates"
  ON doctor_certificates FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own certificates"
  ON doctor_certificates FOR DELETE
  TO authenticated
  USING (doctor_id = auth.uid());

-- RLS Policies for doctor_media
CREATE POLICY "Doctors can view own media"
  ON doctor_media FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own media"
  ON doctor_media FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own media"
  ON doctor_media FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own media"
  ON doctor_media FOR DELETE
  TO authenticated
  USING (doctor_id = auth.uid());

-- RLS Policies for patients
CREATE POLICY "Patients can view own profile"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Patients can insert own profile"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Patients can update own profile"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for bookings
CREATE POLICY "Doctors can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

-- RLS Policies for booking_attachments
CREATE POLICY "Doctors can view attachments for own bookings"
  ON booking_attachments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_attachments.booking_id
      AND bookings.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can insert attachments for own bookings"
  ON booking_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_attachments.booking_id
      AND bookings.doctor_id = auth.uid()
    )
  );

-- RLS Policies for products
CREATE POLICY "Doctors can view own products"
  ON products FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (doctor_id = auth.uid());

-- RLS Policies for orders
CREATE POLICY "Doctors can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

-- RLS Policies for wallet
CREATE POLICY "Doctors can view own wallet"
  ON wallet FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own wallet"
  ON wallet FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own wallet"
  ON wallet FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Doctors can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

-- RLS Policies for chats
CREATE POLICY "Doctors can view own chats"
  ON chats FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can insert own chats"
  ON chats FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own chats"
  ON chats FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Doctors can view messages in own chats"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can insert messages in own chats"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.doctor_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update messages in own chats"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.doctor_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.doctor_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Doctors can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

-- RLS Policies for doctor_badges
CREATE POLICY "Doctors can view own badges"
  ON doctor_badges FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "System can insert badges"
  ON doctor_badges FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());
