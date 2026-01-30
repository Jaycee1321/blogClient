<template>
  <div class="page-bg">
    <Navbar />

    <div class="post-container">
      <h1>Create New Blog</h1>

      <form @submit.prevent="submitBlog">
        <div class="form-group">
          <label for="title">Title</label>
          <input
            type="text"
            id="title"
            v-model="title"
            placeholder="Enter blog title"
            required
          />
        </div>

        <div class="form-group">
          <label for="content">Content</label>
          <textarea
            id="content"
            v-model="content"
            placeholder="Write your blog here..."
            rows="10"
            required
          ></textarea>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? "Posting..." : "Post Blog" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "../components/Navbar.vue";
import { useGlobalStore } from "../stores/globalStores";
import api from "../api";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const store = useGlobalStore();
const router = useRouter();

const title = ref("");
const content = ref("");
const loading = ref(false);

const notyf = new Notyf({
  duration: 3000,
  position: { x: "right", y: "top" },
  dismissible: true,
});

const submitBlog = async () => {
  if (!title.value.trim() || !content.value.trim()) return;

  loading.value = true;
  try {
    const res = await api.post(
      "/blogs/addBlog",
      { title: title.value, content: content.value },
      {
        headers: {
          Authorization: `Bearer ${store.user.token}`,
        },
      }
    );

    const newBlog = res.data;

    notyf.success("Blog posted successfully!");
    router.push(`/blogs/${newBlog._id}`);
  } catch (err) {
    console.error(err);
    notyf.error(err.response?.data?.message || "Failed to post blog");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.page-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #f2c9a8, #95b0b4);
  padding-bottom: 3rem;
}

.post-container {
  max-width: 800px;
  margin: 3rem auto;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input, textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  resize: vertical;
}

.submit-btn {
  padding: 0.8rem 1.5rem;
  background: #6dd5ed;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #2193b0;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
