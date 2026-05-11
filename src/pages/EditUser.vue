<template>
  <div class="edit-wrap">

    <!-- Loading state -->
    <div v-if="loading" class="loading-text">Loading user...</div>

    <!-- Success toast -->
    <transition name="toast">
      <div v-if="showSuccess" class="toast-success">
        &#10003; User updated successfully! Redirecting...
      </div>
    </transition>

    <!-- Form -->
    <UserForm
      v-if="!loading && user"
      :user="user"
      buttonText="Update User"
      @submit-user="updateUser"
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
      user: null,
      loading: true,
      showSuccess: false,
    };
  },

  async mounted() {
    const id = this.$route.params.id;
    try {
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      const d = res.data;
      this.user = {
        id:             d.id,
        name:           d.name           || "",
        username:       d.username       || "",
        email:          d.email          || "",
        phone:          d.phone          || "",
        website:        d.website        || "",
        company:        d.company?.name  || "",
        gender:         "Male",
        bloodGroup:     "",
        role:           "User",
        department:     "",
        skills:         ["Vue"],
        password:       "",
        confirmPassword:"",
      };
    } catch (e) {
      console.error("Failed to load user:", e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
   async updateUser(updatedData) {
  try {
    await axios.put(
      `https://jsonplaceholder.typicode.com/users/${updatedData.id}`,
      updatedData
    );

    this.showSuccess = true;

    setTimeout(() => {
      this.showSuccess = false;

      // pass updated user back to users page
    this.$router.push({
  path: "/users",
  query: {
    updated: JSON.stringify(updatedData)
  }
});

    }, 1200);

  } catch (e) {
    console.error("Update failed:", e);
  }
}
}
  
};
</script>

<style scoped>
* { box-sizing: border-box; }

.edit-wrap {
  padding: 10px;
  font-family: sans-serif;
  max-width: 100%;
}

.loading-text {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  padding: 2rem 0;
}

/* Success toast */
.toast-success {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  margin-bottom: 12px;
  background: #eaf3de;
  border: 1px solid #3b6d11;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #27500a;
  max-width: 660px;
  margin-left: auto;
  margin-right: auto;
}

.toast-enter-active,
.toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from,
.toast-leave-to { opacity: 0; transform: translateY(-6px); }
</style>