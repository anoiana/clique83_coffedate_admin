# Clique83 Admin - UI & Architecture Guidelines

Tài liệu này định nghĩa các tiêu chuẩn về kiến trúc, màu sắc, hiệu ứng và trạng thái cho dự án Admin của Clique83. Mọi đoạn code được sinh ra cần tuân thủ nghiêm ngặt các quy tắc dưới đây.

## 1. Kiến trúc (Architecture)
Dự án sử dụng sự kết hợp giữa **Feature-Sliced Design (FSD)** và **Domain-Driven Design (DDD)**.
- Mọi tài nguyên tuân thủ cấu trúc phân lớp: `app` -> `pages` -> `widgets` -> `features` -> `entities` -> `shared`.
- Không có dependency vòng (circular dependency). Các lớp trên chỉ import từ các lớp dưới.
- **DDD Rule:** Các trạng thái cốt lõi (như `PENDING`, `APPROVED`, `REJECTED` của Evaluation) phải được xử lý và kiểm tra tính hợp lệ ở lớp `entities` trước khi đưa ra UI.

## 2. Hệ thống màu sắc (Color Palette)
Sử dụng các biến CSS (hoặc Tailwind config) dựa trên hệ màu sau để đảm bảo tính đồng nhất:

- **Primary Colors (Thương hiệu chính):**
  - `primary`: `#4F46E5` (Indigo 600 - dùng cho nút bấm chính, active tabs)
  - `primary-hover`: `#4338CA` (Indigo 700)
  
- **Semantic Colors (Màu trạng thái nghiệp vụ):**
  - `success` (Approved/Hoàn thành): `#10B981` (Emerald 500)
  - `danger` (Rejected/Lỗi): `#EF4444` (Red 500)
  - `warning` (Pending/Chờ duyệt): `#F59E0B` (Amber 500)
  - `info` (Matches/Suggestions): `#3B82F6` (Blue 500)

- **Neutral/Background Colors (Nền và Chữ):**
  - `bg-main`: `#F9FAFB` (Gray 50 - Nền tổng thể của Dashboard)
  - `surface`: `#FFFFFF` (White - Nền của Cards, Tables, Modals)
  - `text-primary`: `#111827` (Gray 900 - Tiêu đề, văn bản chính)
  - `text-secondary`: `#6B7280` (Gray 500 - Subtitle, mô tả phụ)
  - `border`: `#E5E7EB` (Gray 200 - Viền các component)

## 3. Hiệu ứng (Transitions & Animations)
Không lạm dụng animation. Chỉ sử dụng các hiệu ứng mượt mà, tinh tế mang tính chất phản hồi tương tác (feedback).

- **Chuyển trang (Page Transition):** Fade in nhẹ nhàng (Duration: 200ms, Easing: ease-in-out).
- **Hover States:** Mọi nút bấm (Buttons) và thẻ có thể click (Clickable Cards) đều phải có hiệu ứng đổi màu nền hoặc nhích lên (Transform: translateY(-2px)) với thời gian 150ms.
- **Modals/Drawers:** Slide up hoặc Fade in kèm mờ nền (backdrop blur).
- **Trạng thái Mở/Đóng (Dropdown/Accordion):** Mở rộng mượt mà (Expand transition) không bị giật layout.

## 4. Trạng thái tải dữ liệu (Loading States)
Tuyệt đối không để màn hình trắng khi chờ API.
- **Initial Page Load:** Sử dụng Skeleton UI cho các khối dữ liệu lớn (như Bảng danh sách User, Thẻ Analytics). Skeleton có màu `gray-200` và hiệu ứng pulse (nhấp nháy nhẹ).
- **Button Actions (Approve/Reject/Login):** Thay thế icon hoặc text bên trong nút bằng một Spinner nhỏ (trùng màu chữ của nút) và `disable` nút đó để chặn user bấm nhiều lần.
- **Inline Loading:** Khi load thêm dữ liệu trong bảng (Pagination), hiển thị spinner nhỏ ở cuối bảng.

## 5. Trạng thái Lỗi & Trống (Error & Empty States)
- **Empty State (Không có dữ liệu):** Khi filter không ra kết quả hoặc không có Pending Evaluation, hiển thị một hình ảnh minh họa nhỏ (SVG) ở giữa kèm dòng chữ màu `text-secondary` (VD: "Không tìm thấy người dùng nào khớp với bộ lọc").
- **Error Handling (Gọi API thất bại):** - Lỗi cục bộ (VD: Approve thất bại): Hiện Toast/Snackbar màu `danger` ở góc phải màn hình.
  - Lỗi toàn cục (VD: Mất mạng, sập server): Hiển thị component Error Boundary thay thế vùng bị lỗi, kèm nút "Thử lại".

## 6. Typography
- Sử dụng font chữ Sans-serif hiện đại (như Inter hoặc Roboto).
- Phân cấp rõ ràng: 
  - `h1`: 24px (Tiêu đề trang)
  - `h2`: 20px (Tiêu đề khối/Widget)
  - `body`: 14px (Văn bản thường, dữ liệu bảng)
  - `caption`: 12px (Chú thích nhỏ, ngày giờ)