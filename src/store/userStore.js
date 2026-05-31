import { defineStore } from "pinia";
import api from "../services/api";
import { getUserById } from "../services/userApi";

export const useUserStore = defineStore("userStore", {

  state: () => ({
    users: [],
  }),

  actions: {

    async fetchAllUsers() {

      try {

        const response = await api.get("users/");
        
        this.users = response.data;


        return response.data;

      } catch (error) {

        console.log("Fetch users error:", error);
        throw error;
      }
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
  }
});