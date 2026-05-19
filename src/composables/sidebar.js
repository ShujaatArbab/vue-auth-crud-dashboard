import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthenticationStore } from "../store/Auth";
import Swal from "sweetalert2";

export function useSidebar() {

  const router = useRouter();
  const authStore = useAuthenticationStore();

  // STATE
  const isCollapsed = ref(false);

  // TOGGLE SIDEBAR
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  // LOGOUT WITH CONFIRMATION
  const logout = async () => {

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, logout",
    cancelButtonText: "No"
  });

  if (result.isConfirmed) {

    // ✅ 1. Clear Pinia store
    authStore.logout();

    // ✅ 2. Clear correct sessionStorage keys
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    sessionStorage.removeItem("user");

    // optional safety
    sessionStorage.clear();

    // ✅ 3. Redirect
    router.replace("/login");

    // ✅ 4. Success message
    Swal.fire({
      title: "Logged out",
      icon: "success",
      timer: 1200,
      showConfirmButton: false
    });
  }
};

  return {
    isCollapsed,
    toggleSidebar,
    logout
  };
}