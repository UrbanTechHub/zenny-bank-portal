-- Allow admins to update profiles (approve users, edit info)
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to insert transactions (credit/debit operations)
CREATE POLICY "Admins can insert transactions" ON public.transactions FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to insert accounts
CREATE POLICY "Admins can insert accounts" ON public.accounts FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));