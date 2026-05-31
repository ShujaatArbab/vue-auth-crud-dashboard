import { ref, onMounted } from "vue";
import { useUserStore } from "../store/userStore";
import api from "../services/userApi";

export function useEditUser(route, router) {

  const user        = ref(null);
  const loading     = ref(true);
  const updating    = ref(false);
  const showSuccess = ref(false);

  const userStore = useUserStore();

  // FETCH USER
  const fetchUser = async () => {
    try {
      const id = route.params.id;

      const foundUser = userStore.users.find(u => u.id == id);

      if (foundUser) {
        user.value = foundUser;
      }

    } catch (e) {
      console.error("Failed to load user:", e);
    } finally {
      loading.value = false;
    }
  };

  // UPDATE USER (API)
  const updateUser = async (updatedData) => {

    updating.value = true;

    try {

      const payload = {
        username: updatedData.username,
        first_name: updatedData.first_name,
        last_name: updatedData.last_name,
        email: updatedData.email,
        phone: updatedData.phone,
        country: updatedData.country,
        city: updatedData.city,
        dob: updatedData.dob,
        gender: updatedData.gender,
        password: updatedData.password,
      };

      const res = await api.patch(
        `users/${updatedData.id}/`,
        payload
      );

      // update store
      const index = userStore.users.findIndex(u => u.id === updatedData.id);

      if (index !== -1) {
        userStore.users[index] = res.data;
      }

      showSuccess.value = true;

      setTimeout(() => {
        showSuccess.value = false;
        router.push("/users");
      }, 1200);

    } catch (e) {
      console.error("Update failed:", e);
    } finally {
      updating.value = false;
    }
  };

  onMounted(fetchUser);

  return {
    user,
    loading,
    updating,
    showSuccess,
    updateUser
  };
}