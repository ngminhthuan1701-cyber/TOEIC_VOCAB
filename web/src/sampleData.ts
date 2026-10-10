import { Word, Question, UserStats } from './types'

export const INITIAL_USER_STATS: UserStats = {
  name: "Minh",
  targetScore: 850,
  currentEstimatedScore: 720,
  streakDays: 5,
  vocabLearned: 142,
  vocabMastered: 86,
  totalVocabGoal: 600,
  readingAccuracy: 78,
  readingQuestionsDone: 95,
  dailyGoalDone: 3,
  dailyGoalTotal: 4
}

export const COMPREHENSIVE_WORDS: Word[] = [
  // --- CHỦ ĐỀ: HỢP ĐỒNG & THƯƠNG LƯỢNG (Contracts & Negotiations) ---
  {
    id: 1,
    word: "negotiate",
    ipa: "/nəˈɡoʊ.ʃi.eɪt/",
    pos: "verb",
    meaning_vn: "thương lượng, đàm phán hợp đồng",
    category: "Hợp đồng & Đàm phán",
    example_en: "The executive director is negotiating a multi-year service contract with the supplier.",
    example_vn: "Giám đốc điều hành đang đàm phán hợp đồng dịch vụ nhiều năm với nhà cung cấp.",
    collocations: ["negotiate terms", "negotiate a contract with"]
  },
  {
    id: 2,
    word: "agreement",
    ipa: "/əˈɡriː.mənt/",
    pos: "noun",
    meaning_vn: "bản thỏa thuận, hợp đồng cam kết",
    category: "Hợp đồng & Đàm phán",
    example_en: "Both parties finally signed the mutual non-disclosure agreement yesterday.",
    example_vn: "Cả hai bên cuối cùng đã ký thỏa thuận bảo mật chung vào ngày hôm qua.",
    collocations: ["reach an agreement", "binding agreement"]
  },
  {
    id: 3,
    word: "clause",
    ipa: "/klɑːz/",
    pos: "noun",
    meaning_vn: "điều khoản trong hợp đồng",
    category: "Hợp đồng & Đàm phán",
    example_en: "The legal advisor recommended adding a cancellation clause to the lease.",
    example_vn: "Cố vấn pháp lý đã khuyến nghị thêm một điều khoản hủy bỏ vào hợp đồng thuê.",
    collocations: ["contract clause", "penalty clause"]
  },
  {
    id: 4,
    word: "comply with",
    ipa: "/kəmˈplaɪ wɪð/",
    pos: "verb phrase",
    meaning_vn: "tuân thủ, làm theo quy định/hợp đồng",
    category: "Hợp đồng & Đàm phán",
    example_en: "All overseas suppliers must strictly comply with federal safety standards.",
    example_vn: "Tất cả các nhà cung cấp nước ngoài phải tuân thủ nghiêm ngặt các tiêu chuẩn an toàn liên bang.",
    collocations: ["comply with regulations", "strictly comply with"]
  },
  {
    id: 5,
    word: "terminate",
    ipa: "/ˈtɝː.mə.neɪt/",
    pos: "verb",
    meaning_vn: "chấm dứt, hủy bỏ (hợp đồng, thỏa thuận)",
    category: "Hợp đồng & Đàm phán",
    example_en: "The client decided to terminate the contract due to recurring shipping delays.",
    example_vn: "Khách hàng đã quyết định chấm dứt hợp đồng do tình trạng giao hàng chậm trễ liên tục.",
    collocations: ["terminate a contract", "terminate employment"]
  },
  {
    id: 6,
    word: "binding",
    ipa: "/ˈbaɪn.dɪŋ/",
    pos: "adjective",
    meaning_vn: "có tính ràng buộc về mặt pháp lý",
    category: "Hợp đồng & Đàm phán",
    example_en: "Once countersigned by both directors, the memorandum becomes legally binding.",
    example_vn: "Khi được cả hai giám đốc đồng ký, biên bản ghi nhớ sẽ có giá trị ràng buộc về mặt pháp lý.",
    collocations: ["legally binding", "binding document"]
  },

  // --- CHỦ ĐỀ: TÀI CHÍNH & KẾ TOÁN (Finance & Budgeting) ---
  {
    id: 7,
    word: "reimburse",
    ipa: "/ˌriː.ɪmˈbɝːs/",
    pos: "verb",
    meaning_vn: "hoàn tiền, bồi hoàn chi phí phát sinh",
    category: "Tài chính & Kế toán",
    example_en: "Sales representatives will be reimbursed for fuel expenses incurred during client visits.",
    example_vn: "Đại diện kinh doanh sẽ được bồi hoàn chi phí xăng xe phát sinh trong các chuyến thăm khách hàng.",
    collocations: ["reimburse expenses", "fully reimbursed"]
  },
  {
    id: 8,
    word: "allocation",
    ipa: "/ˌæl.əˈkeɪ.ʃən/",
    pos: "noun",
    meaning_vn: "sự phân bổ (ngân sách, nguồn lực)",
    category: "Tài chính & Kế toán",
    example_en: "The quarterly budget allocation for digital marketing has been increased by 15 percent.",
    example_vn: "Việc phân bổ ngân sách hàng quý cho tiếp thị kỹ thuật số đã được tăng thêm 15%.",
    collocations: ["budget allocation", "resource allocation"]
  },
  {
    id: 9,
    word: "deficit",
    ipa: "/ˈdef.ə.sɪt/",
    pos: "noun",
    meaning_vn: "sự thâm hụt, số tiền thiếu hụt",
    category: "Tài chính & Kế toán",
    example_en: "Strict cost-cutting measures were implemented to overcome the fiscal deficit.",
    example_vn: "Các biện pháp cắt giảm chi phí nghiêm ngặt đã được thực hiện để khắc phục thâm hụt tài khóa.",
    collocations: ["budget deficit", "fiscal deficit"]
  },
  {
    id: 10,
    word: "revenue",
    ipa: "/ˈrev.ə.nuː/",
    pos: "noun",
    meaning_vn: "doanh thu, tổng thu nhập",
    category: "Tài chính & Kế toán",
    example_en: "Gross quarterly revenue surpassed initial market expectations by twenty percent.",
    example_vn: "Tổng doanh thu hàng quý đã vượt qua kỳ vọng ban đầu của thị trường tới 20%.",
    collocations: ["annual revenue", "generate revenue"]
  },
  {
    id: 11,
    word: "expenditure",
    ipa: "/ɪkˈspen.də.tʃɚ/",
    pos: "noun",
    meaning_vn: "khoản chi tiêu, tổng chi phí",
    category: "Tài chính & Kế toán",
    example_en: "The finance audit revealed unexpected expenditures on IT software licenses.",
    example_vn: "Cuộc kiểm toán tài chính cho thấy các khoản chi tiêu ngoài dự kiến cho bản quyền phần mềm CNTT.",
    collocations: ["capital expenditure", "reduce expenditure"]
  },
  {
    id: 12,
    word: "audit",
    ipa: "/ˈɑː.dɪt/",
    pos: "noun / verb",
    meaning_vn: "kiểm toán, sự thanh tra tài chính",
    category: "Tài chính & Kế toán",
    example_en: "An external accounting agency will conduct an annual audit next Monday.",
    example_vn: "Một công ty kế toán độc lập sẽ tiến hành kiểm toán hàng năm vào thứ Hai tới.",
    collocations: ["financial audit", "undergo an audit"]
  },

  // --- CHỦ ĐỀ: NHÂN SỰ & QUẢN LÝ (Human Resources & Corporate) ---
  {
    id: 13,
    word: "eligible",
    ipa: "/ˈel.ə.dʒə.bəl/",
    pos: "adjective",
    meaning_vn: "đủ điều kiện, thích hợp nhận quyền lợi",
    category: "Nhân sự & Tuyển dụng",
    example_en: "Only employees who complete three months of service are eligible for paid leave.",
    example_vn: "Chỉ những nhân viên hoàn thành 3 tháng làm việc mới đủ điều kiện được nghỉ phép có lương.",
    collocations: ["eligible for promotion", "eligible to participate"]
  },
  {
    id: 14,
    word: "recruit",
    ipa: "/rɪˈkruːt/",
    pos: "verb / noun",
    meaning_vn: "tuyển dụng; tân binh/nhân viên mới",
    category: "Nhân sự & Tuyển dụng",
    example_en: "The firm launched a nationwide talent campaign to recruit seasoned engineers.",
    example_vn: "Công ty đã phát động một chiến dịch nhân tài toàn quốc nhằm tuyển dụng các kỹ sư dày dạn kinh nghiệm.",
    collocations: ["recruit new staff", "recruitment agency"]
  },
  {
    id: 15,
    word: "probation",
    ipa: "/proʊˈbeɪ.ʃən/",
    pos: "noun",
    meaning_vn: "thời gian thử việc",
    category: "Nhân sự & Tuyển dụng",
    example_en: "During the initial probation period, performance evaluations occur monthly.",
    example_vn: "Trong thời gian thử việc ban đầu, các đánh giá hiệu suất sẽ diễn ra hàng tháng.",
    collocations: ["probation period", "on probation"]
  },
  {
    id: 16,
    word: "promising",
    ipa: "/ˈprɑː.mɪ.sɪŋ/",
    pos: "adjective",
    meaning_vn: "đầy triển vọng, hứa hẹn tương lai tốt",
    category: "Nhân sự & Tuyển dụng",
    example_en: "The interview panel agreed that Mr. Chen is the most promising candidate for branch manager.",
    example_vn: "Hội đồng phỏng vấn đồng thuận rằng anh Chen là ứng viên triển vọng nhất cho vị trí giám đốc chi nhánh.",
    collocations: ["promising career", "promising results"]
  },
  {
    id: 17,
    word: "compensation",
    ipa: "/ˌkɑːm.pənˈseɪ.ʃən/",
    pos: "noun",
    meaning_vn: "tiền lương thưởng, sự bồi thường đãi ngộ",
    category: "Nhân sự & Tuyển dụng",
    example_en: "The competitive compensation package includes health coverage and performance incentives.",
    example_vn: "Gói đãi ngộ cạnh tranh bao gồm bảo hiểm y tế và tiền thưởng theo hiệu suất.",
    collocations: ["compensation package", "financial compensation"]
  },
  {
    id: 18,
    word: "mandatory",
    ipa: "/ˈmæn.də.tɔːr.i/",
    pos: "adjective",
    meaning_vn: "bắt buộc theo quy định",
    category: "Quy định & Văn phòng",
    example_en: "Attendance at the monthly workplace emergency preparedness seminar is mandatory.",
    example_vn: "Việc tham dự buổi hội thảo ứng phó khẩn cấp nơi làm việc hàng tháng là bắt buộc.",
    collocations: ["mandatory training", "mandatory attendance"]
  },

  // --- CHỦ ĐỀ: KHÁCH HÀNG & DỊCH VỤ (Customer Service & Hospitality) ---
  {
    id: 19,
    word: "accommodate",
    ipa: "/əˈkɑː.mə.deɪt/",
    pos: "verb",
    meaning_vn: "đáp ứng nhu cầu; cung cấp chỗ ở/tiện nghi",
    category: "Dịch vụ & Du lịch",
    example_en: "The ballroom can accommodate up to 600 attendees comfortably for the seminar.",
    example_vn: "Hội trường lớn có thể đáp ứng chỗ ngồi thoải mái cho tới 600 người tham dự hội thảo.",
    collocations: ["accommodate requests", "accommodate guests"]
  },
  {
    id: 20,
    word: "complimentary",
    ipa: "/ˌkɑːm.pləˈmen.tər.i/",
    pos: "adjective",
    meaning_vn: "miễn phí (quà tặng / dịch vụ đính kèm)",
    category: "Dịch vụ & Du lịch",
    example_en: "Guests are invited to enjoy complimentary beverages at the rooftop lounge.",
    example_vn: "Khách trọ được mời thưởng thức đồ uống miễn phí tại sảnh trên tầng thượng.",
    collocations: ["complimentary breakfast", "complimentary tickets"]
  },
  {
    id: 21,
    word: "warranty",
    ipa: "/ˈwɔːr.ən.t̬i/",
    pos: "noun",
    meaning_vn: "chế độ bảo hành, giấy bảo hành",
    category: "Dịch vụ & Du lịch",
    example_en: "The newly purchased commercial printer is covered by a three-year replacement warranty.",
    example_vn: "Chiếc máy in thương mại mới mua được bảo hành đổi trả trong vòng 3 năm.",
    collocations: ["under warranty", "extended warranty"]
  },
  {
    id: 22,
    word: "tentative",
    ipa: "/ˈten.t̬ə.t̬ɪv/",
    pos: "adjective",
    meaning_vn: "dự kiến, thăm dò, chưa chính thức",
    category: "Quy định & Văn phòng",
    example_en: "The committee released a tentative itinerary for next month's annual conference.",
    example_vn: "Ban tổ chức đã ban hành một lịch trình dự kiến cho hội nghị thường niên vào tháng tới.",
    collocations: ["tentative agreement", "tentative schedule"]
  },
  {
    id: 23,
    word: "commence",
    ipa: "/kəˈmens/",
    pos: "verb",
    meaning_vn: "bắt đầu, khởi công, khởi đầu",
    category: "Quy định & Văn phòng",
    example_en: "Renovations on the international terminal will commence early next quarter.",
    example_vn: "Công tác cải tạo nhà ga quốc tế sẽ bắt đầu vào đầu quý tới.",
    collocations: ["commence operations", "commence construction"]
  },
  {
    id: 24,
    word: "substantial",
    ipa: "/səbˈstæn.ʃəl/",
    pos: "adjective",
    meaning_vn: "đáng kể, quan trọng, to lớn",
    category: "Tài chính & Kế toán",
    example_en: "The company reported a substantial increase in online subscription renewals.",
    example_vn: "Công ty đã báo cáo sự gia tăng đáng kể trong việc gia hạn gói thuê bao trực tuyến.",
    collocations: ["substantial growth", "substantial portion"]
  }
]

