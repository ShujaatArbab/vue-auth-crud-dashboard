import { ref, computed, onMounted, watch } from "vue";
import { getTasks } from "../services/userApi";

export function useTasks() {

  const tasks = ref([]);
  const search = ref("");
  const perPage = ref(5);
  const currentPage = ref(1);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      tasks.value = res.data.data || [];
    } catch (err) {
      console.log("Task load error:", err);
    }
  };

  onMounted(loadTasks);

  watch(search, () => (currentPage.value = 1));
  watch(perPage, () => (currentPage.value = 1));

  // FILTER
  const filteredTasks = computed(() => {
    return tasks.value.filter(t =>
      (t.title || "")
        .toLowerCase()
        .includes(search.value.toLowerCase())
    );
  });

  // PAGINATION
  const totalPages = computed(() =>
    Math.ceil(filteredTasks.value.length / perPage.value) || 1
  );

  const paginatedTasks = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return filteredTasks.value.slice(start, start + perPage.value);
  });

  const goPage = (p) => {
    if (p < 1 || p > totalPages.value) return;
    currentPage.value = p;
  };

  const rangeStart = computed(() =>
    filteredTasks.value.length === 0
      ? 0
      : (currentPage.value - 1) * perPage.value + 1
  );

  const rangeEnd = computed(() =>
    Math.min(
      currentPage.value * perPage.value,
      filteredTasks.value.length
    )
  );

  // ACTIONS (PLACEHOLDERS)
  const viewTask = (task) => {
    console.log("View task:", task);
  };

  const assignTask = (task) => {
    console.log("Assign task:", task);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return {
    tasks,
    search,
    perPage,
    currentPage,
    filteredTasks,
    paginatedTasks,
    totalPages,
    goPage,
    rangeStart,
    rangeEnd,
    viewTask,
    assignTask,
    formatDate
  };
}