<script lang="ts">
import {
  getCookie,
  getStudents,
  removeStudent,
  setStudent,
  createStudent,
  updatePassword,
  removeCookie,
  searchStudents,
} from "../redux/calls.d";
import Modal from "../components/table/ModalTable.vue";
import TableList from "@/components/table/TableList.vue";
import PasswordModal from "@/components/login/PasswordModal.vue";
import DropdownMenu from "@/components/DropdownMenu.vue";
import PaginationTable from "@/components/PaginationTable.vue";

export default {
  data() {
    return {
      username: "",
      students: [],
      loading: <any>false,
      query: "",
      showModal: <Boolean>false,
      menu: <Boolean>false,
      password: <Boolean>false,
      student: {},
      page: <Number>1,
      pagination: <any>{},
    };
  },
  methods: {
    async pay(id: any, status: Boolean) {
      this.loading = id;
      [this.students, this.pagination] = await setStudent(
        "Paid",
        status,
        id,
        this.query.length > 0
      );
      this.loading = false;
    },
    async update(id: any, payload: Object) {
      this.showModal = false;
      const data = Object.assign({}, payload);
      this.loading = id;
      [this.students, this.pagination] = await setStudent("Profile", data, id);
      this.loading = false;
    },
    async delete(id: Number) {
      this.loading = id;
      [this.students, this.pagination] = await removeStudent(id);
      this.showModal = false;
      this.loading = false;
    },
    createLocal() {
      let data = {
        id: 0,
        attributes: {
          Name: "",
          ParentName: "",
          ParentContact: "",
          ParentEmail: "",
          ParentNIF: "",
          Class: "",
          Price: 0,
          Observations: "",
          ImageRights: false,
          Paid: false,
          Week: [],
        },
      };
      this.student = data;
      this.showModal = true;
    },
    async create(payload: Object) {
      const data = Object.assign({}, payload);
      [this.students, this.pagination] = await createStudent(data);
      this.showModal = false;
      this.loading = false;
    },
    async putPassword(password: String) {
      await updatePassword(password);
      this.password = false;
    },
    async logout() {
      await removeCookie("user");
      this.$router.push("/login");
    },
    async handlePagination(e: any, page: Number) {
      e.preventDefault();
      this.page = page;
      [this.students, this.pagination] = await getStudents(
        this.page,
        this.query.length > 0
      );
    },
    async search(e: any) {
      e.preventDefault();
      [this.students, this.pagination] = await searchStudents(this.query);
    },
    async clearSearch() {
      this.page = 1;
      this.query = "";
      [this.students, this.pagination] = await getStudents(this.page, false);
    },
  },
  components: {
    Modal,
    TableList,
    PasswordModal,
    DropdownMenu,
    PaginationTable,
  },

  async beforeMount() {
    const user = await getCookie("user");
    if (!user) {
      this.$router.push("/login");
    } else {
      this.username = user;
    }
    [this.students, this.pagination] = await getStudents(this.page, false);
  },
};
</script>

<template class="bg-slate-100">
  <PasswordModal
    v-if="password"
    :close="() => (password = false)"
    :putPassword="putPassword"
  />
  <main class="container mx-auto sm:pl-20 sm:pr-20">
    <header class="flex justify-between entry pt-20 pb-20 w-full z-20">
      <div class="max-sm:pl-10 max-sm:w-full">
        <h1 class="text-2xl">Olá {{ username }} 👋</h1>
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
    </header>
    <div
      class="entry w-full flex flex-col bg-white pt-12 pb-12 shadow-davdsm rounded-lg delay"
    >
      <div class="w-full md:grid md:grid-cols-3 gap-3 pr-16 pl-16">
        <div class="md:col-span-2">
          <header>
            <h3 class="text-2xl font-medium title max-sm:text-center">
              Alunos
            </h3>
            <p class="text-md pt-2 font-medium subtitle max-sm:text-center">
              Um total de {{ pagination.total }} alunos. 😜
            </p>
          </header>
        </div>
        <div
          class="md:flex max-sm:pt-10 max-sm:pb-10 justify-end max-sm:justify-start md:grid md:grid-cols-2 gap-2"
        >
          <div class="max-sm:w-full">
            <button
              @click="createLocal"
              type="button"
              class="flex items-center justify-left text-white transition w-full rounded yellow px-6 py-3 cursor-pointer font-medium text-sm px-5 py-2.5 mr-2 mb-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 mr-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              Adicionar
            </button>
          </div>
          <div class="max-sm:w-full">
            <form class="flex items-center" @submit="(e) => search(e)">
              <label for="simple-search" class="sr-only">Pesquisa</label>
              <div class="relative w-full">
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10 max-sm:hidden"
                >
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="search"
                  id="simple-search"
                  v-model="query"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full max-sm:pl-4 md:pl-10 p-2.5"
                  placeholder="Search"
                />
              </div>
              <button type="submit" class="hidden">Submit</button>
              <button
                type="reset"
                class="ml-3"
                v-if="query"
                @click="clearSearch"
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
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
      <TableList
        v-if="students.length > 0"
        :students="students"
        :loading="loading"
        :show="(item: any) => ((student = item), (showModal = true))"
        :student="student"
        :pay="pay"
      />
    </div>
    <PaginationTable
      :page="page"
      :pagination="pagination"
      :handlePagination="handlePagination"
    />
    <modal
      v-if="showModal"
      :close="() => (showModal = false)"
      :update="update"
      :delete="delete"
      :create="create"
      v-bind:student="student"
    />
  </main>
</template>
