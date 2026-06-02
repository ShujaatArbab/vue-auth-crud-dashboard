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
//delete user
export const deleteUser = (id) => {
  return api.delete(`/delete/${id}/`);
};
export const addUser = async (payload) => {
  const response = await api.post("adduser/", payload);
  return response.data;
};
//  getting list of Task //
export const getTasks=async()=>{
return await api.get("tasks/")
};
export const getTaskById = async (id) => {
  return await api.get(`view-task/${id}/`);
  
};
//delete task
export const deleteTask = (id) => {
  return api.delete(`/tasks/${id}/`);
};
//createtask
export const createTask = async (payload) => {
  const response = await api.post("createtask/", payload);
  return response.data;
};
//assign task
export const assignTask = async (taskId, payload) => {
  const response = await api.post(
    `tasks/${taskId}/assign/`,
    payload
  );
  return response.data;
};
//fetch useer own task
export const fetchMyTasks = async () => {
  const res = await api.get("my-tasks/");
  return res.data.data;
};
//ADD-COMMENT
export const addTaskComment = async (taskId, comment) => {
  const res = await api.post(`tasks/${taskId}/comments/`, {
    comment: comment
  });

  return res.data;
};