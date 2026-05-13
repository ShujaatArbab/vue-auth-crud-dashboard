<template>
  <router-view v-slot="{ Component }">
    <transition @enter="enter" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import gsap from "gsap";

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