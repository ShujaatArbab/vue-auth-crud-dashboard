<template>
  <div class="h-screen flex items-center justify-center bg-gray-900">

    <div class="bg-white p-8 rounded-xl w-96 shadow-lg">

      <h2 class="text-2xl font-bold mb-5 text-center">
        Login
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-4">

        <!-- Email -->
        <div>
          <input
            v-model="email"
            class="w-full p-3 border rounded"
            placeholder="Enter Email"
          />

          <p class="text-red-500 text-sm">
            {{ emailError }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <input
            type="password"
            v-model="password"
            class="w-full p-3 border rounded"
            placeholder="Enter Password"
          />

          <p class="text-red-500 text-sm">
            {{ passwordError }}
          </p>
        </div>

        <!-- API Error -->
        <p class="text-red-500 text-sm">
          {{ apiError }}
        </p>

        <!-- Button -->
        <button
          class="w-full bg-red-500 text-white p-3 rounded"
          :disabled="loading"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>

      </form>

    </div>

  </div>
</template>

<script>
import { useAuthStore } from "../store/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      emailError: "",
      passwordError: "",
      apiError: ""
    };
  },

  methods: {
    async handleLogin() {

      this.emailError = "";
      this.passwordError = "";
      this.apiError = "";

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // VALIDATION
      if (!this.email) {
        this.emailError = "Email required";

      } else if (!emailRegex.test(this.email)) {
        this.emailError = "Invalid email";
      }

      if (!this.password) {
        this.passwordError = "Password required";
      }

      if (
        this.emailError ||
        this.passwordError
      ) return;

      this.loading = true;

      try {

        const authStore = useAuthStore();

        await authStore.login(
          this.email,
          this.password
        );

        this.$router.push("/dashboard");

      } catch (err) {

        this.apiError =
          err.message || "Login failed";

      } finally {
        this.loading = false;
      }
    }
  }
};
</script>