# AWAD-Final-Project

## Tổng quan

Đây là dự án cuối kỳ (AWAD Final Project) gồm backend (NestJS) và frontend. Mục tiêu: cung cấp một ứng dụng web hoàn chỉnh với cấu trúc module hóa cho authentication và business logic.

Nội dung README này bao gồm mô tả dự án, cấu trúc thư mục, hướng dẫn cài đặt, chạy, test và các biến môi trường cần thiết để phát triển và triển khai.

---

## Kiến trúc & Công nghệ

- Backend: NestJS (TypeScript)
- Frontend: (thư mục `frontend/` có trong repo) — framework không được chỉ rõ trong repo hiện tại; giả định là React/Vue/Angular tùy cấu trúc dự án frontend.
- Test: Jest (backend)
- Lint & format: ESLint, Prettier

---

## Cấu trúc thư mục (tổng quan)

- `backend/` - mã nguồn backend NestJS
  - `src/` - mã nguồn TypeScript
    - `app.module.ts`, `main.ts` và module `auth/` (application, domain, infrastructure, presentation)
  - `package.json` - script và dependencies
  - `tsconfig.json`, `tsconfig.build.json` - cấu hình TypeScript
  - `nest-cli.json` - cấu hình Nest
- `frontend/` - mã nguồn frontend (nội dung có thể khác tuỳ frontend framework)
- `docs/` - tài liệu (nếu có)

> Ghi chú: README này viết dựa trên cấu trúc hiện có trong repo; nếu có thêm thư mục con hoặc dịch vụ (ví dụ: database, microservice), hãy bổ sung phần tương ứng.

---

## Yêu cầu môi trường (Prerequisites)

- Node.js (khuyến nghị LTS, ví dụ Node 18+ hoặc Node 20+) và npm/yarn/pnpm
- Git
- Nếu sử dụng DB: PostgreSQL / MySQL / MongoDB tuỳ dự án (cài đặt & cấu hình bên ngoài)

---

## Backend — Hướng dẫn nhanh (NestJS)

Đường dẫn: `backend/`

Các script chính (dựa trên `backend/package.json`):

- `npm run start` — chạy ứng dụng (production/dev theo cấu hình Nest)
- `npm run start:dev` — chạy ứng dụng ở chế độ phát triển với hot-reload
- `npm run start:debug` — chạy với debug flags
- `npm run build` — build TypeScript (tạo thư mục `dist`)
- `npm run start:prod` — chạy bản build production (`node dist/main`)
- `npm run lint` — chạy ESLint và tự sửa lỗi có thể
- `npm run format` — chạy Prettier để format code
- `npm run test` — chạy unit tests (Jest)
- `npm run test:e2e` — chạy e2e tests (nếu có)

Cài đặt & chạy backend:

```powershell
# chuyển vào thư mục backend
cd backend
# cài dependencies
npm install
# chạy ở chế độ dev
npm run start:dev
```

Build & chạy production:

```powershell
cd backend
npm install --production
npm run build
npm run start:prod
```

---

## Frontend — Hướng dẫn nhanh

Đường dẫn: `frontend/`

(Do repo hiện tại không cung cấp `frontend/package.json` nội dung chi tiết, hướng dẫn tổng quát như sau:)

```powershell
cd frontend
# nếu dùng npm
npm install
npm run dev          # hoặc npm start, tuỳ template/framework
npm run build
```

Gợi ý: mở file `frontend/package.json` để lấy các script chính (`start`, `dev`, `build`). Nếu bạn cần, tôi có thể tạo README chi tiết cho frontend sau khi xem `frontend/package.json`.

---

## Biến môi trường (Environment variables)

Tùy ứng dụng, các biến phổ biến (ví dụ) như:

- `NODE_ENV` — `development` | `production`
- `PORT` — cổng ứng dụng backend (mặc định Nest thường là `3000`)
- `DATABASE_URL` hoặc `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `JWT_SECRET` — secret cho JWT
- `JWT_EXPIRES_IN` — thời gian hết hạn token

Ghi chú: hiện repo backend không chứa file `.env.example` hay `.env` mẫu. Khuyến nghị tạo file `.env.example` ở `backend/` với các biến cần thiết và mô tả ngắn.

Ví dụ mẫu `.env.example`:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
JWT_SECRET=changeme
JWT_EXPIRES_IN=3600s
```

---

## Test

Backend dùng Jest. Một vài lệnh:

```powershell
# chạy unit tests
cd backend
npm run test
# chạy coverage
npm run test:cov
# chạy e2e (nếu có)
npm run test:e2e
```

---

## Lint & Format

```powershell
cd backend
npm run lint
npm run format
```

---

## Quy trình phát triển & đóng góp

- Luôn tạo branch mới cho mỗi feature hoặc bugfix: `git checkout -b feat/ten-feature` hoặc `fix/ten-bug`
- Chạy lint và tests trước khi push
- Viết unit tests cho logic quan trọng
- Dùng PR để review code

---

## Triển khai (Deployment)

Các bước cơ bản:

1. Thiết lập server (Linux/VPS) với Node.js và phụ thuộc
2. Thiết lập biến môi trường trên server
3. Tại server, pull code, cài dependencies, build và chạy

Ví dụ tối giản (server shell):

```bash
# trên server
git clone <repo>
cd repo/backend
npm ci --production
npm run build
npm run start:prod
```

Sử dụng process manager như PM2 hoặc hệ thống container (Docker) để quản lý tiến trình.

---

## Notes & Assumptions

- Tôi đã đọc `backend/package.json` để điền các script chính cho phần Backend.
- Frontend không có `package.json` trong chỗ tôi đọc, nên phần frontend để dạng hướng dẫn tổng quát. Nếu bạn muốn README frontend chi tiết, hãy cung cấp `frontend/package.json` hoặc cho phép tôi mở file đó.
- Không thấy file `.env.example` hay tài liệu DB trong repo — khuyến nghị thêm vào `backend/` để dễ bắt đầu cho người mới.

---

## Các bước tiếp theo (gợi ý)

- Thêm `backend/.env.example` với các biến môi trường thực tế.
- Thêm mô tả API (OpenAPI/Swagger) hoặc link tới API docs nếu có.
- Bổ sung README chi tiết cho `frontend/` sau khi xác thực framework và `package.json`.

---

## Liên hệ

Nếu bạn muốn, tôi có thể:

- Bổ sung README tiếng Anh phiên bản song song.
- Tạo file `backend/.env.example` tự động.
- Mở và đọc `frontend/package.json` rồi cập nhật phần Frontend trong README.

Hãy cho tôi biết muốn thêm mục nào nữa.
