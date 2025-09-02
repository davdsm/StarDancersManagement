<script lang="ts">
export default {
  props: ["openPassword", "logout"],
  data() {
    return {
      link: `${
        import.meta.env.VITE_ADDRESS
      }/uploads/POLITICA_DE_PRIVACIDADE_imprimir_frente_e_verso_300_copias_71c38d7e96.pdf?updated_at=2025-09-02T15:51:17.120Z`,
    };
  },
};
</script>
<template>
  <div
    id="dropdown"
    class="sm:absolute top-16 z-12 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"
  >
    <ul
      class="text-left py-1 text-sm text-gray-700 dark:text-gray-200"
      aria-labelledby="dropdownDefault"
    >
      <li>
        <a
          :href="link"
          target="_blank"
          class="text-left w-full block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          Política de Privacidade
        </a>
      </li>
      <li>
        <button
          @click="() => openPassword()"
          class="text-left w-full block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          Mudar Password
        </button>
      </li>
      <li>
        <button
          @click="() => logout()"
          class="text-left w-full block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          Sair
        </button>
      </li>
    </ul>
  </div>
</template>
