import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: JSON.parse(sessionStorage.getItem("users")) || [],
    loaded: false,
    loading: false,
  }),

  getters: {
    getUserById: (state) => (id) => {
      return state.users.find((user) => user.id === id);
    },

    getUserByEmail: (state) => (email) => {
      return state.users.find(
        (user) => user.email?.toLowerCase() === email.toLowerCase()
      );
    },
  },

  actions: {
    async fetchAllUsers(force = false) {
      // ✅ if already loaded and not forced → skip API call
      if (this.loaded && !force) return this.users;

      this.loading = true;

      try {
        const res = await axios.get(
          "https://dummyjson.com/users?limit=208"
        );

        this.users = res.data.users;
        this.loaded = true;

        sessionStorage.setItem("users", JSON.stringify(this.users));

        return {users};
      } catch (err) {
        throw new Error(err.message || "Failed to fetch users");
      } finally {
        this.loading = false;
      }
    },

    clearUsers() {
      this.users = [];
      this.loaded = false;
      sessionStorage.removeItem("users");
    },
  },
});