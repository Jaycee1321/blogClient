import { defineStore } from "pinia";
import { reactive } from "vue";
import api from "../api";

export const useGlobalStore = defineStore("globalStore", () => {
  const user = reactive({
    _id: localStorage.getItem("_id") || null,
    token: localStorage.getItem("token") || null,
    email: localStorage.getItem("email") || null,
    username: localStorage.getItem("username") || null,
    isAdmin: localStorage.getItem("isAdmin") === "true" || false,
  });

  const persistUser = (token, email, username, isAdmin, id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("username", username);
    localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
    localStorage.setItem("_id", id);
  };

  // LOGIN
  async function login(email, password) {
    try {
      const res = await api.post("/users/login", { email, password });
      const token = res.data.access;
      const username = res.data.user?.username || "";
      const isAdmin = res.data.user?.isAdmin || false;
      const id = res.data.user?._id || "";

      // Update reactive user
      user._id = id;
      user.token = token;
      user.email = email;
      user.username = username;
      user.isAdmin = Boolean(isAdmin);

      persistUser(token, email, username, isAdmin, id);

      return true;
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message || err);
      throw new Error(err.response?.data?.message || "Login failed");
    }
  }

  // REGISTER
  async function register(username, email, password) {
    try {
      const res = await api.post("/users/register", { username, email, password });
      const token = res.data.access;
      const isAdmin = res.data.user?.isAdmin || false;
      const id = res.data.user?._id || "";

      // Update reactive user
      user._id = id;
      user.token = token;
      user.email = email;
      user.username = username;
      user.isAdmin = Boolean(isAdmin);

      persistUser(token, email, username, isAdmin, id);

      return true;
    } catch (err) {
      console.error("Register failed:", err.response?.data?.message || err.message || err);
      throw new Error(err.response?.data?.message || "Register failed");
    }
  }

  // LOGOUT
  function logout() {
    user._id = null;
    user.token = null;
    user.email = null;
    user.username = null;
    user.isAdmin = false;

    localStorage.removeItem("_id");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
  }

  return { user, login, register, logout };
});
