# WebRTC Classroom Signaling Server

Node.js backend for classroom signaling with roles: **admin**, **teacher**, and **student**.

## Features
- JWT login shell and role-based API protection.
- Socket.IO signaling for:
  - Teacher broadcast to all students.
  - Teacher ↔ student direct signaling.
  - Class chat messages.
- PeerJS endpoint at `/peerjs` for WebRTC peer broker support.
- MySQL schema for users/classes/enrollments/sessions/chat.
- **Class secret join code** flow:
  - Teacher creates class and gets join code.
  - Student joins class by code.
- Runtime feature controls (`video`, `chat`, `whiteboard`).

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Create database schema:
   ```bash
   mysql -u root -p webrtc_school < sql/schema.sql
   ```
4. Run server:
   ```bash
   npm run dev
   ```

## API Overview
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/PUT /api/admin/features` (admin)
- `POST /api/teacher/classes` (teacher create class with join code)
- `POST /api/teacher/classes/:classId/sessions/start` (teacher)
- `POST /api/student/classes/join-by-code` (student uses class code)
- `GET /api/student/classes` (student)

### Join-by-code payload
```json
{
  "code": "ABCD2345"
}
```

## Realtime Events
- `class:join`
- `teacher:signal:all`
- `teacher:signal:student`
- `student:signal:teacher`
- `chat:send`
