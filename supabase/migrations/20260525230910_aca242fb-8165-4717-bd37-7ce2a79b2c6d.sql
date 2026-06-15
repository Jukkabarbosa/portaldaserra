
-- 1. Selo de inspeção: link do PDF
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS inspection_pdf_url TEXT;

-- 2. Simulações de financiamento
CREATE TABLE public.financing_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  vehicle_price NUMERIC NOT NULL,
  down_payment NUMERIC NOT NULL DEFAULT 0,
  installments INTEGER NOT NULL,
  interest_rate NUMERIC NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.financing_simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fs_public_insert" ON public.financing_simulations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "fs_admin_read" ON public.financing_simulations
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.vehicles v
      JOIN public.garages g ON g.id = v.garage_id
      WHERE v.id = financing_simulations.vehicle_id AND g.owner_id = auth.uid()
    )
  );

-- 3. Avaliações por IA
CREATE TABLE public.vehicle_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email TEXT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year_model INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  condition TEXT NOT NULL,
  city TEXT,
  estimated_min NUMERIC,
  estimated_avg NUMERIC,
  estimated_max NUMERIC,
  rationale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicle_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ve_public_insert" ON public.vehicle_evaluations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "ve_owner_or_admin_read" ON public.vehicle_evaluations
  FOR SELECT USING (
    public.is_admin(auth.uid())
    OR (user_id IS NOT NULL AND user_id = auth.uid())
  );

-- 4. Alertas inteligentes
CREATE TABLE public.vehicle_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  brand TEXT,
  model TEXT,
  price_min NUMERIC,
  price_max NUMERIC,
  year_min INTEGER,
  mileage_max INTEGER,
  city TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicle_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "va_public_insert" ON public.vehicle_alerts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "va_admin_read" ON public.vehicle_alerts
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "va_admin_write" ON public.vehicle_alerts
  FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "va_admin_delete" ON public.vehicle_alerts
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE TRIGGER set_vehicle_alerts_updated_at
  BEFORE UPDATE ON public.vehicle_alerts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
