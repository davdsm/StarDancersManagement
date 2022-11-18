<script setup lang="ts">
import LoginForm from "@/components/login/LoginForm.vue";
const address = import.meta.env.VITE_ADDRESS;
</script>

<template>
  <div
    class="grid grid-cols-3 gap-3 h-screen max-lg:grid-cols-1 overflow-hidden"
  >
    <LoginForm />
    <div
      class="col-span-2 bg-cover bg-center bg-white max-lg:hidden"
      :style="{
        backgroundImage: `url(${address}/uploads/IMG_20220724_WA_0160_9551f8488a.jpg?updated_at=2022-11-17T14:01:12.848Z)`,
      }"
    ></div>
  </div>
</template>
