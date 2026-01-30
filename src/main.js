import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";

// Pages
import HomePage from "./pages/Homepage.vue";
import BlogPage from "./pages/BlogPage.vue";
import BlogCard from "./components/BlogCard.vue";
import LoginPage from "./pages/LoginPage.vue";
import RegisterPage from "./pages/RegisterPage.vue";
import AdminPage from "./pages/AdminPage.vue";
import PostBlog from "./pages/PostBlog.vue";
import MyBlogs from "./pages/MyBlogs.vue"

// Router setup
const routes = [
  { path: "/", component: HomePage },
  { path: "/blogs/:id", component: BlogPage },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/admin", component: AdminPage },
  { path: '/post-blog', component: PostBlog },
  { path: '/my-blog', component: MyBlogs },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Pinia store
const pinia = createPinia();

// Mount app
createApp(App).use(router).use(pinia).mount("#app");
