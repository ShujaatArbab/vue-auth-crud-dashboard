<template>
  <!-- OVERLAY -->
  <div
    class="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >

    <!-- MODAL -->
    <div
      class="w-full max-w-3xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
    >

      <!-- HEADER -->
      <div class="flex justify-between items-center px-5 py-3 border-b bg-white">

        <div class="flex items-center gap-2 font-semibold text-gray-800">
          <i class="ti ti-user text-green-600"></i>
          <span>User Details</span>
        </div>

        <button
          class="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600"
          @click="$emit('close')"
        >
          <i class="ti ti-x text-sm"></i>
        </button>

      </div>

      <!-- BODY -->
      <div class="flex-1 overflow-y-auto p-5 space-y-6">

        <!-- USER TOP -->
        <div class="flex items-center gap-4">

          <img
            v-if="user.image"
            :src="user.image"
            class="w-14 h-14 rounded-full object-cover border"
          />

          <div
            v-else
            class="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border"
          >
            {{ initials }}
          </div>

          <div>
            <h3 class="text-base font-semibold text-gray-900">
              {{ user.first_name || user.firstName }}
              {{ user.last_name || user.lastName }}
            </h3>

            <p class="text-sm text-gray-500">
              {{ user.email }}
            </p>
          </div>

        </div>

        <div class="border-t"></div>

        <!-- USER INFORMATION -->
        <div class="space-y-4">

          <h4 class="text-xs font-bold uppercase tracking-wider text-green-700">
            User Information
          </h4>

          <!-- SINGLE COMPACT CONTAINER -->
          <div class="bg-gray-50 border border-gray-100 rounded-xl p-4">

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">

              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">
                  Username
                </p>

                <p class="text-sm font-medium text-gray-900">
                  {{ userData.username }}
                </p>
              </div>

              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">
                  First Name
                </p>

                <p class="text-sm font-medium text-gray-900">
                  {{ userData.firstName }}
                </p>
              </div>

              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">
                  Last Name
                </p>

                <p class="text-sm font-medium text-gray-900">
                  {{ userData.lastName }}
                </p>
              </div>

              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">
                  Email
                </p>

                <p class="text-sm font-medium text-gray-900 break-all">
                  {{ userData.email }}
                </p>
              </div>

              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">
                  Phone
                </p>

                <p class="text-sm font-medium text-gray-900">
                  {{ userData.phone }}
                </p>
              </div>

              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">
                  Gender
                </p>

                <p class="text-sm font-medium text-gray-900">
                  {{ userData.gender }}
                </p>
              </div>

              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">
                  DOB
                </p>

                <p class="text-sm font-medium text-gray-900">
                  {{ userData.dob }}
                </p>
              </div>

              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">
                  Country
                </p>

                <p class="text-sm font-medium text-gray-900">
                  {{ userData.country }}
                </p>
              </div>

              <div>
                <p class="text-[11px] uppercase tracking-wide text-gray-500">
                  City
                </p>

                <p class="text-sm font-medium text-gray-900">
                  {{ userData.city }}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      <!-- FOOTER -->
      <div class="px-5 py-3 border-t bg-gray-50 flex justify-end">

        <button
          class="px-4 py-2 text-sm rounded-md bg-red-100 text-red-600 hover:bg-red-200 flex items-center gap-2"
          @click="$emit('close')"
        >
          <i class="ti ti-x"></i>
          Close
        </button>

      </div>

    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  user: { type: Object, required: true },
});

defineEmits(["close"]);

/* SAFE NORMALIZER */
const userData = computed(() => {

  const u = props.user || {};

  return {
    username: u.username ?? "—",
    firstName: u.first_name ?? u.firstName ?? "—",
    lastName: u.last_name ?? u.lastName ?? "—",
    email: u.email ?? "—",
    phone: u.phone ?? "—",
    country: u.country ?? "—",
    city: u.city ?? "—",
    dob: u.dob ?? "—",
    gender: u.gender ?? "—",
  };
});

const initials = computed(() => {

  const f = userData.value.firstName?.[0] || "";
  const l = userData.value.lastName?.[0] || "";

  return (f + l).toUpperCase();
});
</script>