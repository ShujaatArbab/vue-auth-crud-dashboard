import { ref, computed, onMounted } from "vue";
import { useAuthenticationStore } from "../store/Auth";
import { useUserStore } from "../store/userStore";

export function useUserProfile() {

  const authStore = useAuthenticationStore();
  const userStore = useUserStore();

  const user = ref(null);
  const error = ref(null);

  // INITIALS
  const initials = computed(() => {
    return (
      (user.value?.firstName?.[0] || "") +
      (user.value?.lastName?.[0] || "")
    ).toUpperCase();
  });

  // ROLE
  const role = computed(() => {
    const r = user.value?.role || "user";
    return r[0].toUpperCase() + r.slice(1);
  });

  // SUBTITLE
  const subtitle = computed(() => {
    return (
      [user.value?.company?.department, user.value?.company?.name]
        .filter(Boolean)
        .join(" · ") ||
      user.value?.role ||
      ""
    );
  });

  // HAIR INFO
  const hair = computed(() => {
    return (
      [user.value?.hair?.color, user.value?.hair?.type]
        .filter(Boolean)
        .join(", ") || "—"
    );
  });

  // LOAD USER (FIXED)
  const load = async () => {

    user.value = null;
    error.value = null;

    try {

      const authUser = authStore.user;

      if (!authUser) {
        error.value = "No logged in user.";
        return;
      }

      // 🔥 IMPORTANT FIX: get FULL user from userStore
      if (!userStore.users.length) {
        await userStore.fetchAllUsers();
      }

      const fullUser = userStore.users.find(
        u => u.username === authUser.username
      );

      user.value = fullUser || authUser;

    } catch (e) {
      error.value = "Failed to load profile.";
    }
  };

  onMounted(load);

  return {
    user,
    error,
    initials,
    role,
    subtitle,
    hair,
    load
  };
}