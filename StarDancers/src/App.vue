<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, onMounted } from "vue";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import { useUserStore } from "@/stores/user"; // Adjust the path if needed

// Get current route
const route = useRoute();

// Determine if the header should be shown
const showHeader = computed(() => route.name !== "login");

// Admin state
const isAdmin = ref(false);

const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchUser();
  isAdmin.value = userStore.isAdmin;
});
</script>

<template>
  <div v-if="showHeader" class="w-full overflow-x-hidden">
    <Header />
    <main class="flex flex-row flex-wrap mx-auto sm:pl-20 sm:pr-20">
      <div
        class="flex flex-row w-full gap-4 justify-between align-center items-start flex-wrap"
      >
        <Sidebar :isAdmin="isAdmin" />
        <RouterView />
      </div>
    </main>
  </div>
  <div v-else>
     <RouterView />
  </div>
</template>
