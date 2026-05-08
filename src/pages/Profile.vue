<template>
  <div class="p-6 ">

    <h2 class="text-2xl font-bold mb-6 bg-black-900">
      My Profile
    </h2>

    <div
  v-if="user"
  class="bg-gray-800 p-6 rounded-xl text-white shadow-lg"
>

  <!-- Heading Row -->
  <div class="grid grid-cols-4 gap-4 border-b border-gray-600 pb-2 mb-3 font-bold text-gray-300">
    <p>ID</p>
    <p>Name</p>
    <p>Email</p>
    <p>City</p>
  </div>

  <!-- Data Row -->
  <div class="grid grid-cols-4 gap-4 text-sm">
    <p>{{ user.id }}</p>

    <p>
      {{ user.firstName }} {{ user.lastName }}
    </p>

    <p class="break-words">
      {{ user.email }}
    </p>

    <p>
      {{ user.address?.city }}
    </p>
  </div>

</div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null
    };
  },

  mounted() {
    this.user = JSON.parse(
      sessionStorage.getItem("user")
    );

    console.log(this.user);
  }
};
</script>