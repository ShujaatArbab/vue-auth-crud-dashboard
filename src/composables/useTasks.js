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
import { useCommentSocket } from "./useCommentSocket";
import { useToast } from "../composables/useToast";
import { addTaskComment } from "../services/userApi";

export function useTasks() {
  const { commentEvents } = useCommentSocket();
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
  const showConfirmModal = ref(false);
  const confirmMessage = ref("");
  const confirmTitle = ref("");
  const pendingDeleteId = ref(null);
  const showReassignModal  = ref(false);
  const pendingAssignUserId = ref(null);

  // --------------------------
  // TOAST
  // --------------------------
  const { showToast, toastMessage, toastType, triggerToast } = useToast();

  // --------------------------
  // ADD COMMENT (NO SOCKET HERE)
  // --------------------------
  const submitAdminComment = async (commentText) => {
    if (!commentText || !commentText.trim()) return;

    try {
      await addTaskComment(
        selectedTask.value.id,
        commentText.trim()
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

  // --------------------------
  // LOAD TASKS
  // --------------------------
  const loadTasks = async () => {
    try {
      const res = await getTasks();
      tasks.value = res.data.data || [];
      await loadAllComments();
    } catch (err) {
      console.log(err);
    }
  };

  // --------------------------
  // COMMENTS
  // --------------------------
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

  // --------------------------
  // UI HELPERS
  // --------------------------
  const toggleComments = (taskId) => {
    visibleComments.value[taskId] = !visibleComments.value[taskId];
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // --------------------------
  // VIEW TASK
  // --------------------------
  const handleViewTask = async (id) => {
  try {
    const response = await getTaskById(id);
    selectedTask.value = response.data.data;
    selectedTask.value.id = id;

    //  IMPORTANT: always load latest comments when opening modal
    const res = await getTaskComments(id);

    taskComments.value = {
      ...taskComments.value,
      [id]: res.data.data || []
    };

    showModal.value = true;
  } catch (error) {
    console.error(error);
  }
};
  // --------------------------
  // USERS
  // --------------------------
  const loadUsers = async () => {
    const res = await getUsers();
    users.value = res.data.data || res.data;
  };

  const openAssignModal = async (taskId) => {
    await loadUsers();
    selectedTaskId.value = taskId;
    showAssignModal.value = true;
  };

  // --------------------------
  // DELETE
  // --------------------------
  const askDeleteTask = (id) => {
    pendingDeleteId.value = id;
    confirmTitle.value = "Delete Task";
    confirmMessage.value = "Are you sure you want to delete this task?";
    showConfirmModal.value = true;
  };

  const confirmDeleteTask = async () => {
    try {
      await deleteTask(pendingDeleteId.value);

      tasks.value = tasks.value.filter(
        t => t.id !== pendingDeleteId.value
      );

      triggerToast("Task deleted successfully", "success");

    } catch (error) {
      triggerToast("Failed to delete task", "error");
    } finally {
      showConfirmModal.value = false;
      pendingDeleteId.value = null;
    }
  };

  // --------------------------
  // CREATE
  // --------------------------
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
  // ASSIGN
  // askassign
const askAssignTask = (userId) => {
  pendingAssignUserId.value = userId;
  confirmTitle.value = "Confirm Assignment";
  confirmMessage.value = "Are you sure you want to reassign this task?";
  showAssignModal.value = false; 
  showReassignModal.value = true;
};
//confirmassign
const confirmAssignTask = async () => {
  const userId = pendingAssignUserId.value;
  const task   = tasks.value.find(t => t.id === selectedTaskId.value);
  const isReassign = task?.assigned_to && task.assigned_to !== userId;

  try {
    await assignTask(selectedTaskId.value, { assigned_to: userId });
    await loadTasks();
    showAssignModal.value  = false;
    showReassignModal.value = false;
    triggerToast(isReassign ? "Task reassigned successfully" : "Task assigned successfully", "success");
  } catch (err) {
    triggerToast(err.response?.data?.detail || "Assign failed", "error");
  }
};
  // --------------------------
  // FILTER + PAGINATION
  // --------------------------
  const filteredTasks = computed(() =>
    tasks.value.filter(t =>
      (t.title || "")
        .toLowerCase()
        .includes(search.value.toLowerCase())
    )
  );

  const totalPages = computed(() =>
    Math.ceil(filteredTasks.value.length / perPage.value) || 1
  );

  const paginatedTasks = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return filteredTasks.value.slice(
      start,
      start + perPage.value
    );
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

  // --------------------------
  // LIFECYCLE
  // --------------------------
  onMounted(async () => {
    await loadTasks();
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
//watcher
watch(commentEvents, (events) => {
  const latest = events.at(-1);
  if (!latest) return;

  const taskId = latest.task_id;

  if (!taskComments.value[taskId]) {
    taskComments.value[taskId] = [];
  }

  taskComments.value = {
    ...taskComments.value,
    [taskId]: [latest, ...(taskComments.value[taskId] || [])]
  };

  //  ALSO update selectedTask if modal is open
  if (selectedTask.value?.id === taskId) {
    selectedTask.value = {
      ...selectedTask.value,
      comments: taskComments.value[taskId]
    };
  }
});
  // --------------------------
  // RETURN
  // --------------------------
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
    showReassignModal,
    askAssignTask,
    confirmAssignTask,
  };
}