# Phân Công Công Việc - Gmail Email Client

## Thành Viên

| Tên    | Role               | Ghi chú |
| ------ | ------------------ | ------- |
| [Minh] | Fullstack          |         |
| [Nam]  | Backend Developer  |         |
| [Lĩnh] | Frontend Developer |         |

---

## FULLSTACK - [Minh]

### Phase 1: OAuth2 + HttpOnly Cookies (Base - Làm trước)

| ID    | Task                                              | Status |
| ----- | ------------------------------------------------- | ------ |
| FS-1  | Database Schema Update - thêm Google token fields | [ ]    |
| FS-2  | Install googleapis, crypto-js, cookie-parser      | [ ]    |
| FS-3  | Create Encryption Service                         | [ ]    |
| FS-4  | Create Google OAuth2 Use Case                     | [ ]    |
| FS-5  | Update Auth Controller với HttpOnly Cookies       | [ ]    |
| FS-6  | Update Refresh Token Endpoint (read from cookie)  | [ ]    |
| FS-7  | Setup Cookie Parser Middleware                    | [ ]    |
| FS-8  | Create OAuth Callback Page (FE)                   | [ ]    |
| FS-9  | Update Login Page - redirect flow                 | [ ]    |
| FS-10 | Update API Client - withCredentials: true         | [ ]    |
| FS-11 | Create Gmail Service skeleton                     | [ ]    |

### Phase 3: Integration & Polish

| ID    | Task                            | Deadline | Status |
| ----- | ------------------------------- | -------- | ------ |
| FS-12 | API Client Concurrency Guard    |          | [ ]    |
| FS-13 | End-to-End Testing toàn bộ flow |          | [ ]    |
| FS-14 | Fix bugs từ BE và FE            |          | [ ]    |
| FS-15 | Deploy Backend (Railway/Render) |          | [ ]    |
| FS-16 | Deploy Frontend (Vercel)        |          | [ ]    |
| FS-17 | Viết README setup guide         |          | [ ]    |

### Stretch (Nếu còn thời gian)

| ID    | Task                  | Status |
| ----- | --------------------- | ------ |
| FS-S1 | Multi-tab Logout Sync | [ ]    |

---

## BACKEND - [Nam]

> **WAIT**: Bắt đầu sau khi Fullstack hoàn thành FS-1 đến FS-7

### Main Tasks

| ID    | Task                                                 | Deadline | Status |
| ----- | ---------------------------------------------------- | -------- | ------ |
| BE-1  | Implement Gmail Service - listLabels                 |          | [ ]    |
| BE-2  | Implement Gmail Service - listMessages               |          | [ ]    |
| BE-3  | Implement Gmail Service - getMessage                 |          | [ ]    |
| BE-4  | Implement Gmail Service - sendMessage                |          | [ ]    |
| BE-5  | Implement Gmail Service - modifyMessage              |          | [ ]    |
| BE-6  | Implement Gmail Service - getAttachment              |          | [ ]    |
| BE-7  | Create Email Parser Utility                          |          | [ ]    |
| BE-8  | Create Gmail Repository (thay MockEmailRepository)   |          | [ ]    |
| BE-9  | Update Email Controller - GET /mailboxes (real data) |          | [ ]    |
| BE-10 | Update Email Controller - GET /mailboxes/:id/emails  |          | [ ]    |
| BE-11 | Update Email Controller - GET /emails/:id            |          | [ ]    |
| BE-12 | Add endpoint POST /emails/send                       |          | [ ]    |
| BE-13 | Add endpoint POST /emails/:id/reply                  |          | [ ]    |
| BE-14 | Add endpoint POST /emails/:id/modify                 |          | [ ]    |
| BE-15 | Add endpoint GET /attachments/:msgId/:attId          |          | [ ]    |
| BE-16 | Update Module Wiring                                 |          | [ ]    |
| BE-17 | Update Swagger docs                                  |          | [ ]    |

### Stretch (Nếu còn thời gian)

