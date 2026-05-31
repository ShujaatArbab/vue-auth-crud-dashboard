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
  const today = new Date().toISOString().split("T")[0];
  // =========================
  // AUTO FILL / EDIT MODE
  // =========================
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
        first_name: u.first_name ?? u.firstName ?? "",
        last_name: u.last_name ?? u.lastName ?? "",
        email: u.email ?? "",
        phone: u.phone ?? "",
        country: u.country ?? "",
        city: u.city ?? "",
        dob: u.dob ?? "",
        gender: u.gender ?? "",

        // never preload password
        password: "",
        confirmPassword: "",
      });

      submitted.value = false;

      Object.keys(errors).forEach(k => delete errors[k]);

    },
    { immediate: true }
  );

  // =========================
  // LIVE PASSWORD VALIDATION
  // =========================
  watch(
    [() => localUser.password, () => localUser.confirmPassword],
    () => {

      // =====================
      // PASSWORD RULES
      // =====================

      if (localUser.password) {

        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(localUser.password)) {

          errors.password =
            "Password must contain uppercase, lowercase, number, special character and minimum 8 characters";

        } else {

          errors.password = "";

        }

      } else {

        errors.password = "";

      }

      // =====================
      // CONFIRM PASSWORD MATCH
      // =====================

      if (localUser.confirmPassword) {

        if (localUser.password !== localUser.confirmPassword) {

          errors.confirmPassword = "Passwords do not match";

        } else {

          errors.confirmPassword = "";

        }

      } else {

        errors.confirmPassword = "";

      }

    }
  );

  // =========================
  // FORM VALIDATION
  // =========================
  const validateForm = () => {

    Object.keys(errors).forEach(k => delete errors[k]);

    // =====================
    // USERNAME
    // =====================

    if (!localUser.username.trim())
      errors.username = "Username required";

    // =====================
    // FIRST NAME
    // =====================

    if (!localUser.first_name.trim())
      errors.first_name = "First name required";

    // =====================
    // LAST NAME
    // =====================

    if (!localUser.last_name.trim())
      errors.last_name = "Last name required";

    // =====================
    // EMAIL
    // =====================

    if (!localUser.email.trim())
      errors.email = "Email required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (localUser.email && !emailRegex.test(localUser.email)) {
      errors.email = "Invalid email format";
    }

    // =====================
    // PASSWORD REQUIRED
    // =====================

    if (!localUser.password.trim()) {
      errors.password = "Password required";
    }

    if (!localUser.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password required";
    }

    // =====================
    // PASSWORD VALIDATION
    // =====================

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (
      localUser.password &&
      !passwordRegex.test(localUser.password)
    ) {

      errors.password =
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters";
    }

    // =====================
    // CONFIRM PASSWORD
    // =====================

    if (
      localUser.password &&
      localUser.confirmPassword &&
      localUser.password !== localUser.confirmPassword
    ) {

      errors.confirmPassword = "Passwords do not match";
    }

    // =====================
    // PHONE
    // =====================

    if (!localUser.phone.trim())
      errors.phone = "Phone required";

    // =====================
    // COUNTRY
    // =====================

    if (!localUser.country.trim())
      errors.country = "Country required";

    // =====================
    // CITY
    // =====================

    if (!localUser.city.trim())
      errors.city = "City required";

    // =====================
    // DOB
    // =====================

    if (!localUser.dob.trim())
      errors.dob = "DOB required";

    // =====================
    // GENDER
    // =====================

    if (!localUser.gender.trim())
      errors.gender = "Gender required";

    // =====================
    // FINAL CHECK
    // =====================

    return Object.keys(errors).every(key => !errors[key]);

  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = () => {

    submitted.value = true;

    if (!validateForm()) return;

    emit("submit-user", { ...localUser });

  };

  // =========================
  // FORM VALID
  // =========================
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
    showConfirmPassword,
    today
  };
}