<template>
  <div class="p-5">

    <!-- HEADER -->
    <div class="flex justify-between mb-4">
      <h2 class="text-2xl font-bold">Users</h2>

      <button
        @click="openAdd"
        class="bg-green-500 text-white px-3 py-1 rounded"
      >
        + Add User
      </button>
    </div>

    <!-- TABLE -->
    <table class="w-full bg-white shadow rounded">
      <thead class="bg-gray-200">
        <tr>
          <th class="p-2">ID</th>
          <th class="p-2">Name</th>
          <th class="p-2">Email</th>
          <th class="p-2">City</th>
          <th class="p-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(u,index) in users" :key="u.id" class="border-t">
          <td class="p-2">{{ u.id }}</td>
          <td class="p-2">{{ u.firstName }} {{ u.lastName }}</td>
          <td class="p-2">{{ u.email }}</td>
          <td class="p-2">{{ u.address?.city }}</td>

          <td class="p-2 flex gap-3">
            <button @click="viewUser(u)">👁</button>
            <button @click="editUser(u,index)">✏️</button>
            <button @click="deleteUser(index)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ADD / EDIT MODAL -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div class="bg-white p-6 rounded-lg w-[900px] max-h-[90vh] overflow-auto">

        <h2 class="text-xl font-bold mb-4">
          {{ isEdit ? "Edit User" : "Add User" }}
        </h2>

        <!-- FORM -->
        <div class="grid grid-cols-2 gap-4 text-sm">

          <!-- NAME -->
          <div>
            <label>First Name</label>
            <input v-model="form.firstName" class="border p-2 w-full rounded" />
            <p class="text-red-500 text-sm">{{ errors.firstName }}</p>
          </div>

          <div>
            <label>Last Name</label>
            <input v-model="form.lastName" class="border p-2 w-full rounded" />
            <p class="text-red-500 text-sm">{{ errors.lastName }}</p>
          </div>

          <div class="col-span-2">
            <label>Email</label>
            <input v-model="form.email" class="border p-2 w-full rounded" />
            <p class="text-red-500 text-sm">{{ errors.email }}</p>
          </div>

          <!-- PHONE -->
          <div>
            <label>Phone</label>
            <input v-model="form.phone" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label>Age</label>
            <input v-model="form.age" class="border p-2 w-full rounded" />
          </div>

          <!-- RADIO BUTTON (GENDER) -->
          <div class="col-span-2">
            <label class="font-semibold">Gender</label><br>

            <input type="radio" value="male" v-model="form.gender" /> Male
            <input type="radio" value="female" v-model="form.gender" class="ml-3" /> Female

            <p class="text-red-500 text-sm">{{ errors.gender }}</p>
          </div>

          <!-- DROPDOWN -->
          <div class="col-span-2">
            <label>Blood Group</label>
            <select v-model="form.bloodGroup" class="border p-2 w-full rounded">
              <option value="">Select</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>

            <p class="text-red-500 text-sm">{{ errors.bloodGroup }}</p>
          </div>

          <!-- USERNAME -->
          <div>
            <label>Username</label>
            <input v-model="form.username" class="border p-2 w-full rounded" />
          </div>

          <!-- PASSWORD -->
          <div>
            <label>Password</label>
            <input type="password" v-model="form.password" class="border p-2 w-full rounded" />
            <p class="text-red-500 text-sm">{{ errors.password }}</p>
          </div>

          <div>
            <label>Confirm Password</label>
            <input type="password" v-model="form.confirmPassword" class="border p-2 w-full rounded" />
            <p class="text-red-500 text-sm">{{ errors.confirmPassword }}</p>
          </div>

        </div>

        <!-- BUTTONS -->
        <div class="flex justify-end gap-3 mt-4">

          <button @click="showModal=false" class="px-4 py-2 bg-gray-400 rounded">
            Cancel
          </button>

          <button @click="isEdit ? updateUser() : addUser()" class="px-4 py-2 bg-green-500 text-white rounded">
            {{ isEdit ? "Update" : "Add" }}
          </button>

        </div>

      </div>

    </div>

   <!-- VIEW MODAL FULL DETAILS -->
