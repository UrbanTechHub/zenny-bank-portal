-- 1) Attach trigger so new auth users get a profile/account/role
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2) Backfill missing profiles/accounts/roles for existing auth users (skip admin)
INSERT INTO public.profiles (user_id, full_name, is_approved)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
       EXISTS(SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'admin')
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = u.id);

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'user'::app_role
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id);

INSERT INTO public.accounts (user_id, account_number, account_type, balance)
SELECT u.id, 'VTB-' || upper(substr(u.id::text, 1, 8)), 'checking', 0
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.accounts a WHERE a.user_id = u.id)
  AND NOT EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = u.id AND r.role = 'admin');

-- 3) Add per-transfer-mode block columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS block_domestic boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS block_international boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS block_wire boolean NOT NULL DEFAULT false;