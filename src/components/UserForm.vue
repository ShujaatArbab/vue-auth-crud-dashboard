<template>
  <!-- TELEPORT FIX: prevents layout breaking (VERY IMPORTANT) -->
  <Teleport to="body">

    <!-- OVERLAY -->
    <div class="fixed inset-0 z-50 w-screen h-screen bg-black/40 grid place-items-center">

      <!-- MODAL -->
      <div
        class="w-[95vw] max-w-2xl min-w-[320px] h-[90vh] flex flex-col bg-white rounded-lg shadow-xl overflow-hidden"
      >

        <!-- HEADER (fixed) -->
        <div class="shrink-0 flex justify-between items-center px-5 py-3 border-b bg-white">
          <div class="flex items-center gap-2 text-gray-700">
            <i class="ti ti-user-plus text-green-700 text-[16px]"></i>
            <span class="text-sm font-medium">
              {{ buttonText === 'Add User' ? 'Add new user' : 'Edit user' }}
            </span>
          </div>

          <button
            class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-700"
            @click="$emit('cancel')"
          >
            <i class="ti ti-x text-sm"></i>
          </button>
        </div>

        <!-- ONLY SCROLL AREA -->
        <div class="flex-1 overflow-y-auto p-5">

          <!-- SUCCESS -->
          <div
            v-if="submitted"
            class="flex items-center gap-2 px-4 py-2 mb-3 text-sm text-green-800 bg-green-100 border border-green-300 rounded"
          >
            <i class="ti ti-circle-check"></i>
            User saved successfully!
          </div>

          <!-- GRID -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <!-- NAME -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">
                Full name <span class="text-red-500">*</span>
              </label>

              <input
                v-model="localUser.name"
                @input="liveCheck('name')"
                type="text"
                placeholder="John Doe"
                class="h-9 px-3 text-sm border rounded-md w-full focus:ring-2 focus:ring-blue-100"
                :class="errors.name ? 'border-red-500' : 'border-gray-300'"
              />

              <small class="text-xs text-red-500 min-h-[14px]">
                {{ errors.name }}
              </small>
            </div>

            <!-- USERNAME -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">Username</label>
              <input
                v-model="localUser.username"
                type="text"
                placeholder="johndoe"
                class="h-9 px-3 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <!-- EMAIL -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">
                Email <span class="text-red-500">*</span>
              </label>

              <input
                v-model="localUser.email"
                @input="liveCheck('email')"
                type="email"
                placeholder="john@example.com"
                class="h-9 px-3 text-sm border rounded-md w-full"
                :class="errors.email ? 'border-red-500' : 'border-gray-300'"
              />

              <small class="text-xs text-red-500 min-h-[14px]">
                {{ errors.email }}
              </small>
            </div>

            <!-- PHONE -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">Phone</label>
              <input
                v-model="localUser.phone"
                type="text"
                placeholder="+1 555 000 0000"
                class="h-9 px-3 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <!-- WEBSITE -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">Website</label>
              <input
                v-model="localUser.website"
                type="text"
                placeholder="example.com"
                class="h-9 px-3 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <!-- COMPANY -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">Company</label>
              <input
                v-model="localUser.company"
                type="text"
                placeholder="Acme Inc."
                class="h-9 px-3 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <!-- DIVIDER -->
            <div class="col-span-2 border-t border-gray-200 my-1"></div>

            <!-- GENDER -->
            <div class="col-span-2 flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">
                Gender <span class="text-red-500">*</span>
              </label>

              <div class="flex flex-wrap gap-2">
                <label
                  v-for="g in ['Male','Female','Other']"
                  :key="g"
                  class="px-3 py-1 text-xs border rounded-full cursor-pointer"
                  :class="localUser.gender === g
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-500'"
                  @click="localUser.gender = g; errors.gender = ''"
                >
                  {{ g }}
                </label>
              </div>

              <small class="text-xs text-red-500">{{ errors.gender }}</small>
            </div>

            <!-- BLOOD -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">Blood group</label>
              <select
                v-model="localUser.bloodGroup"
                class="h-9 px-3 text-sm border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                <option v-for="bg in ['A+','A-','B+','B-','O+','O-','AB+','AB-']" :key="bg">
                  {{ bg }}
                </option>
              </select>
            </div>

            <!-- ROLE -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">
                Role <span class="text-red-500">*</span>
              </label>

              <select
                v-model="localUser.role"
                @change="liveCheck('role')"
                class="h-9 px-3 text-sm border rounded-md"
                :class="errors.role ? 'border-red-500' : 'border-gray-300'"
              >
                <option value="">Select</option>
                <option>Admin</option>
                <option>Manager</option>
                <option>User</option>
              </select>

              <small class="text-xs text-red-500">{{ errors.role }}</small>
            </div>

            <!-- DEPARTMENT -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">Department</label>
              <select
                v-model="localUser.department"
                class="h-9 px-3 text-sm border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                <option>Engineering</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>HR</option>
              </select>
            </div>

            <!-- SKILLS -->
            <div class="col-span-2 flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">
                Skills <span class="text-red-500">*</span>
              </label>

              <div class="flex flex-wrap gap-2">
                <label
                  v-for="skill in allSkills"
                  :key="skill"
                  class="px-3 py-1 text-xs border rounded-full cursor-pointer"
                  :class="localUser.skills.includes(skill)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-500'"
                  @click="toggleSkill(skill)"
                >
                  {{ skill }}
                </label>
              </div>

              <small class="text-xs text-red-500">{{ errors.skills }}</small>
            </div>

            <!-- PASSWORD -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">
                Password <span class="text-red-500">*</span>
              </label>

              <div class="relative">
                <input
                  :type="showPw ? 'text' : 'password'"
                  v-model="localUser.password"
                  @input="liveCheck('password')"
                  class="h-9 w-full px-3 pr-10 text-sm border border-gray-300 rounded-md"
                />

                <button
                  type="button"
                  class="absolute right-2 top-2 text-gray-400"
                  @click="showPw = !showPw"
                >
                  <i :class="showPw ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
                </button>
              </div>

              <small class="text-xs text-red-500">{{ errors.password }}</small>
            </div>

            <!-- CONFIRM -->
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-500 font-medium">
                Confirm password <span class="text-red-500">*</span>
              </label>

              <input
                :type="showCp ? 'text' : 'password'"
                v-model="localUser.confirmPassword"
                @input="liveCheck('confirm')"
                class="h-9 px-3 text-sm border border-gray-300 rounded-md"
              />

              <small class="text-xs text-red-500">{{ errors.confirmPassword }}</small>
            </div>

          </div>
        </div>

        <!-- FOOTER -->
        <div class="shrink-0 flex justify-end gap-2 px-5 py-3 border-t bg-gray-50">

          <button
            class="px-4 py-2 text-sm text-red-600 bg-red-100 rounded-md"
            @click="$emit('cancel')"
          >
            Cancel
          </button>

          <button
            class="px-5 py-2 text-sm text-white bg-green-700 rounded-md disabled:opacity-50"
            :disabled="!isFormValid"
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