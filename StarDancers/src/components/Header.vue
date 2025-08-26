<script lang="ts">
import PasswordModal from "./login/PasswordModal.vue";
import DropdownMenu from "./DropdownMenu.vue";
import Notification from "./Notification.vue";
import { getBirthdays, getNotifications } from "@/services/students";
import { getCookie, removeCookie, updatePassword } from "@/services/auth";
import { useUserStore } from "@/stores/user";
import { getFamilies } from "@/services/families";
import { onMounted } from "vue";

export default {
  data() {
    return {
      password: false as boolean,
      birtdays: [] as Array<any>,
      username: "",
      menu: false as boolean,
      notifications: [] as Array<any>,
      isAdmin: false,
    };
  },
  components: {
    PasswordModal,
    DropdownMenu,
    Notification,
  },
  async beforeMount() {
    // check login
    const storedUser = await getCookie("user");
    if (!storedUser) {
      this.$router.push("/login");
      return;
    }

    const user = useUserStore();
    const family = await user.getFamily();
    this.isAdmin = user.isAdmin;

    this.username = user.isAdmin
      ? storedUser
      : `Família ${family?.attributes.Name}`;

    // birthdays
    this.birtdays = await getBirthdays();

    // notifications
    this.notifications = await getNotifications();
  },
  methods: {
    async putPassword(password: string) {
      await updatePassword(password);
      this.password = false;
    },
    async logout() {
      removeCookie("user");
      setTimeout(() => {
        window.location.reload();
      }, 0);
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
    <div class="flex items-center justify-between w-full z-10">
      <div class="max-sm:pl-10 max-sm:w-full">
        <h1 class="text-2xl">Olá {{ username }} 👋</h1>
      </div>

      <!-- Birthdays -->
      <div
        v-if="isAdmin"
        id="tooltip"
        class="w-30 mr-12 max-sm:absolute max-sm:w-full max-sm:text-center max-sm:top-80"
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

      <!-- Menu -->
      <div
        class="flex justify-center flex-col w-auto title max-sm:pr-10 z-12"
        :style="{ alignItems: 'end' }"
      >
        <button
          class="flex items-center justify-center w-24 yellow p-3 rounded-lg cursor-pointer"
          type="button"
          @click="menu = !menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>

          <svg
            class="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
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

    <!-- Notifications -->
    <div class="flex flex-col gap-6">
      <Notification
        v-for="notif in notifications"
        :key="notif.id"
        :design="notif.attributes.Type"
        :target="notif.attributes.Target"
        :title="notif.attributes.Title"
        :message="notif.attributes.Message"
      />
    </div>
  </header>
</template>
