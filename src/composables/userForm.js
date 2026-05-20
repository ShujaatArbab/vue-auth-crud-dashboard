import { reactive, ref, computed, watch } from "vue";

export function userForm(props, emit) {

  const emptyUser = {
    id: null,
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    city: "",
    dob: "",
    gender: "",
  };

  const localUser = reactive({ ...emptyUser });

  const errors = reactive({});
  const submitted = ref(false);

  const showPassword = ref(false);
  const showConfirmPassword = ref(false);

  // ✅ FIXED AUTO-FILL (ROBUST + SAFE NORMALIZATION)
  watch(
    () => props.user,
    (u) => {

      if (!u || Object.keys(u).length === 0) {
        Object.assign(localUser, emptyUser);
        return;
      }

      Object.assign(localUser, {
        id: u.id ?? null,
        username: u.username ?? "",

        // handle both API formats safely
        first_name: u.first_name ?? u.firstName ?? "",
        last_name: u.last_name ?? u.lastName ?? "",

        email: u.email ?? "",
        phone: u.phone ?? "",
        country: u.country ?? "",
        city: u.city ?? "",
        dob: u.dob ?? "",
        gender: u.gender ?? "",

        // ⚠️ IMPORTANT FIX:
        // do NOT preload password from backend
        password: "",
        confirmPassword: "",
      });

      submitted.value = false;
      Object.keys(errors).forEach(k => delete errors[k]);
    },
    { immediate: true }
  );

  // ✅ VALIDATION (FIXED: password only required for ADD, not EDIT)
  const validateForm = () => {

    Object.keys(errors).forEach(k => delete errors[k]);

    if (!localUser.username.trim()) errors.username = "Username required";
    if (!localUser.first_name.trim()) errors.first_name = "First name required";
    if (!localUser.last_name.trim()) errors.last_name = "Last name required";
    if (!localUser.email.trim()) errors.email = "Email required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (localUser.email && !emailRegex.test(localUser.email)) {
      errors.email = "Invalid email format";
    }

    // ✅ PASSWORD ONLY REQUIRED FOR NEW USER
    if (!localUser.id) {
      if (!localUser.password.trim()) {
        errors.password = "Password required";
      }
      if (!localUser.confirmPassword.trim()) {
        errors.confirmPassword = "Confirm password required";
      }
    }

    // if password entered → validate
    if (localUser.password) {
      if (localUser.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }

      if (localUser.password !== localUser.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (!localUser.phone.trim()) errors.phone = "Phone required";
    if (!localUser.country.trim()) errors.country = "Country required";
    if (!localUser.city.trim()) errors.city = "City required";
    if (!localUser.dob.trim()) errors.dob = "DOB required";
    if (!localUser.gender.trim()) errors.gender = "Gender required";

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    submitted.value = true;
    if (!validateForm()) return;

    emit("submit-user", { ...localUser });
  };

  const isFormValid = computed(() =>
    localUser.username &&
    localUser.first_name &&
    localUser.last_name &&
    localUser.email &&
    localUser.gender
  );

  return {
    localUser,
    errors,
    submitted,
    handleSubmit,
    isFormValid,
    showPassword,
    showConfirmPassword
  };
}