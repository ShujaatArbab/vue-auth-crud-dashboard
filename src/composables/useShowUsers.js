import { ref, computed, onMounted, watch } from "vue";

import axios from "axios";
import Swal from "sweetalert2";

const BG_COLORS = ["#e6f1fb", "#eaf3de", "#faeeda", "#fcebeb"];
const TX_COLORS = ["#0c447c", "#27500a", "#633806", "#791f1f"];

export function useShowUsers(router) {

  const users        = ref([]);
  const currentPage  = ref(1);
  const search       = ref("");
  const perPage      = ref(5);

  const showEditUser = ref(false);
  const selectedUser = ref(null);

  const showViewUser = ref(false);
  const viewingUser  = ref(null);

  const fetchUsers = async () => {
    try {
      // ✅ CHANGED: dummyjson with limit=208 to get all users
      // ❌ OLD: "https://jsonplaceholder.typicode.com/users" — only 10 users
      const res = await axios.get("https://dummyjson.com/users?limit=208");
      users.value = res.data.users; // ✅ dummyjson wraps in { users: [] }
    } catch (err) { console.log(err); }
  };

  onMounted(fetchUsers);

  watch(search,  () => { currentPage.value = 1; });
  watch(perPage, () => { currentPage.value = 1; });

  const filteredUsers = computed(() =>
    users.value.filter(u =>
      // ✅ dummyjson uses firstName + lastName not name
      (`${u.firstName} ${u.lastName}`).toLowerCase().includes(search.value.toLowerCase())
    )
  );

  const totalPages = computed(() =>
    Math.ceil(filteredUsers.value.length / perPage.value) || 1
  );

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return filteredUsers.value.slice(start, start + perPage.value);
  });

  const rangeStart = computed(() =>
    filteredUsers.value.length ? (currentPage.value - 1) * perPage.value + 1 : 0
  );

  const rangeEnd = computed(() =>
    Math.min(currentPage.value * perPage.value, filteredUsers.value.length)
  );

  const goPage = (p) => {
    if (p < 1 || p > totalPages.value) return;
    currentPage.value = p;
  };

  // ✅ dummyjson uses firstName + lastName
  const initials = (user) => {
    const f = user?.firstName?.[0] ?? "";
    const l = user?.lastName?.[0]  ?? "";
    return (f + l).toUpperCase();
  };

  const avatarStyle = (index) => {
    const i = index % 4;
    return { background: BG_COLORS[i], color: TX_COLORS[i] };
  };

  const viewUser = (user) => {
    viewingUser.value  = user;
    showViewUser.value = true;
    
  };

  const editUser = (user) => {
  selectedUser.value = {
    id:          user.id,
    // ✅ merge firstName + lastName into name
    name:        `${user.firstName} ${user.lastName}`,
    username:    user.username    || "",
    email:       user.email       || "",
    phone:       user.phone       || "",
    website:     user.website     || "",
    // ✅ company object → string
    company:     user.company?.name       || "",
    department:  user.company?.department || "",
    gender:      user.gender      || "",
    bloodGroup:  user.bloodGroup  || "",
    role:        user.role        || "",
    // ✅ skills doesn't exist in DummyJSON — default empty
    skills:      user.skills      || [],
    password:        "",
    confirmPassword: "",
  };
  showEditUser.value = true;
};
  const confirmDelete = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are deleting "${user.firstName} ${user.lastName}"`,
      icon: "warning",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed)
        users.value = users.value.filter(u => u.id !== user.id);
    });
  };

  const addUserLocal = (user) => {

  const [firstName, ...rest] = user.name.split(" ");

  users.value.unshift({
    id: Date.now(),
    firstName,
    lastName: rest.join(" "),
    email: user.email,
    phone: user.phone,
  });

};

  return {
     users,
    search, perPage,
    paginatedUsers, filteredUsers,
    currentPage, totalPages,
    rangeStart, rangeEnd,
    goPage, initials, avatarStyle,
    viewUser, editUser, confirmDelete, addUserLocal,
    showEditUser, selectedUser,
    showViewUser, viewingUser,

  };
}