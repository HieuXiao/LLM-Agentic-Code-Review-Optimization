# 🚀 AI Code Review & Repair Agent (Gemini Powered)

Hệ thống review và sửa lỗi code tự động sử dụng Agentic Workflow với mô hình Gemini 2.5 Flash. Dự án giúp tối ưu hóa quy trình Software Development Life Cycle (SDLC) bằng cách phát hiện lỗi logic, bảo mật, hiệu năng và tự động đề xuất bản vá lỗi hoàn chỉnh.

## 🌟 Tính năng chính
- **Cấu trúc Agentic Workflow**: Tách biệt vai trò **Reviewer** (phát hiện lỗi) và **Repairer** (sửa lỗi).
- **Phân tích lỗi chi tiết**: Trả về dữ liệu lỗi dưới dạng cấu trúc JSON (Issue type, Severity, Line, Context, Description).
- **Tự động sửa lỗi**: Đề xuất bản vá code hoàn chỉnh dựa trên các lỗi nghiêm trọng nhất được tìm thấy.
- **Giao diện Explorer**: Duyệt file hệ thống trực quan với Streamlit.

## 🛠 Tech Stack
- **Core**: Python 3.10+
- **Frontend**: Streamlit
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
- **Library**: `google-genai`, `python-dotenv`

## 📂 Cấu trúc thư mục
```text
├── .streamlit/          # Cấu hình giao diện Streamlit
├── agents/              # Định nghĩa các AI Agent (Review, Repair, Workflow)
├── docs/                # Tài liệu kiến trúc hệ thống
├── prompts/             # Quản lý Prompt templates chuyên biệt
├── utils/               # Các hàm tiện ích và cấu hình hệ thống
├── streamlit_app.py     # File chạy chính của ứng dụng
└── requirements.txt     # Danh sách thư viện phụ thuộc
```

## 🚀 Hướng dẫn cài đặt và sử dụng

### 1. Yêu cầu hệ thống
- Đã cài đặt Python 3.10 trở lên.
- Có **Gemini API Key** (lấy tại [Google AI Studio](https://aistudio.google.com/)).

### 2. Cài đặt
1. Clone project và di chuyển vào thư mục gốc.
2. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   ```
3. Tạo file `.env` từ file mẫu:
   ```bash
   cp .env.example .env
   ```
4. Mở file `.env` và dán API Key của bạn vào:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### 3. Chạy ứng dụng
Khởi động giao diện Streamlit:
```bash
streamlit run streamlit_app.py
```

### 4. Cách sử dụng
1. **Nhập đường dẫn**: Tại cột trái (Explorer), nhập đường dẫn tuyệt đối đến thư mục chứa code của bạn (Vd: `D:\MyProject`).
2. **Chọn file**: Click vào các file `.py` hiển thị trong cây thư mục để xem nội dung.
3. **Chạy AI**: Nhấn nút **"▶️ Run Review & Repair Agent"** ở bảng điều khiển bên phải.
4. **Xem kết quả**:
   - Tab **Review Results**: Xem danh sách lỗi ở định dạng JSON thô.
   - Tab **Detected Issues**: Xem diễn giải lỗi dễ hiểu.
   - Tab **Repaired Code**: Xem và tải về bản code đã được AI sửa lỗi.

---
*Phát triển bởi Đội ngũ SDLC Optimization 2026*

