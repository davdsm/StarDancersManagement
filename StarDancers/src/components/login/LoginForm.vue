<script lang="ts">
import { doLogin, getCookie } from "../../redux/calls.d";

export default {
  data() {
    return {
      username: "",
      password: "",
      loading: false,
      error: 0,
      address: import.meta.env.VITE_ADDRESS,
    };
  },
  methods: {
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
        '/uploads/logo_6864f61fb7.png?updated_at=2022-11-17T20:10:28.305Z'
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
      <input
        v-model="password"
        type="password"
        required
        placeholder="Password"
        class="mt-5 mb-6 block w-full px-6 py-4 bg-zinc-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-lime-500"
      />
      <button
        type="submit"
        class="transition w-full rounded yellow px-6 py-3 cursor-pointer"
      >
        ENTRAR
      </button>
      <!-- <div class="flex items-start">
        <div class="flex items-start"></div>
        <a
          href="#"
          class="ml-auto text-sm font-normal subtitle py-5 hover:underline"
          >Recuperar Password</a
        >
      </div> -->
      <button
        disabled
        v-if="loading"
        type="button"
        class="mt-10 text-sm font-medium text-gray-900 bg-white flex justify-center items-center w-full absolute"
      >
        <svg
          role="status"
          class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#1C64F2"
          />
        </svg>
        A verificar...
      </button>

      <p
        v-if="error === 1"
        class="mt-10 text-sm font-medium text-red-500 bg-white flex justify-center items-center w-full absolute"
      >
        Credênciais Erredas
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
