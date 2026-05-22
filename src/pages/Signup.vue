<script setup>
import { ref } from "vue";
import signupLogic from "../composables/useSignup";

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const { form, errors, apiSuccess, handleSignup } = signupLogic();
</script>

<template>
  <div class="signup-root">

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
        <h1 class="text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
          Join us today<br />
          & get started.
        </h1>

        <!-- Sub -->
        <p class="text-sm text-green-100 opacity-75 leading-relaxed max-w-xs mb-8">
          Create your account and start managing your team from one secure place.
        </p>

        <!-- Tags -->
        <div class="flex flex-col gap-2">
          <span class="inline-flex items-center w-fit bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-4 py-2 rounded-full">
            ✦ Free to register
          </span>

          <span class="inline-flex items-center w-fit bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-4 py-2 rounded-full">
            ✦ Secure & private
          </span>

          <span class="inline-flex items-center w-fit bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-4 py-2 rounded-full">
            ✦ Full dashboard access
          </span>
        </div>

      </div>

      <!-- Deco rings -->
      <div class="deco-ring ring-1"></div>
      <div class="deco-ring ring-2"></div>
    </div>

    <!-- RIGHT — Form -->
    <div class="right-panel">
      <div class="w-full max-w-lg bg-white border border-green-100 rounded-3xl px-8 py-8 shadow-xl">

        <!-- Title -->
        <div class="mb-6">
          <h2 class="text-2xl font-extrabold text-gray-900">
            Create account
          </h2>

          <p class="text-sm text-gray-400 mt-1">
            Fill in your details to get started
          </p>
        </div>

        <form @submit.prevent="handleSignup" class="signup-form-grid">

          <!-- USERNAME -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Username
            </label>

            <input
              v-model="form.username"
              placeholder="johndoe"
              class="w-full h-11 px-4 border-2 rounded-xl text-sm bg-green-50 outline-none transition-all focus:border-green-500 focus:bg-white"
              :class="errors.username ? 'border-red-400' : 'border-gray-200'"
            />

            <p v-if="errors.username" class="text-xs text-red-500">
              {{ errors.username }}
            </p>
          </div>

          <!-- FIRST NAME -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              First Name
            </label>

            <input
              v-model="form.first_name"
              placeholder="John"
              class="w-full h-11 px-4 border-2 rounded-xl text-sm bg-green-50 outline-none transition-all focus:border-green-500 focus:bg-white"
              :class="errors.first_name ? 'border-red-400' : 'border-gray-200'"
            />

            <p v-if="errors.first_name" class="text-xs text-red-500">
              {{ errors.first_name }}
            </p>
          </div>

          <!-- LAST NAME -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Last Name
            </label>

            <input
              v-model="form.last_name"
              placeholder="Doe"
              class="w-full h-11 px-4 border-2 rounded-xl text-sm bg-green-50 outline-none transition-all focus:border-green-500 focus:bg-white"
              :class="errors.last_name ? 'border-red-400' : 'border-gray-200'"
            />

            <p v-if="errors.last_name" class="text-xs text-red-500">
              {{ errors.last_name }}
            </p>
          </div>

          <!-- EMAIL -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Email
            </label>

            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              class="w-full h-11 px-4 border-2 rounded-xl text-sm bg-green-50 outline-none transition-all focus:border-green-500 focus:bg-white"
              :class="errors.email ? 'border-red-400' : 'border-gray-200'"
            />

            <p v-if="errors.email" class="text-xs text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <!-- PASSWORD -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Password
            </label>

            <div
              class="flex items-center border-2 rounded-xl px-4 bg-green-50 transition-all focus-within:border-green-500 focus-within:bg-white"
              :class="errors.password ? 'border-red-400' : 'border-gray-200'"
            >
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder="••••••••"
                class="flex-1 h-11 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors bg-transparent border-none cursor-pointer"
              >

                <!-- Eye Open -->
                <svg
                  v-if="!showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                  />

                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <!-- Eye Closed -->
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 3l18 18"
                  />

                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.584 10.587a2.25 2.25 0 003.182 3.182"
                  />

                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.878 5.092A9.77 9.77 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a15.89 15.89 0 01-4.293 4.95M6.228 6.228A15.91 15.91 0 002.25 12s3.75 7.5 9.75 7.5a9.77 9.77 0 004.122-.908"
                  />
                </svg>

              </button>
            </div>

            <p v-if="errors.password" class="text-xs text-red-500">
              {{ errors.password }}
            </p>
          </div>

          <!-- CONFIRM PASSWORD -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Confirm Password
            </label>

            <div
              class="flex items-center border-2 rounded-xl px-4 bg-green-50 transition-all focus-within:border-green-500 focus-within:bg-white"
              :class="errors.confirm_password ? 'border-red-400' : 'border-gray-200'"
            >
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="form.confirm_password"
                placeholder="••••••••"
                class="flex-1 h-11 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400"
              />

              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors bg-transparent border-none cursor-pointer"
              >

                <!-- Eye Open -->
                <svg
                  v-if="!showConfirmPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
                  />

                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <!-- Eye Closed -->
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.8"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 3l18 18"
                  />

                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.584 10.587a2.25 2.25 0 003.182 3.182"
                  />

                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.878 5.092A9.77 9.77 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a15.89 15.89 0 01-4.293 4.95M6.228 6.228A15.91 15.91 0 002.25 12s3.75 7.5 9.75 7.5a9.77 9.77 0 004.122-.908"
                  />
                </svg>

              </button>
            </div>

            <p v-if="errors.confirm_password" class="text-xs text-red-500">
              {{ errors.confirm_password }}
            </p>
          </div>

          <!-- SUBMIT -->
          <div class="full-col">
            <button
              type="submit"
              class="w-full h-12 bg-gradient-to-r from-green-600 to-green-900 text-white font-bold text-sm rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-green-300 active:scale-95 transition-all tracking-wide"
            >
              Create Account →
            </button>
          </div>

        </form>

        <!-- Footer -->
        <p class="text-center text-sm text-gray-400 mt-5">
          Already have an account?

          <router-link
            to="/login"
            class="text-green-600 font-semibold hover:underline ml-1"
          >
            Sign in
          </router-link>
        </p>

      </div>
    </div>

  </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* { font-family: 'Plus Jakarta Sans', sans-serif; }

/* layout only — Tailwind can't do these */
.signup-root {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(150deg, #14532d 0%, #166534 40%, #15803d 100%);
}

.left-panel {
  display: none;
  position: relative;
  background: linear-gradient(150deg, #14532d 0%, #166534 40%, #15803d 100%);
  overflow: hidden;
  padding: 48px 44px;
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

.right-panel {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
}

/* form grid — 2 col */
.signup-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
}
.full-col { grid-column: 1 / -1; }

/* deco rings */
.deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.07);
}
.ring-1 { width: 420px; height: 420px; top: -120px; right: -120px; }
.ring-2 { width: 260px; height: 260px; bottom: 40px; left: -80px; background: rgba(255,255,255,0.02); }

/* ===== MEDIA QUERIES ===== */

@media (max-width: 480px) {
  .signup-form-grid { grid-template-columns: 1fr; }
  .right-panel { padding: 24px 16px; }
}

@media (min-width: 768px) {
  .signup-root  { background: #f8faf8; }
  .left-panel   { display: flex; width: 40%; }
  .right-panel  { width: 60%; padding: 40px 48px; background: #f8faf8; box-shadow: -8px 0 30px rgba(0,0,0,0.07); }
}

@media (min-width: 1024px) {
  .left-panel  { width: 42%; padding: 60px 52px; }
  .right-panel { padding: 48px 64px; }
}
</style>