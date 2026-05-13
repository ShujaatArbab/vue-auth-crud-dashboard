import { ref, onMounted } from "vue";
import axios from "axios";

export function useEditUser(route, router) {

  const user        = ref(null);
  const loading     = ref(true);
  const showSuccess = ref(false);

  // FETCH USER
  const fetchUser = async () => {
    try {
      const id = route.params.id;

      // ✅ CHANGED: DummyJSON instead of JSONPlaceholder
      const res = await axios.get(`https://dummyjson.com/users/${id}`);
      const d   = res.data;

      user.value = {
        id:              d.id,
        // ✅ DummyJSON uses firstName + lastName
        firstName:       d.firstName       || "",
        lastName:        d.lastName        || "",
        username:        d.username        || "",
        email:           d.email           || "",
        phone:           d.phone           || "",
        age:             d.age             || "",
        gender:          d.gender          || "Male",
        bloodGroup:      d.bloodGroup      || "",
        role:            d.role            || "User",
        department:      d.company?.department || "",
        eyeColor:        d.eyeColor        || "",
        hairColor:       d.hair?.color     || "",
        hairType:        d.hair?.type      || "",
        height:          d.height          || "",
        weight:          d.weight          || "",
        birthDate:       d.birthDate       || "",
        image:           d.image           || "",
        // address
        street:          d.address?.address    || "",
        city:            d.address?.city       || "",
        state:           d.address?.state      || "",
        postalCode:      d.address?.postalCode || "",
        // company
        company:         d.company?.name       || "",
        jobTitle:        d.company?.title      || "",
        // extras
        password:        "",
        confirmPassword: "",
        skills:          ["Vue"],
      };

    } catch (e) {
      console.error("Failed to load user:", e);
    } finally {
      loading.value = false;
    }
  };

  // UPDATE USER
  const updateUser = async (updatedData) => {
    try {
      // ✅ CHANGED: DummyJSON update endpoint
      await axios.put(
        `https://dummyjson.com/users/${updatedData.id}`,
        updatedData
      );

      showSuccess.value = true;

      setTimeout(() => {
        showSuccess.value = false;
        router.push({
          path: "/users",
          query: { updated: JSON.stringify(updatedData) }
        });
      }, 1200);

    } catch (e) {
      console.error("Update failed:", e);
    }
  };

  onMounted(fetchUser);

  return { user, loading, showSuccess, updateUser };
}