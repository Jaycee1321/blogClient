<template>
  <div class="page-bg">
    <Navbar />

    <div class="admin-panel">
      <h1>Admin Panel 🦆</h1>

      <div v-if="loading" class="loading">Loading blogs...</div>

      <div v-else class="blogs-grid">
        <div
          v-for="blog in blogs"
          :key="blog._id"
          class="blog-card"
        >
          <h2>{{ blog.title }}</h2>
          <p>By {{ blog.author?.username || blog.author?.email }}</p>
          <p>{{ formatDate(blog.createdAt) }}</p>

          <button
            v-if="store.user.isAdmin"
            @click="deleteBlog(blog._id)"
            class="delete-btn"
          >
            Delete Blog
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import { useGlobalStore } from "../stores/globalStores";
import api from "../api";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const store = useGlobalStore();
const blogs = ref([]);
const loading = ref(true);

const notyf = new Notyf({
  duration: 3000,
  position: { x: "right", y: "top" },
  dismissible: true,
});

const formatDate = (date) => new Date(date).toLocaleDateString();

const fetchBlogs = async () => {
  try {
    const res = await api.get("/blogs/getBlogs");
    blogs.value = res.data || [];
  } catch (err) {
    console.error(err);
    notyf.error(err.response?.data?.message || "Failed to fetch blogs");
  } finally {
    loading.value = false;
  }
};

const deleteBlog = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this blog?");
  if (!confirmed) return;

  try {
    await api.delete(`/blogs/deleteBlog/${id}`, {
      headers: {
        Authorization: `Bearer ${store.user.token}`,
      },
    });
    blogs.value = blogs.value.filter(blog => blog._id !== id);
    notyf.success("Blog deleted successfully!");
  } catch (err) {
    console.error(err);
    notyf.error(err.response?.data?.message || "Failed to delete blog");
  }
};

onMounted(fetchBlogs);
</script>


<style scoped>
.page-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #f2c9a8, #95b0b4);
  padding-bottom: 3rem;
}

.admin-panel {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.blogs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.blog-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 220px;
}

.blog-card h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  margin-top: auto;
  padding: 0.5rem 1rem;
  background: #ff4d4f;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.delete-btn:hover {
  background: #d9363e;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #333;
}
</style>
