import axios from "axios";
import { useRouter } from "vue-router";

export function useAddUser() {

  const router = useRouter();

  const addUser = async (userData) => {

    try {

      await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        userData
      );

      // simulate ID (since API doesn't save)
      userData.id = Date.now();

      // navigate back with data
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