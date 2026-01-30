<template>
  <nav class="navbar">
    <div class="logo">🦆 Quackr</div>

    <div class="links">
      <router-link to="/" class="nav-link">Home</router-link>

      <router-link v-if="user.token" to="/post-blog" class="nav-link">
        Post Blog
      </router-link>

      <router-link v-if="user.token" to="/my-blog" class="nav-link">
        My Blogs
      </router-link>

      <router-link v-if="!user.token" to="/login" class="nav-link">Login</router-link>
      <router-link v-if="!user.token" to="/register" class="nav-link">Register</router-link>
      <router-link v-if="user.isAdmin" to="/admin" class="nav-link">Admin Dashboard</router-link>
    </div>

    <div class="user-info" v-if="user.token">
      <div class="user-avatar">{{ userInitial }}</div>
      <span class="user-email">Hello, {{ user.username || user.email }} 🦆</span>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useGlobalStore } from "../stores/globalStores";
import { useRouter } from "vue-router";

const store = useGlobalStore();
const { user, logout } = store;
const router = useRouter();

const userInitial = computed(() => {
  const name = user.username || user.email || "?";
  return name.charAt(0).toUpperCase();
});

// Logout and redirect
const handleLogout = () => {
  logout();
  router.push("/");
};
</script>


<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #324b4f;
  color: #324b4f;
  font-weight: 600;
  border-bottom: 2px solid #c99373;
  flex-wrap: wrap;
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: #83e4f2;
  text-shadow: 1px 1px #ffc9a8;
}

.links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-link {
  text-decoration: none;
  color: #ffc9a8;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

.nav-link:hover {
  background: #c99373;
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #ffc9a8;
  color: #324b4f;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1rem;
}

.user-email {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffc9a8;
}

.logout-btn {
  padding: 0.4rem 0.8rem;
  background: #324b4f;
  color: #ffc9a8;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.logout-btn:hover {
  background: #c99373;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .links {
    gap: 0.5rem;
  }

  .user-info {
    flex-direction: row;
    align-items: center;
  }
}
</style>
