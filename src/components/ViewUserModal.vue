<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal modal-content">

      <!-- Header -->
      <div class="card-head">
        <div class="head-left">
          <i class="ti ti-user"></i>
          <span>User Details</span>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <i class="ti ti-x"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="card-body">

        <!-- Avatar + Name -->
        <div class="user-hero">
          <img v-if="user.image" :src="user.image" class="avatar-img" />
          <div v-else class="avatar-circle">{{ initials }}</div>
          <div>
            <h3>{{ user.firstName }} {{ user.lastName }}</h3>
            <p>{{ user.email }}</p>
          </div>
        </div>

        <hr class="divider" />

        <!-- SECTION: Personal Info -->
        <div class="section-title">Personal Information</div>
        <div class="form-grid">
          <div class="field"><label>First Name</label><div class="value-box">{{ user.firstName || '—' }}</div></div>
          <div class="field"><label>Last Name</label><div class="value-box">{{ user.lastName || '—' }}</div></div>
          <div class="field"><label>Maiden Name</label><div class="value-box">{{ user.maidenName || '—' }}</div></div>
          <div class="field"><label>Age</label><div class="value-box">{{ user.age || '—' }}</div></div>
          <div class="field"><label>Gender</label><div class="value-box">{{ user.gender || '—' }}</div></div>
          <div class="field"><label>Birth Date</label><div class="value-box">{{ user.birthDate || '—' }}</div></div>
          <div class="field"><label>Blood Group</label><div class="value-box">{{ user.bloodGroup || '—' }}</div></div>
          <div class="field"><label>Height (cm)</label><div class="value-box">{{ user.height || '—' }}</div></div>
          <div class="field"><label>Weight (kg)</label><div class="value-box">{{ user.weight || '—' }}</div></div>
          <div class="field"><label>Eye Color</label><div class="value-box">{{ user.eyeColor || '—' }}</div></div>
          <div class="field"><label>Hair Color</label><div class="value-box">{{ user.hair?.color || '—' }}</div></div>
          <div class="field"><label>Hair Type</label><div class="value-box">{{ user.hair?.type || '—' }}</div></div>
        </div>

        <hr class="divider" />

        <!-- SECTION: Contact -->
        <div class="section-title">Contact</div>
        <div class="form-grid">
          <div class="field"><label>Email</label><div class="value-box">{{ user.email || '—' }}</div></div>
          <div class="field"><label>Phone</label><div class="value-box">{{ user.phone || '—' }}</div></div>
          <div class="field"><label>Username</label><div class="value-box">{{ user.username || '—' }}</div></div>
          <div class="field"><label>Role</label><div class="value-box">{{ user.role || '—' }}</div></div>
        </div>

        <hr class="divider" />

        <!-- SECTION: Address -->
        <div class="section-title">Address</div>
        <div class="form-grid">
          <div class="field"><label>Street</label><div class="value-box">{{ user.address?.address || '—' }}</div></div>
          <div class="field"><label>City</label><div class="value-box">{{ user.address?.city || '—' }}</div></div>
          <div class="field"><label>State</label><div class="value-box">{{ user.address?.state || '—' }}</div></div>
          <div class="field"><label>Postal Code</label><div class="value-box">{{ user.address?.postalCode || '—' }}</div></div>
          <div class="field"><label>Latitude</label><div class="value-box">{{ user.address?.coordinates?.lat || '—' }}</div></div>
          <div class="field"><label>Longitude</label><div class="value-box">{{ user.address?.coordinates?.lng || '—' }}</div></div>
        </div>

        <hr class="divider" />

        <!-- SECTION: Company -->
        <div class="section-title">Company</div>
        <div class="form-grid">
          <div class="field"><label>Company Name</label><div class="value-box">{{ user.company?.name || '—' }}</div></div>
          <div class="field"><label>Department</label><div class="value-box">{{ user.company?.department || '—' }}</div></div>
          <div class="field"><label>Job Title</label><div class="value-box">{{ user.company?.title || '—' }}</div></div>
          <div class="field "><label>Catchphrase</label><div class="value-box">{{ user.company?.address?.city || '—' }}, {{ user.company?.address?.state || '—' }}</div></div>
        </div>

        <hr class="divider" />

        <!-- SECTION: Bank -->
        <div class="section-title">Bank & Crypto</div>
        <div class="form-grid">
          <div class="field"><label>Card Type</label><div class="value-box">{{ user.bank?.cardType || '—' }}</div></div>
          <div class="field"><label>Card Number</label><div class="value-box">{{ user.bank?.cardNumber || '—' }}</div></div>
          <div class="field"><label>Card Expire</label><div class="value-box">{{ user.bank?.cardExpire || '—' }}</div></div>
          <div class="field"><label>Currency</label><div class="value-box">{{ user.bank?.currency || '—' }}</div></div>
          <div class="field "><label>IBAN</label><div class="value-box">{{ user.bank?.iban || '—' }}</div></div>
          <div class="field"><label>Crypto Coin</label><div class="value-box">{{ user.crypto?.coin || '—' }}</div></div>
          <div class="field"><label>Crypto Network</label><div class="value-box">{{ user.crypto?.network || '—' }}</div></div>
        </div>

      </div>

      <!-- Footer -->
      <div class="card-foot">
        <button class="btn-close" @click="$emit('close')">
          <i class="ti ti-x"></i> Close
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

