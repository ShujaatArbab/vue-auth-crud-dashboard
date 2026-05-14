<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">

    <!-- TOP BAR -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">

      <div>
        <h2 class="text-xl font-semibold text-gray-900">Users</h2>
        <p class="text-sm text-gray-500">
          {{ filteredUsers.length }} total users
        </p>
      </div>

      <button
        class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-full text-sm w-full sm:w-auto"
        @click="showAddUser = true"
      >
        + Add User
      </button>

    </div>

    <!-- TABLE CARD -->
    <div class="bg-white border rounded-xl overflow-hidden shadow-sm">

      <!-- TABLE TOPBAR -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 border-b bg-gray-50">

        <input
          v-model="search"
          type="text"
          placeholder="Search user by name..."
          class="flex-1 min-w-0 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <select
          v-model="perPage"
          class="w-full sm:w-auto max-w-[100px] px-2 py-1 border rounded-lg text-sm bg-white"
        >
          <option :value="5">Show 5</option>
          <option :value="10">Show 10</option>
          <option :value="20">Show 20</option>
          <option :value="50">Show 50</option>
        </select>

      </div>

      <!-- TABLE -->
      <div class="w-full overflow-x-hidden">

        <table class="w-full min-w-full text-left">

          <!-- HEADER -->
          <thead class="bg-gray-100 text-xs uppercase text-gray-500">
            <tr>
              <th class="p-3">Name</th>
              <th class="p-3 hidden sm:table-cell">Email</th>
              <th class="p-3 hidden md:table-cell">Phone</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>

          <!-- BODY -->
          <tbody>

            <tr
              v-for="(user, index) in paginatedUsers"
              :key="user.id"
              class="border-t hover:bg-gray-50"
            >

              <!-- NAME -->
              <td class="p-3">
                <div class="flex items-center gap-2">

                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                    :style="avatarStyle(index)"
                  >
                    {{ initials(user) }}
                  </div>

                  <span class="text-sm font-medium text-gray-800 whitespace-nowrap">
                    {{ user.firstName }} {{ user.lastName }}
                  </span>

                </div>
              </td>

              <!-- EMAIL -->
              <td class="p-3 text-sm text-gray-500 break-all hidden sm:table-cell">
                {{ user.email }}
              </td>

              <!-- PHONE -->
              <td class="p-3 text-sm text-gray-500 whitespace-nowrap hidden md:table-cell">
                {{ user.phone }}
              </td>

              <!-- ACTIONS -->
              <td class="p-3">
                <div class="flex flex-nowrap gap-2 whitespace-nowrap">

                  <button
                    class="px-2 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-500"
                    @click="viewUser(user)"
                  >
                    View
                  </button>

                  <button
                    class="px-2 py-1 text-xs rounded-md bg-yellow-500 text-white hover:bg-yellow-400"
                    @click="editUser(user)"
                  >
                    Edit
                  </button>

                  <button
                    class="px-2 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-500"
                    @click="confirmDelete(user)"
                  >
                    Delete
                  </button>

                </div>
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      <!-- PAGINATION -->
      <div class="flex flex-col justify-between items-start gap-2 p-3 border-t sm:flex-row">

        <div class="text-sm text-gray-500">
          Showing {{ rangeStart }}–{{ rangeEnd }} of {{ filteredUsers.length }}
        </div>

        <div class="flex flex-wrap items-center gap-2">

          <button
            class="px-3 py-1 border rounded text-sm disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="goPage(currentPage - 1)"
          >
            ‹
          </button>

          <button
            v-if="currentPage > 2"
            class="px-3 py-1 border rounded text-sm"
            @click="goPage(1)"
          >
            1
          </button>

          <span v-if="currentPage > 3" class="text-gray-400">...</span>

          <button
            v-if="currentPage > 1"
            class="px-3 py-1 border rounded text-sm"
            @click="goPage(currentPage - 1)"
          >
            {{ currentPage - 1 }}
          </button>

          <button class="px-3 py-1 border rounded text-sm bg-green-700 text-white">
            {{ currentPage }}
          </button>

          <button
            v-if="currentPage < totalPages"
            class="px-3 py-1 border rounded text-sm"
            @click="goPage(currentPage + 1)"
          >
            {{ currentPage + 1 }}
          </button>

          <button
            v-if="currentPage < totalPages - 1"
            class="px-3 py-1 border rounded text-sm"
            @click="goPage(totalPages)"
          >
            {{ totalPages }}
          </button>

          <button
            class="px-3 py-1 border rounded text-sm disabled:opacity-40"
            :disabled="currentPage === totalPages"
            @click="goPage(currentPage + 1)"
          >
            ›
          </button>

        </div>

      </div>

    </div>

    <!-- MODALS -->
    <ViewUserModal
      v-if="showViewUser"
      :user="viewingUser"
      @close="showViewUser = false"
    />

    <UserForm
      v-if="showAddUser"
      :user="{}"
      buttonText="Add User"
      @submit-user="handleAddUser"
      @cancel="showAddUser = false"
    />

    <UserForm
      v-if="showEditUser"
      :user="selectedUser"
      buttonText="Update User"
      @submit-user="handleUpdateUser"
      @cancel="showEditUser = false"
    />

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useShowUsers } from "../composables/useShowUsers";
import UserForm from "../components/UserForm.vue";
import ViewUserModal from "../components/ViewUserModal.vue";

const showAddUser = ref(false);
const handleAddUser = (userData) => {
  addUserLocal(userData);
  showAddUser.value = false;
};

const {
  users,
  search,
  perPage,
  paginatedUsers,
  filteredUsers,
  currentPage,
  totalPages,
  rangeStart,
  rangeEnd,
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
} = useShowUsers();

/* ✅ FIX: PROPER UPDATE (THIS WAS MISSING LOGIC BEFORE) */
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
      website: updatedUser.website,
      company: updatedUser.company,
      department: updatedUser.department,
      gender: updatedUser.gender,
      bloodGroup: updatedUser.bloodGroup,
      role: updatedUser.role,
      skills: updatedUser.skills,
    };
  }

  showEditUser.value = false;
};
</script>