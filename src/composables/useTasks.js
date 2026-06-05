import { ref, computed, onMounted, watch } from "vue";
import {
  getTasks,
  getTaskById,
  getUsers,
  deleteTask,
  createTask,
  assignTask,
  getTaskComments
} from "../services/userApi";
import Swal from "sweetalert2";

export function useTasks() {
  const selectedTaskId = ref(null);
  const showCreateModal = ref(false);
  const showAssignModal = ref(false);
  const showModal = ref(false);
  
  const users = ref([]);
  const tasks = ref([]);
  const selectedTask = ref({});

  const search = ref("");
  const perPage = ref(5);
  const currentPage = ref(1);

  const taskComments = ref({});
  const visibleComments = ref({});

  let socket = null;

  // ---------------- TASKS ----------------
  const loadTasks = async () => {
    try {
      const res = await getTasks();
      tasks.value = res.data.data || [];
      await loadAllComments();
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- COMMENTS LOAD ----------------
  const setTaskComments = (taskId, comments) => {
    taskComments.value = {
      ...taskComments.value,
      [taskId]: comments
    };
  };

  const loadAllComments = async () => {
    await Promise.all(
      tasks.value.map(async (task) => {
        const res = await getTaskComments(task.id);
        setTaskComments(task.id, res.data.data || []);
      })
    );
  };

  // ---------------- WEBSOCKET ----------------
  const connectCommentsSocket = () => {
    socket = new WebSocket("ws://127.0.0.1:8000/ws/comments/");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type !== "new_comment") return;

      const taskId = data.task_id;

      const existing = taskComments.value[taskId] || [];

      taskComments.value = {
        ...taskComments.value,
        [taskId]: [data.comment, ...existing]
      };
    };
  };

  // ---------------- UI HELPERS ----------------
  const toggleComments = (taskId) => {
    visibleComments.value[taskId] = !visibleComments.value[taskId];
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // ---------------- VIEW TASK ----------------
 const handleViewTask = async (id) => {
  try {
    const response = await getTaskById(id);

    selectedTask.value = response.data.data;
    selectedTask.value.id = id; // FORCE correct ID reference

    showModal.value = true;
  } catch (error) {
    console.error(error);
  }
};
  // ---------------- USERS ----------------
  const loadUsers = async () => {
    const res = await getUsers();
    users.value = res.data.data || res.data;
  };

  const openAssignModal = async (taskId) => {
    await loadUsers();
    selectedTaskId.value = taskId;
    showAssignModal.value = true;
  };

  // ---------------- DELETE ----------------
  const handleDeleteTask = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This task will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    await deleteTask(id);
    tasks.value = tasks.value.filter(t => t.id !== id);
  };

  // ---------------- CREATE ----------------
  const handleCreateTask = async (payload) => {
    await createTask(payload);
    await loadTasks();
    showCreateModal.value = false;
  };

  // ---------------- ASSIGN ----------------
  const handleAssignTask = async (userId) => {
    await assignTask(selectedTaskId.value, {
      assigned_to: userId
    });

    await loadTasks();
    showAssignModal.value = false;
  };

  // ---------------- FILTER ----------------
  const filteredTasks = computed(() =>
    tasks.value.filter(t =>
      (t.title || "").toLowerCase().includes(search.value.toLowerCase())
    )
  );

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
    Math.min(currentPage.value * perPage.value, filteredTasks.value.length)
  );

  // ---------------- LIFECYCLE ----------------
  onMounted(() => {
    loadTasks();
    connectCommentsSocket();
  });

  watch(search, () => (currentPage.value = 1));
  watch(perPage, () => (currentPage.value = 1));
  watch(taskComments, (val) => {
  if (!selectedTask.value?.id) return;

  selectedTask.value = {
    ...selectedTask.value,
    comments: val[selectedTask.value.id] || []
  };
}, { deep: true });

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

    showModal,
    selectedTask,
    handleViewTask,

    showAssignModal,
    users,
    openAssignModal,
    handleAssignTask,

    handleDeleteTask,
    handleCreateTask,
    showCreateModal,

    taskComments,
    visibleComments,
    toggleComments,
    formatDate
  };
}