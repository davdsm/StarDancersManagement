<script lang="ts">
export default {
  props: ["close", "submit"],
  data() {
    return {
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    handleSubmit(e: any) {
      e.preventDefault();
      this.submit(this.password, this.confirmPassword);
    },
  },
};
</script>

<template>
  <div
    class="z-50 w-full h-full flex justify-center items-center fixed top-0 right-0 left-0"
  >
    <div
      class="fixed w-full h-full z-50 bg-slate-400 opacity-30"
      @click="() => close()"
    ></div>
    <div
      class="relative w-full max-w-md bg-white rounded-lg z-50 dark:bg-slate-800"
    >
      <!-- Modal content -->
      <form @submit="handleSubmit" class="relative">
        <!-- Modal header -->
        <div
          class="flex justify-between items-center p-4 rounded-t border-b dark:border-slate-700"
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Recuperar Password
          </h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-slate-700 dark:hover:text-white"
            @click="() => close()"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <div class="space-y-4 flex flex-col gap-4">
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                type="password"
                name="password"
                id="password"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Digite a nova password"
                v-model="password"
                required
                minlength="6"
              />
            </div>
            <div>
              <label
                for="confirm-password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Repetir Password</label
              >
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Repita a nova password"
                v-model="confirmPassword"
                required
                minlength="6"
              />
            </div>
          </div>
        </div>
        <!-- Modal footer -->
        <div
          class="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-slate-700"
        >
          <button
            type="button"
            @click="() => close()"
            class="text-gray-500 bg-white hover:bg-gray-100 border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Atualizar Password
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
