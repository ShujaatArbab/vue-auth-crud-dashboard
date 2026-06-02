import { defineStore } from "pinia";

export const useAuthenticationStore = defineStore("Auth", {

  state: () => ({
    access: sessionStorage.getItem("access") || null,
    refresh: sessionStorage.getItem("refresh") || null,
    user: JSON.parse(sessionStorage.getItem("user")) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.access,
    role: (state) => state.user?.role,
  },

  actions: {

    setAuth(data) {

      this.access = data.access;
      this.refresh = data.refresh;
      this.user = data.user;

      sessionStorage.setItem("access", data.access);

      sessionStorage.setItem("refresh", data.refresh);
      sessionStorage.setItem("role", data.user.role);

      sessionStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    },

    logout() {

      this.access = null;
      this.refresh = null;
      this.user = null;

      sessionStorage.clear();
    },
  },
});