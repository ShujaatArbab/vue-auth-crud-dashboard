<template>
  <div class="container mt-4">
    <UserForm
      :user="user"
      buttonText="Add User"
      @submit-user="addUser"
      @cancel="$router.push('/users')"
    />
  </div>
</template>

<script>
import axios from "axios";
import UserForm from "../components/UserForm.vue";

export default {
  components: { UserForm },

  data() {
    return {
      user: {
        name: "",
        username: "",
        email: "",
        phone: "",
        website: "",
        company: "",
        gender: "",
        bloodGroup: "",
        role: "",
        department: "",
        skills: [],
        password: "",
        confirmPassword: "",
      },
    };
  },

  async mounted() {
    try {
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/users/1"
      );

      const u = res.data;

      this.user = {
        ...this.user,
        name: u.name || "",
        username: u.username || "",
        email: u.email || "",
        phone: u.phone || "",
        website: u.website || "",
        company: u.company?.name || "",
      };
    } catch (e) {
      console.log("API prefill failed:", e);
    }
  },

  methods: {
   async addUser(userData) {
  try {
    await axios.post(
      "https://jsonplaceholder.typicode.com/users",
      userData
    );

    userData.id = Date.now();

    // ❌ NO storage
    // ❌ NO sessionStorage

    // OPTIONAL: just emit and navigate
    this.$router.push({
      path: "/users",
      query: { newUser: JSON.stringify(userData) }
    });

  } catch (error) {
    console.log(error);
  }
}
  },
};
</script>