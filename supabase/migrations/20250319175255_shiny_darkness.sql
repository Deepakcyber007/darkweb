/*
  # Update admin user setup with proper dependency handling

  1. Changes
    - Drop existing policies that depend on admin_users table
    - Drop and recreate admin_users table
    - Recreate policies with proper admin checks
  
  2. Security
    - Maintain same security model where only admin users can perform admin operations
    - Public users can still search for breaches
*/

-- First drop the policies that depend on admin_users
DROP POLICY IF EXISTS "Enable insert for admin only" ON data_breaches;
DROP POLICY IF EXISTS "Enable update for admin only" ON data_breaches;
DROP POLICY IF EXISTS "Enable delete for admin only" ON data_breaches;

-- Now we can safely drop and recreate the admin_users table
DROP TABLE IF EXISTS admin_users;

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users table
CREATE POLICY "Enable read access for admin users only"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Recreate the policies for data_breaches
CREATE POLICY "Enable insert for admin only"
  ON data_breaches
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Enable update for admin only"
  ON data_breaches
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Enable delete for admin only"
  ON data_breaches
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );