-- =============================================================================
-- Prismora: Fiverr-Inspired Marketplace Migration
-- Separate roles (Client / Freelancer), Posts, Likes, Saves, Messaging & Storage
-- Migration: 20261010000000_fiverr_marketplace.sql
-- =============================================================================

-- 1. Extend or Update Profiles with Account Roles & Profile Metadata
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'client' CHECK (account_type IN ('client', 'freelancer', 'admin')),
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS business_category TEXT DEFAULT 'Advertising',
  ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS primary_ai_tools TEXT[] DEFAULT '{}';

-- 2. Create Marketplace Posts Table (Work showcase by freelancers)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  media_type TEXT NOT NULL DEFAULT 'video' CHECK (media_type IN ('video', 'image')),
  price_cents INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  category TEXT NOT NULL DEFAULT 'Advertising',
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  ai_tools TEXT[] NOT NULL DEFAULT '{}',
  likes_count INTEGER NOT NULL DEFAULT 0 CHECK (likes_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for searching and filtering posts
CREATE INDEX IF NOT EXISTS idx_posts_creator ON public.posts(creator_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_media_type ON public.posts(media_type);
CREATE INDEX IF NOT EXISTS idx_posts_hashtags ON public.posts USING GIN (hashtags);
CREATE INDEX IF NOT EXISTS idx_posts_tools ON public.posts USING GIN (ai_tools);

-- 3. Create Post Likes Table (Unique per user/post)
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_post_user_like UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user ON public.post_likes(user_id);

-- 4. Create Saved Posts Table (Client saved bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_post_user_saved UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_posts_user ON public.saved_posts(user_id);

-- 5. Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_conversation_parties UNIQUE (client_id, freelancer_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_client ON public.conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_freelancer ON public.conversations(freelancer_id);

-- 6. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);

-- 7. Trigger to keep post likes count in sync
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_post_likes_count ON public.post_likes;
CREATE TRIGGER trg_post_likes_count
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- 8. Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Posts RLS: Public can read, freelancer manages own posts
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
CREATE POLICY "Posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Freelancers can insert own posts" ON public.posts;
CREATE POLICY "Freelancers can insert own posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Freelancers can update own posts" ON public.posts;
CREATE POLICY "Freelancers can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Freelancers can delete own posts" ON public.posts;
CREATE POLICY "Freelancers can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = creator_id);

-- Likes & Saves RLS
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.post_likes;
CREATE POLICY "Likes are viewable by everyone"
  ON public.post_likes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can like posts" ON public.post_likes;
CREATE POLICY "Users can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove like" ON public.post_likes;
CREATE POLICY "Users can remove like"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own saved posts" ON public.saved_posts;
CREATE POLICY "Users can view own saved posts"
  ON public.saved_posts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save posts" ON public.saved_posts;
CREATE POLICY "Users can save posts"
  ON public.saved_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unsave posts" ON public.saved_posts;
CREATE POLICY "Users can unsave posts"
  ON public.saved_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Conversations & Messages RLS
DROP POLICY IF EXISTS "Parties can view their conversations" ON public.conversations;
CREATE POLICY "Parties can view their conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

DROP POLICY IF EXISTS "Clients can create conversations" ON public.conversations;
CREATE POLICY "Clients can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = client_id OR auth.uid() = freelancer_id);

DROP POLICY IF EXISTS "Parties can view messages" ON public.messages;
CREATE POLICY "Parties can view messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND (c.client_id = auth.uid() OR c.freelancer_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Parties can insert messages" ON public.messages;
CREATE POLICY "Parties can insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND (c.client_id = auth.uid() OR c.freelancer_id = auth.uid())
    )
  );

-- 9. Storage Bucket Configuration (Run in Supabase SQL editor if using Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true)
-- ON CONFLICT (id) DO NOTHING;
