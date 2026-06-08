<template>
  <router-view v-slot="{ Component }">
    <transition @enter="enter" mode="out-in">
      <component :is="Component" />
    </transition>
     <!-- GLOBAL TOAST -->
  <div
    v-if="showToast"
    class="fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-sm"
    :class="{
      'bg-green-600 text-white': toastType === 'success',
      'bg-red-600 text-white': toastType === 'error'
    }"
  >
    {{ toastMessage }}
  </div>
  </router-view>
</template>

<script setup>
import gsap from "gsap";
import { useToast } from "./composables/useToast"

const { showToast, toastMessage, toastType } = useToast()

const enter = (el, done) => {
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: 0.5,
    ease: "power2.out",
    
    onComplete: done
  });
};
</script>