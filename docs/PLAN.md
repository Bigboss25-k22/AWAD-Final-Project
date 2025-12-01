# Gmail Email Client - Implementation Plan

## Current Implementation Analysis

### Done (Working)

- Basic login/register with email+password
- JWT token generation and refresh endpoint
- Google Sign-In (using implicit ID Token flow - **needs fix**)
- 3-column responsive inbox UI
- Email list with checkboxes, star, search
- Basic email detail panel
- Backend API endpoints using **MOCK data**

### Critical Issues to Fix

| Issue           | Current                | Required                     |
| --------------- | ---------------------- | ---------------------------- |
| Google OAuth2   | ID Token implicit flow | Authorization Code flow      |
| Gmail API       | Mock data              | Real Gmail API proxy         |
| Token storage   | Redux (in-memory)      | HttpOnly Secure Cookie       |
| Logout          | Not implemented        | Revoke tokens, clear cookies |
| API concurrency | Basic 401 retry        | Refresh lock with queue      |

---

## Phase 1: Google OAuth2 + HttpOnly Cookies

### 1.1 [BE] Database Schema Update

- Add fields: `googleAccessToken`, `googleRefreshToken`, `googleTokenExpiry`
- Technology: Prisma migration

### 1.2 [BE] Install Dependencies

- Package: `googleapis`, `crypto-js`, `cookie-parser`

### 1.3 [BE] Create Encryption Service

- File: `infrastructure/services/encryption.service.ts`
- Purpose: AES encrypt/decrypt Google tokens

### 1.4 [BE] Create Google OAuth2 Use Case

- File: `application/use-cases/auth/google-oauth.use-case.ts`
- Purpose: Generate consent URL, exchange code for tokens, store encrypted refresh token
- Technology: `googleapis` OAuth2Client

### 1.5 [BE] Update Auth Controller with HttpOnly Cookies

- Add endpoints: `GET /auth/google/url`, `POST /auth/google/callback`, `POST /auth/logout`
- Set refresh token as HttpOnly, Secure, SameSite cookie
- Return access token in response body (short-lived)

### 1.6 [BE] Update Refresh Token Endpoint

- Read refresh token from HttpOnly cookie (not request body)
- Return new access token in response body
- Set new refresh token cookie

### 1.7 [FE] Create OAuth Callback Page

- File: `app/auth/google/callback/page.tsx`
- Purpose: Handle redirect, send code to backend, store access token in memory

### 1.8 [FE] Update Login Page

- Remove `@react-oauth/google` component
- Add redirect button to consent URL

### Phase 1 Testing

- [ ] Google consent screen redirects correctly
- [ ] Callback exchanges code and sets HttpOnly cookie
- [ ] Access token stored in memory only
- [ ] Refresh token NOT accessible via JavaScript
- [ ] Logout clears HttpOnly cookie

---

## Phase 2: Gmail API Integration

### 2.1 [BE] Create Gmail Service

- File: `infrastructure/services/gmail.service.ts`
- Purpose: Gmail API client with auto token refresh
- Methods: listLabels, listMessages, getMessage, sendMessage, modifyMessage, getAttachment

### 2.2 [BE] Create Email Parser Utility

- File: `infrastructure/utils/email-parser.util.ts`
- Purpose: Parse MIME messages, extract HTML/plain text, attachments

### 2.3 [BE] Create Gmail Repository

- File: `infrastructure/repositories/gmail-email.repository.impl.ts`
- Purpose: Replace MockEmailRepository with real Gmail data

### 2.4 [BE] Update Email Controller

- Add endpoints: `POST /mail/emails/send`, `POST /mail/emails/:id/reply`, `POST /mail/emails/:id/modify`, `GET /mail/attachments/:messageId/:attachmentId`
- Add pagination support with pageToken

### 2.5 [BE] Update Module Wiring

- Register GmailService, EncryptionService
- Replace MockEmailRepository with GmailEmailRepository

### Phase 2 Testing