| ID    | Task                               | Status |
| ----- | ---------------------------------- | ------ |
| BE-S1 | Gmail Push Notifications (Pub/Sub) | [ ]    |

---

## FRONTEND - [Lĩnh]

> **WAIT**: Bắt đầu sau khi Fullstack hoàn thành FS-8 đến FS-10

### Main Tasks

| ID    | Task                                                          | Deadline | Status |
| ----- | ------------------------------------------------------------- | -------- | ------ |
| FE-1  | Update IMailbox interface                                     |          | [ ]    |
| FE-2  | Update IEmail interface (thêm body, attachments)              |          | [ ]    |
| FE-3  | Update EmailDetailPanel - hiển thị HTML content               |          | [ ]    |
| FE-4  | Update EmailDetailPanel - hiển thị attachments                |          | [ ]    |
| FE-5  | Update EmailDetailPanel - download attachment                 |          | [ ]    |
| FE-6  | Update EmailDetailPanel - action buttons (star, delete, read) |          | [ ]    |
| FE-7  | Create ComposeModal component                                 |          | [ ]    |
| FE-8  | ComposeModal - To/Cc/Bcc fields                               |          | [ ]    |
| FE-9  | ComposeModal - attachment upload                              |          | [ ]    |
| FE-10 | ComposeModal - send email                                     |          | [ ]    |
| FE-11 | Create ReplyPanel component                                   |          | [ ]    |
| FE-12 | Wire useStarEmail mutation                                    |          | [ ]    |
| FE-13 | Wire useMarkRead mutation                                     |          | [ ]    |
| FE-14 | Wire useDeleteEmail mutation                                  |          | [ ]    |
| FE-15 | Wire useSendEmail mutation                                    |          | [ ]    |
| FE-16 | Wire useReplyEmail mutation                                   |          | [ ]    |
| FE-17 | Implement Keyboard Navigation hook                            |          | [ ]    |
| FE-18 | Implement Pagination với useInfiniteQuery                     |          | [ ]    |
| FE-19 | Update Sidebar - hiển thị unread count                        |          | [ ]    |

### Stretch (Nếu còn thời gian)

| ID    | Task                          | Status |
| ----- | ----------------------------- | ------ |
| FE-S1 | Real-time Updates (WebSocket) | [ ]    |
| FE-S2 | Offline Caching (IndexedDB)   | [ ]    |

---

## Timeline

| Tuần | Fullstack           | Backend       | Frontend      |
| ---- | ------------------- | ------------- | ------------- |
| 1    | FS-1 → FS-11 (Base) | -             | -             |
| 2    | FS-12               | BE-1 → BE-11  | FE-1 → FE-11  |
| 3    | FS-13, FS-14        | BE-12 → BE-17 | FE-12 → FE-19 |
| 4    | FS-15 → FS-17       | Bug fixes     | Bug fixes     |

---

## Sync Points

- **Mỗi ngày**: Báo cáo progress, blockers
- **FS xong FS-11**: Notify BE và FE để bắt đầu
- **BE xong BE-11**: Notify FE để test real data
- **FE xong FE-10**: Notify BE để test send email
- **Trước deploy**: Integration testing cả team

---

## HttpOnly Cookie Notes

### Backend cần làm:

- Set cookie với `httpOnly: true, secure: true, sameSite: 'strict'`
- CORS phải có `credentials: true`
- Refresh endpoint đọc token từ cookie, không từ body

### Frontend cần làm:

- Axios config: `withCredentials: true`
- KHÔNG lưu refresh token vào localStorage/Redux
- Access token chỉ lưu trong memory (Redux không persist)

### Testing:

- DevTools > Application > Cookies: thấy refresh token
- `console.log(document.cookie)`: KHÔNG thấy refresh token
- Network tab: cookie tự động gửi với mỗi request

---

## Definition of Done

Mỗi task phải:

- [ ] Code xong, không lỗi TypeScript
- [ ] Test manual thành công
- [ ] Commit với message rõ ràng
