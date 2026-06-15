
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin','garagista','cliente');
CREATE TYPE public.vehicle_status AS ENUM ('ativo','pausado','vendido','pendente');
CREATE TYPE public.vehicle_condition AS ENUM ('novo','seminovo','usado');
CREATE TYPE public.subscription_status AS ENUM ('ativa','pendente','vencida','cancelada');
CREATE TYPE public.lead_status AS ENUM ('novo','em_atendimento','convertido','perdido');
CREATE TYPE public.lead_origin AS ENUM ('whatsapp','formulario','telefone','contato');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin') $$;

-- ============ PLANS ============
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price_monthly NUMERIC(10,2) NOT NULL,
  vehicle_limit INTEGER NOT NULL,
  featured_slots INTEGER NOT NULL DEFAULT 0,
  has_metrics BOOLEAN NOT NULL DEFAULT false,
  has_priority BOOLEAN NOT NULL DEFAULT false,
  has_premium_support BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- ============ GARAGES ============
CREATE TABLE public.garages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  cover_url TEXT,
  description TEXT,
  cnpj TEXT,
  responsible TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  city TEXT,
  state TEXT,
  address TEXT,
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  website TEXT,
  business_hours TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(2,1) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.garages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_garages_owner ON public.garages(owner_id);
CREATE INDEX idx_garages_city ON public.garages(city, state);

-- ============ SUBSCRIPTIONS ============
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garage_id UUID NOT NULL UNIQUE REFERENCES public.garages(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.plans(id),
  status subscription_status NOT NULL DEFAULT 'pendente',
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  last_payment_at TIMESTAMPTZ,
  next_billing_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ============ VEHICLES ============
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garage_id UUID NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  version TEXT,
  year_made INTEGER NOT NULL,
  year_model INTEGER NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  mileage INTEGER NOT NULL DEFAULT 0,
  transmission TEXT,
  fuel TEXT,
  color TEXT,
  body_type TEXT,
  doors INTEGER,
  plate_end TEXT,
  city TEXT,
  state TEXT,
  description TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  condition vehicle_condition NOT NULL DEFAULT 'usado',
  accepts_trade BOOLEAN NOT NULL DEFAULT false,
  finances BOOLEAN NOT NULL DEFAULT false,
  ipva_paid BOOLEAN NOT NULL DEFAULT false,
  licensed BOOLEAN NOT NULL DEFAULT false,
  single_owner BOOLEAN NOT NULL DEFAULT false,
  warranty BOOLEAN NOT NULL DEFAULT false,
  inspection_approved BOOLEAN NOT NULL DEFAULT false,
  manual BOOLEAN NOT NULL DEFAULT false,
  spare_key BOOLEAN NOT NULL DEFAULT false,
  status vehicle_status NOT NULL DEFAULT 'ativo',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  contacts_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_vehicles_garage ON public.vehicles(garage_id);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_brand ON public.vehicles(brand, model);
CREATE INDEX idx_vehicles_price ON public.vehicles(price);

-- ============ VEHICLE IMAGES ============
CREATE TABLE public.vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_main BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_vehicle_images_vehicle ON public.vehicle_images(vehicle_id);

-- ============ VEHICLE VIEWS ============
CREATE TABLE public.vehicle_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  viewer_id UUID,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicle_views ENABLE ROW LEVEL SECURITY;

-- ============ LEADS ============
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garage_id UUID NOT NULL REFERENCES public.garages(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT,
  origin lead_origin NOT NULL DEFAULT 'formulario',
  status lead_status NOT NULL DEFAULT 'novo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_leads_garage ON public.leads(garage_id);

-- ============ FAVORITES ============
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, vehicle_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ============ FEATURED ADS ============
CREATE TABLE public.featured_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.featured_ads ENABLE ROW LEVEL SECURITY;

-- ============ SITE SETTINGS ============
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Portal da Serra',
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#0f1b3d',
  secondary_color TEXT DEFAULT '#3b6fa0',
  hero_title TEXT DEFAULT 'Encontre o carro ideal nas melhores garagens da sua região.',
  hero_subtitle TEXT DEFAULT 'Compare veículos, veja fotos, especificações completas e fale direto com a garagem anunciante.',
  support_whatsapp TEXT,
  contact_email TEXT,
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  terms TEXT,
  privacy TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ============ TRIGGERS ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_garages_updated BEFORE UPDATE ON public.garages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_subs_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- auto create profile + cliente role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'cliente') ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ RLS POLICIES ============

-- profiles
CREATE POLICY "profiles_self_read" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin(auth.uid()));
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- user_roles
CREATE POLICY "roles_self_read" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "roles_admin_all" ON public.user_roles FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- plans (public read, admin write)
CREATE POLICY "plans_public_read" ON public.plans FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));
CREATE POLICY "plans_admin_write" ON public.plans FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- garages (public read active, owner update, admin all)
CREATE POLICY "garages_public_read" ON public.garages FOR SELECT USING (is_active = true OR owner_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "garages_owner_insert" ON public.garages FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "garages_owner_update" ON public.garages FOR UPDATE USING (auth.uid() = owner_id OR public.is_admin(auth.uid()));
CREATE POLICY "garages_admin_delete" ON public.garages FOR DELETE USING (public.is_admin(auth.uid()));

-- subscriptions
CREATE POLICY "subs_owner_read" ON public.subscriptions FOR SELECT
  USING (public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.garages g WHERE g.id = garage_id AND g.owner_id = auth.uid()));
