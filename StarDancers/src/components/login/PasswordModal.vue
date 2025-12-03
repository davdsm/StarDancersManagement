<script lang="ts">
export default {
  props: ["close", "putPassword"],
  data() {
    return {
      new_password: "",
      repeat_password: "",
      error: { id: 0, msg: "" },
    };
  },
  methods: {
    submit(e: any) {
      e.preventDefault();
      if (this.new_password !== this.repeat_password) {
        this.error = { id: 1, msg: "As passwords não correspondem." };
      } else if (this.new_password.length < 5) {
        this.error = {
          id: 2,
          msg: "A password precisa de mais de 6 caracteres.",
        };
      } else {
        this.putPassword(this.new_password);
      }
    },
  },
};
</script>
<template>
  <div
    class="z-50 w-full h-full flex justify-center items-top fixed top-0 right-0 left-0"
  >
    <!-- Main modal -->
    <div
      class="z-40 fixed w-full h-full z-10 bg-slate-400 opacity-30"
      @click="() => close()"
    ></div>
    <div
      id="authentication-modal"
      tabindex="-1"
      aria-hidden="true"
      class="z-50 overflow-y-auto overflow-x-hidden p-4 md:inset-0 h-modal md:h-full"
    >
      <div class="relative w-full max-w-md h-full md:h-auto">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg dark:bg-slate-800">
          <button
            type="button"
            @click="() => close()"
            class="z-30 pointer absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-slate-700 dark:hover:text-white"
            data-modal-toggle="authentication-modal"
          >
            <svg
              aria-hidden="true"
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
            <span class="sr-only">Fechar Modal</span>
          </button>
          <div class="py-6 px-6 lg:px-8">
            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              Mudar Password
            </h3>
            <form class="space-y-6" action="#" @submit="submit">
              <div>
                <label
                  for="new-password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Nova Password</label
                >
                <input
                  type="password"
                  name="new-password"
                  v-model="new_password"
                  id="new-password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
                <p v-if="error.id === 2" class="mt-2 text-sm text-red-600">
                  <span class="font-medium">Oh, não!</span> {{ error.msg }}
                </p>
              </div>
              <div>
                <label
                  for="r-password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >Repetir Nova Password</label
                >
                <input
                  type="password"
                  name="r-password"
                  v-model="repeat_password"
                  id="r-password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
                <p v-if="error.id === 1" class="mt-2 text-sm text-red-600">
                  <span class="font-medium">Oh, não!</span> {{ error.msg }}
                </p>
              </div>
              <button
                type="submit"
                class="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Atualizar Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
