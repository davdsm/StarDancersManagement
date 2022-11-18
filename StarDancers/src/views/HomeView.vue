<script lang="ts">
import { getCookie } from "../redux/calls.d";

export default {
  data() {
    return {
      username: "",
    };
  },
  methods: {},
  async beforeMount() {
    const user = await getCookie("user");
    if (!user) {
      this.$router.push("/login");
    } else {
      this.username = user;
    }
  },
};
</script>

<template class="bg-slate-100">
  <main class="container mx-auto entry">
    <header class="pt-20 pb-20 flex justify-between items-center title">
      <div>
        <h1 class="text-2xl">Olá {{ username }} 👋</h1>
      </div>
      <div class="yellow p-3 rounded-lg cursor-pointer">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      </div>
    </header>
    <div class="w-full flex-col bg-white p-12 shadow-davdsm rounded-lg">test</div>
  </main>
</template>
