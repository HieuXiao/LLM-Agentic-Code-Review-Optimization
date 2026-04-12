# Architecture Documentation

## System Overview
Dự án AI Code Review là một công cụ phân tích mã nguồn được viết bằng **Streamlit**, sử dụng sức mạnh của **Google Gemini API**. Hệ thống sử dụng thiết kế Modular Agent, tách biệt tác vụ **Review** (phân tích) và **Repair** (sửa lỗi) để tăng cường độ chính xác.

## Architecture Diagram (Flow)
```text
┌─────────────────────────────────────────────────────────┐
│                    Streamlit UI Layer                    │
│      (Cây thư mục + Viewer + Panel kết quả AI)           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ├──> streamlit_app.py (Quản lý trạng thái & UI)
                 │
                 ├──> agents/workflow.py (Điều phối quy trình)
                 │         │
                 │         ├──> steps 1: agents/agent_review.py
                 │         │    (Trả về phân tích lỗi JSON)
                 │         │
                 │         └──> steps 2: agents/agent_repair.py
                 │              (Trả về bản sửa code Markdown)
                 │
                 └──> utils/config.py (Quản lý model, temperature, key)
```

## State Management
Hệ thống sử dụng transient state (trạng thái tạm thời) trong `st.session_state` để lưu trữ mã nguồn đã chọn và kết quả từ Agent, giúp giao diện phản hồi mượt mà không cần database cồng kềnh.

## Workflow Flow
1. **Duyệt file**: User nhập đường dẫn thư mục địa phương.
2. **Chọn file**: File được đọc và hiển thị nội dung Python.
3. **Phân tích (Review)**: Agent Reviewer gán lỗi (JSON schema strict) từ model Gemini.
4. **Sửa lỗi (Repair)**: Agent Repairer lấy lỗi nghiêm trọng nhất để tái tạo lại toàn bộ file code sạch.

## Technology Stack
- **Frontend/Backend**: Streamlit (Python)
- **AI Core**: Google GenAI API (`gemini-2.5-flash`)
- **Quản lý cấu hình**: Python-dotenv (.env)
