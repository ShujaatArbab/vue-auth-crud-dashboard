
<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">

    <!-- TOP BAR -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">

      <div>
        <h2 class="text-xl font-semibold text-gray-900">My Tasks</h2>
        <p class="text-sm text-gray-500">
          {{ filteredTasks.length }} total tasks
        </p>
      </div>

    </div>

    <!-- TABLE CARD -->
    <div class="bg-white border rounded-xl overflow-hidden shadow-sm">

      <!-- TOP CONTROLS -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 border-b bg-gray-50">

        <input
          v-model="search"
          type="text"
          placeholder="Search my tasks..."
          class="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
        />

        <select
          v-model="perPage"
          class="w-full sm:w-auto max-w-[120px] px-2 py-1 border rounded-lg text-sm bg-white"
        >
          <option :value="5">Show 5</option>
          <option :value="10">Show 10</option>
          <option :value="20">Show 20</option>
        </select>

      </div>

      <!-- LOADING -->
      <p v-if="loading" class="p-4 text-gray-500">Loading tasks...</p>

      <!-- ERROR -->
      <p v-if="error" class="p-4 text-red-500">{{ error }}</p>

      <!-- TABLE -->
      <div v-if="!loading" class="w-full overflow-x-auto">

        <table class="w-full text-left">

          <!-- HEADER -->
          <thead class="bg-gray-100 text-xs uppercase text-gray-500">
            <tr>
              <th class="p-3">Title</th>
              <th class="p-3">Assigned To</th>
              <th class="p-3">Created At</th>
              <th class="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <!-- BODY -->
          <tbody>
            <tr
              v-for="task in paginatedTasks"
              :key="task.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="p-3 text-sm font-medium text-gray-800">
                {{ task.title }}
              </td>

              <td class="p-3 text-sm text-gray-600">
                {{ task.assigned_to_name || "Me" }}
              </td>

              <td class="p-3 text-sm text-gray-500">
                {{ formatDate(task.created_at) }}
              </td>

              <td class="p-3 text-center ">
                 <div class="flex justify-center gap-2">
                <button
                  class="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-500"
                  @click="handleViewTask(task)"
                >
                  View
                </button>
                     <button
    class="px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-500"
    @click="openComment(task)"
  >
    Comment
  </button>
<select
  :value="task.status"
  @change="updateStatus(task.id, $event.target.value)"
  class="px-3 py-1 text-xs font-medium rounded-md border transition-colors"
  :class="{
    'bg-yellow-500 text-white': task.status === 'pending',
    'bg-blue-600 text-white': task.status === 'in_progress',
    'bg-green-600 text-white': task.status === 'completed'
  }"
>
  <option value="pending">Pending</option>
  <option value="in_progress">In Progress</option>
  <option value="completed">Completed</option>
</select>
</div>
              </td>
            </tr>
          </tbody>

        </table>

      </div>

      <!-- EMPTY -->
      <p v-if="paginatedTasks.length === 0" class="p-4 text-center text-gray-500">
        No tasks found
      </p>

      <!-- PAGINATION -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 border-t">

        <div class="text-sm text-gray-500">
          Showing {{ rangeStart }}–{{ rangeEnd }} of {{ filteredTasks.length }}
        </div>

        <div class="flex gap-2 flex-wrap">

          <button
            class="px-3 py-1 border rounded text-sm"
            :disabled="currentPage === 1"
            @click="goPage(currentPage - 1)"
          >
            ‹
          </button>

          <button class="px-3 py-1 border rounded text-sm bg-green-700 text-white">
            {{ currentPage }}
          </button>

          <button
            class="px-3 py-1 border rounded text-sm"
            :disabled="currentPage === totalPages"
            @click="goPage(currentPage + 1)"
          >
            ›
          </button>
          <div
  v-if="showToast"
  class="fixed bottom-5 right-5 bg-white border shadow-lg px-4 py-3 rounded-lg animate-bounce"
  :class="{
    'border-green-500 text-green-700': toastType === 'success',
    'border-red-500 text-red-700': toastType === 'error'
  }"
>
  {{ toastMessage }}
</div>
        </div>

      </div>

    </div>

    <!-- VIEW MODAL -->
    <ViewTaskModal
      :show="showModal"
      :task="selectedTask"
      @close="showModal = false"
    />

  </div>
  <CommentModel
  :show="showCommentModal"
  :task="selectedTask"
  @close="showCommentModal = false"
/>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useMyTasks } from "../composables/useMyTasks";
import ViewTaskModal from "../components/ViewTaskModel.vue";
import CommentModel from "../components/CommentModel.vue";

const {
  tasks,
  loading,
  error,
  search,
  perPage,
  currentPage,
  showModal,
   paginatedTasks,
    rangeStart,
    rangeEnd,
  totalPages,
  filteredTasks,
  selectedTask,
  handleViewTask,
  goPage,
  formatDate,
  getMyTasks,
  showCommentModal,
  openComment,
  updateStatus,
  showToast,
      toastMessage,
      toastType,
      triggerToast
  

} = useMyTasks();
</script>
