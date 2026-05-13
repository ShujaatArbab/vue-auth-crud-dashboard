<template>
  <div class="dash">

    <!-- HEADER -->
    <div class="dash-head">
      <div>
        <h2>Dashboard</h2>
        <p>Analytics Overview</p>
      </div>
      <div v-if="user" class="logged-chip">
        👤 {{ user.firstName }} {{ user.lastName }} &nbsp;·&nbsp; {{ user.role }}
      </div>
    </div>

    <!-- ROW 1: OVERVIEW -->
    <div class="row-label">Overview</div>
    <div class="grid g4">
      <div class="card">
        <span>Total Users</span>
        <strong class="blue">{{ totalUsers }}</strong>
      </div>
      <div class="card">
        <span>Male Users</span>
        <strong class="indigo">{{ maleUsers }}</strong>
      </div>
      <div class="card">
        <span>Female Users</span>
        <strong class="pink">{{ femaleUsers }}</strong>
      </div>
      <div class="card">
        <span>Young (Age 25 below)</span>
        <strong class="green">{{ youngUsers }}</strong>
      </div>
    </div>

    <!-- ROW 2: ROLES + AGE -->
    <div class="row-label">Roles & Age Groups</div>
    <div class="grid g5">
      <div class="card">
        <span>Admins</span>
        <strong class="red">{{ adminUsers }}</strong>
      </div>
      <div class="card">
        <span>Moderators</span>
        <strong class="orange">{{ moderatorUsers }}</strong>
      </div>
      <div class="card">
        <span>Regular Users</span>
        <strong class="blue">{{ regularUsers }}</strong>
      </div>
      <div class="card">
        <span>Middle Age (26–45)</span>
        <strong class="yellow">{{ midUsers }}</strong>
      </div>
      <div class="card">
        <span>Senior (46 above)</span>
        <strong class="red">{{ seniorUsers }}</strong>
      </div>
    </div>

  </div>
</template>

<script>
import { onMounted } from "vue";
import gsap from "gsap";
import { useDashboard } from "../composables/useDashboard";

export default {
  setup() {
    const {
      user,
      totalUsers,
      maleUsers,
      femaleUsers,
      adminUsers,
      moderatorUsers,
      regularUsers,
      youngUsers,
      midUsers,
      seniorUsers,
      hairColors,
      fetchDashboard,
    } = useDashboard();

    fetchDashboard();

    onMounted(() => {
      gsap.from(".card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out"
      });
    });

    return {
      user,
      totalUsers,
      maleUsers,
      femaleUsers,
      adminUsers,
      moderatorUsers,
      regularUsers,
      youngUsers,
      midUsers,
      seniorUsers,
      hairColors,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }

.dash {
  padding: 20px 28px;
  font-family: 'DM Sans', sans-serif;
  background: #f4f4f5;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

/* HEADER */
.dash-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 14px 20px;
  flex-shrink: 0;
}
.dash-head h2 { font-size: 20px; font-weight: 700; color: #18181b; }
.dash-head p  { font-size: 13px; color: #a1a1aa; margin-top: 2px; }

.logged-chip {
  font-size: 12px; font-weight: 600;
  background: #f4f4f5; border: 1px solid #e4e4e7;
  padding: 6px 14px; border-radius: 20px; color: #3f3f46;
}

/* SECTION LABEL */
.row-label {
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.8px;
  color: #a1a1aa; padding-left: 2px;
  flex-shrink: 0;
}

/* GRIDS */
.grid { display: grid; gap: 14px; flex-shrink: 0; }
.g4 { grid-template-columns: repeat(4, 1fr); }
.g5 { grid-template-columns: repeat(5, 1fr); }

/* STAT CARD */
.card {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.card span   { font-size: 13px; color: #71717a; font-weight: 500; }
.card strong { font-size: 32px; font-weight: 700; line-height: 1.1; }

/* COLORS */
.blue   { color: #2563eb; }
.indigo { color: #4f46e5; }
.pink   { color: #db2777; }
.green  { color: #16a34a; }
.red    { color: #dc2626; }
.orange { color: #ea580c; }
.yellow { color: #ca8a04; }

/* HAIR BLOCK */
.card-block {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  padding: 16px 20px;
  flex: 1;
}

.tag-grid {
  display: flex; flex-wrap: wrap; gap: 10px;
}

.tag {
  display: flex; align-items: center; gap: 8px;
  background: #f4f4f5; border: 1px solid #e4e4e7;
  border-radius: 20px; padding: 6px 14px;
}

.tag-label { font-size: 13px; font-weight: 600; color: #3f3f46; }
.tag-count {
  font-size: 12px; font-weight: 700; color: #fff;
  background: #27272a; border-radius: 20px;
  padding: 2px 8px;
}
</style>