CREATE POLICY "subs_owner_insert" ON public.subscriptions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.garages g WHERE g.id = garage_id AND g.owner_id = auth.uid()) OR public.is_admin(auth.uid()));
CREATE POLICY "subs_admin_update" ON public.subscriptions FOR UPDATE USING (public.is_admin(auth.uid()));

-- vehicles
CREATE POLICY "vehicles_public_read" ON public.vehicles FOR SELECT
  USING (status = 'ativo' OR public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.garages g WHERE g.id = garage_id AND g.owner_id = auth.uid()));
CREATE POLICY "vehicles_owner_insert" ON public.vehicles FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.garages g WHERE g.id = garage_id AND g.owner_id = auth.uid()));
CREATE POLICY "vehicles_owner_update" ON public.vehicles FOR UPDATE
  USING (public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.garages g WHERE g.id = garage_id AND g.owner_id = auth.uid()));
CREATE POLICY "vehicles_owner_delete" ON public.vehicles FOR DELETE
  USING (public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.garages g WHERE g.id = garage_id AND g.owner_id = auth.uid()));

-- vehicle_images
CREATE POLICY "vimg_public_read" ON public.vehicle_images FOR SELECT USING (true);
CREATE POLICY "vimg_owner_write" ON public.vehicle_images FOR ALL
  USING (public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.vehicles v JOIN public.garages g ON g.id = v.garage_id WHERE v.id = vehicle_id AND g.owner_id = auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.vehicles v JOIN public.garages g ON g.id = v.garage_id WHERE v.id = vehicle_id AND g.owner_id = auth.uid()));

-- vehicle_views (anyone can insert, admin/owner reads)
CREATE POLICY "vviews_insert" ON public.vehicle_views FOR INSERT WITH CHECK (true);
CREATE POLICY "vviews_owner_read" ON public.vehicle_views FOR SELECT
  USING (public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.vehicles v JOIN public.garages g ON g.id = v.garage_id WHERE v.id = vehicle_id AND g.owner_id = auth.uid()));

-- leads
CREATE POLICY "leads_public_insert" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_owner_read" ON public.leads FOR SELECT
  USING (public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.garages g WHERE g.id = garage_id AND g.owner_id = auth.uid()));
CREATE POLICY "leads_owner_update" ON public.leads FOR UPDATE
  USING (public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.garages g WHERE g.id = garage_id AND g.owner_id = auth.uid()));

-- favorites
CREATE POLICY "fav_self_all" ON public.favorites FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- featured_ads
CREATE POLICY "feat_public_read" ON public.featured_ads FOR SELECT USING (is_active = true OR public.is_admin(auth.uid()));
CREATE POLICY "feat_admin_write" ON public.featured_ads FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- site_settings
CREATE POLICY "settings_public_read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_write" ON public.site_settings FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES
  ('vehicle-images','vehicle-images', true),
  ('garage-assets','garage-assets', true),
  ('avatars','avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "vehicle_imgs_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'vehicle-images');
CREATE POLICY "vehicle_imgs_auth_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vehicle-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "vehicle_imgs_owner_delete" ON storage.objects FOR DELETE USING (bucket_id = 'vehicle-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "garage_assets_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'garage-assets');
CREATE POLICY "garage_assets_auth_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'garage-assets' AND auth.uid() IS NOT NULL);
CREATE POLICY "garage_assets_owner_delete" ON storage.objects FOR DELETE USING (bucket_id = 'garage-assets' AND auth.uid() IS NOT NULL);

CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_auth_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

-- ============ SEED DATA ============
INSERT INTO public.plans (name, slug, price_monthly, vehicle_limit, featured_slots, has_metrics, has_priority, has_premium_support, description, benefits, sort_order) VALUES
('Start','start', 99.00, 10, 0, false, false, false, 'Ideal para começar a vender online', '["Até 10 veículos","Fotos em carrossel","Página da garagem","Contato por WhatsApp","Suporte básico"]'::jsonb, 1),
('Pro','pro', 249.00, 50, 3, true, true, false, 'Para garagens em crescimento', '["Até 50 veículos","Anúncios em destaque","Métricas de visualização","Página personalizada","Prioridade na listagem","Suporte prioritário"]'::jsonb, 2),
('Premium','premium', 599.00, 999, 10, true, true, true, 'Performance máxima e exclusividade', '["Veículos ilimitados","Destaques na home","Relatórios avançados","Selo Premium","Campanhas promocionais","Suporte VIP","Personalização avançada"]'::jsonb, 3);

INSERT INTO public.site_settings (site_name) VALUES ('Portal da Serra');
