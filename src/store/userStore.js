import { defineStore } from "pinia";
import api from "../services/api";
import { getUserById } from "../services/userApi";
import { useAuthenticationStore } from "../store/Auth";

export const useUserStore = defineStore("userStore", {

  state: () => ({
    users: [],
  }),

  actions: {

    async fetchAllUsers() {

  const authStore = useAuthenticationStore();

  if (authStore.user?.role !== "admin") {
    console.warn("Not allowed");
    return [];
  }

  const response = await api.get("users/", {
    headers: {
      Authorization: `Bearer ${authStore.access}`,
    },
  });

  this.users = response.data;
  return response.data;
 },
                    //view specific user 
 async fetchUserById(id) {
  const res = await getUserById(id);
  return res.data.data;
 },
 async getUserById(id){
 const res=await api.get(`/view/${id}/`);
 return res.data.data;
}
  },
  async fetchUserProfile(id) {
  const authStore = useAuthenticationStore();

  const res = await api.get(`/view/${id}/`, {
    headers: {
      Authorization: `Bearer ${authStore.access}`,
    },
  });

  return res.data.data;   // full profile from DB
}
});