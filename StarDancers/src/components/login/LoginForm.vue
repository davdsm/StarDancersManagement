<script lang="ts">
export default {
  data() {
    return {
      name: "Vue.js",
    };
  },
  methods: {
    greet(event) {
      // `this` inside methods points to the current active instance
      alert(`Hello ${this.name}!`);
      // `event` is the native DOM event
      if (event) {
        alert(event.target.tagName);
      }
    },
  },
};
</script>

<template>
  <div class="flex justify-center items-center flex-col">
    <img
      src="http://192.168.1.67:1337/uploads/logo_6864f61fb7.png?updated_at=2022-11-17T20:10:28.305Z"
      class="w-48"
    />
    <header class="text-center w-96">
      <h2 class="text-2xl font-medium title">ACESSO RESTRITO</h2>
      <p class="text-sm font-normal subtitle py-5">
        Usa as tuas credênciais para iniciar <br />
        sessão na plataforma.
      </p>
    </header>
    <form class="max-lg:w-4/5">
      <input
        type="text"
        value=""
        placeholder="nome@stardancers.pt"
        required
        class="mt-0 block w-full px-6 py-4 bg-zinc-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-lime-500"
      />
      <input
        type="password"
        required
        placeholder="Password"
        class="mt-5 mb-6 block w-full px-6 py-4 bg-zinc-50 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-lime-500"
      />
      <button type="submit" class="transition w-full rounded yellow px-6 py-3">
        ENTRAR
      </button>
    </form>
  </div>
</template>
