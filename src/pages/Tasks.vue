<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">

    <!-- TOP BAR -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Tasks</h2>
        <p class="text-sm text-gray-400">{{ filteredTasks.length }} tasks total</p>
      </div>
      <button
        class="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all w-full sm:w-auto"
        @click="showCreateModal = !showCreateModal"
      >
        <i class="fa-solid fa-plus text-xs"></i>
        Create Task
      </button>
    </div>

    <!-- TABLE CARD -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

      <!-- FILTERS -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <!-- Search -->
        <div class="relative flex-1">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input
            v-model="search"
            type="text"
            placeholder="Search tasks..."
            class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-white"
          />
        </div>

        <!-- Per page -->
        <div class="relative">
          <i class="fa-solid fa-list absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
          <select
            v-model="perPage"
            class="pl-8 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200 appearance-none cursor-pointer"
          >
            <option :value="5">5 per page</option>
            <option :value="10">10 per page</option>
            <option :value="20">20 per page</option>
            <option :value="50">50 per page</option>
          </select>
          <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
        </div>
      </div>

      <!-- MOBILE CARDS -->
      <div class="block md:hidden divide-y divide-gray-100">
        <div
          v-for="task in paginatedTasks"
          :key="task.id"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start gap-3 mb-3">
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-800 truncate">{{ task.title }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ task.assigned_to_name || "Unassigned" }}</p>
            </div>
            <span
              class="text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
              :class="{
                'bg-yellow-100 text-yellow-700': task.status === 'pending',
                'bg-blue-100 text-blue-700':    task.status === 'in_progress',
                'bg-green-100 text-green-700':  task.status === 'completed'
              }"
            >{{ task.status?.replace('_',' ') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all font-medium" @click="handleViewTask(task.id)">
              <i class="fa-solid fa-eye text-[10px]"></i> View
            </button>
            <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all font-medium" @click="openAssignModal(task.id)">
              <i class="fa-solid fa-user-plus text-[10px]"></i> {{ task.assigned_to ? "Reassign" : "Assign" }}
            </button>
            <button class="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all font-medium" @click="askDeleteTask(task.id)">
              <i class="fa-solid fa-trash-can text-[10px]"></i> Delete
            </button>
          </div>
        </div>
      </div>

      <!-- DESKTOP TABLE -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-4 py-3 text-xs font-semibold text-black uppercase tracking-wider">Title</th>
              <th class="px-4 py-3 text-xs font-semibold text-black uppercase tracking-wider">Assigned To</th>
              <th class="px-4 py-3 text-xs font-semibold text-black uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-xs font-semibold text-black uppercase tracking-wider">Created</th>
              <th class="px-4 py-3 text-xs font-semibold text-black uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="task in paginatedTasks"
              :key="task.id"
              class="hover:bg-gray-100 transition-colors group cursor-default"
            >
              <!-- TITLE -->
              <td class="px-4 py-3">
                <span class="text-sm text-gray-700">{{ task.title }}</span>
              </td>

              <!-- ASSIGNED -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {{ task.assigned_to_name?.[0]?.toUpperCase() || '?' }}
                  </div>
                  <span class="text-sm text-gray-600">{{ task.assigned_to_name || "Unassigned" }}</span>
                </div>
              </td>

              <!-- STATUS -->
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-700': task.status === 'pending',
                    'bg-blue-100 text-blue-700':    task.status === 'in_progress',
                    'bg-green-100 text-green-700':  task.status === 'completed'
                  }"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="{
                      'bg-yellow-500': task.status === 'pending',
                      'bg-blue-500':   task.status === 'in_progress',
                      'bg-green-500':  task.status === 'completed'
                    }"
                  ></span>
                  {{ task.status?.replace('_', ' ') }}
                </span>
              </td>

              <!-- CREATED — formatted like "2 Nov 2026" -->
              <td class="px-4 py-3 text-sm text-gray-500">
                {{ task.created_at ? new Date(task.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '—' }}
              </td>

              <!-- ACTIONS — icon buttons -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-1.5">

                  <!-- View -->
                  <button
                    title="View"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200 transition-all"
                    @click="handleViewTask(task.id)"
                  >
                    <i class="fa-solid fa-eye text-sm"></i>
                  </button>

                  <!-- Assign / Reassign -->
                  <button
                    :title="task.assigned_to ? 'Reassign' : 'Assign'"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-green-700 hover:bg-green-50 hover:text-green-800 border border-transparent hover:border-green-200 transition-all"
                    @click="openAssignModal(task.id)"
                  >
                    <i :class="task.assigned_to ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'" class="text-sm"></i>
                  </button>

                  <!-- Delete -->
                  <button
                    title="Delete"
                    class="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 transition-all"
                    @click="askDeleteTask(task.id)"
                  >
                    <i class="fa-solid fa-trash-can text-sm"></i>
                  </button>

                </div>
              </td>
            </tr>

            <tr v-if="paginatedTasks.length === 0">
              <td colspan="5" class="px-4 py-12 text-center">
                <i class="fa-regular fa-folder-open text-3xl text-gray-300 mb-2 block"></i>
                <p class="text-sm text-gray-400">No tasks found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">
        <p class="text-xs text-gray-400">
          Showing <span class="font-semibold text-gray-600">{{ rangeStart }}–{{ rangeEnd }}</span> of <span class="font-semibold text-gray-600">{{ filteredTasks.length }}</span> tasks
        </p>
        <div class="flex items-center gap-1.5">
          <button
            class="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            :disabled="currentPage === 1"
            @click="goPage(currentPage - 1)"
          >
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </button>

          <span class="px-3 py-1 rounded-lg text-sm bg-green-700 text-white font-semibold min-w-[36px] text-center">
            {{ currentPage }}
          </span>

          <button
            class="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            :disabled="currentPage === totalPages"
            @click="goPage(currentPage + 1)"
          >
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

    </div>

    <!-- DELETE CONFIRM -->
    <ConfirmModel
      :isOpen="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      @close="showConfirmModal = false"
      @confirm="confirmDeleteTask()"
    />

    <!-- REASSIGN CONFIRM -->
    <ConfirmModel
      :isOpen="showReassignModal"
      title="Confirm Assignment"
      message="Are you sure you want to reassign this task?"
      @close="showReassignModal = false"
      @confirm="confirmAssignTask()"
    />

    <!-- VIEW TASK -->
    <ViewTaskModal
      :show="showModal"
      :task="selectedTask"
      :taskComments="taskComments"
      @submitComment="submitAdminComment"
      @close="showModal = false"
    />

    <!-- ASSIGN TASK -->
    <AssignTaskModel
      :show="showAssignModal"
      :users="users"
      @close="showAssignModal = false"
      @selectUser="askAssignTask"
    />

    <!-- CREATE TASK -->
    <CreateTaskModel
      :show="showCreateModal"
      @close="showCreateModal = false"
      @submit="handleCreateTask"
    />

  </div>
</template>

<script setup>
import { useTasks } from "../composables/useTasks";
import ViewTaskModal   from "../components/ViewTaskModel.vue";
import AssignTaskModel from "../components/AssignTaskModel.vue";
import CreateTaskModel from "../components/CreateTaskModel.vue";
import ConfirmModel    from "../components/ConfirmModel.vue";

const {
  search, perPage,
  paginatedTasks, filteredTasks,
  currentPage, totalPages,
  rangeStart, rangeEnd,
  goPage, formatDate,
  selectedTask, showModal, handleViewTask,
  showAssignModal, users,
  handleCreateTask,
  showCreateModal, openAssignModal,
  taskComments,
  confirmDeleteTask,
  askDeleteTask,
  confirmMessage,
  confirmTitle,
  showConfirmModal,
  submitAdminComment,
  askAssignTask,
  confirmAssignTask,
  showReassignModal,
} = useTasks();
</script>