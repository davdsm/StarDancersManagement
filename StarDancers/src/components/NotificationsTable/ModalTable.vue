<script lang="ts" type="text/x-template" id="table-modal">
import {
  createFamily,
  deleteFamily,
  getFamilies,
  searchFamilies,
  updateFamily,
} from "@/services/families";
import ErrorModal from "./ErrorModal.vue";
import DeletePoup from "../StudentsTable/DeletePoup.vue";
import type { Family } from "../FamiliesTable/ModalTable.vue";
import {
  createNotification,
  deleteNotification,
  updateNotification,
} from "@/services/notifications";
import { getNotifications } from "@/services/students";

export type Student = {
  id: number;
  attributes: {
    Name: string;
    [key: string]: any;
  };
};

export type Notification = {
  id: number;
  attributes: {
    Type: "Aviso" | "Erro" | "Sucesso" | "Informação";
    Name: string;
    Title: string;
    Message: string;
    Target: "Todos" | "Turma" | "Família";
    Active: boolean;
    Turma: string;
    Families: Family[];
  };
};

export default {
  props: ["close", "notification"],
  data() {
    return {
      familyList: <Family[]>[],
      local_notification: <Notification>{
        id: 0,
        attributes: {
          Type: "Informação",
          Name: "",
          Title: "",
          Message: "",
          Target: "Todos",
          Active: false,
          Turma: "",
          Families: [],
        },
      },
      deleteConfirmation: false,
      name: <string>"",
      slectedFamily: <Family[]>[],
      that: this,
      errorMsg: "",
      familyModal: false,
      searchField: "",
      openTarget: false,
      openType: false,
      openActive: false,
      openFam: false,
    };
  },
  methods: {
    async create(e: any) {
      e.preventDefault();
      this.errorMsg = "";
      let success: 200 | string = "";

      if (this.local_notification.id === 0) {
        success = await createNotification(
          this.local_notification.attributes.Type,
          this.local_notification.attributes.Title,
          this.local_notification.attributes.Message,
          this.local_notification.attributes.Target,
          this.local_notification.attributes.Active,
          this.slectedFamily.map((fam) => fam.id),
          this.local_notification.attributes.Turma
        );
      } else {
        success = await updateNotification(
          this.local_notification.id,
          this.local_notification.attributes.Type,
          this.local_notification.attributes.Title,
          this.local_notification.attributes.Message,
          this.local_notification.attributes.Target,
          this.local_notification.attributes.Active,
          this.slectedFamily.map((fam) => fam.id),
          this.local_notification.attributes.Turma
        );
      }

      this.close();
    },
    async delete() {
      await deleteNotification(this.local_notification.id);
      this.close();
    },
    async handleFamiliesSidebar() {
      if (this.familyList.length === 0) {
        const family = await getFamilies(1);
        this.familyList = family[0];
      }

      this.familyModal = !this.familyModal;
    },
    async search(e: any) {
      e.preventDefault();
      if (this.searchField === "") {
        const student = await getFamilies(1);
        this.familyList = student[0];
      } else {
        const t = await searchFamilies(this.searchField);
        this.familyList = t[0];
      }
    },
    pushFamily(fam: Family) {
      const existingIndex = this.slectedFamily.findIndex(
        (s) => s.id === fam.id
      );

      if (existingIndex !== -1) {
        this.slectedFamily.splice(existingIndex, 1);
      } else {
        this.slectedFamily.push(fam);
      }
    },
    closeDropdowns() {
      (this.openActive = false),
        (this.openFam = false),
        (this.openTarget = false),
        (this.openType = false);
    },
  },
  components: { DeletePoup, ErrorModal },
  async mounted() {
    if (this.notification.hasOwnProperty("id")) {
      this.local_notification = this.notification;
      this.name = this.notification.attributes.Title;
      this.slectedFamily = this.notification.attributes.Families.data;

      const families = await getFamilies(1);
      this.familyList = families[0];
    }
  },
};
</script>

