import { ref, computed, onMounted } from "vue";

export function useUserProfile() {

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

  // LOAD USER
  const load = async () => {

    user.value = null;
    error.value = null;

    const stored = sessionStorage.getItem("user");

    if (stored) {
      user.value = JSON.parse(stored);
      return;
    }

    try {
      const id = Math.floor(Math.random() * 100) + 1;

      const res = await fetch(
        `https://dummyjson.com/users/${id}`
      );

      user.value = await res.json();

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