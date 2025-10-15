-- Create profiles table for user data
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create journal entries table
CREATE TABLE public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journal entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Create weekly challenges table
CREATE TABLE public.weekly_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_type text NOT NULL,
  completed_at timestamptz,
  week_start date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.weekly_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own challenges"
  ON public.weekly_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own challenges"
  ON public.weekly_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges"
  ON public.weekly_challenges FOR UPDATE
  USING (auth.uid() = user_id);

-- Create mood entries table for persistent mood tracking
CREATE TABLE public.mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood text NOT NULL,
  note text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood entries"
  ON public.mood_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood entries"
  ON public.mood_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger to update profiles updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_journal_updated
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();