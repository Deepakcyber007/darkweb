/*
  # Set up single admin user and restrict access

  1. Changes
    - Create admin_users table to track admin status
    - Update RLS policies to only allow specific admin user
    - Pre-insert the admin user record
  
  2. Security
    - Only the specified admin user can perform admin operations
    - Public users can still search for breaches
*/

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

-- Update data_breaches policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON data_breaches;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON data_breaches;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON data_breaches;

-- New policies that check for admin status
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