# WebRTC Classroom Signaling Server - Implementation Plan

## Goals
- Build a **Node.js signaling server** that supports classroom-style WebRTC sessions.
- Provide **role-based access** for `admin`, `teacher`, and `student`.
- Enable **teacher-to-all signaling** plus **teacher-student bidirectional signaling**.
- Support **chat messaging** per class room.
- Add **class secret code join** so students can enroll by code.
- Keep app behavior controlled by centralized **configuration flags**.

## Core Architecture
1. **REST API (Express)**
   - Authentication: login and profile endpoints.
   - Class/session lifecycle endpoints.
   - Admin management endpoints.
2. **Realtime Layer (Socket.IO + PeerJS)**
   - Socket.IO for room join, chat, and signaling fan-out.
   - PeerJS for WebRTC peer discovery / broker path (`/peerjs`).
3. **Persistence Layer (MySQL)**
   - Users, classes, enrollments, sessions, messages, and audit logs.

## Role Model
- **Admin**
  - Manage users and platform-wide feature flags.
- **Teacher**
  - Create classes, start session, publish signal to all students.
  - Share class secret join code to students.
  - Exchange direct signaling with any student.
- **Student**
  - Join class by secret code.
  - Join enrolled class sessions.
  - Receive teacher fan-out signal and reply directly.

## Signaling Flows
1. **Teacher broadcast signal**
   - Teacher emits `teacher:signal:all` with class/session payload.
   - Server verifies role + class ownership, relays to room `class:<id>:students`.
2. **Bidirectional teacher ↔ student signal**
   - Teacher emits `teacher:signal:student` with `studentUserId`.
   - Student emits `student:signal:teacher` with class/session context.
   - Server routes both events only if enrollment is valid.
3. **Chat flow**
   - `chat:send` stores message in MySQL and emits to class room.
4. **Class code enrollment flow**
   - Teacher creates class and receives generated `join_code`.
   - Student calls join-by-code endpoint.
   - Server inserts enrollment if code is valid.

## Security & Controls
- JWT auth required for API and socket connections.
- RBAC middleware for every protected endpoint/event.
- Input validation with Zod schemas.
- Config feature switches:
  - `ENABLE_VIDEO`
  - `ENABLE_CHAT`
  - `ENABLE_WHITEBOARD`

## Milestones
1. Project bootstrap and configuration.
2. MySQL schema and DB access layer.
3. Auth and RBAC endpoints.
4. Class/session management APIs.
5. Socket signaling + chat orchestration.
6. Class code enrollment workflow.
7. Audit logging, tests, and deployment docs.

## Initial Build Delivered in This Repository
- Express app with JWT login shell.
- Role-protected API routes for admin/teacher/student.
- Teacher class creation and student join-by-code endpoints.
- Socket.IO signaling handlers for classroom events.
- PeerJS signaling endpoint.
- SQL schema for MySQL bootstrap.
