MyApp — Admin Panel & Real-Time Chat Platform
A full-stack web application built with Vue 3 and Django REST Framework, featuring role-based user management, a live real-time chat system, and a modern authenticated dashboard experience.

✨ Features
🔐 Authentication
Email/password login and registration with client-side validation
JWT-based authentication (access + refresh tokens)
Persistent sessions via localStorage
Role-based redirects (Admin → Dashboard, User → Profile)
Auto-logout and redirect on token expiry (401 handling via Axios interceptors)
👤 User Profile
View personal account details (name, email, phone, city, zip code, address)
Role badge display (Admin / User)
Member-since date tracking
Quick Actions panel for non-admin users to jump into Chat
👥 User Management (Admin)
Paginated, searchable user table with configurable page size
Add, view, edit, and delete users
Responsive design — full table on desktop, card layout on mobile
Loading skeletons and empty/error states
💬 Real-Time Task Comments
Real-time task comments powered by WebSockets
Both admins and employees can add comments to tasks
Instant delivery of new comments to all authorized participants without page refresh
Conversation-style comment interface for seamless team communication
Real-time updates when new comments are posted
Support for continuous discussion and collaboration within each task
Automatic WebSocket reconnection to maintain communication if the connection is interrupted
Comment history is preserved and loaded when viewing a task
Role-based access ensures only authorized users can participate in task discussions
