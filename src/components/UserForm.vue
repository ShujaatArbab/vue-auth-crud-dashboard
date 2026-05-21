<template>
  <Teleport to="body">

    <div class="fixed inset-0 z-50 bg-black/40 grid place-items-center">

      <div class="w-[95vw] max-w-2xl h-[90vh] flex flex-col bg-white rounded-lg shadow-xl overflow-hidden">

        <!-- HEADER -->
        <div class="shrink-0 flex justify-between items-center px-5 py-3 border-b">
          <span class="text-sm font-medium">
            {{ buttonText === 'Add User' ? 'Add new user' : 'Edit user' }}
          </span>

          <button
            @click="$emit('cancel')"
            class="text-lg font-bold px-2"
          >
            ✕
          </button>
        </div>

        <!-- FORM -->
        <div class="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4">

          <!-- USERNAME -->
          <div>
            <label class="text-xs">Username</label>
            <input v-model="localUser.username" class="input" />

            <p v-if="submitted && errors.username" class="error">
              {{ errors.username }}
            </p>
          </div>

          <!-- FIRST NAME -->
          <div>
            <label class="text-xs">First Name</label>
            <input v-model="localUser.first_name" class="input" />

            <p v-if="submitted && errors.first_name" class="error">
              {{ errors.first_name }}
            </p>
          </div>

          <!-- LAST NAME -->
          <div>
            <label class="text-xs">Last Name</label>
            <input v-model="localUser.last_name" class="input" />

            <p v-if="submitted && errors.last_name" class="error">
              {{ errors.last_name }}
            </p>
          </div>

          <!-- EMAIL -->
          <div>
            <label class="text-xs">Email</label>
            <input v-model="localUser.email" type="email" class="input" />

            <p v-if="submitted && errors.email" class="error">
              {{ errors.email }}
            </p>
          </div>

         

          <!-- PHONE -->
          <div>
            <label class="text-xs">Phone</label>
            <input v-model="localUser.phone" class="input" />

            <p v-if="submitted && errors.phone" class="error">
              {{ errors.phone }}
            </p>
          </div>

          <!-- COUNTRY -->
          <div>
            <label class="text-xs">Country</label>
            <input v-model="localUser.country" class="input" />

            <p v-if="submitted && errors.country" class="error">
              {{ errors.country }}
            </p>
          </div>

          <!-- CITY -->
          <div>
            <label class="text-xs">City</label>
            <input v-model="localUser.city" class="input" />

            <p v-if="submitted && errors.city" class="error">
              {{ errors.city }}
            </p>
          </div>

          <!-- DOB -->
          <div>
            <label class="text-xs">DOB</label>
            <input v-model="localUser.dob" type="date" class="input" />

            <p v-if="submitted && errors.dob" class="error">
              {{ errors.dob }}
            </p>
          </div>

          <!-- GENDER -->
          <div>
            <label class="text-xs">Gender</label>

            <select v-model="localUser.gender" class="input">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <p v-if="submitted && errors.gender" class="error">
              {{ errors.gender }}
            </p>
          </div>
             <!-- PASSWORD -->
          <div>
            <label class="text-xs">Password</label>

            <div class="relative">
              <input
                v-model="localUser.password"
                :type="showPassword ? 'text' : 'password'"
                class="input pr-10"
              />

              <button
                type="button"
                class="absolute right-2 top-2 text-sm"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>

            <p v-if="submitted && errors.password" class="error">
              {{ errors.password }}
            </p>
          </div>

          <!-- CONFIRM PASSWORD -->
          <div>
            <label class="text-xs">Confirm Password</label>

            <div class="relative">
              <input
                v-model="localUser.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="input pr-10"
              />

              <button
                type="button"
                class="absolute right-2 top-2 text-sm"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>
            </div>

            <p v-if="submitted && errors.confirmPassword" class="error">
              {{ errors.confirmPassword }}
            </p>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="shrink-0 flex justify-end gap-2 px-5 py-3 border-t">

          <button
            @click="$emit('cancel')"
            class="px-4 py-2 bg-red-100 text-red-600 rounded"
          >
            Cancel
          </button>

          <button
            class="px-5 py-2 bg-green-700 text-white rounded"
            @click="handleSubmit"
          >
            Save
          </button>

        </div>

      </div>

    </div>

  </Teleport>
</template>

<script>
import { userForm } from "../composables/userForm";


export default {
  name: "UserForm",
  props: {
    user: { type: Object, default: () => ({}) },
    buttonText: { type: String, default: "Save" }
  },
  emits: ["submit-user", "cancel"],
  setup(props, { emit }) {
    return userForm(props, emit);
  }
};

</script>

<style scoped>

.input {
  width: 100%;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 13px;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}

</style>