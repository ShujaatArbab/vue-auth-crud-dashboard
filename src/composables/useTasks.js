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
import { addTaskComment } from "../services/userApi";
export function useTasks() {
  const adminComment = ref("");
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
  //add admin comment
  const submitAdminComment = async (commentText) => {
  if (!commentText || !commentText.trim()) return;

  try {
    await addTaskComment(
      selectedTask.value.id,
      commentText.trim()   // ✅ PASS STRING ONLY
    );

    const res = await getTaskComments(selectedTask.value.id);

    taskComments.value = {
      ...taskComments.value,
      [selectedTask.value.id]: res.data.data
    };

    triggerToast("Comment added successfully", "success");
  } catch (error) {
    console.log("ERROR RESPONSE:", error.response?.data);
    triggerToast("Failed to add comment", "error");
  }
};
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

  const connectCommentsSocket = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return; // already connected
  }

  socket = new WebSocket("ws://127.0.0.1:8000/ws/comments/");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onerror = (err) => {
    console.log("WebSocket error:", err);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // COMMENTS
    if (data.type === "new_comment") {
      const taskId = data.task_id;
      const existing = taskComments.value[taskId] || [];

      taskComments.value = {
        ...taskComments.value,
        [taskId]: [data.comment, ...existing]
      };
    }

    // STATUS UPDATE
    if (data.type === "status_updated") {
      const taskId = data.task_id;

      const task = tasks.value.find(t => t.id === taskId);
      if (task) {
        task.status = data.status;
      }
    }
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
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
  try {
    await createTask(payload);

    await loadTasks();
    showCreateModal.value = false;

    triggerToast("Task created successfully", "success");

  } catch (error) {
  console.log(error);

  const errorData = error.response?.data;

  let message = "Failed to create task";

  if (errorData) {
    const firstKey = Object.keys(errorData)[0];

    if (
      firstKey &&
      Array.isArray(errorData[firstKey]) &&
      errorData[firstKey].length
    ) {
      message = errorData[firstKey][0];
    } else if (errorData.error) {
      message = errorData.error;
    }
  }

  triggerToast(message, "error");
}
};

  //  ASSIGN 
 const handleAssignTask = async (userId) => {
  console.log("TASK ID:", selectedTaskId.value);
  console.log("USER ID:", userId);
  const task = tasks.value.find(t => t.id === selectedTaskId.value);

  const isReassign = task?.assigned_to && task.assigned_to !== userId;

  try {
  await assignTask(selectedTaskId.value, {
    assigned_to: userId
  });

  await loadTasks();
  showAssignModal.value = false;

  triggerToast(
  isReassign ? "Task reassigned successfully" : "Task assigned successfully",
  "success"
);

} catch (err) {
  console.log("FULL ERROR:", err.response?.data);
  triggerToast(
    err.response?.data?.detail ||
    "Assign failed",
    "error"
  );
}
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
 onMounted(async () => {
  await loadTasks();
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
    confirmDeleteTask,
    adminComment,
    submitAdminComment,
  };
}