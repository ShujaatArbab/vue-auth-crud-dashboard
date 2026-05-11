<template>
  <div class="users-wrap">

    <!-- Top Bar -->
    <div class="topbar">
      <div>
        <h2 class="page-title">Users</h2>
        <p class="page-sub">{{ filteredUsers.length }} total users</p>
      </div>

      <!-- SEARCH BOX -->
      <input
        v-model="search"
        type="text"
        placeholder="Search user by name..."
        class="search-box"
      />

      <button class="add-btn" @click="$router.push('/add-user')">
        <span class="plus-circle">+</span>
        Add User
      </button>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.id">
            <td class="td-id">{{ user.id }}</td>

            <td>
              <div class="name-cell">
                <div class="avatar" :style="avatarStyle(index)">
                  {{ initials(user.name) }}
                </div>
                <span class="name-text">{{ user.name }}</span>
              </div>
            </td>

            <td class="muted">{{ user.email }}</td>
            <td class="muted">{{ user.phone }}</td>

            <td>
              <div class="actions">
                <button class="btn btn-view" @click="viewUser(user.id)">
                  View
                </button>
                <button class="btn btn-edit" @click="editUser(user.id)">
                  Edit
                </button>
                <button class="btn btn-del" @click="confirmDelete(user)">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>

      </table>

      <!-- Pagination -->
      <div class="pagination">
        <div class="page-info">
          Showing {{ rangeStart }}–{{ rangeEnd }} of {{ filteredUsers.length }}
        </div>

        <div class="page-btns">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="goPage(currentPage - 1)"
          >
            ‹
          </button>

          <button
            v-for="p in totalPages"
            :key="p"
            class="page-btn"
            :class="{ active: p === currentPage }"
            @click="goPage(p)"
          >
            {{ p }}
          </button>

          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="goPage(currentPage + 1)"
          >
            ›
          </button>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";   // ✅ ADDED

const PER_PAGE = 5;

const BG_COLORS = ["#e6f1fb", "#eaf3de", "#faeeda", "#fcebeb"];
const TX_COLORS = ["#0c447c", "#27500a", "#633806", "#791f1f"];

export default {
  data() {
    return {
      users: [],
      currentPage: 1,
      search: "",
    };
  },

 async mounted() {
  try {
    const res = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );

    this.users = res.data; // ONLY API USERS
  if (this.$route.query.newUser) {
      const newUser = JSON.parse(this.$route.query.newUser);
      this.users.unshift(newUser); // show at top
    }
     if (this.$route.query.updated) {
      const updatedUser = JSON.parse(this.$route.query.updated);

      this.users = this.users.map(u =>
        u.id === updatedUser.id ? updatedUser : u
      );
    }
  } catch (error) {
    console.log(error);
  }
},

  watch: {
    search() {
      this.currentPage = 1;
    }
  },

  computed: {
    filteredUsers() {
      return this.users.filter(user =>
        user.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },

    totalPages() {
      return Math.ceil(this.filteredUsers.length / PER_PAGE) || 1;
    },

    paginatedUsers() {
      const start = (this.currentPage - 1) * PER_PAGE;
      const end = start + PER_PAGE;
      return this.filteredUsers.slice(start, end);
    },

    rangeStart() {
      if (this.filteredUsers.length === 0) return 0;
      return (this.currentPage - 1) * PER_PAGE + 1;
    },

    rangeEnd() {
      return Math.min(this.currentPage * PER_PAGE, this.filteredUsers.length);
    },
  },

  methods: {
    initials(name) {
      return name
        .split(" ")
        .slice(0, 2)
        .map(w => w[0])
        .join("")
        .toUpperCase();
    },

    avatarStyle(index) {
      const i = index % 4;
      return {
        background: BG_COLORS[i],
        color: TX_COLORS[i],
      };
    },

    goPage(p) {
      if (p < 1 || p > this.totalPages) return;
      this.currentPage = p;
    },

    viewUser(id) {
      this.$router.push(`/view-user/${id}`);
    },

    editUser(id) {
      this.$router.push(`/edit-user/${id}`);
    },

    // ✅ SWEETALERT DELETE (FIXED)
    confirmDelete(user) {
      Swal.fire({
        title: "Are you sure?",
        text: `You are deleting "${user.name}"`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.users = this.users.filter(u => u.id !== user.id);

          Swal.fire(
            "Deleted!",
            "User has been removed.",
            "success"
          );
        }
      });
    },
  },
};
</script>

<style scoped>
/* ❗ YOUR CSS UNCHANGED (AS REQUESTED) */
* { box-sizing: border-box; }

.users-wrap {
  padding: 2rem 1.5rem;
  font-family: sans-serif;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
}

.page-sub {
  font-size: 13px;
  color: #6b7280;
}

.search-box {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  width: 220px;
}

.add-btn {
  background: #1a7a4a;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 9px 16px;
  cursor: pointer;
}

.table-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background: #f9fafb;
  padding: 12px;
  font-size: 11px;
  text-transform: uppercase;
  color: #6b7280;
}

td {
  padding: 12px;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
}

.actions {
  display: flex;
  gap: 6px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  transition: all 0.12s;
}

/* View */
.btn-view {
  color: #ffff;
  border-color: #b5d4f4;
  background: #185fa5;
  
}
.btn-view:hover {
  background: #71aeebff;
}

/* Edit */
.btn-edit {
  color: #ffff;
  border-color: #d4a017;
  background:#d4a017;
}
.btn-edit:hover {
  background: rgba(241, 205, 105, 1);
}

/* Delete */
.btn-del {
  color: #ffff;
  border-color: #f7c1c1;
  background:#ff0000
}
.btn-del:hover {
  background: #e78383ff;
}

.pagination {
  display: flex;
  justify-content: space-between;
  padding: 12px;
}
.page-btn {
  border: 1px solid #e5e7eb;
  padding: 5px 10px;
}
.page-btn.active {
  background: #1a7a4a;
  color: white;
}
</style>