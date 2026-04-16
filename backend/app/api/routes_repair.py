# backend/app/api/routes_repair.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas.repair import RepairRequest, RepairResponse
from app.services.repair_service import process_code_repair, stream_process_code_repair

router = APIRouter()

@router.post("/repair", response_model=RepairResponse)
async def fix_code(request: RepairRequest):
    """
    API Endpoint: Nhận mã nguồn gốc và danh sách lỗi, trả về mã nguồn đã sửa.
    """
    try:
        # SỬ DỤNG request.language
        result = await process_code_repair(request.source_code, request.review_issues, request.language)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=500, detail=result.get("explanation"))
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi Server: {str(e)}")
    
    
# --- ROUTE CHO STREAMING ---
@router.post("/repair/stream")
async def fix_code_stream(request: RepairRequest):
    """
    API Endpoint: Stream mã nguồn sửa lỗi trả về UI theo thời gian thực.
    """
    return StreamingResponse(
        stream_process_code_repair(request.source_code, request.review_issues, request.language),
        media_type="text/event-stream"
    )