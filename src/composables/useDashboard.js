import { ref } from "vue";
import axios from "axios";

export function useDashboard() {

  const user        = ref(null);
  const loading     = ref(false);

  // TOTALS
  const totalUsers  = ref(0);

  // GENDER — real field in DummyJSON
  const maleUsers   = ref(0);
  const femaleUsers = ref(0);

  // ROLE — real field in DummyJSON (admin, moderator, user)
  const adminUsers     = ref(0);
  const moderatorUsers = ref(0);
  const regularUsers   = ref(0);

  // BLOOD GROUP — real field in DummyJSON
  const bloodGroups = ref({});

  // HAIR COLOR — real field in DummyJSON
  const hairColors  = ref({});

  // AGE GROUPS — calculated from real age field
  const youngUsers  = ref(0); // ≤ 25
  const midUsers    = ref(0); // 26–45
  const seniorUsers = ref(0); // 46+

  const fetchDashboard = async () => {
    loading.value = true;
    try {
      const res   = await axios.get("https://dummyjson.com/users?limit=208");
      const users = res.data.users || [];

      totalUsers.value  = users.length;

      // GENDER
      maleUsers.value   = users.filter(u => u.gender === "male").length;
      femaleUsers.value = users.filter(u => u.gender === "female").length;

      // ROLE
      adminUsers.value     = users.filter(u => u.role === "admin").length;
      moderatorUsers.value = users.filter(u => u.role === "moderator").length;
      regularUsers.value   = users.filter(u => u.role === "user").length;

      // AGE GROUPS
      youngUsers.value  = users.filter(u => u.age <= 25).length;
      midUsers.value    = users.filter(u => u.age > 25 && u.age <= 45).length;
      seniorUsers.value = users.filter(u => u.age > 45).length;

      // BLOOD GROUPS — count each type
      const bg = {};
      users.forEach(u => {
        if (u.bloodGroup) bg[u.bloodGroup] = (bg[u.bloodGroup] || 0) + 1;
      });
      bloodGroups.value = bg;

      // HAIR COLORS — count each color
      const hc = {};
      users.forEach(u => {
        if (u.hair?.color) hc[u.hair.color] = (hc[u.hair.color] || 0) + 1;
      });
      hairColors.value = hc;

      // LOGGED IN USER
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          const me = await axios.get("https://dummyjson.com/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          user.value = me.data;
        } else {
          const stored = sessionStorage.getItem("user");
          if (stored) user.value = JSON.parse(stored);
        }
      } catch {
        const stored = sessionStorage.getItem("user");
        if (stored) user.value = JSON.parse(stored);
      }

    } catch (err) {
      console.log("Dashboard error:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    user, loading,
    totalUsers,
    maleUsers, femaleUsers,
    adminUsers, moderatorUsers, regularUsers,
    youngUsers, midUsers, seniorUsers,
    bloodGroups, hairColors,
    fetchDashboard,
  };
}