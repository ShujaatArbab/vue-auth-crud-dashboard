<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">

    <!-- TOP BAR -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">Tasks</h2>
        <p class="text-sm text-gray-500">{{ filteredTasks.length }} total tasks</p>
      </div>
      <button
        class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-full text-sm w-full sm:w-auto"
        @click="showCreateModal = !showCreateModal"
      >+ Create Task</button>
    </div>

    <!-- TABLE CARD -->
    <div class="bg-white border rounded-xl overflow-hidden shadow-sm">

      <!-- TOPBAR -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 border-b bg-gray-50">
        <input
          v-model="search"
          type="text"
          placeholder="Search task by title..."
          class="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <select
          v-model="perPage"
          class="w-full sm:w-auto max-w-[120px] px-2 py-1 border rounded-lg text-sm bg-white"
        >
          <option :value="5">Show 5</option>
          <option :value="10">Show 10</option>
          <option :value="20">Show 20</option>
          <option :value="50">Show 50</option>
        </select>
      </div>

      <!-- TABLE -->
      <div class="w-full overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-100 text-xs uppercase text-gray-500">
            <tr>
              <th class="p-3">Title</th>
              <th class="p-3">Assigned To</th>
              <th class="p-3">Created At</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="task in paginatedTasks"
              :key="task.id"
              class="border-t hover:bg-gray-50 align-top"
            >

              <!-- TITLE + COMMENTS -->
              <td class="p-3">
                <div class="flex flex-col gap-1.5">

                  <!-- Task Title -->
                  <span class="text-sm font-medium text-gray-800">{{ task.title }}</span>

                  

                </div>
              </td>

              <td class="p-3 text-sm text-gray-600">{{ task.assigned_to_name || "Unassigned" }}</td>
              <td class="p-3 text-sm text-gray-500">{{ formatDate(task.created_at) }}</td>

              <!-- ACTIONS -->
              <td class="p-3">
                <div class="flex flex-wrap gap-1.5">
                  <button
                    class="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-all"
                    @click="handleViewTask(task.id)"
                  >View</button>
                  <button
                    class="px-3 py-1 text-xs rounded-md bg-green-700 text-white hover:bg-green-600 transition-all"
                    @click="openAssignModal(task.id)"
                  >Assign</button>
                  <button
                    class="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-500 transition-all"
                    @click="askDeleteTask(task.id)"
                  >Delete</button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 border-t">
        <div class="text-sm text-gray-500">
          Showing {{ rangeStart }}–{{ rangeEnd }} of {{ filteredTasks.length }}
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            class="px-3 py-1 border rounded text-sm disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="goPage(currentPage - 1)"
          >‹</button>
          <button class="px-3 py-1 border rounded text-sm bg-green-700 text-white">{{ currentPage }}</button>
          <button
            class="px-3 py-1 border rounded text-sm disabled:opacity-40"
            :disabled="currentPage === totalPages"
            @click="goPage(currentPage + 1)"
          >›</button>
        </div>
      </div>

    </div>

  </div>
  <!--delete confirm model-->
  <ConfirmModel
  :isOpen="showConfirmModal"
  :title="confirmTitle"
  :message="confirmMessage"
  @close="showConfirmModal = false"
  @confirm="confirmDeleteTask"
/>
  <!-- MODALS -->
  <ViewTaskModal
  :show="showModal"
  :task="selectedTask"
  :taskComments="taskComments"
  @close="showModal = false"
/>
  <AssignTaskModel :show="showAssignModal"  :users="users"             @close="showAssignModal = false" @selectUser="handleAssignTask" />
  <CreateTaskModel :show="showCreateModal"  @close="showCreateModal = false" @submit="handleCreateTask" />
  <CommentModel    :show="showCommentModal" :task="selectedCommentTask" @close="showCommentModal = false" />

</template>

<script setup>
import { useTasks } from "../composables/useTasks";
import ViewTaskModal   from "../components/ViewTaskModel.vue";
import AssignTaskModel from "../components/AssignTaskModel.vue";
import CreateTaskModel from "../components/CreateTaskModel.vue";
import CommentModel    from "../components/CommentModel.vue";
import ConfirmModel from "../components/ConfirmModel.vue";

const {
  search, perPage,
  paginatedTasks, filteredTasks,
  currentPage, totalPages,
  rangeStart, rangeEnd,
  goPage, viewTask, assignTask, formatDate,
  selectedTask, showModal, handleViewTask,
  loadUsers, showAssignModal, users,
  handleDeleteTask, handleCreateTask,
  showCreateModal, openAssignModal, handleAssignTask,
  taskComments, showCommentModal,
  selectedCommentTask, 
  confirmDeleteTask,
  askDeleteTask,
  confirmMessage,
  confirmTitle,
  showConfirmModal
  
  
} = useTasks();
</script>