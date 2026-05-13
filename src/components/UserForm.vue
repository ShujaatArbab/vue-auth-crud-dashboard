<template>
  <div class="form-card">

    <!-- Header -->
    <div class="card-head">
      <div class="head-left">
        <i class="ti ti-user-plus"></i>
        <span>{{ buttonText === 'Add User' ? 'Add new user' : 'Edit user' }}</span>
      </div>
      <button class="close-btn" @click="$emit('cancel')" aria-label="Close">
        <i class="ti ti-x"></i>
      </button>
    </div>

    <!-- Body -->
    <div class="card-body">
      <div class="success-banner" v-if="submitted">
        <i class="ti ti-circle-check"></i> User saved successfully!
      </div>

      <div class="form-grid">

        <!-- Name -->
        <div class="field">
          <label>Full name <span class="req">*</span></label>
          <input type="text" v-model="localUser.name" :class="fieldClass('name')"
            @input="liveCheck('name')" placeholder="John Doe" />
          <small class="err-msg">{{ errors.name }}</small>
        </div>

        <!-- Username -->
        <div class="field">
          <label>Username</label>
          <input type="text" v-model="localUser.username" placeholder="johndoe" />
          <small class="err-msg"></small>
        </div>

        <!-- Email -->
        <div class="field">
          <label>Email <span class="req">*</span></label>
          <input type="email" v-model="localUser.email" :class="fieldClass('email')"
            @input="liveCheck('email')" placeholder="john@example.com" />
          <small class="err-msg">{{ errors.email }}</small>
        </div>

        <!-- Phone -->
        <div class="field">
          <label>Phone</label>
          <input type="text" v-model="localUser.phone" placeholder="+1 555 000 0000" />
          <small class="err-msg"></small>
        </div>

        <!-- Website -->
        <div class="field">
          <label>Website</label>
          <input type="text" v-model="localUser.website" placeholder="example.com" />
          <small class="err-msg"></small>
        </div>

        <!-- Company -->
        <div class="field">
          <label>Company</label>
          <input type="text" v-model="localUser.company" placeholder="Acme Inc." />
          <small class="err-msg"></small>
        </div>

        <hr class="divider" />

        <!-- Gender -->
        <div class="field">
          <label>Gender <span class="req">*</span></label>
          <div class="pill-row">
            <label v-for="g in ['Male','Female','Other']" :key="g"
              class="pill-radio" :class="{ sel: localUser.gender === g }"
              @click="localUser.gender = g; errors.gender = ''">
              <i v-if="g==='Male'" class="ti ti-gender-male"></i>
              <i v-if="g==='Female'" class="ti ti-gender-female"></i>
              {{ g }}
            </label>
          </div>
          <small class="err-msg">{{ errors.gender }}</small>
        </div>

        <!-- Blood Group -->
        <div class="field">
          <label>Blood group</label>
          <select v-model="localUser.bloodGroup" class="select-auto">
            <option value="">Select</option>
            <option v-for="bg in ['A+','A-','B+','B-','O+','O-','AB+','AB-']" :key="bg">{{ bg }}</option>
          </select>
          <small class="err-msg"></small>
        </div>

        <!-- Role -->
        <div class="field">
          <label>Role <span class="req">*</span></label>
          <select v-model="localUser.role" :class="fieldClass('role')"
            @change="liveCheck('role')" class="select-auto">
            <option value="">Select role</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>User</option>
          </select>
          <small class="err-msg">{{ errors.role }}</small>
        </div>

        <!-- Department -->
        <div class="field">
          <label>Department</label>
          <select v-model="localUser.department" class="select-auto">
            <option value="">Select</option>
            <option>Engineering</option>
            <option>Design</option>
            <option>Marketing</option>
            <option>Sales</option>
            <option>HR</option>
          </select>
          <small class="err-msg"></small>
        </div>

        <!-- Skills -->
        <div class="field full">
          <label>Skills <span class="req">*</span></label>
          <div class="pill-row">
            <label v-for="skill in allSkills" :key="skill"
              class="pill-check" :class="{ sel: localUser.skills.includes(skill) }"
              @click="toggleSkill(skill)">
              {{ skill }}
            </label>
          </div>
          <small class="err-msg">{{ errors.skills }}</small>
        </div>

        <hr class="divider" />

        <!-- Password -->
        <div class="field">
          <label>Password <span class="req">*</span></label>
          <div class="pw-wrap">
            <input :type="showPw ? 'text' : 'password'" v-model="localUser.password"
              :class="fieldClass('password')" @input="liveCheck('password')"
              placeholder="Min 8 chars" />
            <button type="button" class="pw-eye" @click="showPw = !showPw" aria-label="Toggle">
              <i :class="showPw ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
            </button>
          </div>
          <div class="strength-bar">
            <div class="strength-fill" :style="strengthStyle"></div>
          </div>
          <span class="strength-label" :style="{ color: strengthColor }">{{ strengthText }}</span>
          <small class="err-msg">{{ errors.password }}</small>
        </div>

        <!-- Confirm Password -->
        <div class="field">
          <label>Confirm password <span class="req">*</span></label>
          <div class="pw-wrap">
            <input :type="showCp ? 'text' : 'password'" v-model="localUser.confirmPassword"
              :class="fieldClass('confirmPassword')" @input="liveCheck('confirm')"
              placeholder="Repeat password" />
            <button type="button" class="pw-eye" @click="showCp = !showCp" aria-label="Toggle">
              <i :class="showCp ? 'ti ti-eye-off' : 'ti ti-eye'"></i>
            </button>
          </div>
          <small class="err-msg">{{ errors.confirmPassword }}</small>
        </div>

      </div>
    </div>

    <!-- Footer -->
    <div class="card-foot">
      <button type="button" class="btn-cancel" @click="$emit('cancel')">
        <i class="ti ti-x"></i> Cancel
      </button>
      <button
  type="button"
  class="btn-submit"
  @click="handleSubmit"
  :disabled="!isFormValid"
  :class="{ 'btn-disabled': !isFormValid }"
