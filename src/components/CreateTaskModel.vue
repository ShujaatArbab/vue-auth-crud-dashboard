<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
    >
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">

        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h3 class="text-base font-semibold text-gray-900">Create New Task</h3>
            <p class="text-xs text-gray-400">Assign task to a team member</p>
          </div>
          <button
            class="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:bg-red-100 hover:border-gray-300 hover:text-gray-700 transition-all duration-200 font-medium"
            @click="$emit('close')"
          >
            <i class="fa-solid fa-xmark text-red-600"></i>
          </button>
        </div>

        <div class="p-6 space-y-4 overflow-y-auto">

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Task Title *</label>
            <input
              v-model="title"
              type="text"
              placeholder="Task title"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1">Description</label>
            <textarea
              v-model="description"
              placeholder="Provide a description..."
              rows="3"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400 resize-none"
            />
          </div>

          <div class="pt-2 border-t border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <p class="text-xs font-bold text-red-600">Select User *</p>
              
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <div class="relative flex-1 sm:w-44">
                  <input
                    v-model="userSearch"
                    type="text"
                    placeholder="Search users..."
                    class="w-full pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                  />
                  <i class="fa-solid fa-magnifying-glass absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]"></i>
                </div>

                <div class="relative">
                  <select
                    v-model="usersPerPage"
                    class="pl-2 pr-6 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none cursor-pointer appearance-none"
                  >
                    <option :value="5">5 per page</option>
                    <option :value="10">10 per page</option>
                    <option :value="20">20 per page</option>
                    <option :value="50">50 per page</option>
                  </select>
                  <i class="fa-solid fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[9px] pointer-events-none"></i>
                </div>
              </div>
            </div>

            <div class="space-y-2 min-h-[120px]">
              <div
                v-for="(user, index) in paginatedUsers"
                :key="user.id"
                @click="selectedUserId = user.id"
                class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition hover:bg-gray-50"
                :class="selectedUserId === user.id ? 'border-green-500 bg-green-50/60 shadow-sm' : 'border-gray-200'"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <span class="text-xs font-bold text-gray-400 w-5">
                    {{ (currentUserPage - 1) * usersPerPage + index + 1 }}
                  </span>

                  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                    {{ (user.name || user.username || user.first_name || "U").charAt(0).toUpperCase() }}
                  </div>

                  <div class="flex flex-col min-w-0">
                    <span class="text-sm font-medium text-gray-800 truncate">
                      {{ user.name || user.username || user.first_name }}
                    </span>
                    <span class="text-xs text-gray-400 truncate">
                      {{ user.email }}
                    </span>
                  </div>
                </div>

                <i 
                  class="fa-solid text-sm transition-colors" 
                  :class="selectedUserId === user.id ? 'fa-circle-check text-green-600' : 'fa-arrow-right text-gray-300'"
                ></i>
              </div>

              <div v-if="filteredUsers.length === 0" class="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                <p class="text-xs text-gray-400">No matching team members found</p>
              </div>
            </div>

            <div v-if="filteredUsers.length > usersPerPage" class="flex items-center justify-end gap-1.5 mt-3 pt-2">
              <button
                class="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                :disabled="currentUserPage === 1"
                @click="currentUserPage--"
              >
                <i class="fa-solid fa-chevron-left"></i>
              </button>

              <span class="text-xs text-gray-500 px-2">
                Page {{ currentUserPage }} of {{ totalUserPages }}
              </span>

              <button
                class="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-md text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                :disabled="currentUserPage === totalUserPages"
                @click="currentUserPage++"
              >
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>

          </div>
        </div>

        <div class="px-6 py-3 border-t flex justify-end gap-2 bg-gray-50">
          <button 
            @click="$emit('close')" 
            class="px-4 py-2 text-sm font-semibold bg-white border border-red-600 rounded-xl hover:bg-red-200 text-red-600 transition-all"
          >
            Cancel
          </button>

          <button
            @click="submitTask"
            class="px-4 py-2 text-sm font-semibold bg-green-700 text-white rounded-xl hover:bg-green-800 flex items-center gap-2 transition-all shadow-sm"
          >
            <i class="fa-solid fa-paper-plane text-[10px]"></i>
            Create Task
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCreateTaskModel } from "../composables/useCreateTaskModel";

const props = defineProps({
  show: Boolean,
  users: Array
});

const emit = defineEmits(["close", "submit"]);

// Bind all state properties and functional logic hooks seamlessly from the externalized composable file
const {
  title,
  description,
  selectedUserId,
  userSearch,
  usersPerPage,
  currentUserPage,
  filteredUsers,
  totalUserPages,
  paginatedUsers,
  submitTask
} = useCreateTaskModel(props, emit);
</script>