-- ============================================================================
-- Synapta Invest: Estrutura Completa de Usuários e Diagnóstico
-- Execute este SQL no Editor SQL do Supabase Dashboard
-- ============================================================================

-- ── 1. Criar Tabela de Profiles ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  email text,
  onboarding_completo boolean DEFAULT false,
  perfil text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ── 2. Função e Trigger para Auto-Criação de Profile ────────────────────────
-- Isso garante que ao registrar no Auth, o usuário ganhe um Profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove o gatilho se já existir e cria novamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 3. Criar tabela 'onboarding_data' ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.onboarding_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Etapa 1: Renda & Gastos
  renda_mensal numeric NOT NULL DEFAULT 0,
  gastos_mensais numeric NOT NULL DEFAULT 0,
  outras_rendas text[] DEFAULT '{}',
  maiores_gastos text[] DEFAULT '{}',

  -- Etapa 2: Patrimônio & Dívidas
  patrimonio_total numeric NOT NULL DEFAULT 0,
  tipos_ativos text[] DEFAULT '{}',
  tem_dividas boolean DEFAULT false,
  total_dividas numeric DEFAULT 0,
  taxa_juros_dividas numeric DEFAULT 0,
  prazo_dividas numeric DEFAULT 0,

  -- Etapa 3: Objetivos
  objetivos text[] NOT NULL DEFAULT '{}',
  objetivo_principal text NOT NULL,
  horizonte_anos int NOT NULL DEFAULT 5,

  -- Etapa 4: Perfil de Risco
  reacao_queda text NOT NULL,
  experiencia_rv text NOT NULL,
  percentual_risco text NOT NULL,

  -- Etapa 5: Proteção & Reserva
  tem_seguro_vida boolean DEFAULT false,
  tem_plano_saude boolean DEFAULT false,
  familia_depende boolean DEFAULT false,
  meses_sem_renda numeric DEFAULT 0,
  meses_reserva numeric DEFAULT 0,

  -- Resultado calculado pelo backend
  perfil_calculado text,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ── 4. Row Level Security (RLS) ─────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para Onboarding
DROP POLICY IF EXISTS "Users can view own onboarding data" ON public.onboarding_data;
CREATE POLICY "Users can view own onboarding data" ON public.onboarding_data FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own onboarding data" ON public.onboarding_data;
CREATE POLICY "Users can insert own onboarding data" ON public.onboarding_data FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own onboarding data" ON public.onboarding_data;
CREATE POLICY "Users can update own onboarding data" ON public.onboarding_data FOR UPDATE USING (auth.uid() = user_id);

-- ── 5. Índices ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON public.onboarding_data(user_id);
