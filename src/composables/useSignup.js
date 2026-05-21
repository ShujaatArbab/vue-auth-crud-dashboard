import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import Swal from "sweetalert2";

export default function signupLogic() {

  const router = useRouter();

  // FORM STATE
  const form = reactive({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // ERROR STATE
  const errors = reactive({});
  const apiError = ref("");
  const loading = ref(false);

  // EMAIL VALIDATION
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // CLEAR ERRORS
  const clearErrors = () => {

    Object.keys(errors).forEach((key) => {
      delete errors[key];
    });

    apiError.value = "";
  };
        //password check
const validatePassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
};
  // SIGNUP HANDLER
  const handleSignup = async () => {

    clearErrors();

    // PREVENT MULTIPLE REQUESTS
    if (loading.value) return;

    // REQUIRED FIELD VALIDATION
    const requiredFields = [
      "username",
      "first_name",
      "last_name",
      "email",
      "password",
      "confirm_password",
    ];

    requiredFields.forEach((field) => {

      if (!form[field] || !form[field].trim()) {
        errors[field] = "This field is required";
      }

    });

    // EMAIL VALIDATION
    if (
      form.email &&
      !validateEmail(form.email)
    ) {
      errors.email = "Please enter a valid email address";
    }

    // PASSWORD LENGTH
    if (
  form.password &&
  !validatePassword(form.password)
) {
  errors.password =
    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
}

    // PASSWORD MATCH VALIDATION
    if (
      form.password &&
      form.confirm_password &&
      form.password !== form.confirm_password
    ) {
      errors.confirm_password =
        "Passwords do not match";
    }

    // STOP IF ERRORS EXIST
    if (Object.keys(errors).length > 0) {

      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please correct the highlighted fields.",
        confirmButtonColor: "#ef4444",
      });

      return;
    }

    loading.value = true;

    try {

      // API PAYLOAD
      const payload = {
        username: form.username.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirm_password: form.confirm_password,
      };

      console.log("SIGNUP PAYLOAD:", payload);

      // API REQUEST
      const response = await api.post(
        "/register/",
        payload
      );

      const res = response.data;

      console.log("SIGNUP RESPONSE:", res);

      // SUCCESS
      if (
        res?.status === true ||
        response.status === 201
      ) {

        // SUCCESS ALERT
        await Swal.fire({
          icon: "success",
          title: "Signup Successful",
          text: "Account created successfully!",
          confirmButtonColor: "#ef4444",
          confirmButtonText: "Continue",
        });

        // REDIRECT TO LOGIN
        router.push("/login");

      } else {

        apiError.value =
          res?.message || "Signup failed";

        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: apiError.value,
          confirmButtonColor: "#ef4444",
        });
      }

    } catch (err) {

      console.error("SIGNUP ERROR:", err);

      // BACKEND RESPONSE
      const backend = err.response?.data;

      console.log(
        "BACKEND RESPONSE:",
        backend
      );

      // HANDLE FIELD ERRORS
      if (backend?.errors) {

        Object.keys(backend.errors).forEach((key) => {

          const message = backend.errors[key];

          errors[key] = Array.isArray(message)
            ? message[0]
            : message;
        });
      }

      // GENERAL ERROR MESSAGE
      apiError.value =
        backend?.message ||
        "Signup failed. Please try again.";

      // ERROR ALERT
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: apiError.value,
        confirmButtonColor: "#ef4444",
      });

    } finally {

      loading.value = false;
    }
  };

  return {
    form,
    errors,
    apiError,
    loading,
    handleSignup,
  };
}