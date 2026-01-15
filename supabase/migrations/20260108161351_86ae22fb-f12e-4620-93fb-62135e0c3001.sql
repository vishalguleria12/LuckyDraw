-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can manage roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies to draws table
CREATE POLICY "Admins can insert draws"
ON public.draws
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update draws"
ON public.draws
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete draws"
ON public.draws
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies to prizes table
CREATE POLICY "Admins can insert prizes"
ON public.prizes
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update prizes"
ON public.prizes
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all prizes"
ON public.prizes
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies to draw_entries
CREATE POLICY "Admins can view all entries"
ON public.draw_entries
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies to profiles (for user management)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Function to select a random winner for a draw
CREATE OR REPLACE FUNCTION public.select_draw_winner(draw_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    winner_user_id uuid;
    winner_name text;
BEGIN
    -- Check if caller is admin
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Only admins can select winners';
    END IF;

    -- Select random winner from entries
    SELECT de.user_id INTO winner_user_id
    FROM public.draw_entries de
    WHERE de.draw_id = select_draw_winner.draw_id
    ORDER BY random()
    LIMIT 1;

    IF winner_user_id IS NULL THEN
        RAISE EXCEPTION 'No entries found for this draw';
    END IF;

    -- Get winner username
    SELECT username INTO winner_name
    FROM public.profiles
    WHERE user_id = winner_user_id;

    -- Update draw with winner
    UPDATE public.draws
    SET winner_id = winner_user_id,
        winner_username = winner_name,
        status = 'completed'
    WHERE id = select_draw_winner.draw_id;

    -- Create prize record for winner
    INSERT INTO public.prizes (draw_id, user_id, prize_name, prize_code, status)
    SELECT d.id, winner_user_id, d.prize_name, d.prize_code, 'pending'
    FROM public.draws d
    WHERE d.id = select_draw_winner.draw_id;

    RETURN winner_user_id;
END;
$$;

-- Function to deliver a prize
CREATE OR REPLACE FUNCTION public.deliver_prize(prize_id uuid, delivery_code text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if caller is admin
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Only admins can deliver prizes';
    END IF;

    UPDATE public.prizes
    SET status = 'delivered',
        delivered_at = now(),
        prize_code = COALESCE(delivery_code, prize_code)
    WHERE id = prize_id;
END;
$$;