const initials = computed(() => {
  const f = props.user?.firstName?.[0] ?? "";
  const l = props.user?.lastName?.[0]  ?? "";
  return (f + l).toUpperCase();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }

.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 999; padding: 16px;
}

.modal {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  width: 100%; max-width: 660px;
  height: 90vh;
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.card-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 20px; border-bottom: 1px solid #f3f4f6;
  background: #fff; flex-shrink: 0;
}
.head-left { display: flex; align-items: center; gap: 7px; }
.head-left i { font-size: 16px; color: #1a7a4a; }
.head-left span { font-size: 15px; font-weight: 600; color: #111; }

.close-btn {
  width: 28px; height: 28px; border-radius: 6px;
  border: 1px solid #e5e7eb; background: transparent;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #6b7280; font-size: 14px;
}
.close-btn:hover { background: #fcebeb; color: #a32d2d; border-color: #f7c1c1; }

.card-body {
  flex: 1; overflow-y: auto;
  padding: 20px;
  overscroll-behavior: contain;
}

.user-hero {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 16px;
}

.avatar-img {
  width: 52px; height: 52px; border-radius: 50%;
  object-fit: cover; border: 2px solid #b5d4f4;
  flex-shrink: 0;
}

.avatar-circle {
  width: 52px; height: 52px; border-radius: 50%;
  background: #e6f1fb; color: #0c447c;
  font-size: 18px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; border: 2px solid #b5d4f4;
}

.user-hero h3 { font-size: 16px; font-weight: 700; color: #111; }
.user-hero p  { font-size: 12px; color: #6b7280; margin-top: 2px; }

.divider { border: none; border-top: 1px solid #f3f4f6; margin: 14px 0; }

.section-title {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.6px;
  color: #1a7a4a; margin-bottom: 10px;
}

.form-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px 16px; margin-bottom: 4px;
}

.field { display: flex; flex-direction: column; gap: 4px; }
.field.full { grid-column: 1 / -1; }

label {
  font-size: 11px; font-weight: 600;
  color: #6b7280; text-transform: uppercase; letter-spacing: 0.4px;
}

.value-box {
  height: 34px; padding: 0 10px;
  border: 1px solid #e5e7eb; border-radius: 6px;
  font-size: 13px; color: #111; background: #f9fafb;
  display: flex; align-items: center;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.card-foot {
  display: flex; justify-content: flex-end;
  gap: 8px; padding: 14px 20px;
  border-top: 1px solid #f3f4f6;
  background: #f9fafb; flex-shrink: 0;
}

.btn-close {
  padding: 7px 14px; border-radius: 6px;
  border: 1px solid #f5c2c2; background: #ffe5e5;
  color: #c62828; cursor: pointer; font-size: 13px;
  font-weight: 500; display: flex; align-items: center; gap: 5px;
  font-family: 'DM Sans', sans-serif;
}
.btn-close:hover { background: #ffd0d0; border-color: #f19999; }
</style>