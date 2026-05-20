import { ref } from "vue";

import { useRouter } from "vue-router";

import api from "../services/api";

import { useAuthenticationStore } from "../store/Auth";

export function useLogin() {

  const router = useRouter();
  const authStore = useAuthenticationStore();
  

  const email = ref("");

  const password = ref("");

  const emailError = ref("");

  const passwordError = ref("");

  const apiError = ref("");

  const loading = ref(false);

  const validateEmail = (email) => {

    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  };

 const handleLogin = async () => {
  if (loading.value) return;

  emailError.value = "";
  passwordError.value = "";
  apiError.value = "";

  if (!email.value.trim()) {
    emailError.value = "Email required";
    return;
  }

  if (!validateEmail(email.value.trim())) {
    emailError.value = "Invalid email format";
    return;
  }

  if (!password.value.trim()) {
    passwordError.value = "Password required";
    return;
  }

  loading.value = true;

  try {
    const response = await api.post("login/", {
      email: email.value.trim(),
      password: password.value,
    });

console.log("Response",response.data)
    if (response.data?.status !== true) {
      apiError.value = response.data?.message || "Login failed";
      console.log("Response",response.data.data)
      return;
    }

    authStore.setAuth(response.data.data);
    router.push("/Users");

  } catch (err) {
    console.log(err);

    apiError.value =
      err.response?.data?.message ||
      "Login failed";

  } finally {
    loading.value = false;
  }
};

  return {
    email,
    password,
    emailError,
    passwordError,
    apiError,
    loading,
    handleLogin,
  };
}