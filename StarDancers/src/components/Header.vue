<script lang="ts">
import PasswordModal from "./login/PasswordModal.vue";
import DropdownMenu from "./DropdownMenu.vue";
import Notification from "./Notification.vue";
import {
  getBirthdays,
  getCookie,
  removeCookie,
  updatePassword,
} from "@/services/api";

export default {
  props: [],
  data() {
    return {
      password: <Boolean>false,
      birtdays: <Array<any>>[],
      username: "",
      menu: <Boolean>false,
    };
  },
  components: {
    PasswordModal,
    DropdownMenu,
    Notification,
  },
  async beforeMount() {
    const user = await getCookie("user");
    if (!user) {
      this.$router.push("/login");
    } else {
      this.username = user;
    }
    const birtdays = await getBirthdays();
    this.birtdays = birtdays;
  },
  methods: {
    async putPassword(password: String) {
      await updatePassword(password);
      this.password = false;
    },
    async logout() {
      removeCookie("user");
      this.$router.push("/login");
    },
  },
};
</script>
<template>
  <PasswordModal
    v-if="password"
    :close="() => (password = false)"
    :putPassword="putPassword"
  />
  <header
    class="container mx-auto flex justify-between entry pt-20 pb-10 z-20 flex-wrap flex-col gap-12"
  >
    <div class="flex items-center justify-between w-full">
      <div class="max-sm:pl-10 max-sm:w-full">
        <h1 class="text-2xl">Olá {{ username }} 👋</h1>
      </div>
      <div
        id="tooltip"
        class="w-30 mr-12 max-sm:absolute max-sm:w-full max-sm:text-center max-sm:top-40"
      >
        <div
          class="pt-1 text-slate-600 font-bold max-sm:flex max-sm:justify-center max-sm:items-center"
        >
          🎂 {{ birtdays.length }} aniversário{{
            birtdays.length !== 1 ? "s" : ""
          }}
          hoje.
          <div
            role="tooltip"
            class="top-10 left-0 w-full absolute z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 rounded-lg shadow-sm tooltip bg-gray-700 max-sm:w-40 max-sm:mx-auto max-sm:left-auto"
          >
            <span
              class="ellipsis w-30 block"
              role="tooltip"
              v-for="name in birtdays"
              :key="name.id"
            >
              {{ name.attributes.Name }}
            </span>
          </div>
        </div>
      </div>

      <div
        class="flex justify-center flex-col w-auto title max-sm:pr-10"
        :style="{ alignItems: 'end' }"
      >
        <button
          id="dropdownDefault"
          data-dropdown-toggle="dropdown"
          class="flex items-center justify-center w-24 yellow p-3 rounded-lg cursor-pointer"
          type="button"
          @click="() => (menu = !menu)"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          <svg
            class="ml-2 w-4 h-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        <DropdownMenu
          v-if="menu"
          :logout="logout"
          :openPassword="
            () => {
              menu = false;
              password = true;
            }
          "
        />
      </div>
    </div>
    <Notification />
  </header>
</template>
