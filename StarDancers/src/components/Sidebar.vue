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
    class="bg-white rounded-lg flex-shrink-0 transition-all duration-300 px-4 py-6 shadow-sm sticky top-10 flex w-[calc(100%-40px)] max-sm:mx-[20px] max-sm:px-14 flex-wrap"
    :class="{ 'md:w-16': !open, 'md:w-64': open }"
  >
    <header class="w-full">
      <img
        v-bind:src="logo"
        alt="Star Dancers Logo"
        class="hidden md:block mx-auto mb-4"
        :class="{ 'w-full': !open, 'w-1/2': open }"
      />
    </header>
    <span v-if="open" class="hidden md:block text-gray-400 text-xs p-4 block"
      >Painel de Admnistração</span
    >
    <nav class="w-full">
      <ul class="max-sm:flex max-sm:space-between w-full justify-between">
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
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
              />
            </svg>

            <span v-if="open" class="hidden md:block">Alunos</span>
          </router-link>
        </li>
        <!-- <li class="mb-2 hover:bg-gray-100 rounded-lg">
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

            <span v-if="open" class="hidden md:block">Avisos</span>
          </router-link>
        </li> -->
        <li class="mb-2 hover:bg-gray-100 rounded-lg">
          <router-link
            to="/families"
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
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>

            <span v-if="open" class="hidden md:block">Famílias</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <footer v-if="open" class="text-gray-400 text-xs p-4 hidden md:block">
      <p>© 2025 Star Dancers</p>
    </footer>
    <button
      @click="open = !open"
      class="hidden md:block absolute top-0 -left-12 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors"
    >
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
