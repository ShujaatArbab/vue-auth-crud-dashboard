import { ref, onMounted } from "vue";
import { useUserStore } from "../store/userStore";

export function useEditUser(route, router) {

  const user        = ref(null);
  const loading     = ref(true);
  const showSuccess = ref(false);

  const userStore = useUserStore();

  // FETCH USER (FROM STORE ONLY)
  const fetchUser = async () => {
    try {
      const id = route.params.id;

      const foundUser = userStore.users.find(
        u => u.id == id
      );

      user.value = foundUser || null;

    } catch (e) {
      console.error("Failed to load user:", e);
    } finally {
      loading.value = false;
    }
  };

  // UPDATE USER (STORE ONLY)
  const updateUser = (updatedData) => {

    const index = userStore.users.findIndex(
      u => u.id === updatedData.id
    );

    if (index !== -1) {
      userStore.users[index] = {
        ...userStore.users[index],
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        phone: updatedData.phone,
        gender: updatedData.gender,
        bloodGroup: updatedData.bloodGroup,
        role: updatedData.role,
      };
    }

    showSuccess.value = true;

    setTimeout(() => {
      showSuccess.value = false;
      router.push("/users");
    }, 1200);
  };

  onMounted(fetchUser);

  return { user, loading, showSuccess, updateUser };
}