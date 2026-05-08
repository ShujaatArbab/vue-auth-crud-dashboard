<template>
  <div class="w-60 h-screen bg-gray-900 text-white p-4">

    <nav class="flex flex-col gap-2">

      <router-link to="/dashboard" class="p-2 hover:bg-gray-700 rounded">
        Dashboard
      </router-link>

      <router-link to="/users" class="p-2 hover:bg-gray-700 rounded">
        Users
      </router-link>

      <router-link to="/profile" class="p-2 hover:bg-gray-700 rounded">
        Profile
      </router-link>

    </nav>

  </div>
</template>