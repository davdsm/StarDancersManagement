<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import { useUserStore } from "@/stores/user"; // Adjust the path if needed

const userStore = useUserStore();
const route = useRoute();

const isAdmin = computed(() => userStore.isAdmin);
const showHeader = computed(() => route.path !== "/login");

onMounted(async () => {
  if (userStore.user) {    
    await userStore.fetchUser();
  }
});
</script>

<template>
  <div v-if="showHeader" class="w-full overflow-none">
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
