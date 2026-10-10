-- ========================================================
-- MODULE HỌC TỪ VỰNG CHUYÊN SÂU TOEIC (FSRS / ANKI / QUIZLET / MEMRISE / ETS 2023)
-- ========================================================

-- 1. BẢNG BỘ TỪ / DECKS (Hỗ trợ bộ hệ thống & bộ người dùng tự tạo/chia sẻ)
CREATE TABLE IF NOT EXISTS vocab_decks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT '📚',
    color TEXT DEFAULT '#0284c7',
    is_system BOOLEAN DEFAULT FALSE, -- Deck do hệ thống tạo từ ETS 2023
    is_public BOOLEAN DEFAULT TRUE,
    total_words INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG TỪ VỰNG CHUYÊN SÂU (WORDS) - Tích hợp Word Family, Collocations, Nguồn đề ETS
CREATE TABLE IF NOT EXISTS vocab_words (
    id BIGSERIAL PRIMARY KEY,
    deck_id UUID REFERENCES vocab_decks(id) ON DELETE SET NULL,
    word TEXT NOT NULL,
    ipa TEXT,
    pos TEXT, -- noun, verb, adj, adv, phrase
    meaning_vn TEXT NOT NULL,
    frequency INT DEFAULT 1, -- Số lần xuất hiện trong 10 Test ETS 2023
    
    -- Ngữ cảnh gốc ETS 2023
    ets_source_test INT, -- 1 đến 10
    ets_source_part INT, -- 5, 6, 7
    ets_source_question INT, -- 101 -> 200
    sentence_en TEXT NOT NULL, -- Câu gốc chứa từ trong đề
    sentence_vn TEXT, -- Dịch câu gốc
    
    -- Cấu trúc từ TOEIC (Đặc thù Part 5 & 7)
    word_family JSONB DEFAULT '[]'::jsonb, -- [{"pos": "n", "word": "negotiation"}, {"pos": "adj", "word": "negotiable"}]
    collocations JSONB DEFAULT '[]'::jsonb, -- ["negotiate a contract", "terms of agreement"]
    confusing_pairs JSONB DEFAULT '[]'::jsonb, -- ["affect vs effect"]
    paraphrase_pairs JSONB DEFAULT '[]'::jsonb, -- [{"question_phrase": "require assistance", "passage_phrase": "need help"}]
    image_url TEXT,
    audio_us_url TEXT,
    audio_uk_url TEXT,
    audio_au_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG TIẾN ĐỘ THẺ THUẬT TOÁN FSRS / ANKI (USER_CARDS)
-- Quản lý chu kỳ ôn tập riêng biệt cho từng người dùng theo từng từ
CREATE TABLE IF NOT EXISTS vocab_user_cards (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    word_id BIGINT REFERENCES vocab_words(id) ON DELETE CASCADE,
    
    -- Trạng thái học
    state TEXT DEFAULT 'new', -- 'new' (mới), 'learning' (đang học), 'review' (đến hạn ôn), 'mastered' (thuộc vững)
    
    -- Thông số FSRS (Free Spaced Repetition Scheduler)
    stability FLOAT DEFAULT 0.0, -- Độ bền trí nhớ (S)
    difficulty FLOAT DEFAULT 5.0, -- Độ khó của thẻ (D: 1 -> 10)
    reps INT DEFAULT 0, -- Tổng số lần đã ôn
    lapses INT DEFAULT 0, -- Số lần bấm Quên (dùng để phát hiện LEECH)
    is_leech BOOLEAN DEFAULT FALSE, -- Thẻ hay quên nhiều lần (lapses >= 4)
    
    scheduled_days FLOAT DEFAULT 0.0,
    elapsed_days FLOAT DEFAULT 0.0,
    last_review TIMESTAMPTZ,
    next_review TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- 4. BẢNG NHẬT KÝ ÔN TẬP (REVIEW_LOGS) - Phục vụ Heatmap, Báo cáo & FSRS Training
CREATE TABLE IF NOT EXISTS vocab_review_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id BIGINT REFERENCES vocab_user_cards(id) ON DELETE CASCADE,
    rating INT NOT NULL, -- 1: Again (Quên), 2: Hard (Khó), 3: Good (Được), 4: Easy (Dễ)
    study_mode TEXT DEFAULT 'flashcard', -- 'flashcard', 'learn', 'test', 'match', 'spell'
    time_spent_ms INT DEFAULT 0,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG MẸO NHỚ (MNEMONICS - MEMRISE STYLE)
CREATE TABLE IF NOT EXISTS vocab_mnemonics (
    id BIGSERIAL PRIMARY KEY,
    word_id BIGINT REFERENCES vocab_words(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL, -- Mẹo liên tưởng âm, hình ảnh, câu chuyện
    is_ai_generated BOOLEAN DEFAULT FALSE,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG GAMIFICATION (STREAKS, XP, BADGES - DUOLINGO STYLE)
CREATE TABLE IF NOT EXISTS user_gamification (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    xp INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    last_study_date DATE DEFAULT CURRENT_DATE,
    streak_freeze_count INT DEFAULT 2, -- Số lượt đóng băng streak dự phòng
    level INT DEFAULT 1,
    daily_goal_cards INT DEFAULT 20, -- Mục tiêu số thẻ/ngày
    badges JSONB DEFAULT '[]'::jsonb, -- ["STREAK_7_DAYS", "MASTER_100_PART7"]
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- KÍCH HOẠT ROW LEVEL SECURITY (RLS)
ALTER TABLE vocab_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_review_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_mnemonics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Public read decks" ON vocab_decks FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users manage own decks" ON vocab_decks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read words" ON vocab_words FOR SELECT USING (true);
CREATE POLICY "Public read mnemonics" ON vocab_mnemonics FOR SELECT USING (true);
CREATE POLICY "Users add mnemonics" ON vocab_mnemonics FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own cards" ON vocab_user_cards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own review logs" ON vocab_review_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own gamification" ON user_gamification FOR ALL USING (auth.uid() = user_id);
