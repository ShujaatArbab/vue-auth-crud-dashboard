import { ref } from "vue";

const socket = ref(null);
const isConnected = ref(false);
const commentEvents = ref([]);
export function useCommentSocket() {
  
  const connectSocket = () => {
    const token = sessionStorage.getItem("access");

if (!token || token === "null" || token === "undefined") {
  console.warn("Invalid token");
  return;
}

socket.value = new WebSocket(
  `ws://127.0.0.1:8000/ws/comments/?token=${encodeURIComponent(token)}`
);

    socket.value.onopen = () => {
      console.log("WebSocket connected");
      isConnected.value = true;
    };

    socket.value.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    socket.value.onclose = () => {
      console.warn("WebSocket closed");
      isConnected.value = false;
    };
  };

  const onMessage = (callback) => {
    if (!socket.value) return;

    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
      commentEvents.value.push(data);
      callback(data);
    };
  };

  const disconnectSocket = () => {
    if (socket.value) {
      socket.value.close();
      socket.value = null;
      isConnected.value = false;
    }
  };

  return {
    connectSocket,
    onMessage,
    disconnectSocket,
    isConnected,
    commentEvents
  };
}