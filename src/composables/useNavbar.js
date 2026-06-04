import { ref, onMounted,onBeforeUnmount } from "vue";
import {
  getUnreadCommentCount,
  markCommentsAsRead
} from "../services/userApi";
import { getUnreadTaskComments } from "../services/userApi";
import api from "../services/api";

export default function useNavbar() {
  const showDropdown = ref(false);
  const unreadCount = ref(0);
  const notifications = ref([]);
  let socket = null;

  //  BADGE COUNT (GLOBAL)
  const fetchUnreadCount = async () => {
    const res = await getUnreadCommentCount();
    unreadCount.value = res.data.count;
  };
  const handleClickOutside = (event) => {
  const wrapper = document.querySelector(".notification-wrapper");

  if (wrapper && !wrapper.contains(event.target)) {
    showDropdown.value = false;
  }
};
  //  CLICK BELL 
const openNotifications = async () => {
  if (showDropdown.value) {
    showDropdown.value = false;
    return;
  }

  const res = await getUnreadTaskComments();

  notifications.value = res.data.data;
  showDropdown.value = true;

  await markCommentsAsRead();
  fetchUnreadCount();
};
  //  REAL TIME
const connectWebSocket = () => {
 socket = new WebSocket("ws://127.0.0.1:8000/ws/comments/");

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // toast trigger point
    console.log("New comment:", data);

    fetchUnreadCount();
  };
};

 onMounted(() => {
  fetchUnreadCount();
  connectWebSocket();

  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
  return {
    unreadCount,
    notifications,
    openNotifications,
    showDropdown
  };
}