<template>
  <div class="users-wrap">

    <!-- Top Bar -->
    <div class="topbar">
      <div>
        <h2 class="page-title">Users</h2>
        <p class="page-sub">{{ filteredUsers.length }} total users</p>
      </div>
      <button class="add-btn" @click="showAddUser = true">+ Add User</button>
    </div>

    <!-- Table Card -->
    <div class="table-card">

      <!-- Table Top Bar -->
      <div class="table-topbar">
        <input v-model="search" type="text" placeholder="Search user by name..." class="search-box" />
        <select v-model="perPage" class="page-select">
          <option :value="5">Show 5</option>
          <option :value="10">Show 10</option>
          <option :value="20">Show 20</option>
          <option :value="50">Show 50</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.id">
            <td class="td-id">{{ user.id }}</td>
            <td>
              <div class="name-cell">
                <div class="avatar" :style="avatarStyle(index)">{{ initials(user) }}</div>
                <span class="name-text">{{ user.firstName}} {{ user.lastName}}</span>
              </div>
            </td>
            <td class="muted">{{ user.email }}</td>
            <td class="muted">{{ user.phone }}</td>
            <td>
              <div class="actions">
                <!-- ✅ pass full user object -->
                <button class="btn btn-view" @click="viewUser(user)">View</button>
                <button class="btn btn-edit" @click="editUser(user)">Edit</button>
                <button class="btn btn-del"  @click="confirmDelete(user)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <div class="page-info">Showing {{ rangeStart }}–{{ rangeEnd }} of {{ filteredUsers.length }}</div>
        <div class="page-btns">
          <button class="page-btn" :disabled="currentPage === 1" @click="goPage(currentPage - 1)">‹</button>
          <button v-for="p in totalPages" :key="p" class="page-btn" :class="{ active: p === currentPage }" @click="goPage(p)">{{ p }}</button>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="goPage(currentPage + 1)">›</button>
        </div>
      </div>

    </div>
  </div>

  <!-- ✅ VIEW USER MODAL -->
  <ViewUserModal
    v-if="showViewUser"
    :user="viewingUser"
    @close="showViewUser = false"
  />

  <!-- ADD USER MODAL -->
  <UserModel v-if="showAddUser" @close="showAddUser = false">
    <UserForm :user="{}" buttonText="Add User" @submit-user="handleAddUser" @cancel="showAddUser = false" />
  </UserModel>

  <!-- EDIT USER MODAL -->
  <UserModel v-if="showEditUser" @close="showEditUser = false">
    <UserForm :user="selectedUser" buttonText="Update User" @submit-user="handleUpdateUser" @cancel="showEditUser = false" />
  </UserModel>
</template>

<script setup>
import gsap from "gsap";
import { watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useShowUsers } from "../composables/useShowUsers";
import { ref } from "vue";
import UserForm from "../components/UserForm.vue";
import UserModel from "../components/UserModel.vue";
import ViewUserModal from "../components/ViewUserModal.vue";

const showAddUser = ref(false);
const router = useRouter();

const {
  users,
  search, perPage,
  paginatedUsers, filteredUsers,
  currentPage, totalPages,
  rangeStart, rangeEnd,
  goPage, initials, avatarStyle,
  viewUser, editUser, confirmDelete, addUserLocal,
  showEditUser, selectedUser,
  showViewUser, viewingUser,
} = useShowUsers(router);

const animateModal = async () => {
  await nextTick();
 gsap.from(".modal-content", { scale: 0.8, opacity: 0, duration: 0.4, ease: "elastic.out(1, 0.6)" });
};

watch(showAddUser, (val) => val && animateModal());
watch(showViewUser, (val) => val && animateModal());
watch(showEditUser, (val) => val && animateModal());

const handleAddUser = (userData) => {
  addUserLocal(userData);
  showAddUser.value = false;
};



const handleUpdateUser = (updatedUser) => {

  // split full name into first + last
  const [firstName, ...rest] = updatedUser.name.split(" ");

  updatedUser.firstName = firstName;
  updatedUser.lastName  = rest.join(" ");

  const index = users.value.findIndex(
    u => u.id === updatedUser.id
  );

  if (index !== -1) {
    users.value[index] = {
      ...users.value[index],
      ...updatedUser,
    };
  }

  showEditUser.value = false;
};
</script>

<style scoped>
* { box-sizing: border-box; }
.users-wrap { padding: 2rem 1.5rem; font-family: sans-serif; }

.topbar {
  display: flex; justify-content: space-between;
  align-items: center; margin-bottom: 14px;
}
.page-title { font-size: 22px; font-weight: 600; }
.page-sub   { font-size: 13px; color: #6b7280; }

.add-btn {
  background: #1a7a4a; color: #fff; border: none;
  border-radius: 50px; padding: 9px 16px; cursor: pointer;
}

.table-card {
  background: #fff; border: 1px solid #e5e7eb;
  border-radius: 12px; overflow: hidden;
}

.table-topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid #e5e7eb;
  background: #fafafa;
}

.search-box {
  flex: 1;
  min-width: 0;
  padding: 7px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
}
.search-box:focus { border-color: #185fa5; }

.page-select {
  padding: 7px 10px; border: 1px solid #e5e7eb;
  border-radius: 8px; background: white; font-size: 13px; width: 110px;
}

table { width: 100%; border-collapse: collapse; }
thead th {
  background: #f9fafb; padding: 11px 12px;
  font-size: 11px; text-transform: uppercase;
  color: #6b7280; text-align: left;
}
td { padding: 11px 12px; border-top: 1px solid #f3f4f6; }

.name-cell { display: flex; align-items: center; gap: 8px; }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  font-size: 11px; font-weight: 600; flex-shrink: 0;
}
.muted { color: #6b7280; font-size: 13px; }
.actions { display: flex; gap: 6px; }

.btn {
  display: inline-flex; align-items: center; gap: 4px;
  border-radius: 6px; border: 1px solid #e5e7eb;
  background: transparent; cursor: pointer;
  font-size: 12px; font-weight: 500; padding: 5px 10px; transition: all 0.12s;
}
.btn-view { color: #fff; border-color: #b5d4f4; background: #185fa5; }
.btn-view:hover { background: #71aeeb; }
.btn-edit { color: #fff; border-color: #d4a017; background: #d4a017; }
.btn-edit:hover { background: #f1cd69; }
.btn-del  { color: #fff; border-color: #f7c1c1; background: #ff0000; }
.btn-del:hover  { background: #e78383; }

.pagination {
  display: flex; justify-content: space-between;
  align-items: center; padding: 12px 14px; border-top: 1px solid #f3f4f6;
}
.page-info { font-size: 13px; color: #6b7280; }
.page-btns { display: flex; gap: 4px; }
.page-btn {
  border: 1px solid #e5e7eb; background: #fff;
  padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 13px;
}
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn.active { background: #1a7a4a; color: white; border-color: #1a7a4a; }
</style>