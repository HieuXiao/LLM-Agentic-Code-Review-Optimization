# app/services/review_service.py

import logging
from app.agents.agent_review import ReviewAgent

logger = logging.getLogger(__name__)

async def process_code_review(source_code: str, language: str) -> dict:
    logger.info(f"Bắt đầu Review Code (Ngôn ngữ: {language})...")
    try:
        agent = ReviewAgent()
        review_results = await agent.review(source_code, language)
        
        logger.info(f"Review hoàn tất. Phát hiện {len(review_results)} lỗi.")
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