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

        <!-- FORM WITH LABELS -->
        <div class="grid grid-cols-2 gap-4 text-sm">

          <!-- NAME -->
          <div>
            <label class="font-semibold">First Name</label>
            <input v-model="form.firstName" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">Last Name</label>
            <input v-model="form.lastName" class="border p-2 w-full rounded" />
          </div>

          <div class="col-span-2">
            <label class="font-semibold">Email</label>
            <input v-model="form.email" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">Phone</label>
            <input v-model="form.phone" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">Age</label>
            <input v-model="form.age" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">Gender</label>
            <input v-model="form.gender" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">Username</label>
            <input v-model="form.username" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">Birth Date</label>
            <input v-model="form.birthDate" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">Blood Group</label>
            <input v-model="form.bloodGroup" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">Eye Color</label>
            <input v-model="form.eyeColor" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">Height</label>
            <input v-model="form.height" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">Weight</label>
            <input v-model="form.weight" class="border p-2 w-full rounded" />
          </div>

          <!-- ADDRESS -->
          <div>
            <label class="font-semibold">Address</label>
            <input v-model="form.address.address" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">City</label>
            <input v-model="form.address.city" class="border p-2 w-full rounded" />
          </div>

          <div class="col-span-2">
            <label class="font-semibold">Country</label>
            <input v-model="form.address.country" class="border p-2 w-full rounded" />
          </div>

          <!-- COMPANY -->
          <div>
            <label class="font-semibold">Company Name</label>
            <input v-model="form.company.name" class="border p-2 w-full rounded" />
          </div>

          <div>
            <label class="font-semibold">Company Title</label>
            <input v-model="form.company.title" class="border p-2 w-full rounded" />
          </div>

          <div class="col-span-2">
            <label class="font-semibold">Department</label>
            <input v-model="form.company.department" class="border p-2 w-full rounded" />
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

    <!-- VIEW MODAL (IMPROVED UI) -->
    <div v-if="showView" class="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div class="bg-white p-6 rounded-lg w-[650px] max-h-[90vh] overflow-auto">

        <h2 class="text-xl font-bold mb-4 border-b pb-2">User Details</h2>

        <div class="grid grid-cols-2 gap-3 text-sm">

          <p><b>ID:</b> {{ selectedUser.id }}</p>
          <p><b>Name:</b> {{ selectedUser.firstName }} {{ selectedUser.lastName }}</p>
          <p><b>Email:</b> {{ selectedUser.email }}</p>
          <p><b>Phone:</b> {{ selectedUser.phone }}</p>
          <p><b>Age:</b> {{ selectedUser.age }}</p>
          <p><b>Gender:</b> {{ selectedUser.gender }}</p>
          <p><b>Username:</b> {{ selectedUser.username }}</p>
          <p><b>Birth Date:</b> {{ selectedUser.birthDate }}</p>
          <p><b>Blood Group:</b> {{ selectedUser.bloodGroup }}</p>
          <p><b>Eye Color:</b> {{ selectedUser.eyeColor }}</p>
          <p><b>Height:</b> {{ selectedUser.height }}</p>
          <p><b>Weight:</b> {{ selectedUser.weight }}</p>

          <p><b>Address:</b> {{ selectedUser.address?.address }}</p>
          <p><b>City:</b> {{ selectedUser.address?.city }}</p>
          <p><b>Country:</b> {{ selectedUser.address?.country }}</p>

          <p><b>Company:</b> {{ selectedUser.company?.name }}</p>
          <p><b>Title:</b> {{ selectedUser.company?.title }}</p>
          <p><b>Department:</b> {{ selectedUser.company?.department }}</p>

        </div>

        <div class="text-right mt-4">
          <button @click="showView=false" class="bg-gray-500 text-white px-3 py-1 rounded">
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

      form: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        username: "",
        birthDate: "",
        bloodGroup: "",
        eyeColor: "",
        height: "",
        weight: "",
        address: { address: "", city: "", country: "" },
        company: { name: "", title: "", department: "" }
      }
    };
  },

  async mounted() {
    const res = await fetch("https://dummyjson.com/users?limit=10");
    const data = await res.json();
    this.users = data.users;
  },

  methods: {

    openAdd() {
      this.resetForm();
      this.isEdit = false;
      this.showModal = true;
    },

    addUser() {
      this.users.unshift({ id: Date.now(), ...this.form });
      this.showModal = false;
    },

    editUser(user, index) {
      this.form = JSON.parse(JSON.stringify(user));
      this.editIndex = index;
      this.isEdit = true;
      this.showModal = true;
    },

    updateUser() {
      this.users[this.editIndex] = JSON.parse(JSON.stringify(this.form));
      this.showModal = false;
      this.isEdit = false;
    },

    deleteUser(index) {
      this.users.splice(index, 1);
    },

    viewUser(user) {
      this.selectedUser = user;
      this.showView = true;
    },

    resetForm() {
      this.form = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        username: "",
        birthDate: "",
        bloodGroup: "",
        eyeColor: "",
        height: "",
        weight: "",
        address: { address: "", city: "", country: "" },
        company: { name: "", title: "", department: "" }
      };
    }
  }
};
</script>