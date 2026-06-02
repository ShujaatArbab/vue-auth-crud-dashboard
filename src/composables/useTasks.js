import { ref, computed, onMounted, watch } from "vue";
import { getTasks } from "../services/userApi";
import { getTaskById } from "../services/userApi";
import { getUsers } from "../services/userApi";
import Swal from "sweetalert2";
import { deleteTask } from "../services/userApi";
import { createTask } from "../services/userApi";
import { assignTask } from "../services/userApi";

export function useTasks() {
  const selectedTaskId = ref(null);
  const showCreateModal = ref(false);
  const showAssignModal = ref(false);
  const users = ref([]);
  const showModal = ref(false);
  const selectedTask = ref({});
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



  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };
  // ViewTask //
  const handleViewTask = async (id) => {
  console.log("CLICKED VIEW:", id);

  try {
    const response = await getTaskById(id);

    console.log("TASK API RESPONSE:", response);

    selectedTask.value = response.data.data; // OR response.data (we will confirm)
    showModal.value = true;

  } catch (error) {
    console.error("TASK VIEW ERROR:", error);
  }
};
// ShowUsers //
const loadUsers = async () => {
  const res = await getUsers();
  users.value = res.data.data || res.data;
};
// Open Assigntask Model
const openAssignModal = async (taskId) => {
  await loadUsers();
  selectedTaskId.value = taskId;
  showAssignModal.value = true;
};
//delete task
const handleDeleteTask = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This task will be deleted permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteTask(id);

    // remove from UI instantly
    tasks.value = tasks.value.filter(task => task.id !== id);

    Swal.fire({
      title: "Deleted!",
      text: "Task deleted successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

  } catch (error) {
    console.error(error);

    Swal.fire({
      title: "Error!",
      text: "Failed to delete task.",
      icon: "error",
    });
  }
};
//create task
const handleCreateTask = async (payload) => {
  try {
    const response = await createTask(payload);

    await loadTasks();

    showCreateModal.value = false;

    Swal.fire({
      title: "Success!",
      text: "Task created successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    return response;
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.response?.data?.error || "Failed to create task.",
      icon: "error",
    });
  }
};
//assign task
const handleAssignTask = async (userId) => {
  try {
    console.log("Assigning user:", userId);
    console.log("Task ID:", selectedTaskId.value);

    const response = await assignTask(selectedTaskId.value, {
      assigned_to: userId,
    });

    await loadTasks();

    showAssignModal.value = false;

    Swal.fire({
      title: "Success!",
      text: "Task assigned successfully",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    return response;

  } catch (error) {
    console.log("ERROR:", error.response?.data);
  }
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
    formatDate,
    showModal,
    selectedTask,
    handleViewTask,
    loadUsers,
    openAssignModal,
    showAssignModal,
    users,
    handleDeleteTask,
    handleCreateTask,
    showCreateModal,
    openAssignModal,
    handleAssignTask,
  };
}