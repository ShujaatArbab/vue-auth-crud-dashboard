import { useRouter } from "vue-router";
import { useUserStore } from "../store/userStore";

export function useAddUser() {

  const router = useRouter();
  const userStore = useUserStore();

  const addUser = async (userData) => {

    try {

      // simulate ID (since API doesn't save)
      userData.id = Date.now();

      // ✅ add to store so UI updates everywhere
      userStore.users.unshift(userData);

      // navigate back with data (UNCHANGED)
      router.push({
        path: "/users",
        query: {
          newUser: JSON.stringify(userData)
        }
      });

    } catch (error) {
      console.log("Add user failed:", error);
    }
  };

  return {
    addUser
  };
}