import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

export function useSidebar() {

  const router = useRouter();

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

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      router.push("/login");

      Swal.fire({
        title: "Logged out",
        icon: "success",
        timer: 1500,
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