<script lang="ts">
export default {
  data() {
    return {
      design: <"success" | "error" | "warning" | "info">"info",
      password: <Boolean>false,
      colors: {
        success: "teal",
        error: "rose",
        warning: "amber",
        info: "sky",
      },
      target: <"Todos" | "Turma" | "Família">"Turma J",
    };
  },
};
</script>

<template>
  <dialog
    open="true"
    class="w-2/3 mx-auto p-8 rounded-xl shadow-xl relative flex flex-col justify-between gap-2 max-w-3xl"
    :class="`bg-${colors[design]}-600`"
  >
    <h2 class="text-2xl text-white flex font-bold items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6"
        v-if="design === 'success'"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6"
        v-if="design === 'error'"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6"
        v-if="design === 'warning'"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6"
        v-if="design === 'info'"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </svg>

      Férias
    </h2>
    <p class="text-white">
      Informa-se todos os alunos e encarregados de educação que a academia
      StarDancers entra de férias a 8 de agosto até 24 de agosto. Obrigado
    </p>
    <span
      class="absolute top-4 right-4 font-bold px-4 py-2 rounded text-xs"
      :class="`bg-${colors[design]}-300 text-${colors[design]}-900`"
      >{{ target }}</span
    >
  </dialog>
</template>
