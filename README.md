# MyApp — Admin Panel & Real-Time Comments

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

## Sign Up
<img width="955" height="437" alt="image" src="https://github.com/user-attachments/assets/3b44fd5a-0011-4d89-b370-984ca60850e3" />

## Real-Time Comments
<img width="951" height="440" alt="image" src="https://github.com/user-attachments/assets/827ac240-4c1c-454c-aaa4-04b3f7419682" />

## User Profile
<img width="953" height="437" alt="image" src="https://github.com/user-attachments/assets/738dc2f5-ca34-4c02-8671-110e50861296" />

## User Management
<img width="955" height="440" alt="image" src="https://github.com/user-attachments/assets/e52d2470-20e6-4fb6-a0ce-c8f4317e252b" />

# 🛠️ Tech Stack
## Frontend
- [Vue 3](https://vuejs.org/) (Composition API, <script setup>)
- [Pinia](https://pinia.vuejs.org/) — state management (auth store)
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [Axios](https://axios.rest/) — HTTP client
- [Font Awesome](https://fontawesome.com/) — icons
- [Vue Router](https://router.vuejs.org/) — client-side routing

## Backend
- [Django REST Framework](https://router.vuejs.org/)
- MySQL
- JWT authentication
- Web Sockets for real-time messaging

# 📁 Key Views
| View	| Description |
|---|---|
| Login/Register	| Animated dual-panel auth screen with tab/panel switching |
| Dashboard	| Welcome screen with authenticated user summary |
| Profile |	Read-only profile details with quick action shortcuts |
| Users |	Full CRUD user management table for admins |
| Real-Time |	Real-time Comments , Messages interface with Web Sockets |

# 🚀 Getting Started
## Prerequisites
- Node.js (v18+ recommended)
- Python 3.10+
- MySQL
## Frontend Setup
```bash
npm install
npm run dev
```
## Create a .env file in the project root:
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```
## Backend Setup
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 🔑 Environment Variables
| Variable	| Description | Default |
|---|---|---|
| VITE_API_BASE_URL	| Base URL for the Django API	| http://127.0.0.1:8000 |

## 📌 Notes
- Auth tokens are stored in localStorage under authToken / user.access and user.refresh.
- Task comments use WebSockets for real-time communication between admins and employees.
- Role-based access is determined by the is_superuser flag returned from the backend, not a hardcoded role check.
## 📄 License
This project is proprietary and intended for internal use.










