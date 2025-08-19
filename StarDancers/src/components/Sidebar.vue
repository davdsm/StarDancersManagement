<script lang="ts">
export default {
  props: ["isAdmin"],
  data() {
    return {
      open: <boolean>true,
      logo: `${
        import.meta.env.VITE_ADDRESS
      }/uploads/logo_ee5853dd17.png?updated_at=2022-11-25T01:35:44.722Z`,
    };
  },
};
</script>
<template>
  <aside
    v-if="isAdmin"
    class="bg-white rounded-lg flex-shrink-0 transition-all duration-300 px-4 py-6 shadow-sm sticky top-10"
    :class="{ 'w-16': !open, 'w-64': open }"
  >
    <header>
      <img
        v-bind:src="logo"
        alt="Star Dancers Logo"
        class="mx-auto mb-4"
        :class="{ 'w-full': !open, 'w-1/2': open }"
      />
    </header>
    <span v-if="open" class="text-gray-400 text-xs p-4 block"
      >Painel de Admnistração</span
    >
    <nav>
      <ul>
        <li class="mb-2 hover:bg-gray-100 rounded-lg">
          <router-link
            to="/"
            class="py-4 flex items-center gap-2"
            :class="{ 'px-4 ': open, 'px-2': !open }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              :class="{ 'w-5': open, 'w-8': !open }"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>

            <span v-if="open">Alunos</span>
          </router-link>
        </li>
        <li class="mb-2 hover:bg-gray-100 rounded-lg">
          <router-link
            to="/"
            class="py-4 flex items-center gap-2"
            :class="{ 'px-4 ': open, 'px-2': !open }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              :class="{ 'w-5': open, 'w-6': !open }"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>

            <span v-if="open">Avisos</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <footer v-if="open" class="text-gray-400 text-xs p-4 block">
      <p>© 2025 Star Dancers</p>
    </footer>
    <button @click="open = !open" class="absolute top-0 -left-12 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 transform transition-transform duration-300"
        :class="{ 'rotate-180': !open, 'rotate-0': open }"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
        />
      </svg>
    </button>
  </aside>
</template>
