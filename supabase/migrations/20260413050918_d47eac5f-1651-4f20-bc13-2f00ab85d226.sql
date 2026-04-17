
-- Add is_approved to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT false;

-- Create accounts table
CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  account_number text NOT NULL UNIQUE,
  account_type text NOT NULL DEFAULT 'checking',
  balance bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'VND',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own accounts" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all accounts" ON public.accounts FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all accounts" ON public.accounts FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert accounts" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create transactions table
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_id uuid,
  sender_account text NOT NULL,
  recipient_account text NOT NULL,
  recipient_name text NOT NULL,
  amount bigint NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  reference_number text NOT NULL,
  type text NOT NULL DEFAULT 'transfer',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can create transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Admins can view all transactions" ON public.transactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update transactions" ON public.transactions FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create transfer_pins table
CREATE TABLE public.transfer_pins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  pin_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.transfer_pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pin" ON public.transfer_pins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pin" ON public.transfer_pins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pin" ON public.transfer_pins FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_transfer_pins_updated_at BEFORE UPDATE ON public.transfer_pins FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create account on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  acct_num text;
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  acct_num := 'VTB-' || upper(substr(NEW.id::text, 1, 8));
  INSERT INTO public.accounts (user_id, account_number, account_type, balance)
  VALUES (NEW.id, acct_num, 'checking', 0);
  
  RETURN NEW;
END;
$$;

-- Enable realtime for transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.accounts;
