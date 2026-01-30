<template>
	<Navbar />
  <div class="page">

    <h1 class="page-title">🦆 Quackr Feed</h1>

    <div v-if="loading" class="loading">Loading blogs...</div>

    <div v-else class="blog-list">
      <BlogCard
        v-for="blog in blogs"
        :key="blog._id"
        :blog="blog"
      >
        <button
          v-if="store.user.isAdmin || blog.userEmail === store.user.email"
          @click="deleteBlog(blog._id)"
          class="delete-btn"
        >
          Delete
        </button>
      </BlogCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import BlogCard from "../components/BlogCard.vue";
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

const fetchBlogs = async () => {
  try {
    const res = await api.get("/blogs/getBlogs");
    blogs.value = Array.isArray(res.data.blogs) ? res.data.blogs : res.data || [];
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
    await api.delete(`/blogs/deleteBlog/${id}`);
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
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f2c9a8, #95b0b4);
  padding: 2rem 1rem;
  font-family: "Segoe UI", sans-serif;
  color: #324b4f;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #324b4f;
  text-shadow: 1px 1px #ffc9a8;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #324b4f;
}

.blog-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  justify-items: center;
}

.blog-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 8px 20px rgba(50, 75, 79, 0.2);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(50, 75, 79, 0.3);
}

.title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #324b4f;
  text-decoration: none;
  margin-bottom: 0.8rem;
}

.excerpt {
  font-size: 1rem;
  color: #324b4f;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #c99373;
  margin-top: auto;
}

.delete-btn {
  margin-top: 0.8rem;
  padding: 0.4rem 0.8rem;
  background: #324b4f;
  color: #ffc9a8;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s, transform 0.2s;
}

.delete-btn:hover {
  background: #c99373;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  .blog-card {
    max-width: 100%;
  }
}
</style>
