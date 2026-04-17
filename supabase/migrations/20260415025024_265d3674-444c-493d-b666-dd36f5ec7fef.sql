
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_locked boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS transfer_blocked boolean NOT NULL DEFAULT false;
