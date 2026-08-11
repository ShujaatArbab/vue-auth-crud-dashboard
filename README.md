# MyApp — Admin Panel & Real-Time Chat Platform

A full-stack web application built with Vue 3 and Django REST Framework, featuring role-based user management, a live real-time chat system, and a modern authenticated dashboard experience.

# ✨ Features

## 🔐 Authentication
- Email/password login and registration with client-side validation
- JWT-based authentication (access + refresh tokens)
- Persistent sessions via localStorage
- Role-based redirects (Admin → Dashboard, User → Profile)
- Auto-logout and redirect on token expiry (401 handling via Axios interceptors)
## 👤 User Profile
- View personal account details (name, email, phone, city, zip code, address)
- Role badge display (Admin / User)
- Member-since date tracking
- Quick Actions panel for non-admin users to jump into Chat
## 👥 User Management (Admin)
- Paginated, searchable user table with configurable page size
- Add, view, edit, and delete users
- Responsive design — full table on desktop, card layout on mobile
- Loading skeletons and empty/error states
## 💬 Real-Time Task Comments
- Real-time task comments powered by WebSockets
- Both admins and employees can add comments to tasks
- New comments are delivered instantly without refreshing the page
- Supports chat-style communication within each task
- Real-time updates for all authorized participants
- Comment history is preserved and loaded when viewing a task
- Automatic WebSocket reconnection if the connection is interrupted
- Role-based access ensures only authorized users can participate in task discussions
## Screenshots
## Login
<img width="955" height="440" alt="image" src="https://github.com/user-attachments/assets/d53589f7-a99f-422d-8cd4-0cad3b98fff9" />


