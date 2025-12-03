<script lang="ts">
import PasswordModal from "./login/PasswordModal.vue";
import DropdownMenu from "./DropdownMenu.vue";
import Notification from "./Notification.vue";
import {
  getBirthdays,
  getNotifications,
  getStudents,
} from "@/services/students";
import { getCookie, removeCookie, updatePassword } from "@/services/auth";
import { useUserStore } from "@/stores/user";
import type { Family } from "./FamiliesTable/ModalTable.vue";
import { useThemeStore } from "@/stores/theme";

export default {
  setup() {
    const themeStore = useThemeStore();
    return { themeStore };
  },
  data() {
    return {
      password: false as boolean,
      birtdays: [] as Array<any>,
      username: "",
      menu: false as boolean,
      notifications: [] as Array<any>,
      isAdmin: false,
      family: <Family>{},
      students: [] as Array<any>,
      todayDay: new Date().getDate(),
    };
  },
  components: {
    PasswordModal,
    DropdownMenu,
    Notification,
  },
  async mounted() {
    // check login
    const storedUser = await getCookie("user");
    if (!storedUser) {
      this.$router.push("/login");
      return;
    }

    const user = useUserStore();
    const family = await user.getFamily();

    this.isAdmin = user.isAdmin;
    this.family = family as Family;

    // birthdays
    this.birtdays = await getBirthdays();

    // Get students for notifications
    let students = [];
    if (this.isAdmin) {
      const [studentsData] = await getStudents(1, false);
      students = studentsData;
    } else {
      // For non-admin users, get students from user store
      students = await user.getStudents();
    }

    // Store students in data
    this.students = students;

    // Set username based on role and family status
    if (user.isAdmin) {
      this.username = storedUser;
    } else if (family?.attributes.Name) {
      this.username = `Família ${family.attributes.Name}`;
    } else if (students.length > 0 && students[0].attributes.ParentName) {
      this.username = students[0].attributes.ParentName;
    } else {
      this.username = storedUser;
    }

    const classes = new Set(
      students?.map((student: any) => student.attributes.Class) || []
    );

    // notifications
    this.notifications = await getNotifications(
      family?.attributes.Name ?? "",
      Array.from(classes) as string[]
    );
  },
  methods: {
    async putPassword(password: string) {
      await updatePassword(password);
      this.password = false;
    },
    async logout() {
      removeCookie("user");
      removeCookie("token");
      localStorage.removeItem("token");
      const userStore = useUserStore();
      userStore.$reset();
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
    <div
      class="flex items-center justify-between w-full z-10 flex-wrap gap-6 px-6"
    >
      <div class="order-1 w-1/2 md:w-1/4">
        <h1 class="text-2xl">Olá {{ username }} 👋</h1>
      </div>

      <!-- Birthdays -->
      <div
        v-if="isAdmin"
        id="tooltip"
        class="order-3 md:order-2 text-center w-full md:w-1/4"
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
        class="flex justify-center flex-row w-auto title z-12 w-1/3 order-2 md:order-3 md:w-1/4"
        :style="{ alignItems: 'end' }"
      >
        <button
          class="group flex items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-3 rounded-lg cursor-pointer text-black dark:text-white mr-2 transition-colors duration-200"
          type="button"
          @click="themeStore.toggleTheme()"
          title="Alternar tema"
        >
          <!-- Sun Icon (for dark mode) -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            v-if="themeStore.isDark"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>

          <!-- Moon Icon (for light mode) -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            v-if="!themeStore.isDark"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
          </svg>
        </button>

        <button
          class="group flex items-center justify-center w-24 bg-teal-500 hover:bg-teal-600 p-3 rounded-lg cursor-pointer text-white"
          type="button"
          @click="menu = !menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 group-hover:rotate-45 transition-all duration-200 ease-in-out"
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
            class="ml-2 w-4 h-4 transition-all duration-200 ease-in-out"
            :class="menu ? '-rotate-180' : ''"
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
      <Notification
        v-if="
          !isAdmin &&
          students.length > 0 &&
          todayDay > 8 &&
          students.find((stud) => !stud.attributes.Paid)
        "
        design="Erro"
        target="Família"
        title="Atraso no Pagamento"
        message="Atenção, inscrição comprometida. Sujeito a pagamento de uma nova inscrição."
      />
      <Notification
        v-if="
          !isAdmin &&
          students.length > 0 &&
          todayDay === 8 &&
          students.find((stud) => !stud.attributes.Paid)
        "
        design="Aviso"
        target="Família"
        title="Regularize o Pagamento"
        message="Atenção, lembramos que a mensalidade está em atraso. Regularize a situação até ao final do dia de hoje."
      />
    </div>
  </header>
</template>