- [ ] Mailboxes endpoint returns real Gmail labels
- [ ] Emails endpoint returns real emails with pagination
- [ ] Email detail returns full body and attachments
- [ ] Send email works (verify in Gmail Sent)
- [ ] Modify email (star, delete, mark read) works
- [ ] Token auto-refresh works after expiry

---

## Phase 3: Token Refresh Concurrency Guard

### 3.1 [FE] Update API Client

- File: `services/apis/apiClient.ts`
- Purpose: Implement refresh lock, queue failed requests during refresh
- Refresh endpoint reads cookie automatically (credentials: include)

### 3.2 [FE] Update Auth State

- Store access token in memory only (not Redux persist)
- No refresh token in frontend

### Phase 3 Testing

- [ ] Single refresh when multiple 401s occur
- [ ] All queued requests retry after refresh
- [ ] Redirect to login on refresh failure

---

## Phase 4: UI Enhancements

### 4.1 [FE] Update Email Detail Panel

- File: `components/EmailDetailPanel.tsx`
- Changes: Display real body (HTML in iframe), headers, attachment downloads

### 4.2 [FE] Create Compose Modal

- File: `components/ComposeModal.tsx`
- Features: To/Cc/Bcc fields, subject, body, attachment upload, send

### 4.3 [FE] Wire Email Actions

- Files: EmailListPanel.tsx, EmailDetailPanel.tsx, useInbox.ts
- Actions: Star/unstar, mark read/unread, delete, reply, forward

### 4.4 [FE] Implement Keyboard Navigation

- File: `hooks/useKeyboardNavigation.ts`
- Keys: Arrow up/down, Enter, Delete, Escape

### 4.5 [FE] Implement Pagination

- File: `hooks/useInbox.ts`
- Features: Cursor-based pagination, "Load More" button

### Phase 4 Testing

- [ ] Email detail shows real content and attachments
- [ ] Compose sends email successfully
- [ ] Reply/Forward pre-fills correctly
- [ ] All email actions work (star, delete, read)
- [ ] Keyboard navigation works
- [ ] Pagination loads more emails

---

## Phase 5: Stretch Goals

### 5.1 [BE+FE] Gmail Push Notifications

- Backend: Pub/Sub webhook, WebSocket gateway
- Frontend: WebSocket client for real-time updates

### 5.2 [FE] Multi-tab Logout Sync

- File: `services/auth/broadcastChannel.ts`
- Purpose: Sync logout across browser tabs

### 5.3 [FE] Offline Caching

- File: `services/cache/emailCache.ts`
- Purpose: Cache emails for offline access

### Phase 5 Testing

- [ ] Push notifications work in real-time
- [ ] Multi-tab logout syncs correctly
- [ ] Offline mode shows cached emails

---

## Security Checklist

- [ ] Google refresh token encrypted in database
- [ ] App refresh token in HttpOnly Secure SameSite cookie
- [ ] Access token in memory only (not localStorage/Redux persist)
- [ ] Frontend never stores Google tokens
- [ ] CORS restricted to frontend domain with credentials
- [ ] Token revocation on logout
- [ ] CSRF protection (SameSite=Strict or CSRF token)

---

## Key Files Summary

| Purpose       | Backend                    | Frontend                        |
| ------------- | -------------------------- | ------------------------------- |
| OAuth2        | `google-oauth.use-case.ts` | `auth/google/callback/page.tsx` |
| Gmail API     | `gmail.service.ts`         | -                               |
| Email Parsing | `email-parser.util.ts`     | -                               |
| Endpoints     | `email.controller.ts`      | -                               |
| API Client    | -                          | `apiClient.ts`                  |
| Compose       | -                          | `ComposeModal.tsx`              |
| Actions       | -                          | `useInbox.ts`                   |
| Keyboard      | -                          | `useKeyboardNavigation.ts`      |
| Real-time     | `notifications.gateway.ts` | `notificationSocket.ts`         |
| Offline       | -                          | `emailCache.ts`                 |
