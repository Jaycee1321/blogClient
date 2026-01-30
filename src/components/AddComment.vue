<template>
  <div class="add-comment">
    <textarea v-model="content" placeholder="Add a comment..." />
    <button @click="submitComment">Comment</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["add"]);
const content = ref("");

const submitComment = () => {
  if (!content.value.trim()) return alert("Comment cannot be empty");
  emit("add", content.value.trim());
  content.value = "";
};
</script>

<style scoped>
.add-comment {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add-comment textarea {
  width: 100%;
  min-height: 70px;
  border-radius: 10px;
  padding: 0.8rem;
  border: 1px solid #ccc;
  resize: none;
  font-size: 1rem;
}

.add-comment button {
  align-self: flex-end;
  background: #2193b0;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.add-comment button:hover {
  background: #1a7b91;
}
</style>
