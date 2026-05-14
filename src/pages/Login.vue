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
 <div
  class="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 sm:px-6 overflow-hidden"
>

    <!-- Login Card -->
    <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-6">

      <!-- Top -->
      <div class="text-center mb-6 sm:mb-8">

        <div class="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          A
        </div>

        <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">
          Welcome Back
        </h2>

        <p class="text-gray-500 mt-2 text-sm">
          Please sign in to continue to your account
        </p>

      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>

          <input
            v-model="email"
            class="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"
            placeholder="Enter your email"
          />

          <p class="text-red-500 text-sm mt-1">{{ emailError }}</p>
        </div>

        <!-- Password -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">Password</label>
            <span class="text-sm text-red-500 cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </div>

          <input
            type="password"
            v-model="password"
            class="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"
            placeholder="Enter your password"
          />

          <p class="text-red-500 text-sm mt-1">{{ passwordError }}</p>
        </div>

        <!-- API Error -->
        <p class="text-red-500 text-sm text-center">
          {{ apiError }}
        </p>

        <!-- Button -->
        <button
          class="w-full bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-xl font-semibold shadow-md disabled:opacity-50 text-sm sm:text-base"
          :disabled="loading"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>

      </form>

      <!-- Bottom -->
      <div class="mt-6 sm:mt-7 text-center">
        <p class="text-gray-500 text-sm">
          Don't have an account?
          <span class="text-red-500 font-medium cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>

    </div>

  </div>
</template>