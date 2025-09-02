<script lang="ts" type="text/x-template" id="table-modal">
import { ref } from "vue";
import { createFamily, deleteFamily, updateFamily } from "@/services/families";
import ErrorModal from "./ErrorModal.vue";
import DeletePoup from "../StudentsTable/DeletePoup.vue";
import { getStudents, searchStudents } from "@/services/students";

export type Student = {
  id: number;
  attributes: {
    Name: string;
    [key: string]: any;
  };
};

export type Family = {
  id: number;
  attributes: {
    Name: string;
    Email: string;
    Students: { data: Student[] };
    Password: string;
  };
};

export default {
  props: ["close", "family"],
  data() {
    return {
      studentList: [] as Student[],
      local_family: {
        id: 0,
        attributes: {
          Name: "",
          Email: "",
          Students: { data: [] as Student[] },
          Password: "",
          RepeatPassword: "",
        },
      } as Family,
      deleteConfirmation: false,
      name: "",
      email: "",
      students: [] as Student[],
      password: "",
      repeatPassword: "",
      that: this,
      errorMsg: "",
      showPassword: false,
      ShowRepeatPassword: false,
      studentsModal: false,
      searchField: "",
    };
  },
  methods: {
    async create(e: any) {
      e.preventDefault();
      this.errorMsg = "";
      let success: 200 | string = "";
      if (this.password !== this.repeatPassword) {
        this.errorMsg = "As passwords inseridas não são iguais.";
        return;
      }

      if (this.local_family.id === 0) {
        success = await createFamily(
          this.name,
          this.email,
          this.students.map((s) => s.id),
          this.password
        );
        this.close();
      } else {
        if (this.password.length > 0 && this.password.length <= 6) {
          this.errorMsg = "As password precisam de conter no mínimo 6 digitos.";
          return;
        }

        success = await updateFamily(
          this.family.id,
          this.name,
          this.email,
          this.students.map((s) => s.id),
          this.password
        );
        this.close();
      }
    },
    async delete() {
      await deleteFamily(this.family.id, this.email);
      this.close();
    },
    async deleteLocalStudent(id: number) {
      this.students = this.students.filter((s) => s.id === id);
    },
    async handleStudentsSidebar() {
      if (this.studentList.length === 0) {
        const student = await getStudents(1, false);
        this.studentList = student[0];
      }

      this.studentsModal = !this.studentsModal;
    },
    async search(e: any) {
      e.preventDefault();
      if (this.searchField === "") {
        const student = await getStudents(1, false);
        this.studentList = student[0];
      } else {
        const t = await searchStudents(this.searchField);
        this.studentList = t[0];
      }
    },
    pushStudent(student: Student) {
      // Check if student is already in the array
      const existingIndex = this.students.findIndex((s) => s.id === student.id);

      if (existingIndex !== -1) {
        // Student exists, remove them from the array
        this.students.splice(existingIndex, 1);
      } else {
        // Student doesn't exist, add them to the array
        this.students.push(student);
      }
    },
  },
  components: { DeletePoup, ErrorModal },
  mounted() {
    if (this.family.hasOwnProperty("id")) {
      this.local_family = this.family;
      this.name = this.family.attributes.Name;
      this.email = this.family.attributes.Email;
      this.students = this.family.attributes.Students.data;
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
      v-if="studentsModal"
      class="mt-5 fixed md:relative md:w-1/5 max-w-2xl h-full md:z-50 -top-2 md:top-0 z-[90] w-5/6"
    >
      <div
        class="relative bg-white rounded-lg shadow overflow-y-auto overflow-x-hidden h-4/5"
      >
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-4 rounded-t border-b">
          <h3 class="text-xl font-semibold text-gray-900">Alunos</h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center"
            @click="handleStudentsSidebar"
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
              class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
            />
            <button type="submit" class="hidden"></button>
          </form>

          <div>
            <div class="relative flex flex-col rounded-xl bg-white shadow">
              <nav class="flex min-w-[240px] flex-col gap-1 p-2">
                <div
                  v-for="student in studentList"
                  class="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                >
                  <label
                    :for="`student-${student.id}`"
                    class="flex w-full cursor-pointer items-center px-3 py-2"
                  >
                    <div
                      class="inline-flex items-center"
                      @click="pushStudent(student)"
                    >
                      <label
                        class="flex items-center cursor-pointer relative"
                        :for="`student-${student.id}`"
                      >
                        <input
                          type="checkbox"
                          class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                          :id="`student-${student.id}`"
                          :checked="
                            !!students.find((stud) => student.id === stud.id)
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
                        class="cursor-pointer ml-2 text-slate-600 text-sm"
                        for="check-vertical-list-group"
                      >
                        {{ student.attributes.Name }}
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
        @click="handleStudentsSidebar"
        type="button"
        class="border border-teal-600 mx-auto my-6 bg-teal-200 text-teal-900 px-4 py-2 rounded font-semibold text-xs flex items-center gap-2"
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
      :class="!studentsModal ? 'z-50' : ''"
    >
      <!-- Modal content -->
      <form
        action="#"
        @submit="(e:any) => create(e)"
        class="relative bg-white rounded-lg shadow"
      >
        <!-- Modal header -->
        <div class="flex justify-between items-center p-4 rounded-t border-b">
          <h3 class="text-xl font-semibold text-gray-900">Editar {{ name }}</h3>
          <span
            v-if="errorMsg"
            class="w-1/2 text-center text-red-500 text-xs font-bold ml-auto"
            >{{ errorMsg }}</span
          >
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center"
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
                for="family-name"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Nome Família</label
              >
              <input
                type="text"
                name="family-name"
                id="family-name"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="name"
                v-model="name"
                required
              />
            </div>
            <div class="col-span-6 sm:col-span-4">
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Email Responsável</label
              >
              <input
                type="email"
                name="email"
                id="email"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="email"
                v-model="email"
                required
              />
            </div>
          </div>
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-3">
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Password</label
              >
              <input
                :type="showPassword ? 'text' : 'password'"
                name="password"
                id="password"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Password"
                v-model="password"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 absolute top-10 right-3 cursor-pointer"
                @click="showPassword = !showPassword"
                v-if="!showPassword"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 absolute top-10 right-3 cursor-pointer"
                @click="showPassword = !showPassword"
                v-if="showPassword"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="repeat-password"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Repetir Password</label
              >
              <input
                :type="ShowRepeatPassword ? 'text' : 'password'"
                name="repeat-word"
                id="repeat-password"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                placeholder="Password"
                v-model="repeatPassword"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 absolute top-10 right-3 cursor-pointer"
                @click="ShowRepeatPassword = !ShowRepeatPassword"
                v-if="!ShowRepeatPassword"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 absolute top-10 right-3 cursor-pointer"
                @click="ShowRepeatPassword = !ShowRepeatPassword"
                v-if="ShowRepeatPassword"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
          </div>
          <div
            class="flex flex-col gap-2"
            v-if="family.id !== 0 && local_family.attributes"
          >
            <label
              for="students"
              class="flex mb-2 text-sm font-medium text-neutral-700 w-full gap-2"
              ><svg
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
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>

              Alunos associados a esta família.</label
            >
            <div
              nam="students"
              class="col-span-6 sm:col-span-3 w-full flex flex-wrap gap-2"
            >
              <button
                type="button"
                class="bg-teal-200 text-teal-900 px-4 py-2 rounded font-semibold text-xs flex items-center gap-2"
                v-for="student in students"
              >
                {{ student.attributes.Name }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4"
                  @click="pushStudent(student)"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <button
                @click="handleStudentsSidebar"
                type="button"
                class="bg-sky-200 text-sky-900 px-4 py-2 rounded font-semibold text-xs flex items-center gap-2"
              >
                Importar Alunos
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
        </div>
        <!-- Modal footer -->
        <div
          class="flex items-center justify-between p-6 space-x-2 rounded-b border-t border-gray-200"
        >
          <button
            type="submit"
            v-if="local_family.id === 0"
            class="text-white bg-teal-700 hover:bg-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Criar {{ name }}
          </button>
          <button
            type="submit"
            v-if="local_family.id !== 0"
            class="text-white bg-teal-700 hover:bg-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
    :name="name"
    :no="() => (deleteConfirmation = false)"
    :yes="() => that.delete(family.id)"
  />
</template>
