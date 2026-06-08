import { ref,computed, onMounted } from "vue";
import { fetchMyTasks } from "../services/userApi";
import { addTaskComment } from "../services/userApi";
import { updateTaskStatus } from "../services/userApi";
import { getMyTaskComments } from "../services/userApi";

export function useMyTasks() {
    
    
   
    
    const comment = ref("");
    const showCommentModal = ref(false)
    const selectedTask = ref(null)
    const taskComments = ref({})
  const openComment = (task) => {
  selectedTask.value = task
  showCommentModal.value = true
}
  const tasks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const getMyTasks = async () => {
    loading.value = true;
    error.value = null;

    try {
      tasks.value = await fetchMyTasks();
    } catch (e) {
      error.value = "Failed to load tasks";
    } finally {
      loading.value = false;
    }
  };
const handleViewTask = async (task) => {
  selectedTask.value = task;
  await loadTaskComments(task.id);
  showModal.value = true;
};

/* UI STATE */
const search = ref("");
const perPage = ref(5);
const currentPage = ref(1);

/* MODAL */
const showModal = ref(false);


/* LOAD DATA */
onMounted(() => {
  getMyTasks();
});

/* SEARCH */
const filteredTasks = computed(() => {
  if (!tasks.value) return [];

  return tasks.value.filter((t) =>
    t.title.toLowerCase().includes(search.value.toLowerCase()) ||
    (t.assigned_to_name || "").toLowerCase().includes(search.value.toLowerCase())
  );
});

/* PAGINATION */
const totalPages = computed(() =>
  Math.ceil(filteredTasks.value.length / perPage.value)
);

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredTasks.value.slice(start, start + perPage.value);
});

const rangeStart = computed(() =>
  filteredTasks.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1
);

const rangeEnd = computed(() =>
  Math.min(currentPage.value * perPage.value, filteredTasks.value.length)
);

/* PAGE CHANGE */
const goPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};


/* DATE FORMAT */
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};
//submit comment
const submitComment = async () => {
  if (!comment.value.trim()) return;

  loading.value = true;

  try {
    await addTaskComment(props.task.id, comment.value);

    comment.value = "";

    emit("close"); // close modal after submit
  } catch (err) {
    console.log("Error adding comment", err);
  } finally {
    loading.value = false;
  }
};
const updateStatus = async (taskId, status) => {
  try {
    await updateTaskStatus(taskId, {
      status: status,
    });
   

    // update UI instantly (no refresh)
    const task = tasks.value.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      
    }

  } catch (error) {
    console.log("Status update failed", error);
  }
};
//load user comments
const loadTaskComments = async (taskId) => {
  try {
    const response = await getMyTaskComments(taskId);

    taskComments.value[taskId] = response.data.data;
  } catch (error) {
    console.log(error);
  }
};
  return {
    tasks,
    loading,
    error,
    search,
    perPage,
    currentPage,
    showModal,
    filteredTasks,
    totalPages,
    selectedTask,
    paginatedTasks,
    rangeStart,
    rangeEnd,
    getMyTasks,
    handleViewTask,
    goPage,
    formatDate,
    showCommentModal,
    taskComments,
    openComment,
    updateStatus,
      taskComments,
    loadTaskComments,
 
  };
}