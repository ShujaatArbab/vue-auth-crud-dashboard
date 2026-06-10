import { ref } from "vue";

const socket = ref(null);
const isConnected = ref(false);

export function useCommentSocket() {
  
  const connectSocket = () => {
    const token = localStorage.getItem("access_token");

    if (!token || token === "null") {
      console.warn("No token → WebSocket not started");
      return;
    }

    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      return; // already connected
    }

    socket.value = new WebSocket(
      `ws://127.0.0.1:8000/ws/comments/?token=${token}`
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
  };
}