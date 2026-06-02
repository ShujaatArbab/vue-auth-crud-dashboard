import { ref } from "vue";
import api from "../services/api";
import { useAuthenticationStore } from "../store/Auth";

export function useDashboard() {
  const user = ref(null);
  const loading = ref(false);

  const totalUsers = ref(0);
  const maleUsers = ref(0);
  const femaleUsers = ref(0);

  const fetchDashboard = async () => {
    const authStore = useAuthenticationStore();

  // 🔐 BLOCK NON-ADMINS
  if (authStore.user?.role !== "admin") {
    console.warn("Access denied: dashboard is admin only");
    return;
  }

  loading.value = true;

  try {
    const res = await api.get("/dashboard/");
    const data = res.data?.data;

    totalUsers.value = data?.summary?.total_users ?? 0;
    maleUsers.value = data?.summary?.male ?? 0;
    femaleUsers.value = data?.summary?.female ?? 0;

    user.value = data?.user ?? null;

  } catch (err) {
    console.log("Dashboard error:", err);
  } finally {
    loading.value = false;
  }
};

  return {
    user,
    loading,
    totalUsers,
    maleUsers,
    femaleUsers,
    fetchDashboard,
  };
}