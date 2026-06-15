ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS ai_knowledge_base text;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS has_ai_assistant boolean NOT NULL DEFAULT false;
UPDATE public.plans SET has_ai_assistant = true WHERE slug = 'premium';