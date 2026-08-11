# MyApp — Admin Panel & Real-Time Chat Platform

A full-stack web application built with Vue 3 and Django REST Framework, featuring role-based user management, a live real-time chat system, and a modern authenticated dashboard experience.

# ✨ Features

# 🔐 Authentication
Email/password login and registration with client-side validation
JWT-based authentication (access + refresh tokens)
Persistent sessions via localStorage
Role-based redirects (Admin → Dashboard, User → Profile)
Auto-logout and redirect on token expiry (401 handling via Axios interceptors)
