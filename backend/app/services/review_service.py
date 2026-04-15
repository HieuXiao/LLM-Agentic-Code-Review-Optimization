# app/services/review_service.py

import logging
from app.agents.agent_review import ReviewAgent

logger = logging.getLogger(__name__)

def process_code_review(source_code: str, language: str) -> dict:
    """Service xử lý Phân tích mã (Review)."""
    try:
        agent = ReviewAgent()
        review_results = agent.review(source_code, language)
        
        return {
            "status": "success",
            "issues_found": len(review_results) if isinstance(review_results, list) else 0,
            "review_result": review_results,
            "error_message": None
        }
    except Exception as e:
        logger.error(f"Lỗi Review: {e}")
        return {
            "status": "error",
            "issues_found": 0,
            "review_result": [],
            "error_message": str(e)
        }