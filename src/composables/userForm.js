import { reactive, ref, computed } from "vue";


export function userForm(props, emit) {

  // STATE
  const localUser = reactive({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    company: "",
    gender: "",
    bloodGroup: "",
    role: "",
    department: "",
    skills: [],
    password: "",
    confirmPassword: "",
    ...props.user
  });

  const errors = reactive({});
  const showPw = ref(false);
  const showCp = ref(false);
  const submitted = ref(false);

  const allSkills = [
    "Vue",
    "React",
    "Angular",
    "Node.js",
    "Python",
    "Laravel"
  ];

  // PASSWORD STRENGTH
  const strengthScore = computed(() => {
    const pw = localUser.password;
    if (!pw) return 0;

    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;

    return Math.max(s, 1);
  });

  const strengthText = computed(() =>
    ["", "Weak", "Fair", "Good", "Strong"][strengthScore.value] || ""
  );

  const strengthColor = computed(() =>
    ["", "#e24b4a", "#ef9f27", "#185fa5", "#3b6d11"][strengthScore.value] || ""
  );

  const strengthStyle = computed(() => ({
    width: [0, 25, 50, 75, 100][strengthScore.value] + "%",
    background: strengthColor.value
  }));

  // FIELD CLASS
  const fieldClass = (field) => {
    return errors[field] ? "field-err" : "";
  };

  // TOGGLE SKILL
  const toggleSkill = (skill) => {
    const idx = localUser.skills.indexOf(skill);

    if (idx === -1) {
      localUser.skills.push(skill);
    } else {
      localUser.skills.splice(idx, 1);
    }

    if (localUser.skills.length) {
      errors.skills = "";
    }
  };

  // LIVE VALIDATION
  const liveCheck = (field) => {

    const u = localUser;

    if (field === "name") {
      errors.name = u.name.trim() ? "" : "Name is required";
    }

    if (field === "email") {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email);
      errors.email = !u.email
        ? "Email is required"
        : !ok
        ? "Invalid email address"
        : "";
    }

    if (field === "role") {
      errors.role = u.role ? "" : "Role is required";
    }

    if (field === "password") {
      errors.password = !u.password
        ? "Password is required"
        : strengthScore.value < 2
        ? "Password too weak"
        : "";
    }

    if (field === "confirm") {
      errors.confirmPassword = !u.confirmPassword
        ? "Please confirm password"
        : u.password !== u.confirmPassword
        ? "Passwords do not match"
        : "";
    }
  };

  // VALIDATE FULL FORM
  const validateForm = () => {

    Object.keys(errors).forEach(k => delete errors[k]);

    const u = localUser;

    if (!u.name.trim()) errors.name = "Name is required";

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email);

    if (!u.email) errors.email = "Email is required";
    else if (!emailOk) errors.email = "Invalid email address";

    if (!u.gender) errors.gender = "Gender is required";
    if (!u.role) errors.role = "Role is required";

    if (!u.skills.length) errors.skills = "Select at least one skill";

    if (!u.password) errors.password = "Password is required";
    else if (strengthScore.value < 2)
      errors.password = "Password too weak";

    if (!u.confirmPassword)
      errors.confirmPassword = "Please confirm password";
    else if (u.password !== u.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    return Object.keys(errors).length === 0;
  };

  // SUBMIT
  const handleSubmit = () => {

    if (validateForm()) {

      submitted.value = true;

      setTimeout(() => {
        submitted.value = false;
      }, 3000);

      emit("submit-user", { ...localUser });
    }
  };
  const isFormValid = computed(() => {
  const u = localUser;

  return (
    u.name.trim() &&
    u.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u.email) &&
    u.gender &&
    u.role &&
    u.skills.length > 0 &&
    u.password &&
    u.confirmPassword &&
    u.password === u.confirmPassword &&
    strengthScore.value >= 2
  );
});

  return {
    localUser,
    errors,
    showPw,
    showCp,
    submitted,
    allSkills,

    strengthScore,
    strengthText,
    strengthColor,
    strengthStyle,
     
    fieldClass,
    toggleSkill,
    liveCheck,
    validateForm,
    handleSubmit,
    isFormValid 
  };
}