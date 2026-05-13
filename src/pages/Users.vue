<template>
  <div class="p-6 bg-gray-50 min-h-screen">

    <!-- TOP BAR -->
    <div class="flex justify-between items-center mb-4">

      <div>
        <h2 class="text-xl font-semibold text-gray-900">Users</h2>
        <p class="text-sm text-gray-500">
          {{ filteredUsers.length }} total users
        </p>
      </div>

      <button
        class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-full text-sm"
        @click="showAddUser = true"
      >
        + Add User
      </button>
    </div>

    <!-- TABLE CARD -->
    <div class="bg-white border rounded-xl overflow-hidden shadow-sm">

      <!-- TABLE TOPBAR -->
      <div class="flex items-center gap-3 p-3 border-b bg-gray-50">

        <input
          v-model="search"
          type="text"
          placeholder="Search user by name..."
          class="flex-1 min-w-0 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <select
          v-model="perPage"
          class="w-28 px-2 py-2 border rounded-lg text-sm bg-white"
        >
          <option :value="5">Show 5</option>
          <option :value="10">Show 10</option>
          <option :value="20">Show 20</option>
          <option :value="50">Show 50</option>
        </select>

      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">

          <thead class="bg-gray-100 text-xs uppercase text-gray-500">
            <tr>
              <th class="p-3">#</th>
              <th class="p-3">Name</th>
              <th class="p-3">Email</th>
              <th class="p-3">Phone</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="(user, index) in paginatedUsers"
              :key="user.id"
              class="border-t hover:bg-gray-50"
            >

              <td class="p-3 text-sm text-gray-600">
                {{ user.id }}
              </td>

              <td class="p-3">
                <div class="flex items-center gap-2">

                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-blue-100 text-blue-700"
                    :style="avatarStyle(index)"
                  >
                    {{ initials(user) }}
                  </div>

                  <span class="text-sm font-medium text-gray-800">
                    {{ user.firstName }} {{ user.lastName }}
                  </span>

                </div>
              </td>

              <td class="p-3 text-sm text-gray-500">
                {{ user.email }}
              </td>

              <td class="p-3 text-sm text-gray-500">
                {{ user.phone }}
              </td>

              <td class="p-3">
                <div class="flex gap-2">

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

      <!-- ✅ SMART PAGINATION (FIXED FOR 200+ PAGES) -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-3 p-3 border-t">

        <div class="text-sm text-gray-500">
          Showing {{ rangeStart }}–{{ rangeEnd }} of {{ filteredUsers.length }}
        </div>

        <div class="flex items-center gap-2 flex-wrap">

          <!-- Prev -->
          <button
            class="px-3 py-1 border rounded text-sm disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="goPage(currentPage - 1)"
          >
            ‹
          </button>

          <!-- First -->
          <button
            v-if="currentPage > 2"
            class="px-3 py-1 border rounded text-sm"
            @click="goPage(1)"
          >
            1
          </button>

          <span v-if="currentPage > 3" class="text-gray-400">...</span>

          <!-- Prev page -->
          <button
            v-if="currentPage > 1"
            class="px-3 py-1 border rounded text-sm"
            @click="goPage(currentPage - 1)"
          >
            {{ currentPage - 1 }}
          </button>

          <!-- Current -->
          <button class="px-3 py-1 border rounded text-sm bg-green-700 text-white">
            {{ currentPage }}
          </button>

          <!-- Next page -->
          <button
            v-if="currentPage < totalPages"
            class="px-3 py-1 border rounded text-sm"
            @click="goPage(currentPage + 1)"
          >
            {{ currentPage + 1 }}
          </button>

          <span v-if="currentPage < totalPages - 2" class="text-gray-400">...</span>

          <!-- Last -->
          <button
            v-if="currentPage < totalPages - 1"
            class="px-3 py-1 border rounded text-sm"
            @click="goPage(totalPages)"
          >
            {{ totalPages }}
          </button>

          <!-- Next -->
          <button
            class="px-3 py-1 border rounded text-sm disabled:opacity-40"
            :disabled="currentPage === totalPages"
            @click="goPage(currentPage + 1)"
          >
            ›
          </button>

          <!-- 🔥 PAGE DROPDOWN -->
          <select
            v-model="currentPage"
            @change="goPage(Number(currentPage))"
            class="ml-2 px-2 py-1 border rounded text-sm bg-white"
          >
            <option v-for="p in totalPages" :key="p" :value="p">
              Page {{ p }}
            </option>
          </select>

        </div>

      </div>

    </div>

    <!-- MODALS -->
    <ViewUserModal
      v-if="showViewUser"
      :user="viewingUser"
      @close="showViewUser = false"
    />

    <UserModel v-if="showAddUser" @close="showAddUser = false">
      <UserForm
        :user="{}"
        buttonText="Add User"
        @submit-user="handleAddUser"
        @cancel="showAddUser = false"
      />
    </UserModel>

    <UserModel v-if="showEditUser" @close="showEditUser = false">
      <UserForm
        :user="selectedUser"
        buttonText="Update User"
        @submit-user="handleUpdateUser"
        @cancel="showEditUser = false"
      />
    </UserModel>

  </div>
</template>

<script setup>
import gsap from "gsap";
import { watch, nextTick, ref } from "vue";
import { useRouter } from "vue-router";
import { useShowUsers } from "../composables/useShowUsers";

import UserForm from "../components/UserForm.vue";
import UserModel from "../components/UserModel.vue";
import ViewUserModal from "../components/ViewUserModal.vue";

const showAddUser = ref(false);
const router = useRouter();

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
} = useShowUsers(router);

const animateModal = async () => {
  await nextTick();
  gsap.from(".modal-content", {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    ease: "elastic.out(1, 0.6)",
  });
};

watch(showAddUser, (val) => val && animateModal());
watch(showViewUser, (val) => val && animateModal());
watch(showEditUser, (val) => val && animateModal());

const handleAddUser = (userData) => {
  addUserLocal(userData);
  showAddUser.value = false;
};

const handleUpdateUser = (updatedUser) => {
  const [firstName, ...rest] = updatedUser.name.split(" ");
  updatedUser.firstName = firstName;
  updatedUser.lastName = rest.join(" ");

  const index = users.value.findIndex((u) => u.id === updatedUser.id);

  if (index !== -1) {
    users.value[index] = {
      ...users.value[index],
      ...updatedUser,
    };
  }

  showEditUser.value = false;
};
</script>