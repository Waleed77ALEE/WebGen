import { createClient } from '@supabase/supabase-js';

// Retrieve values from environment variables or use the user's explicit project credentials as a robust fallback
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://vhcpbtclheayxdqfwqlu.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable__iPE2DKQkv9f9DwNYYuUaQ_ybDGToGa';

/**
 * Shared Supabase Client instance for Auth, Firestore-like operations, Real-time listens, etc.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SQL_SCHEMA_BLUEPRINT = `-- ==========================================
-- SUPABASE TABLES SCHEMA BLUEPRINT FOR GEN_SITE
-- Run this in your Supabase SQL Editor to set up tables
-- ==========================================

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT,
  phone TEXT,
  address TEXT,
  email TEXT
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Trigger to automatically create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'New Member'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending',
  total_price NUMERIC NOT NULL,
  items JSONB NOT NULL, -- Array of items: [{title, price, quantity}]
  shipping_address TEXT,
  recipient_name TEXT,
  recipient_phone TEXT,
  website_name TEXT
);

-- Enable RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert orders (to allow guest checkout)" 
  ON public.orders FOR INSERT 
  WITH CHECK (true);


-- 3. CART_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  product_id TEXT NOT NULL,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  image_url TEXT,
  website_name TEXT
);

-- Enable RLS for Cart Items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart items" 
  ON public.cart_items FOR ALL 
  USING (auth.uid() = user_id);


-- 4. CONTACT_SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  website_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT
);

-- Enable RLS for Submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert submissions" 
  ON public.contact_submissions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins or users can view submissions" 
  ON public.contact_submissions FOR SELECT 
  USING (true);
`;
