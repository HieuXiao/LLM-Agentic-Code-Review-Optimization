# app/services/repair_service.py

import logging
import asyncio
import google.generativeai as genai
from app.agents.agent_repair import RepairAgent

logger = logging.getLogger(__name__)

async def process_code_repair(source_code: str, review_issues: list, language: str) -> dict:
    logger.info("Bắt đầu tiến trình Repair Code...")
    try:
        if not review_issues:
            return {"status": "error", "repaired_code": "", "explanation": "Không có lỗi nào để sửa."}

        # Chỉ lấy lỗi đầu tiên để sửa
        first_issue = review_issues[0]
        issue_desc = f"Issue: {first_issue.get('description')} at line {first_issue.get('line')}."

        agent = RepairAgent()
        repaired_code = await agent.repair(source_code, issue_desc, language)
        
        if repaired_code:
            logger.info("Tạo code sửa lỗi thành công.")
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
        
        
# --- HÀM CHO STREAMING ---
async def stream_process_code_repair(source_code: str, review_issues: list, language: str):
    logger.info(f"Bắt đầu tiến trình STREAM Repair Code cho ngôn ngữ: {language}...")
    if not review_issues:
        yield "data: Không có lỗi nào để sửa.\n\n"
        return

    try:
        first_issue = review_issues[0]
        issue_desc = f"Issue: {first_issue.get('description')} at line {first_issue.get('line')}."

        # CẬP NHẬT PROMPT: Động hóa theo biến language
        prompt = (
            f"Bạn là một chuyên gia về {language}. "
            f"Hãy sửa lỗi sau: {issue_desc}\n"
            f"Mã nguồn {language} gốc:\n{source_code}\n"
            f"Chỉ trả về mã {language} đã sửa hoàn chỉnh, không giải thích, không dùng markdown block (như ```)."
        )
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = await model.generate_content_async(prompt, stream=True)
        
        async for chunk in response:
            if chunk.text:
                safe_text = chunk.text.replace("\n", "\\n")
                yield f"data: {safe_text}\n\n"
                await asyncio.sleep(0.01) # Tạo độ trễ nhỏ để UI render mượt hơn
                
    except Exception as e:
        logger.error(f"Lỗi Stream Repair: {e}")
        error_msg = str(e).replace("\n", " ")
        yield f"data: [ERROR] {error_msg}\n\n"