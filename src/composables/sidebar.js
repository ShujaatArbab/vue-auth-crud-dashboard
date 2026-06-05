// composables/sidebar.js
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthenticationStore } from "../store/Auth";

const isCollapsed = ref(false);
const showLogoutModal = ref(false);

export function useSidebar() {
  const router = useRouter();
  const authStore = useAuthenticationStore();

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  const logout = () => {
    showLogoutModal.value = true;
  };

  const closeLogoutModal = () => {
    showLogoutModal.value = false;
  };

  const confirmLogout = async () => {
    authStore.logout();
    sessionStorage.clear();
    showLogoutModal.value = false;

    await router.replace("/login");
  };

  return {
    isCollapsed,
    showLogoutModal: showLogoutModal,
    toggleSidebar,
    logout,
    closeLogoutModal,
    confirmLogout
  };
}