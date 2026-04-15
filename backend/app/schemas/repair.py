# backend\app\schemas\repair.py

from pydantic import BaseModel, Field
from typing import Any, Optional

class RepairRequest(BaseModel):
    source_code: str = Field(..., description="Đoạn mã nguồn gốc cần sửa.")
    review_issues: Any = Field(..., description="Kết quả lỗi từ bước Review để Agent dựa vào đó sửa.")

class RepairResponse(BaseModel):
    status: str = Field(..., description="Trạng thái sửa lỗi (VD: success, error).")
    repaired_code: str = Field(..., description="Mã nguồn mới đã được AI sửa lỗi và tối ưu.")
    explanation: Optional[str] = Field(default=None, description="Giải thích của AI về những gì đã sửa.")