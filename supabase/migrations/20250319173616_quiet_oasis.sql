/*
  # Data Breach Management Schema

  1. New Tables
    - `data_breaches`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `breach_date` (date)
      - `breach_source` (text)
      - `compromised_data` (text array)
      - `severity` (enum: high, medium, low)
      - `removal_requested` (boolean)
      - `request_date` (timestamptz, nullable)
      - `status` (enum: pending, approved, rejected)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `data_breaches` table
    - Add policy for authenticated users to manage data
*/

-- Create enum types
CREATE TYPE breach_severity AS ENUM ('high', 'medium', 'low');
CREATE TYPE breach_status AS ENUM ('pending', 'approved', 'rejected');

-- Create data breaches table
CREATE TABLE IF NOT EXISTS data_breaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  breach_date date NOT NULL,
  breach_source text NOT NULL,
  compromised_data text[] NOT NULL,
  severity breach_severity NOT NULL DEFAULT 'medium',
  removal_requested boolean NOT NULL DEFAULT false,
  request_date timestamptz,
  status breach_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE data_breaches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
  ON data_breaches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON data_breaches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON data_breaches
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON data_breaches
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_data_breaches_email ON data_breaches(email);
CREATE INDEX IF NOT EXISTS idx_data_breaches_phone ON data_breaches(phone);
CREATE INDEX IF NOT EXISTS idx_data_breaches_status ON data_breaches(status);
CREATE INDEX IF NOT EXISTS idx_data_breaches_severity ON data_breaches(severity);