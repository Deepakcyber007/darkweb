/*
  # Update RLS Policies for Data Breaches

  1. Changes
    - Update RLS policies to allow public access for reading data
    - Keep write operations restricted to authenticated users only

  2. Security
    - Allow anyone to search and view breach data
    - Maintain authenticated-only access for modifications
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON data_breaches;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON data_breaches;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON data_breaches;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON data_breaches;

-- Create new policies
CREATE POLICY "Enable public read access"
  ON data_breaches
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON data_breaches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
  ON data_breaches
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
  ON data_breaches
  FOR DELETE
  TO authenticated
  USING (true);