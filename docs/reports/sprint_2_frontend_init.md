## 3. Cập nhật tiến độ: Hoàn thiện Service Layer (Frontend)
- **Data Types:** Đã định nghĩa chặt chẽ các TypeScript Interfaces (`Issue`, `ReviewResponse`, `RepairResponse`) nhằm đảm bảo tính toàn vẹn dữ liệu từ Backend gửi lên.
- **API Integration:** Đã xây dựng thành công `api.service.ts` sử dụng Axios để kết nối mượt mà với 2 endpoints FastAPI, sẵn sàng cho việc tích hợp vào UI.

## 4. Giai đoạn tiếp theo (Đang thực hiện)
- Xây dựng trang chủ (`HomePage.tsx`) với giao diện chia đôi (Split Pane): Textarea nhập code (trái) và AI Review Panel (phải).
- Tích hợp state management cơ bản để hiển thị Loading, Danh sách lỗi (Issues) và Mã nguồn đã sửa (Repaired Code).