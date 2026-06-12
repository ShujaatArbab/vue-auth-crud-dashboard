import { defineStore } from "pinia";

export const useAuthenticationStore = defineStore("auth", {
  state: () => ({
    user: null,
    role: null,
    access: null,
    refresh: null,
  }),

  actions: {
    setAuth(userData) {
      this.user = userData.user;
      this.role = userData.user?.role?.toLowerCase();
      this.access = userData.access;
      this.refresh = userData.refresh;
    },

    loadAuthFromStorage() {
      const data = sessionStorage.getItem("auth");
      if (!data) return;

      const parsed = JSON.parse(data);

      this.user = parsed.user;
      this.role = parsed.user?.role?.toLowerCase();
      this.access = parsed.access;
      this.refresh = parsed.refresh;
    },

    logout() {
      this.user = null;
      this.role = null;
      this.access = null;
      this.refresh = null;
      sessionStorage.clear();
    },
  },
});