import { ref, onMounted,onBeforeUnmount } from "vue";
import {
  getUnreadCommentCount,
  markCommentsAsRead,
  getUnreadStatusNotifications,
  getUnreadStatusCount,
  markStatusNotificationsRead
} from "../services/userApi";
import { getUnreadTaskComments } from "../services/userApi";
import api from "../services/api";

export default function useNavbar() {
  
  const showDropdown = ref(false);
  const unreadCount = ref(0);
  const statusCount = ref(0);
  const notifications = ref([]);
  let socket = null;
  
//fetch status count
const fetchStatusCount = async () => {
  const res = await getUnreadStatusCount();
  statusCount.value = res.data.count;
};
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

  const commentRes = await getUnreadTaskComments();
  const statusRes = await getUnreadStatusNotifications();
   notifications.value.forEach(n => {
    n.read = true;
  });
  const commentNotifications = commentRes.data.data.map(item => ({
  id: item.id,
  type: "comment",
  user_name: item.user_name,
  message: item.comment,
  task: item.task
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

  //  remove NEW indicator
  
  showDropdown.value = true;

  await Promise.all([
  markCommentsAsRead(),
  markStatusNotificationsRead()
]);
  fetchUnreadCount();
  fetchStatusCount();
};
  //  REAL TIME
 const connectWebSocket = () => {
  socket = new WebSocket("ws://127.0.0.1:8000/ws/comments/");

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // toast trigger point
    console.log("New comment:", data);

    // COMMENT update (existing logic)
    if (data.type === "new_comment") {
      fetchUnreadCount();
    }

    //  STATUS update (NEW ADDITION)
   if (data.type === "status_updated") {
  

  fetchStatusCount();
}
  };
};

 onMounted(() => {
  fetchUnreadCount();
  fetchStatusCount();
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
    showDropdown,
   
    statusCount,
  };
}