<script setup>
import { ref } from "vue";
import signupLogic from "../composables/useSignup";

const showPassword = ref(false);
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
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-3 py-4">

    <div class="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[50%,50%]">

      <!-- LEFT -->
      <div class="hidden lg:flex flex-col bg-gray-900 text-white px-10 pb-10 items-center justify-center text-center">
        <div class="w-20 h-20 rounded-full bg-white text-gray-900 flex items-center justify-center text-4xl font-bold mb-6">
          ➕
        </div>

        <h1 class="text-4xl font-bold mb-4">
          Create Your Account
        </h1>

        <p class="text-gray-300 text-lg max-w-sm">
          Access dashboard, manage users and control everything from one place.
        </p>
      </div>

      <!-- RIGHT -->
      <div class="px-4 sm:px-6 lg:px-8 py-4">

        <!-- HEADER -->
        <div class="mb-4">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">
            Sign Up
          </h2>

          <p class="text-gray-500 text-sm mt-1">
            Fill all required information
          </p>
        </div>

        <!-- FORM -->
        <form
          @submit.prevent="handleSignup"
          class="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >

          <!-- USERNAME -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-1 block">
              Username
            </label>

            <input
              v-model="form.username"
              placeholder="Enter username"
              class="w-full bg-gray-100 px-3 py-2 rounded-lg text-sm"
            />

            <p class="text-xs text-red-500 mt-1">
              {{ errors.username }}
            </p>
          </div>

          <!-- FIRST NAME -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-1 block">
              First Name
            </label>

            <input
              v-model="form.first_name"
              placeholder="Enter first name"
              class="w-full bg-gray-100 px-3 py-2 rounded-lg text-sm"
            />

            <p class="text-xs text-red-500 mt-1">
              {{ errors.first_name }}
            </p>
          </div>

          <!-- LAST NAME -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-1 block">
              Last Name
            </label>

            <input
              v-model="form.last_name"
              placeholder="Enter last name"
              class="w-full bg-gray-100 px-3 py-2 rounded-lg text-sm"
            />

            <p class="text-xs text-red-500 mt-1">
              {{ errors.last_name }}
            </p>
          </div>

          <!-- EMAIL -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>

            <input
              v-model="form.email"
              placeholder="Enter email address"
              class="w-full bg-gray-100 px-3 py-2 rounded-lg text-sm"
            />

            <p class="text-xs text-red-500 mt-1">
              {{ errors.email }}
            </p>
          </div>

          <!-- PASSWORD -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>

            <div class="relative">

              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder="Enter password"
                class="w-full bg-gray-100 px-3 py-2 rounded-lg text-sm pr-10"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>

            </div>

            <p class="text-xs text-red-500 mt-1">
              {{ errors.password }}
            </p>
          </div>

          <!-- CONFIRM PASSWORD -->
          <div>
            <label class="text-sm font-medium text-gray-700 mb-1 block">
              Confirm Password
            </label>

            <div class="relative">

              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="form.confirm_password"
                placeholder="Confirm password"
                class="w-full bg-gray-100 px-3 py-2 rounded-lg text-sm pr-10"
              />

              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>

            </div>

            <p class="text-xs text-red-500 mt-1">
              {{ errors.confirm_password }}
            </p>
          </div>

          <!-- BUTTON -->
          <div class="sm:col-span-2 pt-1">

            <button
              type="submit"
              class="w-full bg-red-500 hover:bg-red-600 transition text-white py-2.5 rounded-lg font-semibold"
            >
              Create Account
            </button>

          </div>

        </form>

        <!-- LOGIN -->
        <div class="mt-3 text-center text-sm text-gray-500">

          Already registered?

          <router-link
            to="/login"
            class="text-red-500 font-semibold ml-1 hover:text-red-600"
          >
            Login
          </router-link>

        </div>

      </div>
    </div>
  </div>
</template>