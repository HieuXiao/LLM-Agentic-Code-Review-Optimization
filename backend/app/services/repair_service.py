# app/services/repair_service.py

import logging
from app.agents.agent_repair import RepairAgent

logger = logging.getLogger(__name__)

def process_code_repair(source_code: str, review_issues: list, language: str) -> dict:
    """Service xử lý Sửa lỗi mã (Repair) dựa trên kết quả Review."""
    try:
        if not review_issues:
            return {"status": "error", "repaired_code": "", "explanation": "Không có lỗi nào để sửa."}

        # Dựa theo logic cũ của bạn: Chỉ lấy lỗi đầu tiên để sửa
        first_issue = review_issues[0]
        issue_desc = f"Issue: {first_issue.get('description')} at line {first_issue.get('line')}."

        agent = RepairAgent()
        repaired_code = agent.repair(source_code, issue_desc, language)
        
        if repaired_code:
            return {
                "status": "success",
                "repaired_code": repaired_code,
                "explanation": "Đã tạo bản sửa lỗi thành công."
            }
        else:
            return {
                "status": "error",
                "repaired_code": "",
                "explanation": "Agent không thể tạo ra code sửa lỗi."
            }
    except Exception as e:
        logger.error(f"Lỗi Repair: {e}")
        return {
            "status": "error",
            "repaired_code": "",
            "explanation": str(e)
        }