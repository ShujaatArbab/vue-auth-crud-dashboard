<template>
  <div class="page-wrap">

    <div class="card" v-if="user">

      <div class="hero">
        <div class="av">
          <img v-if="user.image" :src="user.image" :alt="user.firstName" />
          <span v-else>{{ initials }}</span>
        </div>

        <div class="ht">
          <div class="hn">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="hs">{{ subtitle }}</div>
        </div>

        <div class="hr">
          <span class="rp">{{ role }}</span>
          <span class="od"><span class="dot"></span>Active</span>
        </div>
      </div>

      <div class="body">

        <div class="stats">
          <div class="sb"><div class="sv">{{ user.age }}<span class="su">yr</span></div><div class="sl">Age</div></div>
          <div class="sb"><div class="sv">{{ Math.round(user.height) }}<span class="su">cm</span></div><div class="sl">Height</div></div>
          <div class="sb"><div class="sv">{{ Math.round(user.weight) }}<span class="su">kg</span></div><div class="sl">Weight</div></div>
          <div class="sb"><div class="sv sm">{{ user.bloodGroup }}</div><div class="sl">Blood</div></div>
        </div>

        <div class="grid">
          <div class="gi">
            <div class="gl"><i class="ti ti-mail" />Email</div>
            <div class="gv"><a :href="'mailto:' + user.email">{{ user.email }}</a></div>
          </div>

          <div class="gi">
            <div class="gl"><i class="ti ti-phone" />Phone</div>
            <div class="gv">{{ user.phone }}</div>
          </div>

          <div class="gi">
            <div class="gl"><i class="ti ti-id-badge" />Username</div>
            <div class="gv">@{{ user.username }}</div>
          </div>

          <div class="gi">
            <div class="gl"><i class="ti ti-gender-bigender" />Gender</div>
            <div class="gv">{{ user.gender }}</div>
          </div>

          <div class="gi">
            <div class="gl"><i class="ti ti-calendar" />Born</div>
            <div class="gv">{{ user.birthDate }}</div>
          </div>

          <div class="gi">
            <div class="gl"><i class="ti ti-eye" />Eyes</div>
            <div class="gv eye-v">
              <span class="ed" :style="{ background: user.eyeColor }"></span>
              {{ user.eyeColor }}
            </div>
          </div>

          <div class="gi">
            <div class="gl"><i class="ti ti-sparkles" />Hair</div>
            <div class="gv">{{ hair }}</div>
          </div>

          <div class="gi">
            <div class="gl"><i class="ti ti-map-pin" />City</div>
            <div class="gv">{{ user.address?.city }}, {{ user.address?.state }}</div>
          </div>

          <div class="gi">
            <div class="gl"><i class="ti ti-globe" />Country</div>
            <div class="gv">{{ user.address?.country }}</div>
          </div>

          <div class="gi">
            <div class="gl"><i class="ti ti-building" />Company</div>
            <div class="gv">{{ user.company?.name }}</div>
          </div>

          <div class="gi">
            <div class="gl"><i class="ti ti-briefcase" />Department</div>
            <div class="gv">{{ user.company?.department }}</div>
          </div>

          <div class="gi">
            <div class="gl"><i class="ti ti-home" />Address</div>
            <div class="gv">{{ user.address?.address }}</div>
          </div>
        </div>

       <div class="foot">

  <div class="mini-card">
    <div class="lbl">Status</div>
    <div class="val status">
      <span class="dot"></span> Active
    </div>
  </div>

  <div class="mini-card">
    <div class="lbl">Account</div>
    <div class="val">{{ role }}</div>
  </div>

  <div class="mini-card">
    <div class="lbl">Last Login</div>
    <div class="val">Today</div>
  </div>

</div>

      </div>
    </div>

    <div v-else class="loading">
      <div class="spin"></div>
      <p>{{ error || 'Loading…' }}</p>
    </div>
  
  </div>
</template>

<script setup>
import { useUserProfile } from "../composables/useUserProfile";

const {
  user,
  error,
  initials,
  role,
  subtitle,
  hair
} = useUserProfile();
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 🔥 NEW: full dashboard layout fix */
.page-wrap {
  width: 100%;
  min-height: 100vh;
  padding: 12px 12px 12px 12px;
  background: #f8fafc;
}

/* MAIN CARD (now full width feel) */
.card {
  font-family: 'Inter', sans-serif;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;

  width: 100%;
}

/* Hero */
.hero {
  background: #0f172a;
  padding: 20px 24px 0;
  display: flex;
  align-items: flex-end;
  gap: 16px;
}

.av {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.12);
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  color: #94a3b8;
  overflow: hidden;
  flex-shrink: 0;
  margin-bottom: -18px;
}

.av img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ht {
  padding-bottom: 22px;
  flex: 1;
}

.hn {
  font-size: 17px;
  font-weight: 600;
  color: #f1f5f9;
}

.hs {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  
}

.hr {
  padding-bottom: 22px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.rp {
  background: rgba(99, 102, 241, 0.18);
  color: #a5b4fc;
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 20px;
}

.od {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #475569;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}

/* Body */
.body {
  padding: 14px 20px 12px;
  
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.sb {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 8px;
  text-align: center;
}

.sv {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

.su {
  font-size: 9px;
  color: #94a3b8;
}

.sl {
  font-size: 10px;
  color: #94a3b8;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.gi {
  padding: 9px 13px;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.gi:nth-child(3n) {
  border-right: none;
}

.gl {
  font-size: 9px;
  color: #94a3b8;
  text-transform: uppercase;
}

.gv {
  font-size: 12px;
  color: #1e293b;
}

/* Footer */
.foot {
  margin-top: 11px;
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 6px 13px;
  border-radius: 7px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
}
.foot {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.mini-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
}

.lbl {
  font-size: 9px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: .08em;
}

.val {
  font-size: 12px;
  font-weight: 500;
  color: #0f172a;
  margin-top: 2px;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}

</style>