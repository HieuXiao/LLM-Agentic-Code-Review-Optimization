# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# --- THÊM 2 DÒNG IMPORT NÀY ---
from app.api import routes_review, routes_repair
from app.core.logging_config import setup_logging

# Kích hoạt logging ngay khi server khởi động
setup_logging()

app = FastAPI(
    title="LLM Code Review API",
    description="API cho hệ thống phân tích và sửa lỗi mã nguồn sử dụng AI.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- THÊM 2 DÒNG ĐĂNG KÝ ROUTER NÀY ---
# Đăng ký các route với prefix là /api
app.include_router(routes_review.router, prefix="/api", tags=["Review"])
app.include_router(routes_repair.router, prefix="/api", tags=["Repair"])

@app.get("/")
async def root():
    return {"message": "Backend FastAPI đang chạy thành công!", "status": "OK"}