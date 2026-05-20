import { ref, computed, onMounted, watch } from "vue";
import Swal from "sweetalert2";
import { useUserStore } from "../store/userStore";
import { deleteUser } from "../services/userApi";

const BG_COLORS = ["#e6f1fb", "#eaf3de", "#faeeda", "#fcebeb"];
const TX_COLORS = ["#0c447c", "#27500a", "#633806", "#791f1f"];

export function useShowUsers(router) {

  const userStore = useUserStore();

  const users = ref([]);
  const currentPage = ref(1);
  const search = ref("");
  const perPage = ref(5);

  const showEditUser = ref(false);
  const selectedUser = ref(null);

  const showViewUser = ref(false);
  const viewingUser = ref(null);

  let userIdCounter = 1;

  // ✅ REPLACED API CALL WITH STORE
  const fetchUsers = async () => {
  try {
    const data = await userStore.fetchAllUsers();

    users.value = data.map(u => ({
      ...u,
      firstName: u.first_name,
      lastName: u.last_name,
    }));

  } catch (err) {
    console.log(err);
  }
};

  onMounted(fetchUsers);

  watch(search, () => (currentPage.value = 1));
  watch(perPage, () => (currentPage.value = 1));

  const filteredUsers = computed(() =>
    users.value.filter(u =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(search.value.toLowerCase())
    )
  );

  const totalPages = computed(() =>
    Math.ceil(filteredUsers.value.length / perPage.value) || 1
  );

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return filteredUsers.value.slice(start, start + perPage.value);
  });

  const goPage = (p) => {
    if (p < 1 || p > totalPages.value) return;
    currentPage.value = p;
  };

  const initials = (user) => {
    return ((user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")).toUpperCase();
  };

  const avatarStyle = (index) => {
    const i = index % 4;
    return { background: BG_COLORS[i], color: TX_COLORS[i] };
  };

 const viewUser = async (user) => {
  const data = await userStore.fetchUserById(user.id);
  viewingUser.value = data;
  showViewUser.value = true;
};
const editUser = async (user) => {
  const data = await userStore.fetchUserById(user.id);

  selectedUser.value = {
    id: data.id,
    username: data.username,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    country: data.country,
    city: data.city,
    dob: data.dob,
    gender: data.gender,
  };

  showEditUser.value = true;
};
  // ✅ FIXED UPDATE LOGIC (UNCHANGED)
  const handleUpdateUser = (updatedUser) => {

    const [firstName, ...rest] = updatedUser.name.split(" ");

    const index = users.value.findIndex(u => u.id === updatedUser.id);

    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        firstName,
        lastName: rest.join(" "),
        email: updatedUser.email,
        phone: updatedUser.phone,
      };
    }

    showEditUser.value = false;
  };

  const confirmDelete = (user) => {
  Swal.fire({
    title: "Are you sure?",
    text: `You are deleting "${user.username}"`,
    icon: "warning",
    showCancelButton: true,
  }).then(async (res) => {
    if (res.isConfirmed) {
      try {
        await deleteUser(user.id);

        // remove from UI instantly
        users.value = users.value.filter(u => u.id !== user.id);

        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (err) {
        console.log("Delete error:", err);
        Swal.fire("Error", "Failed to delete user", "error");
      }
    }
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

    // 🔥 ADD DEFAULT STRUCTURE
    company: "",
    address: "",
    hair: {},
    age: null,
    bloodGroup: "",
    role: "user",
  });
};

  return {
    users,
    search,
    perPage,
    paginatedUsers,
    filteredUsers,
    currentPage,
    totalPages,
    goPage,
    initials,
    avatarStyle,
    viewUser,
    editUser,
    confirmDelete,
    addUserLocal,
    showEditUser,
    selectedUser,
    showViewUser,
    viewingUser,
    handleUpdateUser,
  };
}