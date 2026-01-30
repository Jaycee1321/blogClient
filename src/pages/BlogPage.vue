<template>
  <div class="page-bg">
    <Navbar />

    <div v-if="loading" class="loading">Loading blog...</div>

    <div v-else-if="blog" class="blog-layout">

      <article class="blog-main">
        <h1 class="blog-title">{{ blog.title }}</h1>

        <div class="blog-meta">
          <span>By {{ blog.author?.username || blog.author?.email }}</span>
          <span>{{ formatDate(blog.createdAt) }}</span>
        </div>

        <div class="blog-content">{{ blog.content }}</div>
      </article>

      <aside class="blog-comments">
        <h3>Comments ({{ comments.length }})</h3>

        <div v-for="comment in comments" :key="comment._id" class="comment-item">
          <div class="comment-header">
            <div class="avatar">
              {{ (comment.user?.username || comment.user?.email || "U").charAt(0).toUpperCase() }}
            </div>
            <span class="comment-user">
              {{ comment.user?.username || comment.user?.email }}
            </span>

            <!-- Author label -->
            <span v-if="String(comment.user?._id) === String(blog.author?._id)" class="author-label">
              Author
            </span>

            <!-- Delete button -->
            <button
              v-if="store.user.isAdmin"
              @click="deleteComment(comment._id)"
              class="delete-btn"
            >
              Delete
            </button>

          </div>

          <div class="comment-content">{{ comment.content }}</div>
        </div>

        <AddComment @add="addComment" />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Navbar from "../components/Navbar.vue";
import AddComment from "../components/AddComment.vue";
import { useGlobalStore } from "../stores/globalStores";
import api from "../api";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const store = useGlobalStore();
const route = useRoute();
const blogId = route.params.id;

const blog = ref(null);
const comments = ref([]);
const loading = ref(true);

const notyf = new Notyf({
  duration: 3000,
  position: { x: "right", y: "top" },
  dismissible: true,
});

const formatDate = (date) => new Date(date).toLocaleDateString();

const fetchBlog = async () => {
  try {
    const res = await api.get(`/blogs/getBlog/${blogId}`);
    blog.value = res.data.blog || res.data;
    comments.value = blog.value?.comments || [];
  } catch (err) {
    console.error(err);
    notyf.error(err.response?.data?.message || "Failed to fetch blog");
  } finally {
    loading.value = false;
  }
};

const addComment = async (content) => {
  if (!content.trim()) return;
  try {
    const res = await api.post(`/blogs/addComment/${blogId}`, { content });
    comments.value.push(res.data.comment || res.data.comments?.slice(-1)[0]);
    notyf.success("Comment added!");
  } catch (err) {
    console.error(err);
    notyf.error(err.response?.data?.message || "Failed to add comment");
  }
};

const deleteComment = async (commentId) => {
  const confirmed = window.confirm("Are you sure you want to delete this comment?");
  if (!confirmed) return;

  try {
    await api.delete(`/blogs/deleteComment/${blogId}/${commentId}`);
    comments.value = comments.value.filter(c => c._id !== commentId);
    notyf.success("Comment deleted!");
  } catch (err) {
    console.error(err);
    notyf.error(err.response?.data?.message || "Failed to delete comment");
  }
};

onMounted(fetchBlog);
</script>

<style scoped>
.page-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #f2c9a8, #95b0b4);
  padding-bottom: 3rem;
}

.blog-layout {
  display: grid;
  grid-template-columns: 3fr 1.2fr;
  gap: 2.5rem;
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.blog-main {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.blog-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.blog-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 2rem;
}

.blog-content {
  font-size: 1.1rem;
  line-height: 1.9;
  white-space: pre-line;
}

.blog-comments {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}

.comment-item {
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.8rem;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6dd5ed, #2193b0);
  color: white;
  font-weight: 700;
  display: grid;
  place-items: center;
  font-size: 1rem;
}

.comment-user {
  font-weight: 600;
}

.author-label {
  margin-left: 0.5rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  background-color: #f39c12;
  border-radius: 4px;
}

.delete-btn {
  margin-left: auto;
  background: #ff4d4f;
  border: none;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

@media (max-width: 900px) {
  .blog-layout {
    grid-template-columns: 1fr;
  }
  .blog-comments {
    max-height: none;
  }
}
</style>
