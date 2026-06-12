import { ref, computed, onMounted, watch } from "vue";
import {
  getTasks,
  getTaskById,
  getUsers,
  deleteTask,
  createTask,
  assignTask,
  getTaskComments,
  addTaskComment
} from "../services/userApi";
import { useCommentSocket } from "./useCommentSocket";
import { useToast } from "../composables/useToast";
import { useNotifications } from "./useNotifications";

export function useTasks() {
  const { addNotification } = useNotifications();
  const { connectSocket, onMessage, commentEvents } = useCommentSocket();

  // Form & UI States
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
  const showReassignModal = ref(false);
  const pendingAssignUserId = ref(null);

  const { showToast, toastMessage, toastType, triggerToast } = useToast();

  const openCreateModal = async () => {
    await loadUsers();
    showCreateModal.value = true;
  };

  // --------------------------
  // ADD COMMENT
  // --------------------------
  const submitAdminComment = async (commentText) => {
    if (!commentText || !commentText.trim()) return;

    try {
      await addTaskComment(selectedTask.value.id, commentText.trim());
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
  // LOAD TASKS (With String Coercion Fix)
  // --------------------------
  const loadTasks = async () => {
    try {
      const res = await getTasks();
      const fetchedTasks = res.data.data || [];
      
      // FIX 1: Convert IDs to Strings to bypass rigid type matching (String vs Int)
      tasks.value = fetchedTasks.map(task => {
        if (task.assigned_to) {
          const matchedUser = users.value.find(u => String(u.id) === String(task.assigned_to));
          if (matchedUser) {
            task.assigned_to_name = matchedUser.name || matchedUser.username || matchedUser.first_name;
          }
        }
        return task;
      });

      await loadAllComments();
    } catch (err) {
      console.log(err);
    }
  };

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
      tasks.value = tasks.value.filter(t => t.id !== pendingDeleteId.value);
      triggerToast("Task deleted successfully", "success");
    } catch (error) {
      triggerToast("Failed to delete task", "error");
    } finally {
      showConfirmModal.value = false;
      pendingDeleteId.value = null;
    }
  };

  // --------------------------
  // CREATE TASK (With Automated Assignment Fallback Chain)
  // --------------------------
 // --------------------------
// CREATE & AUTOMATICALLY ASSIGN TASK
// --------------------------
const handleCreateTask = async (payload) => {
  try {
    const res = await createTask(payload);

    console.log("CREATE RESPONSE", res);

    const newTaskId = res.task.id;

    if (payload.assigned_to) {
      await assignTask(newTaskId, {
        assigned_to: payload.assigned_to
      });
    }

    await loadTasks();

    showCreateModal.value = false;

    triggerToast(
      "Task created and assigned successfully!",
      "success"
    );

  } catch (error) {
    console.error(error);

    triggerToast(
      error.response?.data?.error ||
      "Failed to create task",
      "error"
    );
  }
};
  // --------------------------
  // REASSIGN TASK ACTION
  // --------------------------
  const askAssignTask = (userId) => {
    pendingAssignUserId.value = userId;
    confirmTitle.value = "Confirm Assignment";
    confirmMessage.value = "Are you sure you want to reassign this task?";
    showAssignModal.value = false; 
    showReassignModal.value = true;
  };

  const confirmAssignTask = async () => {
    const userId = pendingAssignUserId.value;
    const task = tasks.value.find(t => t.id === selectedTaskId.value);
    const isReassign = task?.assigned_to && task.assigned_to !== userId;

    try {
      await assignTask(selectedTaskId.value, { assigned_to: userId });
      await loadTasks();
      showAssignModal.value = false;
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
    tasks.value.filter(t => (t.title || "").toLowerCase().includes(search.value.toLowerCase()))
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
    filteredTasks.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1
  );

  const rangeEnd = computed(() =>
    Math.min(currentPage.value * perPage.value, filteredTasks.value.length)
  );

  // --------------------------
  // LIFECYCLE (Unified Initialization Hook)
  // --------------------------
  onMounted(async () => {
    // FIX 3: Consolidated double hooks to run linearly to avoid execution collisions
    await loadUsers();
    await loadTasks();

    connectSocket();

    onMessage((data) => {
      if (data.type === "status_updated") {
        const task = tasks.value.find(t => t.id === data.task_id);
        if (task) {
          task.status = data.status;
        }
        if (selectedTask.value?.id === data.task_id) {
          selectedTask.value.status = data.status;
        }
        addNotification({
          id: Date.now(),
          type: data.type,
          message: data.message,
          task: data.task,
          user_name: data.user_name
        });
      }
    });
  });

  // Watchers
  watch(search, () => (currentPage.value = 1));
  watch(perPage, () => (currentPage.value = 1));

  watch(taskComments, (val) => {
    if (!selectedTask.value?.id) return;
    selectedTask.value = {
      ...selectedTask.value,
      comments: val[selectedTask.value.id] || []
    };
  }, { deep: true });

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

    if (selectedTask.value?.id === taskId) {
      selectedTask.value = {
        ...selectedTask.value,
        comments: taskComments.value[taskId]
      };
    }
  });

  return {
    tasks, search, perPage, currentPage, filteredTasks, paginatedTasks, totalPages,
    goPage, rangeStart, rangeEnd, showModal, selectedTask, handleViewTask,
    showAssignModal, users, openAssignModal, handleCreateTask, showCreateModal,
    taskComments, visibleComments, toggleComments, formatDate, showToast,
    toastMessage, toastType, triggerToast, showConfirmModal, confirmTitle,
    confirmMessage, askDeleteTask, confirmDeleteTask, adminComment, submitAdminComment,
    showReassignModal, askAssignTask, confirmAssignTask, openCreateModal,
  };
}