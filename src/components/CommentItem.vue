<template>
  <div class="comment-item">
    <div class="avatar">
      {{ comment.user.username?.charAt(0).toUpperCase() || '?' }}
    </div>
    <div class="comment-body">
      <div class="comment-header">
        <span class="comment-author">{{ comment.user.username || comment.user.email }}</span>
        <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
      </div>
      <div class="comment-content">{{ comment.content }}</div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  comment: Object
});

const formatDate = (date) => new Date(date).toLocaleDateString();
</script>

<style scoped>
.comment-item {
  display: flex;
  gap: 0.75rem;
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

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 0.25rem;
}

.comment-author {
  font-weight: 600;
}

.comment-content {
  font-size: 1rem;
}
</style>
