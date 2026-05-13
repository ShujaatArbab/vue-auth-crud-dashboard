import { defineStore } from "pinia";
import axios from "axios";

export const useAuthenticationStore = defineStore("auth", {
  state: () => ({
    token: sessionStorage.getItem("token") || null,
    user: JSON.parse(sessionStorage.getItem("user")) || null,
  }),

  actions: {
    async login(email, password) {

      // GET ALL USERS
      const usersRes = await axios.get("https://dummyjson.com/users");

      // FIND USER BY EMAIL
      const user = usersRes.data.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      // EMAIL NOT FOUND
      if (!user) throw new Error("Email not found");

      try {
        // LOGIN API
        const loginRes = await axios.post("https://dummyjson.com/auth/login", {
          username: user.username,
          password,
          expiresInMins: 60,
        });

        // ✅ FIX: DummyJSON returns accessToken not token
        const token = loginRes.data.accessToken;

        // STORE TOKEN & USER
        this.token = token;
        this.user = user;
        

        // SAVE IN SESSION
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        
        
        // RETURN for useLogin.js to use
        return { token, user };
        

      } catch (err) {
        if (err.response?.status === 400) throw new Error("Wrong password");
        throw new Error("Login failed");
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
});