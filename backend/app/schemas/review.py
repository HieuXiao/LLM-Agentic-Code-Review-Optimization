# backend\app\schemas\review.py

from pydantic import BaseModel, Field
from typing import Any, Optional

class ReviewRequest(BaseModel):
    source_code: str = Field(..., description="Đoạn mã nguồn cần được AI phân tích.")
    language: str = Field(default="python", description="Ngôn ngữ lập trình của mã nguồn.")

class ReviewResponse(BaseModel):
    status: str = Field(..., description="Trạng thái phân tích (VD: success, error).")
    issues_found: int = Field(default=0, description="Tổng số lỗi phát hiện được.")
    review_result: Any = Field(..., description="Kết quả phân tích chi tiết từ Agent.")
    error_message: Optional[str] = Field(default=None, description="Thông báo lỗi nếu có.")