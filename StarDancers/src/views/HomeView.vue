<script lang="ts">
import { getCookie, getStudents, setStudent } from "../redux/calls.d";
import Modal from "../components/table/ModalTable.vue";

export default {
  data() {
    return {
      username: "",
      students: [],
      loading: false,
      query: "",
      showModal: false,
      student: {},
    };
  },
  methods: {
    async pay(id: any, status: Boolean) {
      this.loading = id;
      const students = await setStudent("Paid", status, id);
      this.students = students;
      this.loading = false;
    },
  },
  components: {
    Modal,
  },
  computed: {
    filterStudents() {
      return this.students.filter(
        (item: any) =>
          item.attributes.Name.toLowerCase().includes(
            this.query.toLowerCase()
          ) ||
          item.attributes.ParentName.toLowerCase().includes(
            this.query.toLowerCase()
          ) ||
          item.attributes.ParentContact.toLowerCase().includes(
            this.query.toLowerCase()
          ) ||
          item.attributes.Class.toLowerCase().includes(this.query.toLowerCase())
      );
    },
  },

  async beforeMount() {
    const user = await getCookie("user");
    if (!user) {
      this.$router.push("/login");
    } else {
      this.username = user;
    }
    this.students = await getStudents();
  },
};
</script>

<template class="bg-slate-100">
  <main class="container mx-auto">
    <header class="entry pt-20 pb-20 w-full md:grid md:grid-cols-2 gap-2">
      <div class="max-sm:pl-10 max-sm:w-full">
        <h1 class="text-2xl">Olá {{ username }} 👋</h1>
      </div>
      <div class="flex justify-end w-auto max-sm:hidden title">
        <div class="yellow p-3 rounded-lg cursor-pointer">
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
        </div>
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
              Um total de {{ students.length }} alunos. 😜
            </p>
          </header>
        </div>
        <div
          class="md:flex max-sm:pt-10 max-sm:pb-10 justify-end max-sm:justify-start md:grid md:grid-cols-2 gap-2"
        >
          <div class="max-sm:w-full">
            <button
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
            <form class="flex items-center" @submit="(e) => e.preventDefault()">
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
                  type="text"
                  id="simple-search"
                  v-model="query"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full max-sm:pl-4 md:pl-10 p-2.5"
                  placeholder="Search"
                  required
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        class="pt-10 md:pr-16 md:pl-16 overflow-x-auto relative sm:rounded-lg"
      >
        <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="w-40 py-3 px-6 font-medium">Alun@</th>
              <th scope="col" class="w-40 py-3 px-6">Responsável</th>
              <th scope="col" class="w-20 py-3 px-6">Valor</th>
              <th scope="col" class="w-60 py-3 px-6">Turma</th>
              <th scope="col" class="w-40 py-3 px-6">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filterStudents"
              :key="item.id"
              class="bg-white border-b hover:bg-gray-50"
            >
              <th
                scope="row"
                class="py-4 px-6 font-medium title whitespace-nowrap cursor-pointer"
                @click="(showModal = true), (student = item)"
              >
                {{ item.attributes.Name }}
              </th>
              <td
                class="py-4 px-6 py-4 px-6 font-medium title whitespace-nowrap"
              >
                <div class="flex flex-col">
                  {{ item.attributes.ParentName }}
                  <span class="pt-1 text-slate-600">{{
                    item.attributes.ParentContact
                  }}</span>
                </div>
              </td>
              <td
                class="py-4 px-6 py-4 px-6 font-medium title whitespace-nowrap"
              >
                <div class="flex flex-col">
                  {{ item.attributes.Price }}€
                  <span class="pt-1 text-slate-600">Mensal</span>
                </div>
              </td>
              <td class="py-4 px-6">
                {{ item.attributes.Class }}
              </td>
              <td class="py-4 px-6 flex justify-start">
                <span
                  v-if="this.loading !== item.id && item.attributes.Paid"
                  @click="pay(item.id, !item.attributes.Paid)"
                  class="cursor-pointer bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900"
                  >Pago</span
                >
                <span
                  v-if="this.loading !== item.id && !item.attributes.Paid"
                  @click="pay(item.id, !item.attributes.Paid)"
                  class="cursor-pointer bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900"
                  >Não Pago</span
                >
                <span v-if="this.loading === item.id">
                  <svg
                    class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <modal
      v-if="showModal"
      :close="() => (showModal = false)"
      v-bind:student="student"
    />
  </main>
</template>
