<script setup>
import { ref } from "vue";
import signupLogic from "../composables/useSignup";

const showPassword        = ref(false);
const showConfirmPassword = ref(false);

const countries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium",
  "Bhutan","Bolivia","Brazil","Bulgaria","Canada","China","Colombia","Denmark",
  "Egypt","France","Germany","India","Indonesia","Iran","Iraq","Ireland","Italy",
  "Japan","Jordan","Kazakhstan","Kuwait","Malaysia","Maldives","Mexico","Nepal",
  "Netherlands","New Zealand","Nigeria","Norway","Oman","Pakistan","Philippines",
  "Poland","Portugal","Qatar","Russia","Saudi Arabia","Singapore","South Africa",
  "South Korea","Spain","Sri Lanka","Sweden","Switzerland","Thailand","Turkey",
  "UAE","UK","USA","Vietnam"
];

const { form, errors, apiSuccess, handleSignup } = signupLogic();
</script>

<template>
  <div class="signup-root">

    <!-- LEFT — Branding -->
    <div class="left-panel">
      <div class="left-inner">

        <div class="flex items-center gap-3 mb-12">
          <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <span class="text-green-700 font-black text-lg">A</span>
          </div>
          <span class="text-white font-bold text-lg tracking-wide">AdminPanel</span>
        </div>

                <h1 class="left-heading">
          Join us today <br />
          <span class="space">&<br></span>
          get    started.
        </h1>

        <p class="left-sub">
          Create your account and start managing your team from one secure place.
        </p>

        <div class="left-tags">
          <span class="tag">✦ Free to register</span>
          <span class="tag">✦ Secure & private</span>
          <span class="tag">✦ Full dashboard access</span>
        </div>

      </div>

      <div class="deco-ring ring-1"></div>
      <div class="deco-ring ring-2"></div>
    </div>

    <!-- RIGHT — Form -->
    <div class="right-panel">
      <div class="form-card">

        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Create account</h2>
          <p class="text-sm text-gray-400 mt-1">Fill in your details to get started</p>
        </div>

        <form @submit.prevent="handleSignup" class="form-grid">

          <!-- USERNAME -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</label>
            <input v-model="form.username" placeholder="johndoe" class="field-input" :class="errors.username ? 'border-red-400' : 'border-gray-200'" />
            <p v-if="errors.username" class="text-xs text-red-500">{{ errors.username }}</p>
          </div>

          <!-- FIRST NAME -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">First Name</label>
            <input v-model="form.first_name" placeholder="John" class="field-input" :class="errors.first_name ? 'border-red-400' : 'border-gray-200'" />
            <p v-if="errors.first_name" class="text-xs text-red-500">{{ errors.first_name }}</p>
          </div>

          <!-- LAST NAME -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Name</label>
            <input v-model="form.last_name" placeholder="Doe" class="field-input" :class="errors.last_name ? 'border-red-400' : 'border-gray-200'" />
            <p v-if="errors.last_name" class="text-xs text-red-500">{{ errors.last_name }}</p>
          </div>

          <!-- EMAIL -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
            <input v-model="form.email" type="email" placeholder="you@example.com" class="field-input" :class="errors.email ? 'border-red-400' : 'border-gray-200'" />
            <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <!-- PASSWORD -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
            <div class="pw-box" :class="errors.password ? 'border-red-400' : 'border-gray-200'">
              <input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="••••••••" class="pw-input" />
              <button type="button" @click="showPassword = !showPassword" class="pw-eye">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
          </div>

          <!-- CONFIRM PASSWORD -->
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirm Password</label>
            <div class="pw-box" :class="errors.confirm_password ? 'border-red-400' : 'border-gray-200'">
              <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirm_password" placeholder="••••••••" class="pw-input" />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="pw-eye">
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <p v-if="errors.confirm_password" class="text-xs text-red-500">{{ errors.confirm_password }}</p>
          </div>

          <!-- SUBMIT -->
          <div class="full-col">
            <button type="submit" class="submit-btn">Create Account →</button>
          </div>

        </form>

        <p class="text-center text-sm text-gray-400 mt-5">
          Already have an account?
          <router-link to="/login" class="text-green-600 font-semibold hover:underline ml-1">Sign in</router-link>
        </p>

      </div>
    </div>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
.space{
margin-left: 130px;
color: white;
font-size: 50px;
}
.signup-root {
  display: flex;
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #f8faf8;
}

/* ===== LEFT ===== */
.left-panel {
  display: none;
  position: relative;
  background: linear-gradient(150deg, #14532d 0%, #166534 40%, #15803d 100%);
  overflow: hidden;
  padding: 48px 44px;
  border-radius: 0 100px 100px 0;
}
.text-center{
  margin-top: 20px;
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
  font-size: 38px;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -1px;
  margin-bottom: 16px;
}

.left-sub {
  font-size: 14px;
  color: rgba(255,255,255,0.65);
  line-height: 1.7;
  max-width: 280px;
  margin-bottom: 32px;
}

.left-tags { display: flex; flex-direction: column; gap: 10px; }

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
  background: linear-gradient(150deg, #14532d 0%, #166534 40%, #15803d 100%);
  border-radius: 0 100px 100px 0;
  
}

.form-card {
  width: 100%;
  max-width: 480px;
  background: #fff;
  border: 1px solid #e8f5e9;
  border-radius: 24px;
  padding: 32px 28px;
  box-shadow: 0 4px 40px rgba(20,83,45,0.08);
}

/* ===== FORM GRID ===== */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
}

.full-col { grid-column: 1 / -1; }

/* ===== INPUTS ===== */
.field-input {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border: 1.5px solid;
  border-radius: 10px;
  background: #f9fdf9;
  font-size: 13px;
  color: #111;
  outline: none;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: border-color 0.2s, box-shadow 0.2s;
   
}

.field-input:focus {
  border-color: #16a34a !important;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
  background: #fff;
}

/* Password */
.pw-box {
  display: flex;
  align-items: center;
  border: 1.5px solid;
  border-radius: 10px;
  background: #f9fdf9;
  padding: 0 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.pw-box:focus-within {
  border-color: #16a34a !important;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
  background: #fff;
}

.pw-input {
  flex: 1; height: 42px;
  background: transparent; border: none; outline: none;
  font-size: 13px; color: #111;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.pw-eye {
  background: none; border: none;
  cursor: pointer; font-size: 14px; padding: 0;
}

/* ===== BUTTON ===== */
.submit-btn {
  width: 100%;
  height: 46px;
  background: linear-gradient(135deg, #16a34a, #14532d);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.3px;
  box-shadow: 0 6px 20px rgba(22,163,74,0.3);
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(22,163,74,0.4);
}

.submit-btn:active { transform: scale(0.98); }

/* ===== MEDIA QUERIES ===== */

@media (max-width: 480px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-card { padding: 24px 16px; border-radius: 18px; }
  .left-heading { font-size: 30px; }
}

@media (min-width: 768px) {
  .left-panel { display: flex; width: 40%; }
  .right-panel { width: 60%; padding: 40px 48px; }
 
}

@media (min-width: 1024px) {
  .left-panel { width: 42%; padding: 60px 52px; }
  .left-heading { font-size: 46px; }
  .right-panel { padding: 48px 64px; }
  .form-card { max-width: 520px; padding: 36px 36px; }
}

@media (min-width: 1280px) {
  .left-heading { font-size: 52px; }
}

</style>