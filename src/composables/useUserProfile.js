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
      (user.value?.first_name?.[0] || "") +
      (user.value?.last_name?.[0] || "")
    ).toUpperCase();

  });

  // ROLE
  const role = computed(() => {
  return authStore.user?.role || "User";
});

  // SUBTITLE
  const subtitle = computed(() => {

    return [
      user.value?.city,
      user.value?.country
    ]
      .filter(Boolean)
      .join(", ");

  });

  // HAIR PLACEHOLDER
  const hair = computed(() => {
    return "—";
  });

  // LOAD USER
  const load = async () => {
  user.value = null;
  error.value = null;

  try {
    const authUser = authStore.user;

    if (!authUser?.id) {
      error.value = "No logged in user.";
      return;
    }

    // 🔥 FETCH FULL PROFILE FROM BACKEND
    const profile = await userStore.fetchUserById(authUser.id);

    user.value = {
      ...authUser,
      ...profile, // merge login + DB profile
    };

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