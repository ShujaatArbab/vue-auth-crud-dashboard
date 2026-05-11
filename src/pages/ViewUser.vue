<template>
  <div class="page-wrap">

    <!-- Loading State -->
    <div v-if="loading" class="loading-wrap">
      <div class="loader"></div>
      <p>Loading user details...</p>
    </div>

    <!-- Main Content -->
    <template v-else>

      <!-- Header Card -->
      <div class="hero-card">

        <div class="hero-left">
          <div class="avatar">
            {{ initials }}
          </div>

          <div class="hero-info">
            <h1>{{ user.name }}</h1>

            <p>@{{ user.username }}</p>

            <div class="company-chip">
              {{ user.company?.name }}
            </div>
          </div>
        </div>

        <button class="back-btn" @click="$router.push('/users')">
          Back
        </button>

      </div>

      <!-- Stats -->
      <div class="stats-grid">

        <div class="stat-card">
          <span class="stat-label">Email</span>
          <span class="stat-value">{{ user.email }}</span>
        </div>

        <div class="stat-card">
          <span class="stat-label">Phone</span>
          <span class="stat-value">{{ user.phone }}</span>
        </div>

        <div class="stat-card">
          <span class="stat-label">Website</span>
          <span class="stat-value">{{ user.website }}</span>
        </div>

      </div>

      <!-- Main Grid -->
      <div class="content-grid">

        <!-- Contact -->
        <div class="card">

          <div class="card-head">
            Contact Information
          </div>

          <div class="card-body">

            <div class="field">
              <label>Email</label>
              <a :href="'mailto:' + user.email">
                {{ user.email }}
              </a>
            </div>

            <div class="field">
              <label>Phone</label>
              <span>{{ user.phone }}</span>
            </div>

            <div class="field">
              <label>Website</label>
              <a :href="'https://' + user.website" target="_blank">
                {{ user.website }}
              </a>
            </div>

          </div>
        </div>

        <!-- Address -->
        <div class="card">

          <div class="card-head">
            Address Details
          </div>

          <div class="card-body">

            <div class="field">
              <label>Street</label>
              <span>{{ user.address?.street }}</span>
            </div>

            <div class="field">
              <label>Suite</label>
              <span>{{ user.address?.suite }}</span>
            </div>

            <div class="field">
              <label>City</label>
              <span>{{ user.address?.city }}</span>
            </div>

            <div class="field">
              <label>Zipcode</label>
              <span>{{ user.address?.zipcode }}</span>
            </div>

          </div>
        </div>

        <!-- Company -->
        <div class="card">

          <div class="card-head">
            Company Information
          </div>

          <div class="card-body">

            <div class="field">
              <label>Company</label>
              <span>{{ user.company?.name }}</span>
            </div>

            <div class="field">
              <label>Catch Phrase</label>
              <span>{{ user.company?.catchPhrase }}</span>
            </div>

            <div class="field">
              <label>Business</label>
              <span>{{ user.company?.bs }}</span>
            </div>

          </div>
        </div>

        <!-- Location -->
        <div class="card">

          <div class="card-head">
            Geo Location
          </div>

          <div class="card-body">

            <div class="field">
              <label>Latitude</label>
              <span>{{ user.address?.geo?.lat }}</span>
            </div>

            <div class="field">
              <label>Longitude</label>
              <span>{{ user.address?.geo?.lng }}</span>
            </div>

            <div class="location-box">
              🌍 {{ user.address?.city }},
              {{ user.address?.zipcode }}
            </div>

          </div>
        </div>

      </div>

    </template>

  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {},
      loading: true,
    };
  },

  computed: {
    initials() {
      if (!this.user.name) return "";

      return this.user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
    },
  },

  async mounted() {
    const id = this.$route.params.id;

    try {
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );

      this.user = res.data;
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page-wrap {
  min-height: 100vh;
  padding: 24px;
  background: #f5f7fb;
  font-family: Inter, sans-serif;
}

/* Loading */

.loading-wrap {
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 14px;
  color: #6b7280;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #dbeafe;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Hero Card */

.hero-card {
  background: white;
  border-radius: 18px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf0f5;
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.avatar {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
}

.hero-info h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #111827;
}

.hero-info p {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
}

.company-chip {
  margin-top: 10px;
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 30px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 600;
}

/* Back Button */

.back-btn {
  border: none;
  background: #ef4444;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.back-btn:hover {
  background: #f87171;
}

/* Stats */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 22px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid #edf0f5;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04);
}

.stat-label {
  display: block;
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 8px;
}

.stat-value {
  color: #111827;
  font-size: 15px;
  font-weight: 600;
  word-break: break-word;
}

/* Main Grid */

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* Cards */

.card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #edf0f5;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.04);
}

.card-head {
  padding: 18px 20px;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
  background: #fafafa;
}

.card-body {
  padding: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.field:last-child {
  margin-bottom: 0;
}

.field label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.field span,
.field a {
  font-size: 15px;
  color: #111827;
  text-decoration: none;
  line-height: 1.5;
}

.field a {
  color: #2563eb;
}

.field a:hover {
  text-decoration: underline;
}

/* Location */

.location-box {
  margin-top: 10px;
  padding: 12px;
  border-radius: 12px;
  background: #f3f4f6;
  font-size: 14px;
  color: #374151;
}

/* Responsive */

@media (max-width: 900px) {

  .content-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .hero-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }
}

@media (max-width: 600px) {

  .page-wrap {
    padding: 14px;
  }

  .hero-left {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-info h1 {
    font-size: 22px;
  }

  .avatar {
    width: 70px;
    height: 70px;
    font-size: 24px;
  }
}
</style>