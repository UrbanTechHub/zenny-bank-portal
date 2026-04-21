ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS transfer_limit_exceeded boolean NOT NULL DEFAULT false;

CREATE POLICY "Admins can delete transactions"
ON public.transactions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));