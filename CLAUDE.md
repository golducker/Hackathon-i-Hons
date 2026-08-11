# Hackathon Chat Demo

FastAPI backend (Gemini API) + Vite/React frontend. Repo: golducker/Hackathon-i-Hons, branch `main`.

## Cấu trúc
- `backend/` — FastAPI, `main.py` là gốc, app tên `app`
  - `GET /` → `{"status":"ok"}`
  - `POST /api/chat` nhận `{"message":...}`, gọi Gemini qua `google-genai`, trả `{"reply":...}`, lỗi Gemini trả HTTP 502 (không crash)
  - Model đang dùng: `gemini-flash-latest` — KHÔNG dùng `gemini-2.5-flash`, key hiện tại bị lỗi 404 "no longer available to new users" với model đó
  - `.env` cần `GEMINI_API_KEY` (không commit, tự điền tay mỗi máy)
  - venv riêng theo từng máy, không commit
- `frontend/` — Vite + React
  - `App.jsx`: input + nút Gửi + hiển thị reply, có loading/error state
  - Gọi API qua `VITE_API_URL` (từ `.env`) + endpoint `/api/chat`
  - `.env` cần `VITE_API_URL` (local: `http://localhost:8000`, không commit)
  - `node_modules/` không commit, cần `npm install` mỗi máy

## Chạy local
```
cd backend && ./venv/Scripts/python.exe -m uvicorn main:app --reload --port 8000
cd frontend && npm run dev
```

## Quy tắc cho Claude khi sửa code
- Sau mỗi lần sửa code hoặc thêm tính năng mới, đảm bảo backend (port 8000) và frontend (port 5173) đang chạy (khởi động lại nếu cần — backend đổi code phải restart nếu không chạy `--reload`), rồi tự động trả ra link `http://localhost:5173` để user test ngay, không cần user phải hỏi lại.

## Deploy (Vercel)
- 2 project Vercel trỏ vào repo này: `hackathon-i-hons` và `hackathon-i-hons-msop`.
- Git Integration đã bật → push lên `main` tự deploy.
- Biến môi trường production (`VITE_API_URL`, `GEMINI_API_KEY`) cấu hình riêng trong Vercel Dashboard của từng project, không dùng file `.env` local.

## Multi-machine workflow
- Làm việc trên 2 máy: desktop (nhà, VS Code) + laptop (mang đi thi, Antigravity).
- Rời máy nào → `git push` trước. Ngồi máy khác → `git pull` trước khi sửa.
- `.env`, `venv/`, `node_modules/` không sync qua git — mỗi máy tự cài/điền lại 1 lần.

## Ngày thi
- Đưa giám khảo URL Production Vercel (không có hash lạ trong domain), không đưa URL Preview.
- Không push code sát giờ thi (tránh bản đang build dở).
- Backend serverless có thể cold-start chậm vài giây ở lần gọi đầu — gọi thử trước khi demo.
