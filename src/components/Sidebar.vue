<template>
  <div
    :class="[
      'h-screen bg-gray-900 text-white flex flex-col transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-60'
    ]"
  >

    <!-- Top -->
    <div class="flex items-center justify-between p-3 border-b border-gray-700">

      <span v-if="!isCollapsed" class="font-bold text-lg">
        MyApp
      </span>

      <!-- Toggle Button -->
      <button
        @click="toggleSidebar"
        class="p-2 hover:bg-gray-700 rounded"
      >
        <Menu class="w-5 h-5 text-white" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-2 mt-4 px-2 flex-1">

      <router-link
        to="/dashboard"
        class="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition"
      >
        <LayoutDashboard class="w-5 h-5 text-white" />
        <span v-if="!isCollapsed">Dashboard</span>
      </router-link>

      <router-link
        to="/users"
        class="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition"
      >
        <Users class="w-5 h-5 text-white" />
        <span v-if="!isCollapsed">Users</span>
      </router-link>

      <router-link
        to="/profile"
        class="flex items-center gap-3 p-2 hover:bg-gray-700 rounded transition"
      >
        <User class="w-5 h-5 text-white" />
        <span v-if="!isCollapsed">Profile</span>
      </router-link>

    </nav>

    <!-- Logout Button Bottom -->
    <div class="p-2 border-t border-gray-700">

      <button
        @click="logout"
        class="w-full flex items-center gap-3 p-2 rounded hover:bg-red-500 transition"
      >
        <LogOut class="w-5 h-5 text-white" />

        <span v-if="!isCollapsed">
          Logout
        </span>
      </button>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

import {
  Menu,
  LayoutDashboard,
  Users,
  User,
  LogOut
} from "lucide-vue-next"

const isCollapsed = ref(false)

const router = useRouter()

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const logout = () => {
  sessionStorage.removeItem("token")
  router.push("/login")
}
</script>