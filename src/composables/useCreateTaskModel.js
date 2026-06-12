import { ref, computed, watch } from "vue";
import { useToast } from "./useToast"; // Path adjusted to match your original imports

export function useCreateTaskModel(props, emit) {
  const { triggerToast } = useToast();

  // Form State Refs
  const title = ref("");
  const description = ref("");
  const selectedUserId = ref(null);

  // User Search & Pagination Refs
  const userSearch = ref("");
  const usersPerPage = ref(5);
  const currentUserPage = ref(1);

  // Filter users by Name, Username, First Name, or Email
  const filteredUsers = computed(() => {
    if (!props.users) return [];
    const query = userSearch.value.toLowerCase().trim();
    if (!query) return props.users;

    return props.users.filter((user) => {
      const name = (user.name || "").toLowerCase();
      const username = (user.username || "").toLowerCase();
      const firstName = (user.first_name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      
      return (
        name.includes(query) ||
        username.includes(query) ||
        firstName.includes(query) ||
        email.includes(query)
      );
    });
  });

  // Calculate Total User Pages
  const totalUserPages = computed(() => {
    return Math.ceil(filteredUsers.value.length / usersPerPage.value) || 1;
  });

  // Extract Paginated User Window
  const paginatedUsers = computed(() => {
    const start = (currentUserPage.value - 1) * usersPerPage.value;
    const end = start + usersPerPage.value;
    return filteredUsers.value.slice(start, end);
  });

  // Reset page window when queries alter
  watch(userSearch, () => {
    currentUserPage.value = 1;
  });

  // Task Submission Handler
  const submitTask = () => {
    if (!title.value.trim()) {
      triggerToast("Title required", "error");
      return;
    }

    if (!selectedUserId.value) {
      triggerToast("Select a user", "error");
      return;
    }

    emit("submit", {
      title: title.value,
      description: description.value,
      assigned_to: selectedUserId.value
    });
  };

  // Clean form state when modal closes
  watch(() => props.show, (isVisible) => {
    if (!isVisible) {
      title.value = "";
      description.value = "";
      selectedUserId.value = null;
      userSearch.value = "";
      currentUserPage.value = 1;
    }
  });

  return {
    title,
    description,
    selectedUserId,
    userSearch,
    usersPerPage,
    currentUserPage,
    filteredUsers,
    totalUserPages,
    paginatedUsers,
    submitTask
  };
}