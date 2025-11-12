<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    design: {
      type: String as () => "Sucesso" | "Erro" | "Aviso" | "Informação",
      default: "Sucesso",
    },
    target: {
      type: String as () => "Todos" | "Turma" | "Família",
      default: "Todos",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      colors: {
        Sucesso: "teal",
        Erro: "rose",
        Aviso: "amber",
        Informação: "sky",
      },
    };
  },
});
</script>

<template>
  <dialog
    open="true"
    :class="[
      'z-04 w-4/5 md:w-2/3 mx-auto p-8 rounded-xl shadow-xl relative flex flex-col justify-between gap-3 max-w-3xl md:mb-0',
      `bg-${colors[design]}-600`,
    ]"
  >
    <h2
      class="gap-2 justify-between w-full flex justify-items-center items-center"
    >
      <span class="text-md md:text-2xl text-white flex font-bold items-center gap-2">
        <!-- success -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          v-if="design === 'Sucesso'"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>

        <!-- error -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6"
          v-if="design === 'Erro'"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <!-- warning -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          v-if="design === 'Aviso'"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>

        <!-- info -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          v-if="design === 'Informação'"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>

        {{ title }}
      </span>

      <span
        :class="[
          'rounded px-4 py-2 text-xs md:text-md font-bold font:semi-bold',
          `bg-${colors[design]}-300`,
          `text-${colors[design]}-900`,
        ]"
      >
        {{ target }}
      </span>
    </h2>

    <p class="text-white text-xs md:text-lg font-light">{{ message }}</p>
  </dialog>
</template>
