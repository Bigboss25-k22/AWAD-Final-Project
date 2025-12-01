# Fullstack Base Tasks - Gmail Email Client

## Role: Fullstack Developer (Team Lead)

**Mục tiêu**: Xây dựng foundation với HttpOnly Cookies để BE và FE có thể làm việc độc lập.

---

## Priority 1: OAuth2 + HttpOnly Cookies (Làm TRƯỚC TIÊN)

### Task 1.1: Database Schema Update

**File**: `backend/prisma/schema.prisma`

Thêm fields vào User model:

- googleAccessToken: String? (encrypted)
- googleRefreshToken: String? (encrypted)
- googleTokenExpiry: DateTime?

**Deliverable**: Migration file, updated schema

---

### Task 1.2: Install Dependencies

**Backend**:

```bash
npm install googleapis crypto-js cookie-parser
npm install -D @types/crypto-js @types/cookie-parser
```

**Deliverable**: Updated package.json

---

### Task 1.3: Create Encryption Service

**File**: `backend/src/infrastructure/services/encryption.service.ts`

**Purpose**: AES encrypt/decrypt Google tokens trước khi lưu DB

**Deliverable**: Working encryption service

---

### Task 1.4: Create Google OAuth2 Use Case

**File**: `backend/src/application/use-cases/auth/google-oauth.use-case.ts`

**Methods**:

1. `getConsentUrl()`: Generate Google OAuth consent URL with scopes
2. `exchangeCode(code: string)`: Exchange auth code for tokens
3. `revokeTokens(userId: string)`: Revoke Google tokens on logout

**Scopes cần request**:

- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.modify`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/gmail.labels`
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`

**Deliverable**: OAuth use case with token storage

---

### Task 1.5: Update Auth Controller with HttpOnly Cookies

**File**: `backend/src/presentation/controllers/auth.controller.ts`

**New Endpoints**:
| Method | Path | Purpose |
|--------|------|---------|
| GET | /auth/google/url | Return consent URL |
| POST | /auth/google/callback | Exchange code, set HttpOnly cookie, return access token |
| POST | /auth/logout | Clear HttpOnly cookie, revoke tokens |

**Cookie Settings**:

- httpOnly: true
- secure: true (production)
- sameSite: 'strict'
- path: '/'
- maxAge: 7 days

**Deliverable**: Working endpoints with HttpOnly cookies

---

### Task 1.6: Update Refresh Token Endpoint

**File**: `backend/src/presentation/controllers/auth.controller.ts`

**Changes**:

- Read refresh token từ cookie thay vì request body
- Return new access token trong response body
- Set new refresh token cookie

**Deliverable**: Refresh endpoint using cookies

---

### Task 1.7: Setup Cookie Parser Middleware

**File**: `backend/src/main.ts`

**Changes**:

- Add `app.use(cookieParser())`
- Update CORS: `credentials: true`

**Deliverable**: Cookie parser configured

---

### Task 1.8: Create OAuth Callback Page (FE)

**File**: `frontend/src/app/auth/google/callback/page.tsx`

**Flow**:

1. Extract `code` from URL params
2. POST to `/auth/google/callback` with `credentials: 'include'`
3. Store access token in memory (Redux - not persisted)
4. Redirect to `/inbox`

**Deliverable**: Callback page handling OAuth redirect

---

### Task 1.9: Update Login Page (FE)

**File**: `frontend/src/features/login/LoginPage.tsx`

**Changes**:

1. Remove `@react-oauth/google` component
2. Add button "Login with Google"
3. onClick: fetch `/auth/google/url` then `window.location.href = url`

**Deliverable**: Updated login with redirect flow

---

### Task 1.10: Update API Client for Cookies

**File**: `frontend/src/services/apis/apiClient.ts`

**Changes**:

- Add `withCredentials: true` to axios config
- Update refresh call to NOT send token in body

**Deliverable**: API client with cookie support

---

## Priority 2: Gmail Service Foundation

### Task 2.1: Create Basic Gmail Service

**File**: `backend/src/infrastructure/services/gmail.service.ts`

**Purpose**: Initialize Gmail API client with user tokens

**Deliverable**: Gmail service skeleton with token refresh logic

---

## Priority 3: Integration Testing

### Task 3.1: Test OAuth + Cookie Flow End-to-End

**Checklist**:

- [ ] Login button redirects to Google consent
- [ ] After consent, redirected to callback page
- [ ] Callback sets HttpOnly cookie (verify in DevTools > Application > Cookies)
- [ ] Access token stored in Redux (NOT in localStorage)
- [ ] Refresh token NOT visible in JavaScript (`document.cookie`)
- [ ] User redirected to /inbox
- [ ] Logout clears HttpOnly cookie

---

## Priority 4: Token Refresh Concurrency

### Task 4.1: Update API Client Concurrency

**File**: `frontend/src/services/apis/apiClient.ts`

**Implement**:

1. `isRefreshing` flag
2. `failedQueue` array
3. On 401: if refreshing, queue request; else refresh then retry all
4. Refresh call includes credentials (cookie sent automatically)

**Deliverable**: API client with concurrency guard

---

## Environment Variables Needed

**Backend (.env)**:

```
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
ENCRYPTION_KEY=32-char-random-string
COOKIE_SECRET=another-random-string
```

**Frontend (.env.local)**:

```
NEXT_PUBLIC_API_END_POINT=http://localhost:3001
```

---

## Handoff Points

### Sau khi hoàn thành Priority 1:

- **BE Developer** có thể bắt đầu: Gmail Service methods, Email Parser, Gmail Repository
- **FE Developer** có thể bắt đầu: Email Detail Panel, Compose Modal, Email Actions

### Sau khi hoàn thành Priority 2:

- **BE Developer** tiếp tục: Update Email Controller với real data
- **FE Developer** tiếp tục: Pagination, Keyboard Navigation

---

## Timeline Estimate

| Task                          | Time         |
| ----------------------------- | ------------ |
| Priority 1 (OAuth2 + Cookies) | 3-4 days     |
| Priority 2 (Gmail Service)    | 1 day        |
| Priority 3 (Testing)          | 0.5 day      |
| Priority 4 (Concurrency)      | 1 day        |
| **Total**                     | **5-6 days** |
