# Sổ Từ TOEIC - Ôn & Luyện Từ Vựng Thông Minh

Ứng dụng web học từ vựng TOEIC với thuật toán lặp lại ngắt quãng (**Spaced Repetition / SM-2**), tích hợp cơ sở dữ liệu đám mây **Supabase Cloud**.

## 🚀 Tính năng chính
1. **Ôn tập Flashcard (Spaced Repetition)**: Tự động tính toán chu kỳ lặp lại theo thuật toán SuperMemo SM-2 (Quên, Khó, Nhớ, Dễ).
2. **5 Chế độ Luyện tập**:
   - Trắc nghiệm nghĩa (Quiz)
   - Gõ từ tiếng Anh theo nghĩa (Type)
   - Nghe và viết chính tả (Listen)
   - Nhìn hình đoán từ (Picture)
   - Điền từ vào câu ví dụ (Cloze test - Part 5)
3. **Đọc hiểu tương tác (Reading Part 6 & 7)**: Bấm vào bất kỳ từ vựng nào trong bài đọc để tra cứu và thêm nhanh vào sổ từ.
4. **Đồng bộ Supabase Cloud**: Đăng ký / Đăng nhập tài khoản cá nhân để lưu trữ và đồng bộ từ vựng trên mọi thiết bị.
5. **Tiến độ học tập**: Thống kê số từ đã thuộc, đang học, chuỗi ngày học liên tục (streak) và biểu đồ 14 ngày.

## 🛠️ Cấu hình Supabase
- **URL**: `https://dqbhginmdwkvckyyzlkv.supabase.co`
- **Publishable Key**: `sb_publishable_K6Eh9iJPx4NvCUEj4VUMVw_KFQgFHwC`
- Script khởi tạo bảng: Xem trong file [supabase_schema.sql](./supabase_schema.sql).

## 🌐 Triển khai công khai (Public) lên GitHub Pages
1. Đẩy mã nguồn lên GitHub.
2. Vào **Settings** của repository trên GitHub.
3. Chọn mục **Pages** ở thanh menu bên trái.
4. Tại phần **Build and deployment > Branch**, chọn nhánh `master` (hoặc `main`) và thư mục `/(root)`, sau đó nhấn **Save**.
5. Sau 1-2 phút, bạn sẽ nhận được đường link trang web công khai dạng:
   `https://<ten-tai-khoan-github>.github.io/<ten-repo>/`
