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
  return api.delete(`/delete-user/${id}/`);
};
//add user
export const addUser = async (payload) => {
  const response = await api.post("adduser/", payload);
  return response.data;
};
//  getting list of Task //
export const getTasks=async()=>{
return await api.get("tasks/")
};
//get task by id
export const getTaskById = async (id) => {
  return await api.get(`view-task/${id}/`);
  
};
//delete task
export const deleteTask = (id) => {
  return api.delete(`delete-task/${id}/`);
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
// get UNREAD COMMENT
export const getUnreadTaskComments = () => {
  return api.get("get-unreadcomment/");
};
//get task comments
export const getTaskComments = (taskId) => {
  return api.get(`get-taskcomment/${taskId}/`);
};
//markasread
export const markCommentsAsRead = () => {
  return api.post("mark-as-read/");
};
//count unread comment
export const getUnreadCommentCount = () => {
  return api.get("unread-taskcomment-count/");
};
//status update
export const updateTaskStatus = (taskId, data) => {
  return api.patch(`tasks/${taskId}/status/`, data);
};
// GET unread status notifications
export const getUnreadStatusNotifications = () => {
  return api.get("unread-status-notifications/");
};

// GET status notification count
export const getUnreadStatusCount = () => {
  return api.get("unread-status-count/");
};

// MARK status notifications as read
export const markStatusNotificationsRead = () => {
  return api.post("mark-status-read/");
};
//get-mytask-comment(user see his own comment)
export const getMyTaskComments = (taskId) => {
  return api.get(`tasks/${taskId}/my-comments/`);
};