-- BẢNG 1: TỪ VỰNG TOEIC TRỌNG TÂM
CREATE TABLE IF NOT EXISTS words (
    id BIGSERIAL PRIMARY KEY,
    word TEXT NOT NULL,
    ipa TEXT,
    pos TEXT, -- part of speech: noun, verb, adj, etc.
    meaning_vn TEXT NOT NULL,
    category TEXT DEFAULT 'General Business', -- Contracts, Marketing, Office, etc.
    example_en TEXT,
    example_vn TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 2: TIẾN ĐỘ HỌC TỪ VỰNG CỦA NGƯỜI DÙNG (Spaced Repetition)
CREATE TABLE IF NOT EXISTS user_vocab_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    word_id BIGINT REFERENCES words(id) ON DELETE CASCADE,
    box_level INT DEFAULT 1, -- 1 đến 5 (Spaced Repetition)
    review_count INT DEFAULT 0,
    is_mastered BOOLEAN DEFAULT FALSE,
    next_review TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- BẢNG 3: BỘ ĐỀ THI
CREATE TABLE IF NOT EXISTS tests (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL, -- ví dụ: "ETS 2023 - Test 01"
    year INT DEFAULT 2023,
    total_questions INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 4: CÂU HỎI & BÀI ĐỌC
CREATE TABLE IF NOT EXISTS questions (
    id BIGSERIAL PRIMARY KEY,
    test_id BIGINT REFERENCES tests(id) ON DELETE CASCADE,
    part_number INT NOT NULL, -- 5, 6, 7
    question_number INT NOT NULL, -- 101 -> 200
    passage_text TEXT, -- Đoạn văn cho Part 6 & Part 7 (nếu có)
    passage_image_url TEXT, -- Ảnh đoạn văn nếu dùng bản scan
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer VARCHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
    explanation TEXT, -- Giải thích chi tiết
    vocabulary_notes JSONB -- Các từ vựng then chốt trong câu
);

-- BẢNG 5: LỊCH SỬ LÀM BÀI CỦA NGƯỜI DÙNG
CREATE TABLE IF NOT EXISTS test_submissions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    test_id BIGINT REFERENCES tests(id) ON DELETE CASCADE,
    reading_score INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    total_count INT DEFAULT 0,
    duration_seconds INT DEFAULT 0,
    answers_detail JSONB, -- { "101": "A", "102": "C", ... }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KÍCH HOẠT ROW LEVEL SECURITY (RLS) ĐỂ BẢO MẬT
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_submissions ENABLE ROW LEVEL SECURITY;

-- CHO PHÉP MỌI NGƯỜI ĐỌC TỪ VỰNG & BỘ ĐỀ
CREATE POLICY "Public read words" ON words FOR SELECT USING (true);
CREATE POLICY "Public read tests" ON tests FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (true);

-- TIẾN ĐỘ NGƯỜI DÙNG & LỊCH SỬ THI: Chỉ người đó đọc/ghi
CREATE POLICY "Users manage own vocab" ON user_vocab_progress
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own submissions" ON test_submissions
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- THÊM MẪU MỘT SỐ TỪ VỰNG ETS 2023 TRỌNG TÂM BAN ĐẦU
INSERT INTO words (word, ipa, pos, meaning_vn, category, example_en, example_vn) VALUES
('accommodate', '/əˈkɑː.mə.deɪt/', 'verb', 'đáp ứng, cung cấp chỗ ở / tiện nghi', 'Corporate & Hospitality', 'The hotel can accommodate up to 500 guests for the conference.', 'Khách sạn có thể đáp ứng chỗ ở cho tối đa 500 khách dự hội nghị.'),
('reimburse', '/ˌriː.ɪmˈbɝːs/', 'verb', 'hoàn tiền, bồi hoàn công tác phí', 'Finance & Accounting', 'Employees will be reimbursed for travel expenses within two weeks.', 'Nhân viên sẽ được bồi hoàn chi phí đi lại trong vòng hai tuần.'),
('warranty', '/ˈwɔːr.ən.t̬i/', 'noun', 'giấy bảo hành, sự bảo hành', 'Customer Service', 'The electronic device comes with a two-year limited warranty.', 'Thiết bị điện tử đi kèm với bảo hành có giới hạn hai năm.'),
('eligible', '/ˈel.ə.dʒə.bəl/', 'adj', 'đủ điều kiện, thích hợp', 'Human Resources', 'Only full-time staff members are eligible for the annual bonus.', 'Chỉ những nhân viên toàn thời gian mới đủ điều kiện nhận tiền thưởng hàng năm.'),
('negotiate', '/nəˈɡoʊ.ʃi.eɪt/', 'verb', 'thương lượng, đàm phán', 'Contracts & Business', 'The management is negotiating a new contract with the supplier.', 'Ban quản lý đang đàm phán một hợp đồng mới với nhà cung cấp.'),
('complimentary', '/ˌkɑːm.pləˈmen.tər.i/', 'adj', 'miễn phí (dịch vụ kèm theo)', 'Hospitality & Travel', 'Guests are provided with complimentary breakfast every morning.', 'Khách được phục vụ bữa sáng miễn phí mỗi buổi sáng.'),
('tentative', '/ˈten.t̬ə.t̬ɪv/', 'adj', 'dự kiến, chưa dứt khoát', 'Office Management', 'We have set a tentative date for the project launch on May 15.', 'Chúng tôi đã ấn định ngày ra mắt dự án dự kiến là ngày 15 tháng 5.'),
('mandatory', '/ˈmæn.də.tɔːr.i/', 'adj', 'bắt buộc', 'Rules & Regulations', 'Attendance at the safety training session is mandatory for all workers.', 'Việc tham dự buổi đào tạo an toàn là bắt buộc đối với tất cả công nhân.'),
('commence', '/kəˈmens/', 'verb', 'bắt đầu, khởi đầu', 'Corporate & Office', 'Construction on the new office headquarters will commence next month.', 'Việc xây dựng trụ sở văn phòng mới sẽ bắt đầu vào tháng tới.'),
('promising', '/ˈprɑː.mɪ.sɪŋ/', 'adj', 'đầy triển vọng, hứa hẹn', 'Business Development', 'The young candidate demonstrated promising sales potential during the interview.', 'Ứng viên trẻ đã thể hiện tiềm năng bán hàng đầy triển vọng trong buổi phỏng vấn.');
