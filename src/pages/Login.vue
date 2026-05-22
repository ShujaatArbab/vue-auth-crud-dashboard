<script setup>
import { useLogin } from "../composables/useLogin";

const {
  email,
  password,
  emailError,
  passwordError,
  apiError,
  loading,
  handleLogin
} = useLogin();
</script>

<template>
  <div class="login-root">

    
    <!-- LEFT — Branding -->
    <div class="left-panel">
      <div class="left-inner">

        <!-- Logo -->
        <div class="flex items-center gap-3 mb-14">
          <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <span class="text-green-700 font-black text-lg">A</span>
          </div>

          <span class="text-white font-bold text-lg tracking-wide">
            AdminPanel
          </span>
        </div>

        <!-- Heading -->
        <h1 class="text-3xl font-extrabold text-white leading-snug tracking-tight mb-4">
          Welcome back<br />
          Access your<br />
          dashboard
        </h1>

        <!-- Sub -->
        <p class="text-base font-normal text-green-100 opacity-80 leading-relaxed max-w-xs">
          Secure login to continue managing your team.
        </p>

      </div>

      <!-- Deco Rings -->
      <div class="deco-ring ring-1"></div>
      <div class="deco-ring ring-2"></div>
    </div>

    <!-- RIGHT — Form -->
    <div class="right-panel">
      <div
        class="w-full max-w-md bg-white border border-green-100 rounded-3xl px-8 py-10 shadow-xl"
      >

        <!-- Title -->
        <div class="mb-7">
          <h2 class="text-2xl font-extrabold text-gray-900">
            Welcome back
          </h2>

          <p class="text-sm text-gray-400 mt-1">
            Sign in to your admin account
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-5">

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Email
            </label>

            <div
              class="flex items-center gap-2 border-2 rounded-xl px-4 bg-green-50 transition-all"
              :class="
                emailError
                  ? 'border-red-400'
                  : 'border-gray-200 focus-within:border-green-500 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(22,163,74,0.12)]'
              "
            >
              <svg
                class="w-4 h-4 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75"
                />
              </svg>

              <input
                v-model="email"
                type="email"
                placeholder="you@example.com"
                class="flex-1 h-11 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>

            <p v-if="emailError" class="text-xs text-red-500">
              {{ emailError }}
            </p>
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Password
              </label>

              <span
                class="text-xs text-green-600 font-medium cursor-pointer hover:underline"
              >
                Forgot?
              </span>
            </div>

            <div
              class="flex items-center gap-2 border-2 rounded-xl px-4 bg-green-50 transition-all"
              :class="
                passwordError
                  ? 'border-red-400'
                  : 'border-gray-200 focus-within:border-green-500 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(22,163,74,0.12)]'
              "
            >
              <svg
                class="w-4 h-4 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>

              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                class="flex-1 h-11 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>

            <p v-if="passwordError" class="text-xs text-red-500">
              {{ passwordError }}
            </p>
          </div>

          <!-- API Error -->
          <div
            v-if="apiError"
            class="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600"
          >
            ⚠ {{ apiError }}
          </div>

          <!-- Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full h-12 bg-gradient-to-r from-green-600 to-green-800 text-white font-bold text-sm rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-green-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
          >
            <span v-if="!loading">
              Sign In →
            </span>

            <span v-else class="flex items-center justify-center gap-1">
              <span class="dot"></span>
              <span class="dot" style="animation-delay:0.2s"></span>
              <span class="dot" style="animation-delay:0.4s"></span>
            </span>
          </button>

        </form>

        <!-- Footer -->
        <p class="text-center text-sm text-gray-400 mt-6">
          No account?

          <router-link
            to="/signup"
            class="text-green-600 font-semibold hover:underline ml-1"
          >
            Sign up
          </router-link>
        </p>

      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* Font */
* {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* ===== Layout ===== */

.login-root {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(150deg, #14532d 0%, #166534 40%, #15803d 100%);
}

/* LEFT PANEL */

.left-panel {
  display: none;
  position: relative;
  background: linear-gradient(150deg, #14532d 0%, #166534 40%, #15803d 100%);
  overflow: hidden;
  padding: 48px 44px;

  /* FIXED RADIUS */
  border-radius: 0 100px 100px 0;
}

.left-inner {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

/* RIGHT PANEL */

.right-panel {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 32px 20px;
}

/* Deco Rings */

.deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.07);
}

.ring-1 {
  width: 420px;
  height: 420px;
  top: -120px;
  right: -120px;
}

.ring-2 {
  width: 260px;
  height: 260px;
  bottom: 40px;
  left: -80px;
  background: rgba(255,255,255,0.02);
}

/* Loading Animation */

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;

  background: #fff;
  border-radius: 50%;

  animation: blink 0.6s infinite alternate;
}

@keyframes blink {
  from {
    opacity: 0.3;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* ===== Responsive ===== */

@media (max-width: 380px) {
  .right-panel {
    padding: 24px 16px;
  }
}

@media (min-width: 768px) {

  .login-root {
    background: #f8faf8;
  }

  .left-panel {
    display: flex;
    width: 42%;
  }

  .right-panel {
    width: 58%;
    padding: 40px 48px;
    background: #f8faf8;
    box-shadow: -8px 0 30px rgba(0,0,0,0.07);
  }
}

@media (min-width: 1024px) {

  .left-panel {
    width: 45%;
    padding: 60px 52px;
  }

  .right-panel {
    padding: 60px 64px;
  }
}
</style>