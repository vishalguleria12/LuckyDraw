-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  token_balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create draws table for lucky draws
CREATE TABLE public.draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prize_name TEXT NOT NULL,
  prize_subtitle TEXT,
  prize_emoji TEXT DEFAULT '🎁',
  prize_type TEXT NOT NULL DEFAULT 'gift_card', -- gift_card, subscription, credit
  token_cost INTEGER NOT NULL DEFAULT 1,
  max_entries INTEGER NOT NULL DEFAULT 100,
  current_entries INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'upcoming', -- upcoming, active, completed
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  winner_id UUID REFERENCES auth.users(id),
  winner_username TEXT,
  prize_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create draw_entries table for user entries
CREATE TABLE public.draw_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entries_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(draw_id, user_id)
);

-- Create token_transactions table for tracking purchases
CREATE TABLE public.token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- purchase, spend, refund
  description TEXT,
  draw_id UUID REFERENCES public.draws(id),
  payment_status TEXT DEFAULT 'completed', -- pending, completed, failed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prizes table for winner prizes
CREATE TABLE public.prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draw_id UUID NOT NULL REFERENCES public.draws(id),
  prize_name TEXT NOT NULL,
  prize_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, delivered, claimed
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Draws policies (public read, only system can modify)
CREATE POLICY "Anyone can view draws"
ON public.draws FOR SELECT
TO authenticated
USING (true);

-- Draw entries policies
CREATE POLICY "Users can view their own entries"
ON public.draw_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries"
ON public.draw_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Token transactions policies
CREATE POLICY "Users can view their own transactions"
ON public.token_transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.token_transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Prizes policies
CREATE POLICY "Users can view their own prizes"
ON public.prizes FOR SELECT
USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample draws
INSERT INTO public.draws (prize_name, prize_subtitle, prize_emoji, prize_type, token_cost, max_entries, status, ends_at)
VALUES 
  ('Netflix Premium', '1 Month Subscription', '🎬', 'subscription', 5, 100, 'active', now() + interval '4 hours'),
  ('Amazon Pay', '₹500 Gift Card', '🛒', 'gift_card', 3, 150, 'upcoming', now() + interval '1 day'),
  ('YouTube Premium', '3 Months', '📺', 'subscription', 8, 75, 'upcoming', now() + interval '2 days'),
  ('Google Play', '₹300 Credit', '🎮', 'credit', 4, 120, 'upcoming', now() + interval '3 days');