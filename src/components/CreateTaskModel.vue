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

        <!-- HEADER -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div>
            <h3 class="text-base font-semibold text-gray-900">Create New Task</h3>
            <p class="text-xs text-gray-400">Assign task to a team member</p>
          </div>
          <button
  class="w-9 h-9 flex items-center justify-center
         border border-gray-200 rounded-lg
         p-2
         text-red-500
         hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700
         transition-all duration-200"
  @click="$emit('close')"
>
  ✕
</button>
        </div>

        <!-- CONTENT (ONLY SCROLL AREA) -->
        <div class="p-6 space-y-4 overflow-y-auto">

          <!-- TITLE -->
          <input
            v-model="title"
            placeholder="Task title"
            class="w-full px-3 py-2 border rounded-lg text-sm"
          />

          <!-- DESCRIPTION -->
          <textarea
            v-model="description"
            placeholder="Description"
            class="w-full px-3 py-2 border rounded-lg text-sm"
          />

          <!-- USERS -->
          <div>
            <p class="text-xs font-semibold text-red-600 mb-2">
              Select User
            </p>

            <!-- NO INNER SCROLL -->
            <div class="space-y-2">
              <div
                v-for="(user, index) in users"
                :key="user.id"
                @click="selectedUserId = user.id"
                class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition hover:bg-gray-50"
                :class="selectedUserId === user.id ? 'border-green-500 bg-green-50' : 'border-gray-200'"
              >

                <!-- LEFT SIDE -->
                <div class="flex items-center gap-3">

                  <!-- NUMBER -->
                  <span class="text-xs font-bold text-gray-400 w-5">
                    {{ index + 1 }}
                  </span>

                  <!-- AVATAR -->
                  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                    {{
                      (user.name || user.username || user.first_name || "U")
                        .charAt(0)
                        .toUpperCase()
                    }}
                  </div>

                  <!-- NAME + EMAIL -->
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-800">
                      {{ user.name || user.username || user.first_name }}
                    </span>
                    <span class="text-xs text-gray-400">
                      {{ user.email }}
                    </span>
                  </div>
                </div>

                <!-- RIGHT ARROW -->
                <i class="fa-solid fa-arrow-right text-gray-400"></i>

              </div>
            </div>
          </div>

        </div>

        <!-- FOOTER -->
        <div class="px-6 py-3 border-t flex justify-end gap-2 bg-gray-50">

          <button @click="$emit('close')" class="px-4 py-2 text-sm text-red-600 border  border-red-500  hover:bg-gray-200 rounded-full">
            Cancel
          </button>

          <button
            @click="submitTask"
            class="px-4 py-2 text-sm bg-green-600 text-white rounded-full hover:bg-green-700"
          >
           + Create Task
          </button>

        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from "vue";
import { useToast } from "../composables/useToast";

const { triggerToast } = useToast();

const props = defineProps({
  show: Boolean,
  users: Array
});

const emit = defineEmits(["close", "submit"]);

const title = ref("");
const description = ref("");
const selectedUserId = ref(null);

const submitTask = () => {
  if (!title.value.trim()) {
    triggerToast("Title required", "error");
    return;
  }

  if (!selectedUserId.value) {
    triggerToast("Select a user", "error");
    return;
  }

  emit("submit", {
    title: title.value,
    description: description.value,
    assigned_to: selectedUserId.value
  });
};

watch(() => props.show, (v) => {
  if (!v) {
    title.value = "";
    description.value = "";
    selectedUserId.value = null;
  }
});
</script>