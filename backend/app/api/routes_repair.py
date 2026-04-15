# backend/app/api/routes_repair.py

from fastapi import APIRouter, HTTPException
from app.schemas.repair import RepairRequest, RepairResponse
from app.services.repair_service import process_code_repair

router = APIRouter()

@router.post("/repair", response_model=RepairResponse)
async def fix_code(request: RepairRequest):
    """
    API Endpoint: Nhận mã nguồn gốc và danh sách lỗi, trả về mã nguồn đã sửa.
    """
    try:
        # Giao việc cho Service Layer. 
        # (Giả định mặc định là python, nếu muốn bạn có thể thêm 'language' vào schema RepairRequest)
        result = process_code_repair(request.source_code, request.review_issues, language="python")
        
        if result.get("status") == "error":
            raise HTTPException(status_code=500, detail=result.get("explanation"))
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi Server: {str(e)}")