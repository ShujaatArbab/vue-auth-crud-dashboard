import api from "../services/api";

// GET USERS
export const getUsers = () => {
  return api.get("/users/");
};

// UPDATE USER
export const updateUser = (id, data) => {
  return api.patch(`/users/${id}/`, data);
};

// GET SINGLE USER
export const getUserById = (id) => {
  return api.get(`/view/${id}/`);
};
export const deleteUser = (id) => {
  return api.delete(`/delete/${id}/`);
};
export const addUser = async (payload) => {
  const response = await api.post("adduser/", payload);
  return response.data;
};
//  getting list of Task //
export const getTasks=async()=>{
return await api.get("get-task/")
}