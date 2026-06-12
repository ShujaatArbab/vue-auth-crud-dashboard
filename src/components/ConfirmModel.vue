<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        @click="$emit('close')"
      ></div>

      <div
        class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 z-10 overflow-hidden transform transition-all"
      >

        <div class="px-6 py-4 bg-gray-50/70 border-b border-gray-100 flex items-center gap-3">
          
          <div 
            class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="{
              'bg-red-50 text-red-600': variant === 'danger',
              'bg-blue-50 text-blue-600': variant === 'info',
              'bg-green-50 text-green-600': variant === 'success'
            }"
          >
            <i v-if="variant === 'danger'" class="fa-solid fa-triangle-exclamation text-sm"></i>
            <i v-else-if="variant === 'info'" class="fa-solid fa-circle-info text-sm"></i>
            <i v-else class="fa-solid fa-circle-check text-sm"></i>
          </div>

          <h2 class="text-base font-semibold text-gray-900 tracking-tight">
            {{ title }}
          </h2>
        </div>

        <div class="px-6 py-5">
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ message }}
          </p>
        </div>

        <div class="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end items-center gap-3">

          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center gap-1.5"
          >
            Cancel
          </button>

          <button
            type="button"
            @click="$emit('confirm')"
            class="px-4 py-2 text-sm font-semibold text-white rounded-xl active:scale-[0.98] transition-all duration-200 shadow-md flex items-center gap-1.5"
            :class="{
              'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-600/10 focus:ring-4 focus:ring-red-100': variant === 'danger',
              'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-600/10 focus:ring-4 focus:ring-blue-100': variant === 'info',
              'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-green-600/10 focus:ring-4 focus:ring-green-100': variant === 'success'
            }"
          >
            Confirm
          </button>

        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: { 
    type: String, 
    default: "Are you sure?" 
  },
  message: { 
    type: String, 
    default: "This action cannot be undone." 
  },
  variant: {
    type: String,
    default: "danger", // Options: 'danger' | 'info' | 'success'
    validator: (value) => ["danger", "info", "success"].includes(value)
  }
});

defineEmits(["close", "confirm"]);
</script>