<template>
  <div
    class="transition gap-12 z-40 w-full h-full flex justify-center items-top fixed top-0 right-0 left-0"
  >
    <div
      class="fixed w-full h-full z-40 bg-slate-400 opacity-30"
      @click="() => close()"
    ></div>
    <div
      v-if="familyModal && familyList.length > 0"
      class="mt-5 fixed md:relative md:w-1/5 max-w-2xl h-full md:z-50 -top-2 md:top-0 z-[90] w-5/6"
    >
      <div
        class="relative bg-white rounded-lg overflow-y-auto overflow-x-hidden h-4/5 dark:bg-slate-800"
      >
        <!-- Modal Header -->
        <div
          class="flex justify-between items-center p-4 rounded-t border-b dark:border-slate-700"
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Famílias
          </h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-slate-700 dark:hover:text-white"
            @click="handleFamiliesSidebar"
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
        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          <form @submit="search" action="#" method="post">
            <input
              type="search"
              v-model="searchField"
              placeholder="Procurar..."
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white"
            />
            <button type="submit" class="hidden"></button>
          </form>

          <div>
            <div
              class="relative flex flex-col rounded-xl bg-white dark:bg-slate-800"
            >
              <nav class="flex min-w-[240px] flex-col gap-1 p-2">
                <div
                  v-for="fam in familyList"
                  class="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 dark:hover:bg-slate-700 dark:focus:bg-slate-700 dark:active:bg-slate-700"
                >
                  <label
                    :for="`fam-${fam.id}`"
                    class="flex w-full cursor-pointer items-center px-3 py-2"
                  >
                    <div
                      class="inline-flex items-center"
                      @click="pushFamily(fam)"
                    >
                      <label
                        class="flex items-center cursor-pointer relative"
                        :for="`fam-${fam.id}`"
                      >
                        <input
                          type="checkbox"
                          class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                          :id="`student-${fam.id}`"
                          :checked="
                            !!slectedFamily.find((stud) => fam.id === stud.id)
                          "
                        />
                        <span
                          class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3.5 w-3.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            stroke="currentColor"
                            stroke-width="1"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </span>
                      </label>
                      <label
                        class="cursor-pointer ml-2 text-slate-600 text-sm dark:text-gray-300"
                        for="check-vertical-list-group"
                      >
                        {{ fam.attributes.Name }}
                      </label>
                    </div>
                  </label>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <button
        @click="handleFamiliesSidebar"
        type="button"
        class="border border-pink-600 mx-auto my-6 bg-pink-200 text-pink-900 px-4 py-2 rounded font-semibold text-xs flex items-center gap-2"
      >
        Importar
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
    <div
      class="mt-5 relative w-full max-w-2xl h-full md:h-fit overflow-y-auto overflow-x-hidden"
      :class="!familyModal ? 'z-50' : ''"
      v-if="local_notification"
    >
      <!-- Modal content -->
      <form
        action="#"
        @submit="(e:any) => create(e)"
        class="relative bg-white rounded-lg dark:bg-slate-800"
      >
        <!-- Modal header -->
        <div
          class="flex justify-between items-center p-4 rounded-t border-b dark:border-slate-700"
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            Editar {{ name }}
          </h3>
          <span
            v-if="errorMsg"
            class="w-1/2 text-center text-red-500 text-xs font-bold ml-auto"
            >{{ errorMsg }}</span
          >
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
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-2">
              <label
                for="notification-title"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Título</label
              >
              <input
                type="text"
                name="notification-title"
                id="notification-title"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white"
                :placeholder="local_notification.attributes.Title"
                v-model="local_notification.attributes.Title"
                required
              />
            </div>
            <div class="col-span-6 sm:col-span-4 relative">
              <label
                for="notification-title"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Quem?</label
              >
              <button
                id="dropdownTarget"
                data-dropdown-toggle="target"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 flex w-2/3 p-2.5 justify-between items-center dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                type="button"
                @click="closeDropdowns(), (openTarget = !openTarget)"
              >
                {{ local_notification.attributes.Target }}
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              <div
                id="dropdown"
                class="absolute z-10 bg-gray-50 border border-gray-300 divide-y divide-gray-100 rounded-lg w-2/3 mt-4 dark:bg-slate-700 dark:border-slate-600"
                v-if="openTarget"
              >
                <ul
                  class="py-2 text-gray-900 text-sm dark:text-white"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    <button
                      type="button"
                      class="block px-4 py-2 hover:bg-gray-100 w-full text-left dark:hover:bg-slate-600"
                      @click="
                        (local_notification.attributes.Target = 'Todos'),
                          closeDropdowns()
                      "
                      :class="
                        local_notification.attributes.Target === 'Todos'
                          ? 'font-bold'
                          : ''
                      "
                    >
                      Todos
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      class="block px-4 py-2 hover:bg-gray-100 w-full text-left dark:hover:bg-slate-600"
                      @click="
                        (local_notification.attributes.Target = 'Turma'),
                          closeDropdowns()
                      "
                      :class="
                        local_notification.attributes.Target === 'Turma'
                          ? 'font-bold'
                          : ''
                      "
                    >
                      Turma
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      class="block px-4 py-2 hover:bg-gray-100 w-full text-left dark:hover:bg-slate-600"
                      @click="
                        (local_notification.attributes.Target = 'Família'),
                          closeDropdowns()
                      "
                      :class="
                        local_notification.attributes.Target === 'Família'
                          ? 'font-bold'
                          : ''
                      "
                    >
                      Família
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="col-span-6 sm:col-span-4"
              v-if="local_notification.attributes.Target === 'Turma'"
            >
              <label
                for="notification-title"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Turma</label
              >
              <input
                type="text"
                name="notification-turma"
                id="notification-turma"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white"
                :placeholder="local_notification.attributes.Turma"
                v-model="local_notification.attributes.Turma"
                required
              />
            </div>
            <div
              class="col-span-6 sm:col-span-4 relative"
              v-if="local_notification.attributes.Target === 'Família'"
            >
              <label
                for="notification-title"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Família</label
              >
              <div class="col-span-6 sm:col-span-3 w-full flex flex-wrap gap-2">
                <button
                  type="button"
                  class="bg-teal-200 text-teal-900 px-4 py-2 rounded font-semibold text-xs flex items-center gap-2"
                  v-for="fam in slectedFamily"
                >
                  {{ fam.attributes.Name }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4"
                    @click="pushFamily(fam)"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <button
                  @click="handleFamiliesSidebar"
                  type="button"
                  class="bg-sky-200 text-sky-900 px-4 py-2 rounded font-semibold text-xs flex items-center gap-2"
                >
                  Importar Famílias
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="col-span-6 sm:col-span-3 relative">
              <label
                for="notification-title"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Tipo de Notificação</label
              >
              <button
                id="dropdownTarget"
                data-dropdown-toggle="target"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 flex w-full p-2.5 justify-between items-center dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                type="button"
                @click="closeDropdowns(), (openType = !openType)"
              >
                {{ local_notification.attributes.Type }}
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div
                id="dropdown"
                class="absolute z-10 bg-gray-50 border border-gray-300 divide-y divide-gray-100 rounded-lg w-full mt-4 dark:bg-slate-700 dark:border-slate-600"
                v-if="openType"
              >
                <ul
                  class="py-2 text-gray-900 text-sm dark:text-white"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    <button
                      type="button"
                      class="block px-4 py-2 hover:bg-gray-100 w-full text-left dark:hover:bg-slate-600"
                      @click="
                        (local_notification.attributes.Type = 'Aviso'),
                          closeDropdowns()
                      "
                      :class="
                        local_notification.attributes.Type === 'Aviso'
                          ? 'font-bold'
                          : ''
                      "
                    >
                      Aviso
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      class="block px-4 py-2 hover:bg-gray-100 w-full text-left dark:hover:bg-slate-600"
                      @click="
                        (local_notification.attributes.Type = 'Erro'),
                          closeDropdowns()
                      "
                      :class="
                        local_notification.attributes.Type === 'Erro'
                          ? 'font-bold'
                          : ''
                      "
                    >
                      Erro
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      class="block px-4 py-2 hover:bg-gray-100 w-full text-left dark:hover:bg-slate-600"
                      @click="
                        (local_notification.attributes.Type = 'Sucesso'),
                          closeDropdowns()
                      "
                      :class="
                        local_notification.attributes.Type === 'Sucesso'
                          ? 'font-bold'
                          : ''
                      "
                    >
                      Sucesso
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      class="block px-4 py-2 hover:bg-gray-100 w-full text-left dark:hover:bg-slate-600"
                      @click="
                        (local_notification.attributes.Type = 'Informação'),
                          closeDropdowns()
                      "
                      :class="
                        local_notification.attributes.Type === 'Informação'
                          ? 'font-bold'
                          : ''
                      "
                    >
                      Informação
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-span-6 sm:col-span-2">
              <label
                for="notification-title"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Estado</label
              >
              <button
                id="dropdownTarget"
                data-dropdown-toggle="target"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 flex w-5/6 p-2.5 justify-between items-center dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                type="button"
                @click="closeDropdowns(), (openActive = !openActive)"
              >
                {{
                  local_notification.attributes.Active ? "Ligado" : "Desligado"
                }}
                <svg
                  class="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div
                id="dropdown"
                class="absolute z-10 bg-gray-50 border border-gray-300 divide-y divide-gray-100 rounded-lg w-full mt-4 dark:bg-slate-700 dark:border-slate-600"
                v-if="openActive"
              >
                <ul
                  class="py-2 text-gray-900 text-sm dark:text-white"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    <button
                      type="button"
                      class="block px-4 py-2 hover:bg-gray-100 w-full text-left dark:hover:bg-slate-600"
                      @click="
                        (local_notification.attributes.Active = true),
                          closeDropdowns()
                      "
                      :class="
                        local_notification.attributes.Active ? 'font-bold' : ''
                      "
                    >
                      Ligado
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      class="block px-4 py-2 hover:bg-gray-100 w-full text-left dark:hover:bg-slate-600"
                      @click="
                        (local_notification.attributes.Active = false),
                          closeDropdowns()
                      "
                      :class="
                        !local_notification.attributes.Active ? 'font-bold' : ''
                      "
                    >
                      Desligado
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-span-6 sm:col-span-6">
              <label
                for="notification-title"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Mensagem</label
              >
              <textarea
                v-model="local_notification.attributes.Message"
                rows="7"
                :placeholder="local_notification.attributes.Message"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 flex w-5/6 p-2.5 justify-between items-center dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white"
              ></textarea>
            </div>
          </div>

          <div class="flex flex-col gap-2"></div>
        </div>

        <!-- Modal footer -->
        <div
          class="flex items-center justify-between p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-slate-700"
        >
          <button
            type="submit"
            v-if="local_notification.id === 0"
            class="text-white bg-pink-600 hover:bg-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Criar {{ name }}
          </button>
          <button
            type="submit"
            v-if="local_notification.id !== 0"
            class="text-white bg-pink-600 hover:bg-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Atualizar {{ name }}
          </button>
          <button
            type="button"
            v-if="name"
            @click="() => (deleteConfirmation = true)"
            class="flex items-center text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
  <DeletePoup
    v-if="deleteConfirmation"
    :name="local_notification.attributes.Name"
    :no="() => (deleteConfirmation = false)"
    :yes="() => that.delete(notification.id)"
  />
</template>
