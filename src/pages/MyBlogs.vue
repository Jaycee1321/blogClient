<template>
  <div class="page-bg">
    <Navbar />

    <div class="myblogs-container">
      <h1>My Blogs 🦆</h1>

      <div v-if="loading" class="loading">Loading your blogs...</div>
      <div v-else-if="blogs.length === 0" class="empty-msg">
        You have no blogs yet.
      </div>

      <div class="blogs-list">
        <div v-for="blog in blogs" :key="blog._id" class="blog-card">
          <h3>{{ blog.title }}</h3>
          <p>{{ blog.content.slice(0, 150) }}...</p>
          <small>By {{ blog.author.username }}</small>
          <div class="blog-actions">
            <router-link :to="`/blogs/${blog._id}`" class="view-btn">View</router-link>

            <!-- delte -->
            <button
              @click="deleteBlog(blog._id)"
              class="delete-btn"
            >
              Delete
            </button>
          </div>
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

// Fetch blogs
const fetchMyBlogs = async () => {
  try {
    const res = await api.get("/blogs/myBlogs", {
      headers: { Authorization: `Bearer ${store.user.token}` },
    });
    blogs.value = res.data || [];
  } catch (err) {
    console.error(err);
    notyf.error(err.response?.data?.message || "Failed to fetch your blogs");
  } finally {
    loading.value = false;
  }
};

// Delete blog
const deleteBlog = async (id) => {
  const confirmed = window.confirm("Are you sure you want to delete this blog?");
  if (!confirmed) return;

  try {
    await api.delete(`/blogs/deleteBlog/${id}`, {
      headers: { Authorization: `Bearer ${store.user.token}` },
    });
    blogs.value = blogs.value.filter(blog => blog._id !== id);
    notyf.success("Blog deleted successfully!");
  } catch (err) {
    console.error(err);
    notyf.error(err.response?.data?.message || "Failed to delete blog");
  }
};

onMounted(fetchMyBlogs);
</script>


<style scoped>
.page-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #f2c9a8, #95b0b4);
  padding-bottom: 3rem;
}

.myblogs-container {
  max-width: 1000px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.loading,
.empty-msg {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  margin-top: 2rem;
}

.blogs-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.blog-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.blog-card h3 {
  margin-bottom: 0.5rem;
}

.blog-card p {
  flex-grow: 1;
  margin-bottom: 1rem;
  color: #333;
}

.blog-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.view-btn {
  background: #6dd5ed;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s;
}

.view-btn:hover {
  background: #2193b0;
}

.delete-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: #c41c1c;
}

@media (max-width: 768px) {
  .blogs-list {
    grid-template-columns: 1fr;
  }
}
</style>
