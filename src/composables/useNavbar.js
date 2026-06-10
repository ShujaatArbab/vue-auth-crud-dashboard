import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  getUnreadCommentCount,
  markCommentsAsRead,
  getUnreadStatusNotifications,
  getUnreadStatusCount,
  markStatusNotificationsRead,
  getUnreadTaskComments
} from "../services/userApi";

import { useCommentSocket } from "../composables/useCommentSocket";

export default function useNavbar() {

  const showDropdown = ref(false);
  const unreadCount = ref(0);
  const statusCount = ref(0);
  const notifications = ref([]);

  const { connectSocket, onMessage, disconnectSocket } = useCommentSocket();

  // --------------------------
  // FETCH COUNTS
  // --------------------------
  const fetchStatusCount = async () => {
    const res = await getUnreadStatusCount();
    statusCount.value = res.data.count;
  };

  const fetchUnreadCount = async () => {
    const res = await getUnreadCommentCount();
    unreadCount.value = res.data.count;
  };

  // --------------------------
  // CLICK OUTSIDE DROPDOWN
  // --------------------------
  const handleClickOutside = (event) => {
    const wrapper = document.querySelector(".notification-wrapper");

    if (wrapper && !wrapper.contains(event.target)) {
      showDropdown.value = false;
    }
  };

  // --------------------------
  // OPEN NOTIFICATIONS
  // --------------------------
  const openNotifications = async () => {
    if (showDropdown.value) {
      showDropdown.value = false;
      return;
    }

    const commentRes = await getUnreadTaskComments();
    const statusRes = await getUnreadStatusNotifications();

    const commentNotifications = commentRes.data.data.map(item => ({
      id: item.id,
      type: "comment",
      user_name: item.user_name,
      message: item.comment || item.message || "No content",
      task: item.task || { title: item.task_title || "Task" }
    }));

    const statusNotifications = statusRes.data.data.map(item => ({
      id: item.id,
      type: "status",
      user_name: item.user_name,
      message: `${item.user_name} changed status to ${item.status}`,
      task: {
        title: item.task_title
      }
    }));

    notifications.value = [
      ...statusNotifications,
      ...commentNotifications
    ];

    showDropdown.value = true;

    await Promise.all([
      markCommentsAsRead(),
      markStatusNotificationsRead()
    ]);

    fetchUnreadCount();
    fetchStatusCount();
  };

  // --------------------------
  // REAL TIME SOCKET (CLEAN)
  // --------------------------
  const initSocket = () => {
    connectSocket();

    onMessage((data) => {

      // NEW COMMENT
      if (data.type === "new_comment") {

        unreadCount.value += 1;

        // prevent duplicates
        const exists = notifications.value.some(
          n => n.id === data.comment_id
        );

        if (!exists) {
          notifications.value.unshift({
            id: data.comment_id || Date.now(),
            user_name: data.user_name || "Unknown",
            message: data.comment || "New comment",
            task: {
              title: data.task_title || "Task"
            }
          });
        }
      }

      // STATUS UPDATE
      if (data.type === "status_updated") {
        fetchStatusCount();
      }
    });
  };

  // --------------------------
  // LIFECYCLE
  // --------------------------
  onMounted(() => {
    fetchUnreadCount();
    fetchStatusCount();

    document.addEventListener("click", handleClickOutside);

    const token = localStorage.getItem("access_token");

    if (token) {
      initSocket();
    }
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
    disconnectSocket();
  });

  // --------------------------
  // RETURN
  // --------------------------
  return {
    unreadCount,
    notifications,
    openNotifications,
    showDropdown,
    statusCount,
    connectSocket,
  };
}