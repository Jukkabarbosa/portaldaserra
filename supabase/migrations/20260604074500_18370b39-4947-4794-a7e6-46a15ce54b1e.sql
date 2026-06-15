
-- Amplia subscriptions com integração Stripe
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
  ADD COLUMN IF NOT EXISTS amount NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL',
  ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ;

-- Tabela de pagamentos (log de cada transação)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  garage_id UUID REFERENCES public.garages(id) ON DELETE SET NULL,
  sponsor_id UUID REFERENCES public.sponsors(id) ON DELETE SET NULL,
  user_id UUID,
  plan_slug TEXT,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  stripe_session_id TEXT,
  stripe_invoice_id TEXT,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'pending', -- pending|paid|failed|refunded
  payment_method TEXT,                    -- card|pix|boleto
  customer_email TEXT,
  customer_name TEXT,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  paid_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payments_garage ON public.payments(garage_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON public.payments(paid_at DESC);
GRANT SELECT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY payments_admin_all ON public.payments FOR ALL TO authenticated
  USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY payments_owner_read ON public.payments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.garages g WHERE g.id = payments.garage_id AND g.owner_id = auth.uid()));

-- Faturas geradas
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  garage_id UUID REFERENCES public.garages(id) ON DELETE SET NULL,
  sponsor_id UUID REFERENCES public.sponsors(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  stripe_invoice_id TEXT UNIQUE,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'open', -- open|paid|overdue|void
  due_date DATE,
  paid_at TIMESTAMPTZ,
  pdf_url TEXT,
  hosted_url TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_document TEXT,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_garage ON public.invoices(garage_id);
GRANT SELECT ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY invoices_admin_all ON public.invoices FOR ALL TO authenticated
  USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY invoices_owner_read ON public.invoices FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.garages g WHERE g.id = invoices.garage_id AND g.owner_id = auth.uid()));
CREATE TRIGGER invoices_set_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Cupons promocionais
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percent', -- percent|fixed
  discount_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration TEXT NOT NULL DEFAULT 'once', -- once|repeating|forever
  duration_months INTEGER,
  max_redemptions INTEGER,
  times_redeemed INTEGER NOT NULL DEFAULT 0,
  applies_to JSONB NOT NULL DEFAULT '[]'::jsonb, -- array de plan slugs
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  stripe_coupon_id TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY coupons_admin_all ON public.coupons FOR ALL TO authenticated
  USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY coupons_public_read_active ON public.coupons FOR SELECT TO anon, authenticated
  USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));
CREATE TRIGGER coupons_set_updated_at BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Log financeiro (auditoria)
CREATE TABLE IF NOT EXISTS public.financial_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- subscription.created|payment.succeeded|payment.failed|refund.created|webhook.received...
  source TEXT NOT NULL DEFAULT 'stripe',
  entity_type TEXT,
  entity_id TEXT,
  actor_id UUID,
  amount NUMERIC(12,2),
  currency TEXT DEFAULT 'BRL',
  description TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fin_logs_event ON public.financial_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_fin_logs_created ON public.financial_logs(created_at DESC);
GRANT SELECT ON public.financial_logs TO authenticated;
GRANT ALL ON public.financial_logs TO service_role;
ALTER TABLE public.financial_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY fin_logs_admin_read ON public.financial_logs FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));
CREATE POLICY fin_logs_admin_insert ON public.financial_logs FOR INSERT TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Log de acessos do site (visitas, páginas, leads)
CREATE TABLE IF NOT EXISTS public.site_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  user_id UUID,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT, -- mobile|desktop|tablet
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  duration_seconds INTEGER,
  is_lead BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_access_path ON public.site_access_logs(path);
CREATE INDEX IF NOT EXISTS idx_access_created ON public.site_access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_user ON public.site_access_logs(user_id);
GRANT SELECT, INSERT ON public.site_access_logs TO anon, authenticated;
GRANT ALL ON public.site_access_logs TO service_role;
ALTER TABLE public.site_access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY access_public_insert ON public.site_access_logs FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY access_admin_read ON public.site_access_logs FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));
