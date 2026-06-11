
<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">

    <!-- HEADER -->
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4"
    >
      <div>
        <h2 class="text-xl font-semibold text-gray-900">
          My Tasks
        </h2>

        <p class="text-sm text-gray-500">
          {{ filteredTasks.length }} total tasks
        </p>
      </div>
    </div>

    <!-- CARD -->
    <div class="bg-white border rounded-xl overflow-hidden shadow-sm">

      <!-- FILTERS -->
      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-b bg-gray-50"
      >
        <input
          v-model="search"
          type="text"
          placeholder="Search my tasks..."
          class="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
        />

        <select
          v-model="perPage"
          class="w-full sm:w-auto px-3 py-2 border rounded-lg text-sm bg-white"
        >
          <option :value="5">Show 5</option>
          <option :value="10">Show 10</option>
          <option :value="20">Show 20</option>
          <option :value="50">Show 50</option>
        </select>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="p-6 text-center text-gray-500">
        Loading tasks...
      </div>

      <!-- ERROR -->
      <div
        v-else-if="error"
        class="p-6 text-center text-red-500"
      >
        {{ error }}
      </div>

      <template v-else>

        <!-- MOBILE VIEW -->
        <div class="block md:hidden">

          <div
            v-for="task in paginatedTasks"
            :key="task.id"
            class="border-b p-4"
          >
            <div class="flex justify-between items-start gap-3">

              <div class="flex-1 min-w-0">
                <h3
                  class="font-semibold text-gray-800 break-words"
                >
                  {{ task.title }}
                </h3>

                <p class="text-sm text-gray-500 mt-2">
                  Assigned:
                  {{ task.assigned_to_name || "Me" }}
                </p>

                <p class="text-xs text-gray-400 mt-1">
                  {{ formatDate(task.created_at) }}
                </p>
              </div>

              <span
                class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                :class="{
                  'bg-yellow-100 text-yellow-700':
                    task.status === 'pending',

                  'bg-blue-100 text-blue-700':
                    task.status === 'in_progress',

                  'bg-green-100 text-green-700':
                    task.status === 'completed'
                }"
              >
                {{ task.status }}
              </span>
            </div>

            <div class="mt-4 flex flex-col gap-2">

              <button
                class="w-full px-3 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-500"
                @click="openComment(task)"
              >
                Comment
              </button>

              <select
                :value="task.status"
                @change="updateStatus(task.id, $event.target.value)"
                class="w-full px-3 py-2 text-sm rounded-md border"
                :class="{
                  'bg-yellow-500 text-white':
                    task.status === 'pending',

                  'bg-blue-600 text-white':
                    task.status === 'in_progress',

                  'bg-green-600 text-white':
                    task.status === 'completed'
                }"
              >
                <option value="pending">
                  Pending
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>

            </div>
          </div>

        </div>

        <!-- DESKTOP TABLE -->
        <div class="hidden md:block overflow-x-auto">

          <table class="w-full min-w-[850px] text-left">

            <thead
              class="bg-gray-100 text-xs uppercase text-gray-500"
            >
              <tr>
                <th class="p-3 min-w-[250px]">
                  Title
                </th>

                <th class="p-3 min-w-[180px]">
                  Assigned To
                </th>

                <th class="p-3 min-w-[180px]">
                  Created At
                </th>

                <th class="p-3 min-w-[250px] text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              <tr
                v-for="task in paginatedTasks"
                :key="task.id"
                class="border-t hover:bg-gray-50"
              >
                <td
                  class="p-3 text-sm font-medium text-gray-800"
                >
                  {{ task.title }}
                </td>

                <td class="p-3 text-sm text-gray-600">
                  {{ task.assigned_to_name || "Me" }}
                </td>

                <td class="p-3 text-sm text-gray-500">
                  {{ formatDate(task.created_at) }}
                </td>

                <td class="p-3">
                  <div
                    class="flex justify-center items-center gap-2 flex-wrap"
                  >
                    <button
                      class="px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-500"
                      @click="openComment(task)"
                    >
                      Comment
                    </button>

                    <select
                      :value="task.status"
                      @change="
                        updateStatus(
                          task.id,
                          $event.target.value
                        )
                      "
                      class="px-3 py-1 text-xs font-medium rounded-md border"
                      :class="{
                        'bg-yellow-500 text-white':
                          task.status === 'pending',

                        'bg-blue-600 text-white':
                          task.status === 'in_progress',

                        'bg-green-600 text-white':
                          task.status === 'completed'
                      }"
                    >
                      <option value="pending">
                        Pending
                      </option>

                      <option value="in_progress">
                        In Progress
                      </option>

                      <option value="completed">
                        Completed
                      </option>
                    </select>
                  </div>
                </td>
              </tr>

              <tr
                v-if="paginatedTasks.length === 0"
              >
                <td
                  colspan="4"
                  class="p-6 text-center text-gray-500"
                >
                  No tasks found
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        <!-- PAGINATION -->
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t"
        >
          <div
            class="text-sm text-gray-500 text-center sm:text-left"
          >
            Showing {{ rangeStart }}–{{ rangeEnd }}
            of {{ filteredTasks.length }}
          </div>

          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 border rounded text-sm disabled:opacity-50"
              :disabled="currentPage === 1"
              @click="goPage(currentPage - 1)"
            >
              ‹
            </button>

            <button
              class="px-4 py-1 rounded text-sm bg-green-700 text-white"
            >
              {{ currentPage }}
            </button>

            <button
              class="px-3 py-1 border rounded text-sm disabled:opacity-50"
              :disabled="currentPage === totalPages"
              @click="goPage(currentPage + 1)"
            >
              ›
            </button>
          </div>
        </div>

      </template>
    </div>

    <!-- TOAST -->
    <div
      v-if="showToast"
      class="fixed bottom-5 right-5 z-50 bg-white border shadow-lg px-4 py-3 rounded-lg"
      :class="{
        'border-green-500 text-green-700':
          toastType === 'success',

        'border-red-500 text-red-700':
          toastType === 'error'
      }"
    >
      {{ toastMessage }}
    </div>

    <!-- COMMENT MODAL -->
    <CommentModel
      :show="showCommentModal"
      :task="selectedTask"
      :task-comments="taskComments"
      @close="showCommentModal = false"
    />

  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useMyTasks } from "../composables/useMyTasks";

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
      triggerToast,
      taskComments
  

} = useMyTasks();
</script>
