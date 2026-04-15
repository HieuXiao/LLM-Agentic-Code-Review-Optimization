# backend/app/core/logging_config.py

import logging
import sys

def setup_logging():
    """Thiết lập cấu hình logging để ghi ra file và hiển thị trên terminal"""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.FileHandler("app.log", encoding="utf-8"), # Ghi vào file
            logging.StreamHandler(sys.stdout)                 # In ra Terminal
        ]
    )