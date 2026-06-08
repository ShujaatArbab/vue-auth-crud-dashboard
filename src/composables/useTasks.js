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
import { useToast } from "../composables/useToast"

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
  const showConfirmModal = ref(false)
  const confirmMessage = ref("")
  const confirmTitle = ref("")
  const pendingDeleteId = ref(null) 
  let socket = null;
  //  TASKS 
  const loadTasks = async () => {
    try {
      const res = await getTasks();
      tasks.value = res.data.data || [];
      await loadAllComments();
    } catch (err) {
      console.log(err);
    }
  };
  //  COMMENTS LOAD 
  const setTaskComments = (taskId, comments) => {
    taskComments.value = {
      ...taskComments.value,
      [taskId]: comments
    };
  };
//LOAD ALL COMMENT
  const loadAllComments = async () => {
    await Promise.all(
      tasks.value.map(async (task) => {
        const res = await getTaskComments(task.id);
        setTaskComments(task.id, res.data.data || []);
      })
    );
  };

  //  WEBSOCKET 
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

  // UI HELPERS 
  const toggleComments = (taskId) => {
    visibleComments.value[taskId] = !visibleComments.value[taskId];
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  //  VIEW TASK 
 const handleViewTask = async (id) => {
  try {
    const response = await getTaskById(id);
    selectedTask.value = response.data.data;
    selectedTask.value.id = id; 
    showModal.value = true;
  } catch (error) {
    console.error(error);
  }
};
  // USERS 
  const loadUsers = async () => {
    const res = await getUsers();
    users.value = res.data.data || res.data;
  };
  const openAssignModal = async (taskId) => {
    await loadUsers();
    selectedTaskId.value = taskId;
    showAssignModal.value = true;
  };

// DELETE 
  const askDeleteTask = (id) => {
  pendingDeleteId.value = id
  confirmTitle.value = "Delete Task"
  confirmMessage.value = "Are you sure you want to delete this task?"
  showConfirmModal.value = true
}
const confirmDeleteTask = async () => {
  try {
    await deleteTask(pendingDeleteId.value)

    tasks.value = tasks.value.filter(t => t.id !== pendingDeleteId.value)

    triggerToast("Task deleted successfully", "success")

  } catch (error) {
    triggerToast("Failed to delete task", "error")
  } finally {
    showConfirmModal.value = false
    pendingDeleteId.value = null
  }
}

  //  CREATE 
  const handleCreateTask = async (payload) => {
    await createTask(payload);
    await loadTasks();
    showCreateModal.value = false;
  };

  //  ASSIGN 
  const handleAssignTask = async (userId) => {
    await assignTask(selectedTaskId.value, {
      assigned_to: userId
    });

    await loadTasks();
    showAssignModal.value = false;
  };
  //  FILTER 
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
  // ONMOUNTED 
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
const { showToast, toastMessage, toastType, triggerToast } = useToast()
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
    handleCreateTask,
    showCreateModal,
    taskComments,
    visibleComments,
    toggleComments,
    formatDate,
    showToast,
    toastMessage,
    toastType,
    triggerToast,
    showConfirmModal,
    confirmTitle,
    confirmMessage,
    askDeleteTask,
    confirmDeleteTask
  };
}