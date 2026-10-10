import { Word, Question } from './types'

export const FALLBACK_WORDS: Word[] = [
  {
    id: 1,
    word: 'accommodate',
    ipa: '/əˈkɑː.mə.deɪt/',
    pos: 'verb',
    meaning_vn: 'đáp ứng, cung cấp chỗ ở / tiện nghi',
    category: 'Corporate & Hospitality',
    example_en: 'The hotel can accommodate up to 500 guests for the annual gala.',
    example_vn: 'Khách sạn có thể đáp ứng chỗ ở cho tối đa 500 khách dự tiệc thường niên.'
  },
  {
    id: 2,
    word: 'reimburse',
    ipa: '/ˌriː.ɪmˈbɝːs/',
    pos: 'verb',
    meaning_vn: 'hoàn tiền, bồi hoàn chi phí công tác',
    category: 'Finance & Accounting',
    example_en: 'Employees will be reimbursed for travel expenses within two weeks.',
    example_vn: 'Nhân viên sẽ được bồi hoàn chi phí đi lại trong vòng hai tuần.'
  },
  {
    id: 3,
    word: 'eligible',
    ipa: '/ˈel.ə.dʒə.bəl/',
    pos: 'adjective',
    meaning_vn: 'đủ điều kiện, thích hợp được hưởng quyền lợi',
    category: 'Human Resources',
    example_en: 'Only full-time staff members are eligible for health insurance benefits.',
    example_vn: 'Chỉ những nhân viên toàn thời gian mới đủ điều kiện nhận phúc lợi bảo hiểm y tế.'
  },
  {
    id: 4,
    word: 'warranty',
    ipa: '/ˈwɔːr.ən.t̬i/',
    pos: 'noun',
    meaning_vn: 'sự bảo hành, phiếu cam kết bảo hành',
    category: 'Customer Service',
    example_en: 'The electronic laptop comes with a comprehensive two-year warranty.',
    example_vn: 'Chiếc máy tính xách tay điện tử đi kèm với bảo hành toàn diện trong hai năm.'
  },
  {
    id: 5,
    word: 'negotiate',
    ipa: '/nəˈɡoʊ.ʃi.eɪt/',
    pos: 'verb',
    meaning_vn: 'thương lượng, đàm phán hợp đồng',
    category: 'Contracts & Business',
    example_en: 'The senior director is negotiating a new contract with our main supplier.',
    example_vn: 'Giám đốc cấp cao đang đàm phán một hợp đồng mới với nhà cung cấp chính của chúng tôi.'
  },
  {
    id: 6,
    word: 'complimentary',
    ipa: '/ˌkɑːm.pləˈmen.tər.i/',
    pos: 'adjective',
    meaning_vn: 'miễn phí (dịch vụ ưu đãi tặng kèm)',
    category: 'Hospitality & Travel',
    example_en: 'Guests can enjoy complimentary shuttle bus service to the airport.',
    example_vn: 'Khách có thể sử dụng dịch vụ xe đưa đón miễn phí đến sân bay.'
  },
  {
    id: 7,
    word: 'tentative',
    ipa: '/ˈten.t̬ə.t̬ɪv/',
    pos: 'adjective',
    meaning_vn: 'dự kiến, mang tính thăm dò, chưa chốt',
    category: 'Office Management',
    example_en: 'The board scheduled a tentative date for the merger announcement on Friday.',
    example_vn: 'Hội đồng quản trị đã lên lịch một ngày dự kiến công bố việc sáp nhập vào thứ Sáu.'
  },
  {
    id: 8,
    word: 'mandatory',
    ipa: '/ˈmæn.də.tɔːr.i/',
    pos: 'adjective',
    meaning_vn: 'bắt buộc theo quy định',
    category: 'Rules & Regulations',
    example_en: 'Attendance at the workplace security briefing is mandatory for all personnel.',
    example_vn: 'Việc tham dự buổi phổ biến an ninh nơi làm việc là bắt buộc đối với toàn bộ nhân viên.'
  }
]

export const ETS_2023_TEST1_SAMPLE: Question[] = [
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
    explanation: "Động từ 'send' cần một đại từ tân ngữ (object pronoun) đứng sau làm tân ngữ gián tiếp (send someone something). 'Her' đóng vai trò tân ngữ chỉ người nhận.",
    vocabulary_notes: [
      { word: "financial department", meaning: "phòng tài chính" },
      { word: "budget report", meaning: "báo cáo ngân sách" }
    ]
  },
  {
    id: 102,
    test_id: 1,
    part_number: 5,
    question_number: 102,
    question_text: "The new transit system is expected to significantly reduce travel times for _______ commuters.",
    option_a: "local",
    option_b: "locally",
    option_c: "localize",
    option_d: "locality",
    correct_answer: "A",
    explanation: "Trước danh từ 'commuters' (người đi làm) cần một tính từ bổ nghĩa. 'Local' (thuộc địa phương) là tính từ thích hợp nhất.",
    vocabulary_notes: [
      { word: "transit system", meaning: "hệ thống giao thông công cộng" },
      { word: "commuters", meaning: "những người đi làm hàng ngày" }
    ]
  },
  {
    id: 103,
    test_id: 1,
    part_number: 5,
    question_number: 103,
    question_text: "All staff members must wear protective eyewear _______ entering the manufacturing laboratory.",
    option_a: "when",
    option_b: "during",
    option_c: "because",
    option_d: "while of",
    correct_answer: "A",
    explanation: "Cụm 'when entering' là dạng rút gọn mệnh đề trạng ngữ cùng chủ ngữ (when they enter -> when entering). 'During' phải đi kèm cụm danh từ (during the meeting), không trực tiếp đi với V-ing.",
    vocabulary_notes: [
      { word: "protective eyewear", meaning: "kính bảo hộ mắt" },
      { word: "laboratory", meaning: "phòng thí nghiệm" }
    ]
  },
  {
    id: 104,
    test_id: 1,
    part_number: 5,
    question_number: 104,
    question_text: "The customer service hotline is available 24 hours a day to _______ assistance with online orders.",
    option_a: "provide",
    option_b: "provides",
    option_c: "providing",
    option_d: "provided",
    correct_answer: "A",
    explanation: "Cấu trúc chỉ mục đích 'to + V nguyên mẫu' (to provide assistance: nhằm cung cấp sự hỗ trợ).",
    vocabulary_notes: [
      { word: "assistance", meaning: "sự hỗ trợ / giúp đỡ" },
      { word: "available", meaning: "sẵn có / trực tuyến" }
    ]
  },
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
    explanation: "Đoạn văn thông báo tòa nhà chính sẽ đóng cửa vào thứ Bảy ngày 15/10 để bảo trì hệ thống điều hòa ('The main building will remain closed to all personnel...'). Do đó đáp án A là chính xác nhất.",
    vocabulary_notes: [
      { word: "undergo maintenance", meaning: "trải qua việc bảo trì" },
      { word: "personnel", meaning: "nhân viên / nhân sự" },
      { word: "in advance", meaning: "trước, làm trước" }
    ]
  }
]
