<script setup>
import { useLogin } from "../composables/useLogin";
const { email, password, emailError, passwordError, apiError, loading, handleLogin } = useLogin();
</script>

<template>
  <div class="login-root">

    <!-- LEFT — Branding -->
    <div class="left-panel">
      <div class="left-inner">

        <div class="flex items-center gap-3 mb-12">
          <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <span class="text-green-700 font-black text-lg" style="font-family: 'Syne', sans-serif">A</span>
          </div>
          <span class="text-white font-bold text-lg tracking-wide" style="font-family: 'Syne', sans-serif">AdminPanel</span>
        </div>
<br><br>
       <h1 class="left-heading">
  Welcome back<br>
  Access your dashboard
</h1><br>

<p class="left-sub">
  Secure login to continue.
</p>

        

      </div>

      <!-- decorative -->
      <div class="deco-ring ring-1"></div>
      <div class="deco-ring ring-2"></div>
    </div>

    <!-- RIGHT — Form -->
    <div class="right-panel">
      <div class="form-card">

        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900" style="font-family: 'Syne', sans-serif">Welcome back</h2>
          <p class="text-sm text-gray-400 mt-1">Sign in to your admin account</p>
        </div>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-5">

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
            <div class="input-box" :class="emailError ? 'border-red-400' : 'border-gray-200'">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75"/>
              </svg>
              <input v-model="email" type="email" placeholder="you@example.com" class="field-input" />
            </div>
            <p v-if="emailError" class="text-xs text-red-500">{{ emailError }}</p>
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center">
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
              <span class="text-xs text-green-600 cursor-pointer hover:underline font-medium">Forgot?</span>
            </div>
            <div class="input-box" :class="passwordError ? 'border-red-400' : 'border-gray-200'">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
              </svg>
              <input v-model="password" type="password" placeholder="••••••••" class="field-input" />
            </div>
            <p v-if="passwordError" class="text-xs text-red-500">{{ passwordError }}</p>
          </div>

          <!-- API Error -->
          <div v-if="apiError" class="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            ⚠ {{ apiError }}
          </div>

          <!-- Button -->
          <button type="submit" :disabled="loading" class="submit-btn">
            <span v-if="!loading">Sign In →</span>
            <span v-else class="flex items-center justify-center gap-1">
              <span class="dot"></span>
              <span class="dot" style="animation-delay:0.2s"></span>
              <span class="dot" style="animation-delay:0.4s"></span>
            </span>
          </button>

        </form>

        <p class="text-center text-sm text-gray-400 mt-6">
          No account?     
          <router-link to="/signup" class="text-green-600 font-semibold hover:underline ml-1">  Sign up</router-link>
        </p>

      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.login-root {
  display: flex;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  background: #f8faf8;
}

/* ===== LEFT ===== */
.left-panel {
  display: none;
  position: relative;
  background: linear-gradient(150deg, #14532d 0%, #166534 40%, #15803d 100%);
  overflow: hidden;
  padding: 48px 44px;
}

.left-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.left-heading {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
  margin-left: 0;
}

.left-sub {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  margin-left: 0;
  max-width: 260px;
}
.left-tags {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tag {
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.85);
  font-size: 12px;
  font-weight: 500;
  padding: 7px 14px;
  border-radius: 20px;
  width: fit-content;
  letter-spacing: 0.3px;
}

.deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.07);
}
.ring-1 { width: 420px; height: 420px; top: -120px; right: -120px; }
.ring-2 { width: 260px; height: 260px; bottom: 40px; left: -80px; border-color: rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); }

/* ===== RIGHT ===== */
.right-panel {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  background:  linear-gradient(150deg, #14532d 0%, #166534 40%, #15803d 100%);
   border-radius: 0 120px 120px 0;
}

.form-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border: 1px solid #e8f5e9;
  border-radius: 24px;
  padding: 36px 28px;
  box-shadow: 0 4px 40px rgba(20,83,45,0.08);
}

/* ===== INPUTS ===== */
.input-box {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid;
  border-radius: 12px;
  padding: 0 14px;
  background: #f9fdf9;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-box:focus-within {
  border-color: #16a34a !important;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
  background: #fff;
}

.field-input {
  flex: 1;
  height: 44px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: #111;
  font-family: 'DM Sans', sans-serif;
}

.field-input::placeholder { color: #aaa; }

.text-center{
  margin-top: 20px;
}
.text-green-600{
  font-size: 20;
}

/* ===== BUTTON ===== */
.submit-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #16a34a, #14532d);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: 'Syne', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.3px;
  box-shadow: 0 6px 20px rgba(22,163,74,0.3);
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
}
.left-panel {
  border-radius: 0 100px 100px 0;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(22,163,74,0.4);
}

.submit-btn:active:not(:disabled) { transform: scale(0.98); }
.submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

/* Loading dots */
.dot {
  display: inline-block;
  width: 6px; height: 6px;
  background: #fff;
  border-radius: 50%;
  animation: blink 0.6s infinite alternate;
}
@keyframes blink { from { opacity: 0.3; transform: scale(0.8); } to { opacity: 1; transform: scale(1.1); } }

/* ===== MEDIA QUERIES ===== */

@media (max-width: 380px) {
  .form-card { padding: 28px 18px; border-radius: 18px; }
}

@media (min-width: 768px) {
  .left-panel { display: flex; width: 42%; }
  .right-panel { width: 58%; padding: 40px 48px; }
}

@media (min-width: 1024px) {
  .left-panel { width: 45%; padding: 60px 52px; }
  .left-heading { font-size: 54px; }
  .right-panel { padding: 60px 64px; }
  .form-card { padding: 44px 36px; max-width: 420px; }
}

@media (min-width: 1280px) {
  .left-heading { font-size: 60px; }
}
</style>