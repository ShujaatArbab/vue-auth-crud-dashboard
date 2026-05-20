import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR (attach access token)
api.interceptors.request.use((config) => {

  const token = sessionStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR (auto refresh token)
api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // if token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refresh = sessionStorage.getItem("refresh");

        if (!refresh) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // call refresh API
        const res = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh: refresh,
          }
        );

        const newAccess = res.data.access;

        // save new access token
        sessionStorage.setItem("access", newAccess);

        // update header and retry request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);

      } catch (err) {

        // refresh token expired → logout
        sessionStorage.clear();
        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;