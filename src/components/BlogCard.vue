<template>
  <article class="blog-card">

    <div class="card-header">
      <div class="avatar">
        {{ authorInitial }}
      </div>

      <div class="meta">
        <span class="author">
          {{ blog.author?.username || blog.author?.email }}
        </span>
        <span class="date">
          {{ formatDate(blog.createdAt) }}
        </span>
      </div>
    </div>

    <!-- Title -->
    <router-link
      :to="`/blogs/${blog._id}`"
      class="card-title"
    >
      {{ blog.title }}
    </router-link>
    <p class="card-excerpt">
      {{ blog.content.substring(0, 160) }}...
    </p>
    <!-- Footer -->
    <div class="card-footer">
      <router-link :to="`/blogs/${blog._id}`" class="read-more">
          Read more →
        </router-link>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  blog: {
    type: Object,
    required: true
  }
});

const authorInitial = computed(() =>
  (props.blog.author?.username || props.blog.author?.email || "?")
    .charAt(0)
    .toUpperCase()
);

const formatDate = (date) =>
  new Date(date).toLocaleDateString();
</script>



<style scoped>
.blog-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 1.8rem;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.12);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.blog-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6dd5ed, #2193b0);
  color: white;
  font-weight: 700;
  display: grid;
  place-items: center;
  font-size: 1.1rem;
}

.meta {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  color: #666;
}

.author {
  font-weight: 600;
  color: #333;
}

.card-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a1a1a;
  text-decoration: none;
  line-height: 1.3;
  margin-bottom: 0.6rem;
}

.card-title:hover {
  text-decoration: underline;
}

.card-excerpt {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  flex-grow: 1;
}

.card-footer {
  margin-top: 1.2rem;
  display: flex;
  justify-content: flex-end;
}

.read-more {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2193b0;
}

</style>