<div v-if="showView" class="fixed inset-0 bg-black/60 flex items-center justify-center">

  <div class="bg-white p-6 rounded-lg w-[750px] max-h-[90vh] overflow-auto">

    <h2 class="text-xl font-bold mb-4 border-b pb-2">
      User Full Details
    </h2>

    <div v-if="selectedUser" class="grid grid-cols-2 gap-3 text-sm">

      <p><b>ID:</b> {{ selectedUser.id }}</p>

      <p><b>First Name:</b> {{ selectedUser.firstName }}</p>
      <p><b>Last Name:</b> {{ selectedUser.lastName }}</p>

      <p><b>Maiden Name:</b> {{ selectedUser.maidenName }}</p>
      <p><b>Age:</b> {{ selectedUser.age }}</p>

      <p><b>Gender:</b> {{ selectedUser.gender }}</p>
      <p><b>Email:</b> {{ selectedUser.email }}</p>

      <p><b>Phone:</b> {{ selectedUser.phone }}</p>
      <p><b>Username:</b> {{ selectedUser.username }}</p>
      <p><b>Password:</b> {{ selectedUser.password }}</p>

      <p><b>Birth Date:</b> {{ selectedUser.birthDate }}</p>
      <p><b>Blood Group:</b> {{ selectedUser.bloodGroup }}</p>
      <p><b>Height:</b> {{ selectedUser.height }}</p>
      <p><b>Weight:</b> {{ selectedUser.weight }}</p>
      <p><b>Eye Color:</b> {{ selectedUser.eyeColor }}</p>

      <p><b>Hair Color:</b> {{ selectedUser.hair?.color }}</p>
      <p><b>Hair Type:</b> {{ selectedUser.hair?.type }}</p>

      <p><b>IP:</b> {{ selectedUser.ip }}</p>
      <p><b>MAC Address:</b> {{ selectedUser.macAddress }}</p>

      <p><b>University:</b> {{ selectedUser.university }}</p>
      <p><b>SSN:</b> {{ selectedUser.ssn }}</p>

      <p><b>Role:</b> {{ selectedUser.role }}</p>

      <p><b>Address:</b> {{ selectedUser.address?.address }}</p>
      <p><b>City:</b> {{ selectedUser.address?.city }}</p>
      <p><b>State:</b> {{ selectedUser.address?.state }}</p>
      <p><b>Country:</b> {{ selectedUser.address?.country }}</p>

      <p><b>Company:</b> {{ selectedUser.company?.name }}</p>
      <p><b>Department:</b> {{ selectedUser.company?.department }}</p>
      <p><b>Title:</b> {{ selectedUser.company?.title }}</p>

      <p><b>Bank Card:</b> {{ selectedUser.bank?.cardNumber }}</p>
      <p><b>Currency:</b> {{ selectedUser.bank?.currency }}</p>

      <p><b>Crypto:</b> {{ selectedUser.crypto?.coin }}</p>

      <p><b>User Agent:</b> {{ selectedUser.userAgent }}</p>

    </div>

    <div class="text-right mt-4">
      <button @click="showView=false" class="bg-gray-600 text-white px-3 py-1 rounded">
        Close
      </button>
    </div>

  </div>

</div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      showModal: false,
      showView: false,
      isEdit: false,
      editIndex: null,
      selectedUser: {},

      errors: {},

      form: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        username: "",
        bloodGroup: "",
        password: "",
        confirmPassword: ""
      }
    };
  },

  async mounted() {
    const res = await fetch("https://dummyjson.com/users?limit=10");
    const data = await res.json();
    this.users = data.users;
  },

  methods: {

    validate() {
      this.errors = {};

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (!this.form.firstName) this.errors.firstName = "Required";
      if (!this.form.lastName) this.errors.lastName = "Required";

      if (!this.form.email) this.errors.email = "Required";
      else if (!emailRegex.test(this.form.email))
        this.errors.email = "Invalid email";

      if (!this.form.gender) this.errors.gender = "Select gender";
      if (!this.form.bloodGroup) this.errors.bloodGroup = "Select blood group";

      if (!this.form.password)
        this.errors.password = "Password required";
      else if (!strongPass.test(this.form.password))
        this.errors.password = "Weak password (A,a,1,@,8+)";

      if (this.form.password !== this.form.confirmPassword)
        this.errors.confirmPassword = "Passwords not match";

      return Object.keys(this.errors).length === 0;
    },

    openAdd() {
      this.form = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        username: "",
        bloodGroup: "",
        password: "",
        confirmPassword: ""
      };
      this.isEdit = false;
      this.showModal = true;
    },

    addUser() {
      if (!this.validate()) return;

      this.users.unshift({
        id: Date.now(),
        ...this.form
      });

      this.showModal = false;
    },

    editUser(user, index) {
      this.form = JSON.parse(JSON.stringify(user));
      this.editIndex = index;
      this.isEdit = true;
      this.showModal = true;
    },

    updateUser() {
      if (!this.validate()) return;

      this.users[this.editIndex] = JSON.parse(JSON.stringify(this.form));
      this.showModal = false;
      this.isEdit = false;
    },

    deleteUser(index) {
      this.users.splice(index, 1);
    },

   viewUser(user) {
  this.selectedUser = JSON.parse(JSON.stringify(user));
  this.showView = true;
}
  }
};
</script>