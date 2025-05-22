<script lang="ts">
import { doLogin, getCookie } from "../../redux/calls.d";

export default {
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,    // ← controla a visibilidade
      loading: false,
      error: 0,
      address: import.meta.env.VITE_ADDRESS,
    };
  },
  methods: {
    toggleShow() {           // ← o método para alternar
      this.showPassword = !this.showPassword;
    },
    async login(e: any) {
      this.error = 0;
      this.loading = true;
      e.preventDefault();
      const msg = await doLogin(this.username, this.password);
      this.loading = false;
      if (msg === 200) {
        this.error = 0;
        this.$router.push("/");
      } else if (msg === 400) {
        this.error = 1;
      } else {
        this.error = 2;
      }
    },
  },
  async beforeMount() {
    const user = await getCookie("user");
    if (user) {
      this.$router.push("/");
    }
  },
};
</script>

<template>
  <div class="flex justify-center items-center flex-col bg-white">
    <img
      v-bind:src="
        address +
        '/uploads/logo_ee5853dd17.png?updated_at=2022-11-25T01:35:44.722Z'
      "
      class="w-48"
    />
    <header class="text-center w-96">
      <h2 class="text-2xl font-medium title">ACESSO RESTRITO</h2>
      <p class="text-sm font-normal subtitle py-5">
        Usa as tuas credênciais para iniciar <br />
        sessão na plataforma.
      </p>
    </header>
    <form class="max-lg:w-3/5" @submit="login">
      <input
        v-model="username"
        type="text"
        placeholder="Nome de Utilizador"
        required
        class="mt-0 block w-full px-6 py-4 bg-zinc-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-lime-500"
      />

      <div class="relative mt-5 mb-6">
        <input
          v-model="password"
          :type="showPassword ? 'password' : 'text'"
          required
          placeholder="Password"
          class="block w-full px-6 py-4 bg-zinc-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-lime-500"
        />

        <button
          type="button"
          @click="toggleShow"
          class="absolute inset-y-0 right-3 flex items-center p-1"
        >

          <svg
            v-if="!showPassword"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <!-- olho fechado -->
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.66-3.042m2.568-2.568A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.223 2.531M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3l18 18"
            />
          </svg>
        </button>
      </div>

      <button
        type="submit"
        class="transition w-full rounded yellow px-6 py-3 cursor-pointer"
      >
        ENTRAR
      </button>

      <!-- resto permanece igual -->
      <button
        disabled
        v-if="loading"
        type="button"
        class="mt-10 text-sm font-medium text-gray-900 bg-white flex justify-center items-center w-full absolute"
      >
        <!-- ...spinner... -->
        A verificar...
      </button>

      <p
        v-if="error === 1"
        class="mt-10 text-sm font-medium text-red-500 bg-white flex justify-center items-center w-full absolute"
      >
        Credênciais Erradas
      </p>

      <p
        v-if="error === 2"
        class="mt-10 text-sm font-medium text-red-500 bg-white flex justify-center items-center w-full text-center absolute"
      >
        Sistema com falhas, por favor contactar geral@davdsm.pt
      </p>
    </form>
  </div>
</template>
