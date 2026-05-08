import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {

  state: () => ({
    token: sessionStorage.getItem("token") || null,

    user: JSON.parse(
      sessionStorage.getItem("user")
    ) || null
  }),

  actions: {

    async login(email, password) {

      // STEP 1 → GET USERS
      const usersRes = await axios.get(
        "https://dummyjson.com/users"
      );

      // STEP 2 → FIND USER
      const user = usersRes.data.users.find(
        u => u.email === email
      );

      if (!user) {
        throw new Error("User not found");
      }

      // STEP 3 → LOGIN
      const loginRes = await axios.post(
        "https://dummyjson.com/auth/login",
        {
          username: user.username,
          password
        }
      );

      // STORE TOKEN
      this.token = loginRes.data.token;

      // STORE USER
      this.user = user;

      // SESSION STORAGE
      sessionStorage.setItem(
        "token",
        this.token
      );

      sessionStorage.setItem(
        "user",
        JSON.stringify(this.user)
      );
    },

    logout() {

      this.token = null;
      this.user = null;

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }
  }
});