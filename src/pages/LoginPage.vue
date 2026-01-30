<template>
	    <Navbar />
  <div class="auth-page">

    <div class="auth-card">
      <h1 class="auth-title">Login</h1>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      <p class="switch-text">
        Don’t have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "../components/Navbar.vue";
import { useGlobalStore } from "../stores/globalStores";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const store = useGlobalStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const notyf = new Notyf({
  duration: 3000,
  position: { x: "right", y: "top" },
  dismissible: true,
});

const handleLogin = async () => {
  try {
    await store.login(email.value, password.value);
    notyf.success("Login successful!");
    router.push("/");
  } catch (err) {
    notyf.error(err.response?.data?.message || err.message || "Login failed");
  }
};
</script>


<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #83e4f2, #95b0b4);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4rem;
  font-family: "Segoe UI", sans-serif;
}

.auth-card {
  background: #ffc9a8;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(50, 75, 79, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #324b4f;
  text-shadow: 1px 1px #c99373;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid #95b0b4;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #324b4f;
  box-shadow: 0 0 5px #324b4f;
}

button {
  padding: 0.8rem 1rem;
  background: #324b4f;
  color: #ffc9a8;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

button:hover {
  background: #c99373;
  transform: translateY(-2px);
  color: white;
}

.switch-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #324b4f;
}

.switch-text a {
  color: #324b4f;
  font-weight: 600;
  text-decoration: underline;
}

.switch-text a:hover {
  color: #c99373;
}
</style>
