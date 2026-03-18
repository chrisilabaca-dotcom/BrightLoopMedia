-- ============================================
-- Enable Row Level Security (RLS) on all public tables
-- ============================================
-- Run this in your Supabase SQL Editor:
--   1. Go to https://supabase.com/dashboard
--   2. Select your project
--   3. Click "SQL Editor" in the left sidebar
--   4. Paste this entire file and click "Run"
-- ============================================

-- Step 1: Enable RLS on every table
ALTER TABLE public."Member" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Setting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Location" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Waiver" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ImportBatch" ENABLE ROW LEVEL SECURITY;

-- Step 2: Allow logged-in users to read all rows (SELECT)
-- Adjust these policies later if you need tighter access control.

CREATE POLICY "Authenticated users can read Member"
  ON public."Member" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read Setting"
  ON public."Setting" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read Location"
  ON public."Location" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read Session"
  ON public."Session" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read Booking"
  ON public."Booking" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read Waiver"
  ON public."Waiver" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read Payment"
  ON public."Payment" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read User"
  ON public."User" FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read ImportBatch"
  ON public."ImportBatch" FOR SELECT
  TO authenticated
  USING (true);

-- Step 3: Allow logged-in users to insert rows

CREATE POLICY "Authenticated users can insert Member"
  ON public."Member" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert Setting"
  ON public."Setting" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert Location"
  ON public."Location" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert Session"
  ON public."Session" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert Booking"
  ON public."Booking" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert Waiver"
  ON public."Waiver" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert Payment"
  ON public."Payment" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert User"
  ON public."User" FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert ImportBatch"
  ON public."ImportBatch" FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Step 4: Allow logged-in users to update rows

CREATE POLICY "Authenticated users can update Member"
  ON public."Member" FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update Setting"
  ON public."Setting" FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update Location"
  ON public."Location" FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update Session"
  ON public."Session" FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update Booking"
  ON public."Booking" FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update Waiver"
  ON public."Waiver" FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update Payment"
  ON public."Payment" FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update User"
  ON public."User" FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ImportBatch"
  ON public."ImportBatch" FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Step 5: Allow logged-in users to delete rows

CREATE POLICY "Authenticated users can delete Member"
  ON public."Member" FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete Setting"
  ON public."Setting" FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete Location"
  ON public."Location" FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete Session"
  ON public."Session" FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete Booking"
  ON public."Booking" FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete Waiver"
  ON public."Waiver" FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete Payment"
  ON public."Payment" FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete User"
  ON public."User" FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete ImportBatch"
  ON public."ImportBatch" FOR DELETE
  TO authenticated
  USING (true);
