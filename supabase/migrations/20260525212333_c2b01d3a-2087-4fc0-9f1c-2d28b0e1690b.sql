
CREATE TYPE public.sponsor_tier AS ENUM ('bronze', 'prata', 'ouro', 'platina', 'diamante');

CREATE TABLE public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  website_url text,
  description text,
  category text,
  tier public.sponsor_tier NOT NULL DEFAULT 'bronze',
  monthly_price numeric NOT NULL DEFAULT 0,
  contact_email text,
  contact_phone text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  clicks_count integer NOT NULL DEFAULT 0,
  impressions_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY sponsors_public_read ON public.sponsors
  FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));

CREATE POLICY sponsors_admin_write ON public.sponsors
  FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER trg_sponsors_updated_at BEFORE UPDATE ON public.sponsors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX sponsors_tier_idx ON public.sponsors(tier);
CREATE INDEX sponsors_active_idx ON public.sponsors(is_active, sort_order);

CREATE TABLE public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  description text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_logs_admin_read ON public.admin_logs
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY admin_logs_admin_insert ON public.admin_logs
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE INDEX admin_logs_created_idx ON public.admin_logs(created_at DESC);
CREATE INDEX admin_logs_entity_idx ON public.admin_logs(entity, entity_id);