>
  <i class="ti ti-user-plus"></i>
  {{ buttonText }}
</button>
    </div>

  </div>
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
* { box-sizing: border-box; }
.form-card {
   height: 90vh;
  overflow: hidden; /* keep this - locks the card */
  display: flex;
  flex-direction: column;
}

.card-body {
  flex: 1;
  overflow-y: auto;  /* only this scrolls */
  padding: 20px;
  overscroll-behavior: contain;
}
/* HEADER FIXED */
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 14px 20px;
  border-bottom: 1px solid #f3f4f6;

  background: #fff;

  flex-shrink: 0;
  z-index: 10;
}
.head-left { display: flex; align-items: center; gap: 7px; }
.head-left i { font-size: 16px; color: #1a7a4a; }
.close-btn {
  width: 28px; height: 28px; border-radius: 6px;
  border: 1px solid #e5e7eb; background: transparent;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #6b7280; font-size: 14px; transition: all 0.12s;
}
.close-btn:hover { background: #fcebeb; color: #a32d2d; border-color: #f7c1c1; }
.card-body { padding: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
.field { display: flex; flex-direction: column; gap: 3px; }
.field.full { grid-column: 1 / -1; }
label { font-size: 12px; font-weight: 500; color: #6b7280; }
.req { color: #a32d2d; }
input[type=text], input[type=email], input[type=password], select {
  height: 34px; padding: 0 10px;
  border: 1px solid #e5e7eb; border-radius: 6px;
  font-size: 13px; outline: none; color: #111;
  background: #fff; width: 100%;
}
input:focus, select:focus { border-color: #185fa5; box-shadow: 0 0 0 2px #e6f1fb; }
.field-err { border-color: #a32d2d !important; box-shadow: 0 0 0 2px #fcebeb !important; }
.select-auto { width: auto; min-width: 120px; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 8px center; padding-right: 26px;
}
.err-msg { font-size: 11px; color: #a32d2d; min-height: 14px; }
.divider { grid-column: 1/-1; border: none; border-top: 1px solid #f3f4f6; margin: 4px 0; }
.pill-row { display: flex; flex-wrap: wrap; gap: 6px; }
.pill-radio, .pill-check {
  display: flex; align-items: center; gap: 4px;
  padding: 5px 10px; border: 1px solid #e5e7eb; border-radius: 20px;
  cursor: pointer; font-size: 12px; color: #6b7280;
  background: #fff; transition: all 0.12s; user-select: none;
}
.pill-radio:hover, .pill-check:hover { border-color: #9ca3af; }
.pill-radio.sel, .pill-check.sel { background: #e6f1fb; border-color: #185fa5; color: #0c447c; }
.pw-wrap { position: relative; }
.pw-wrap input { padding-right: 32px; }
.pw-eye {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #9ca3af;
  padding: 0; font-size: 15px; display: flex; align-items: center;
}
.strength-bar { height: 3px; border-radius: 2px; background: #e5e7eb; overflow: hidden; margin-top: 4px; }
.strength-fill { height: 100%; border-radius: 2px; transition: width 0.25s, background 0.25s; }
.strength-label { font-size: 11px; margin-top: 2px; }
.success-banner {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; margin-bottom: 12px;
  background: #eaf3de; border: 1px solid #3b6d11;
  border-radius: 6px; font-size: 13px; color: #27500a;
  grid-column: 1/-1;
}
/* FOOTER FIXED */
.card-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  padding: 14px 20px;
  border-top: 1px solid #f3f4f6;

  background: #f9fafb;

  flex-shrink: 0;
}
.ti-x {
  font-size: 16px;
  display: inline-block;
}
.btn-cancel {
  padding: 7px 14px;
  border-radius: 6px;
  border: 1px solid #f5c2c2;
  background: #ffe5e5;
  color: #c62828;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}
.btn-cancel:hover {  background: #ffd0d0;
  border-color: #f19999; }
.btn-submit {
  padding: 7px 18px; border-radius: 6px;
  border: none; background: #1a7a4a; color: #fff;
  cursor: pointer; font-size: 13px; font-weight: 500;
  display: flex; align-items: center; gap: 5px;
}
.btn-submit:hover { background: #15693e; }
.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>