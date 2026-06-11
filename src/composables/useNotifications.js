import { ref, computed } from "vue";

const notifications = ref([]);

export function useNotifications() {

  const addNotification = (payload) => {
    notifications.value.unshift(payload);
  };

  const unreadCount = computed(() => notifications.value.length);

  const statusCount = computed(() =>
    notifications.value.filter(n => n.type === "status_updated").length
  );

  const clearNotifications = () => {
    notifications.value = [];
  };

  return {
    notifications,
    addNotification,
    unreadCount,
    statusCount,
    clearNotifications
  };
}