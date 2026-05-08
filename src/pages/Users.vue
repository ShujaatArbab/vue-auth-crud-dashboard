<template>
  <div class="p-5">

    <!-- HEADER -->
    <div class="flex justify-between mb-4">
      <h2 class="text-2xl font-bold">Users</h2>

      <button
        @click="showModal = true"
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
          <th class="p-2">Role</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="u in users" :key="u.id" class="border-t">
          <td class="p-2">{{ u.id }}</td>
          <td class="p-2">{{ u.firstName }} {{ u.lastName }}</td>
          <td class="p-2">{{ u.email }}</td>
          <td class="p-2">{{ u.city }}</td>
          <td class="p-2">
            <span v-if="Array.isArray(u.role)">
              {{ u.role.join(', ') }}
            </span>
            <span v-else>{{ u.role }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODAL -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div class="bg-white p-6 rounded-lg w-[900px] max-h-[90vh] overflow-auto">

        <h2 class="text-xl font-bold mb-4">Add User</h2>

        <!-- FORM -->
        <div class="grid grid-cols-2 gap-3">

          <!-- NAME -->
          <div>
            <input v-model="form.firstName" placeholder="First Name" class="border p-2 w-full" />
            <p class="text-red-500 text-sm">{{ errors.firstName }}</p>
          </div>

          <div>
            <input v-model="form.lastName" placeholder="Last Name" class="border p-2 w-full" />
            <p class="text-red-500 text-sm">{{ errors.lastName }}</p>
          </div>

          <input v-model="form.email" placeholder="Email" class="border p-2 col-span-2" />
          <p class="text-red-500 text-sm col-span-2">{{ errors.email }}</p>

          <input v-model="form.phone" placeholder="Phone" class="border p-2" />
          <input v-model="form.age" placeholder="Age" class="border p-2" />

          <!-- GENDER -->
          <div class="col-span-2">
            <label class="font-bold">Gender:</label>

            <label class="ml-2">
              <input type="radio" value="male" v-model="form.gender" /> Male
            </label>

            <label class="ml-2">
              <input type="radio" value="female" v-model="form.gender" /> Female
            </label>

            <p class="text-red-500 text-sm">{{ errors.gender }}</p>
          </div>

          <input v-model="form.username" placeholder="Username" class="border p-2" />

          <!-- ROLES (UPDATED) -->
          <div class="col-span-2">
            <label class="font-bold block mb-1">Roles:</label>

            <label class="mr-3">
              <input type="checkbox" value="admin" v-model="form.role" />
              Admin
            </label>

            <label class="mr-3">
              <input type="checkbox" value="user" v-model="form.role" />
              User
            </label>

            <label class="mr-3">
              <input type="checkbox" value="manager" v-model="form.role" />
              Manager
            </label>

            <label class="mr-3">
              <input type="checkbox" value="editor" v-model="form.role" />
              Editor
            </label>
          </div>

          <!-- BLOOD GROUP -->
          <select v-model="form.bloodGroup" class="border p-2 col-span-2">
            <option value="">Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>

          <p class="text-red-500 text-sm col-span-2">{{ errors.bloodGroup }}</p>

          <input v-model="form.eyeColor" placeholder="Eye Color" class="border p-2" />
          <input v-model="form.height" placeholder="Height" class="border p-2" />

          <input v-model="form.weight" placeholder="Weight" class="border p-2" />
          <input v-model="form.city" placeholder="City" class="border p-2" />

          <input v-model="form.country" placeholder="Country" class="border p-2" />
          <input v-model="form.university" placeholder="University" class="border p-2" />

          <input v-model="form.address" placeholder="Address" class="border p-2 col-span-2" />

          <input v-model="form.companyName" placeholder="Company Name" class="border p-2" />
          <input v-model="form.companyTitle" placeholder="Company Title" class="border p-2" />

          <input v-model="form.companyDepartment" placeholder="Department" class="border p-2 col-span-2" />

          <!-- PASSWORD -->
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="border p-2 col-span-2"
            @input="checkPassword"
          />

          <p class="col-span-2 text-sm" :class="strengthColor">
            Must be 8+ chars, uppercase, number, symbol
          </p>

          <p class="text-red-500 text-sm col-span-2">{{ errors.password }}</p>

          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="border p-2 col-span-2"
          />

          <p class="text-red-500 text-sm col-span-2">{{ errors.confirmPassword }}</p>

        </div>

        <!-- BUTTONS -->
        <div class="flex justify-end gap-3 mt-4">

          <button @click="showModal = false" class="px-4 py-2 bg-gray-400 rounded">
            Cancel
          </button>

          <button @click="addUser" class="px-4 py-2 bg-green-500 text-white rounded">
            Add User
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
      showModal: false,
      users: [],
      strength: "",
      errors: {},

      form: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        username: "",
        role: [],   // ✅ CHANGED TO ARRAY
        birthDate: "",
        bloodGroup: "",
        eyeColor: "",
        height: "",
        weight: "",
        university: "",
        address: "",
        city: "",
        country: "",
        hairColor: "",
        hairType: "",
        companyName: "",
        companyTitle: "",
        companyDepartment: "",
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

  computed: {
    strengthColor() {
      if (this.strength === "strong") return "text-green-500";
      if (this.strength === "medium") return "text-yellow-500";
      return "text-red-500";
    }
  },

  methods: {

    checkPassword() {
      const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      const medium = /^(?=.*[a-z])(?=.*\d).{6,}$/;

      if (strong.test(this.form.password)) this.strength = "strong";
      else if (medium.test(this.form.password)) this.strength = "medium";
      else this.strength = "weak";
    },

    validate() {
      this.errors = {};

      const emailRegex = /^\S+@\S+\.\S+$/;

      if (!this.form.firstName) this.errors.firstName = "First name required";
      if (!this.form.lastName) this.errors.lastName = "Last name required";

      if (!this.form.email) this.errors.email = "Email required";
      else if (!emailRegex.test(this.form.email))
        this.errors.email = "Invalid email";

      if (!this.form.gender) this.errors.gender = "Select gender";
      if (!this.form.bloodGroup) this.errors.bloodGroup = "Select blood group";

      if (this.form.password.length < 8)
        this.errors.password = "Password too weak";

      if (this.form.password !== this.form.confirmPassword)
        this.errors.confirmPassword = "Passwords not match";

      return Object.keys(this.errors).length === 0;
    },

    addUser() {
      if (!this.validate()) return;

      this.users.unshift({
        id: Date.now(),
        ...this.form
      });

      this.showModal = false;

      this.form = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        username: "",
        role: [],
        birthDate: "",
        bloodGroup: "",
        eyeColor: "",
        height: "",
        weight: "",
        university: "",
        address: "",
        city: "",
        country: "",
        hairColor: "",
        hairType: "",
        companyName: "",
        companyTitle: "",
        companyDepartment: "",
        password: "",
        confirmPassword: ""
      };
    }
  }
};
</script>