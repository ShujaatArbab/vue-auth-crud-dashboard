import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthenticationStore } from "../store/Auth";

export function useLogin() {
  const router = useRouter();

  const email = ref("");
  const password = ref("");

  const emailError = ref("");
  const passwordError = ref("");
  const apiError = ref("");

  const loading = ref(false);

  const handleLogin = async () => {
    // RESET ERRORS
    emailError.value = "";
    passwordError.value = "";
    apiError.value = "";

    // EMAIL REGEX
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|pk)$/i;

    // VALIDATE EMAIL
    if (!email.value) {
      emailError.value = "Email required";
    } else if (!emailRegex.test(email.value.trim())) {
      emailError.value = "Email not valid";
    }

    // VALIDATE PASSWORD
    if (!password.value) {
      passwordError.value = "Password required";
    }

    // STOP IF ERRORS
    if (emailError.value || passwordError.value) return;

    loading.value = true;

    try {
      const authStore = useAuthenticationStore();

      // LOGIN via store
      const res = await authStore.login(email.value.trim(), password.value);

      // ✅ FIX: store returns { token, user } — save correctly
      if (res?.token) {
        sessionStorage.setItem("token", res.token);
      }

      if (res?.user) {
        sessionStorage.setItem("user", JSON.stringify(res.user));
      }

      // REDIRECT
      router.push("/dashboard");

    } catch (err) {
      apiError.value = err.response?.data?.message || err.message || "Login failed";
    } finally {
      loading.value = false;
    }
  };

  return { email, password, emailError, passwordError, apiError, loading, handleLogin };
}