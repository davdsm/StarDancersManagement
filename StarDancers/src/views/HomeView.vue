<script lang="ts">
import { useUserStore } from "@/stores/user";
import Modal from "@/components/StudentsTable/ModalTable.vue";
import TableList from "@/components/StudentsTable/TableList.vue";
import PaginationTable from "@/components/PaginationTable.vue";
import {
  createStudent,
  getStudents,
  removeStudent,
  searchStudents,
  setStudent,
} from "@/services/students";

export default {
  data() {
    return {
      username: "",
      students: <any[]>[],
      loading: <any>false,
      query: "",
      showModal: <boolean>false,
      student: {},
      birtdays: <Array<any>>[],
      page: <number>1,
      pagination: <any>{},
      isAdmin: <boolean>false,
      family: <any>null,
    };
  },
  methods: {
    async pay(id: any, status: boolean, method?: string) {
      if (this.isAdmin) {
        if (status === false) this.update(id, { PaidMonths: 1 });
        this.loading = id;
        [this.students, this.pagination] = await setStudent(
          "Paid",
          status,
          id,
          this.query.length > 0,
          method
        );
        this.loading = false;
      }
    },
    async update(id: any, payload: Object) {
      const data = Object.assign({}, payload);
      this.loading = id;
      const [success, pagination] = await setStudent(
        "Profile",
        data,
        id,
        this.query.length > 0,
        ""
      );
      this.loading = false;
      if (success) {
        // this.showModal = false;
        if (this.query) {
          const _students = await searchStudents(this.query);
          this.students = _students[0];
        } else {
          this.students = success;
        }

        return 200;
      } else {
        return pagination;
      }
    },
    async delete(id: number, email: string) {
      this.loading = id;
      [this.students, this.pagination] = await removeStudent(
        id as number,
        email
      );
      this.showModal = false;
      this.loading = false;
    },
    createLocal() {
      let data = {
        id: <number>0,
        attributes: {
          Name: <string>"",
          ParentName: <string>"",
          ParentContact: <string>"",
          ParentEmail: <string>"",
          ParentNIF: <string>"",
          Class: <string>"",
          Price: <number>0,
          Observations: <string>"",
          ImageRights: <boolean>false,
          Paid: <boolean>false,
          Week: <Array<string>>[],
          BornDate: <Date>new Date(),
          StudentID: <string>"0",
        },
      };
      this.student = data;
      this.showModal = true;
    },
    async create(payload: Object) {
      const data = Object.assign({}, payload);
      const [sucess, pagination] = await createStudent(data);
      if (!sucess) {
        return pagination;
      }
      this.students = sucess;
      this.pagination = pagination;
      this.showModal = false;
      this.loading = false;
      return 200;
    },
    async handlePagination(e: any, page: number) {
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
    PaginationTable,
  },

  async beforeMount() {
    // [this.students, this.pagination] = await getStudents(this.page, false);
  },

  async mounted() {
    this.isAdmin = false;
    const userStore = useUserStore();
    await userStore.fetchUser();
    this.isAdmin = userStore.isAdmin;

    // For non-admin users, get their family information
    if (!this.isAdmin) {
      this.family = await userStore.getFamily();
      this.students = await userStore.getStudents();
    } else {
      [this.students, this.pagination] = await getStudents(this.page, false);
    }
  },
};
</script>

<template class="">
  <div
    class="flex-1 h-auto transition-all duration-300 rounded-lg mx-[20px] w-[calc(100%-40px)] md:w-4/6"
  >
    <div
      class="entry flex flex-col bg-white dark:bg-card pt-12 pb-12 rounded-lg delay"
      :class="!isAdmin && 'mb-20'"
    >
      <div class="w-full md:grid md:grid-cols-3 gap-3 px-16">
        <div class="md:col-span-2">
          <header>
            <h3
              class="text-2xl font-medium title max-sm:text-center dark:text-white"
            >
              <span v-if="isAdmin">Alunos</span>
              <span v-else>Meus Alunos</span>
            </h3>
            <p
              class="text-md pt-2 font-medium subtitle max-sm:text-center dark:text-gray-300"
            >
              <span v-if="family && !isAdmin">
                Família {{ family.attributes.Name }} -
              </span>
              Um total de
              {{
                pagination?.hasOwnProperty("total")
                  ? pagination.total
                  : students.length
              }}
              alunos. 😜
            </p>
          </header>
        </div>
        <div
          class="md:flex max-sm:pt-10 max-sm:pb-10 justify-end max-sm:justify-start md:grid md:grid-cols-2 gap-2"
          v-if="isAdmin"
        >
          <div class="max-sm:w-full">
            <button
              @click="createLocal"
              type="button"
              class="flex items-center justify-center text-white transition w-full rounded yellow cursor-pointer font-medium text-sm px-4 py-2.5 mr-2 mb-2 shrink-0 gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 shrink-0"
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
            <form class="flex items-center" @submit="(e: any) => search(e)">
              <label for="simple-search" class="sr-only">Pesquisa</label>
              <div class="relative w-full">
                <div
                  class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10 max-sm:hidden"
                >
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5 text-gray-500 dark:text-gray-400"
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
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full max-sm:pl-4 md:pl-10 p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white"
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
        :update="update"
      />
    </div>
    <PaginationTable
      v-if="isAdmin"
      :page="page"
      :pagination="pagination"
      :handlePagination="handlePagination"
    />
  </div>
  <modal
    v-if="showModal"
    :close="() => (showModal = false)"
    :update="update"
    :delete="delete"
    :create="create"
    :pay="pay"
    v-bind:student="student"
  />
</template>