export const COMPREHENSIVE_QUESTIONS: Question[] = [
  // PART 5
  {
    id: 101,
    test_id: 1,
    part_number: 5,
    question_number: 101,
    question_text: "Ms. Tanaka requested that the financial department send _______ the updated budget report before noon.",
    option_a: "she",
    option_b: "her",
    option_c: "hers",
    option_d: "herself",
    correct_answer: "B",
    explanation: "Động từ 'send' cần một đại từ tân ngữ (object pronoun) làm tân ngữ gián tiếp (cấu trúc: send + sb + sth). 'Her' đóng vai trò tân ngữ chỉ người nhận.",
    vocabulary_notes: [
      { word: "financial department", meaning: "phòng tài chính" },
      { word: "budget report", meaning: "báo cáo ngân sách chi tiêu" }
    ]
  },
  {
    id: 102,
    test_id: 1,
    part_number: 5,
    question_number: 102,
    question_text: "The new transit subway system is expected to significantly reduce travel times for _______ commuters.",
    option_a: "local",
    option_b: "locally",
    option_c: "localize",
    option_d: "locality",
    correct_answer: "A",
    explanation: "Trước danh từ số nhiều 'commuters' (người đi lại làm việc), ta cần một tính từ bổ nghĩa. 'Local' (thuộc địa phương) là tính từ chính xác.",
    vocabulary_notes: [
      { word: "transit system", meaning: "hệ thống giao thông công cộng" },
      { word: "commuters", meaning: "người đi lại làm việc hàng ngày" }
    ]
  },
  {
    id: 103,
    test_id: 1,
    part_number: 5,
    question_number: 103,
    question_text: "All factory staff members must wear protective eyewear _______ entering the manufacturing laboratory.",
    option_a: "when",
    option_b: "during",
    option_c: "because",
    option_d: "in spite of",
    correct_answer: "A",
    explanation: "Cụm 'when entering' là dạng rút gọn mệnh đề trạng ngữ đồng chủ ngữ (When they enter -> When entering). 'During' chỉ đi với danh từ, không đi trực tiếp với V-ing.",
    vocabulary_notes: [
      { word: "protective eyewear", meaning: "kính bảo hộ mắt" },
      { word: "manufacturing laboratory", meaning: "phòng thí nghiệm sản xuất" }
    ]
  },
  {
    id: 104,
    test_id: 1,
    part_number: 5,
    question_number: 104,
    question_text: "The client support hotline is available 24 hours a day to _______ immediate assistance with online orders.",
    option_a: "provide",
    option_b: "provides",
    option_c: "providing",
    option_d: "provided",
    correct_answer: "A",
    explanation: "Cấu trúc chỉ mục đích 'to + V (nguyên thể)' (to provide assistance: nhằm mục đích cung cấp sự hỗ trợ).",
    vocabulary_notes: [
      { word: "hotline", meaning: "đường dây nóng" },
      { word: "assistance", meaning: "sự hỗ trợ, trợ giúp" }
    ]
  },
  {
    id: 105,
    test_id: 1,
    part_number: 5,
    question_number: 105,
    question_text: "Mr. Henderson reviewed the proposal _______ before presenting it to the executive board of directors.",
    option_a: "careful",
    option_b: "carefully",
    option_c: "carefulness",
    option_d: "caring",
    correct_answer: "B",
    explanation: "Trạng từ 'carefully' đứng sau tân ngữ để bổ nghĩa cho động từ hành động 'reviewed'.",
    vocabulary_notes: [
      { word: "proposal", meaning: "bản đề xuất, dự án" },
      { word: "board of directors", meaning: "hội đồng quản trị" }
    ]
  },
  {
    id: 106,
    test_id: 1,
    part_number: 5,
    question_number: 106,
    question_text: "The regional manager announced that our branch has achieved _______ sales figures than last quarter.",
    option_a: "high",
    option_b: "higher",
    option_c: "highest",
    option_d: "highly",
    correct_answer: "B",
    explanation: "Xuất hiện từ 'than' báo hiệu cấu trúc so sánh hơn của tính từ ngắn (higher + noun + than).",
    vocabulary_notes: [
      { word: "sales figures", meaning: "số liệu doanh số bán hàng" },
      { word: "quarter", meaning: "quý trong năm tài chính" }
    ]
  },
  {
    id: 107,
    test_id: 1,
    part_number: 5,
    question_number: 107,
    question_text: "Employees seeking reimbursement for travel costs must submit all receipts _______ Friday afternoon.",
    option_a: "by",
    option_b: "at",
    option_c: "from",
    option_d: "about",
    correct_answer: "A",
    explanation: "Giới từ 'by + mốc thời gian' mang nghĩa là 'trước hoặc chậm nhất vào lúc...', dùng phổ biến cho deadline nộp hồ sơ, giấy tờ.",
    vocabulary_notes: [
      { word: "reimbursement", meaning: "khoản thanh hoàn, bồi hoàn" },
      { word: "receipt", meaning: "hóa đơn, biên lai xác nhận" }
    ]
  },
  {
    id: 108,
    test_id: 1,
    part_number: 5,
    question_number: 108,
    question_text: "Despite the bad weather conditions, the construction crew managed to _______ the bridge on schedule.",
    option_a: "complete",
    option_b: "completes",
    option_c: "completed",
    option_d: "completion",
    correct_answer: "A",
    explanation: "Cấu trúc 'manage to + V (nguyên thể)': xoay sở/thành công làm được việc gì đó.",
    vocabulary_notes: [
      { word: "construction crew", meaning: "đội ngũ công nhân xây dựng" },
      { word: "on schedule", meaning: "đúng tiến độ / đúng lịch trình" }
    ]
  },

  // PART 6
  {
    id: 131,
    test_id: 1,
    part_number: 6,
    question_number: 131,
    passage_text: "NOTICE TO ALL TENANTS\n\nStarting on November 1st, the building management will replace all hallway lighting with energy-efficient LED fixtures. [131] during this installation, power in the corridors will be temporarily switched off between 9:00 A.M. and 11:00 A.M. We apologize for any inconvenience.",
    question_text: "Choose the word that best fits the blank [131]:",
    option_a: "Therefore",
    option_b: "Similarly",
    option_c: "Otherwise",
    option_d: "Instead",
    correct_answer: "A",
    explanation: "'Therefore' (Do đó/Vì vậy) dùng để chỉ kết quả logic: do việc thay thế đèn nên nguồn điện hành lang sẽ tạm thời bị ngắt.",
    vocabulary_notes: [
      { word: "tenants", meaning: "người thuê nhà/căn hộ" },
      { word: "fixtures", meaning: "bộ đèn chiếu sáng cố định" },
      { word: "temporarily", meaning: "một cách tạm thời" }
    ]
  },

  // PART 7
  {
    id: 153,
    test_id: 1,
    part_number: 7,
    question_number: 153,
    passage_text: "MEMORANDUM\n\nTo: All Branch Staff\nFrom: Clara Vance, Regional Director\nDate: October 12\nSubject: Office Facility Upgrades\n\nPlease be advised that our head office will undergo scheduled air-conditioning maintenance this Saturday, October 15. The main building will remain closed to all personnel from 8:00 A.M. to 5:00 P.M. Anyone requiring urgent weekend access must notify building security in advance and obtain a temporary visitor pass.",
    question_text: "What is the primary purpose of the memorandum?",
    option_a: "To announce an upcoming building closure",
    option_b: "To recruit maintenance technicians",
    option_c: "To update staff on overtime regulations",
    option_d: "To introduce a newly appointed director",
    correct_answer: "A",
    explanation: "Đoạn văn gửi đến toàn bộ nhân viên để thông báo tòa nhà chính sẽ đóng cửa vào thứ Bảy ngày 15/10 để bảo trì hệ thống máy lạnh ('The main building will remain closed to all personnel...'). Đáp án A là chính xác.",
    vocabulary_notes: [
      { word: "undergo maintenance", meaning: "trải qua đợt bảo trì" },
      { word: "in advance", meaning: "trước, báo trước" },
      { word: "visitor pass", meaning: "thẻ ra vào tạm thời" }
    ]
  },
  {
    id: 154,
    test_id: 1,
    part_number: 7,
    question_number: 154,
    passage_text: "MEMORANDUM (Tiếp tục đoạn trên)\n\nAnyone requiring urgent weekend access must notify building security in advance and obtain a temporary visitor pass.",
    question_text: "According to the memo, what must employees do if they need to enter the building on Saturday?",
    option_a: "Contact Clara Vance directly",
    option_b: "Reschedule their work for Sunday",
    option_c: "Inform security and get a temporary pass",
    option_d: "Pay an emergency access fee",
    correct_answer: "C",
    explanation: "Nội dung chỉ rõ: 'must notify building security in advance and obtain a temporary visitor pass' (báo cho bộ phận an ninh và xin thẻ tạm thời).",
    vocabulary_notes: [
      { word: "urgent access", meaning: "sự ra vào khẩn cấp" },
      { word: "obtain", meaning: "đạt được, xin được" }
    ]
  }
]
