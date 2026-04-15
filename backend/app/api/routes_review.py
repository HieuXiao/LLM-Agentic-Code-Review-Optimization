# backend/app/api/routes_review.py

from fastapi import APIRouter, HTTPException
from app.schemas.review import ReviewRequest, ReviewResponse
from app.services.review_service import process_code_review

router = APIRouter()

@router.post("/review", response_model=ReviewResponse)
async def analyze_code(request: ReviewRequest):
    """
    API Endpoint: Nhận mã nguồn từ Frontend và trả về kết quả phân tích lỗi.
    """
    try:
        # THÊM 'await' Ở DÒNG NÀY:
        result = await process_code_review(request.source_code, request.language)
        
        # Nếu service báo lỗi, ném lỗi HTTP 500
        if result.get("status") == "error":
            raise HTTPException(status_code=500, detail=result.get("error_message"))
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi Server: {str(e)}")