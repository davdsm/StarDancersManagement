<script lang="ts">
import qs from "qs";

import { useUserStore } from "@/stores/user";
import TableList from "@/components/ReportsTable/TableList.vue";
import { getReports } from "@/services/reports";

export default {
  data() {
    return {
      reports: [],
      loading: <any>false,
      query: "",
      showModal: <Boolean>false,
      report: {},
      isAdmin: <Boolean>false,
      pagination: <any>{},
      page: <number>1,
      searchTerm: "",
    };
  },
  methods: {
    async get() {
      return ([this.reports, this.pagination] = await getReports(
        this.page,
        this.query
      ));
    },
    async search(e: any, reset?: boolean) {
      if (reset) {
        this.searchTerm = "";
      }
      e.preventDefault();

      if (!this.searchTerm || this.searchTerm.trim() === "") {
        // If search is empty, clear the filter
        this.query = "";
      } else {
        // Create filter for family name using Strapi's $containsi (case-insensitive contains)
        const filter = qs.stringify(
          {
            filters: {
              Name: {
                $containsi: this.searchTerm.trim(),
              },
            },
          },
          { encodeValuesOnly: true }
        );

        // Add & prefix to append to the existing query
        this.query = `&${filter}`;
      }

      // Reset to first page when searching
      this.page = 1;

      // Execute the search using existing getFamilies function
      return await this.get();
    },
  },
  components: { TableList },

  async beforeMount() {
    [this.reports, this.pagination] = await this.get();
  },

  async mounted() {
    const userStore = useUserStore();
    await userStore.fetchUser();
    this.isAdmin = userStore.isAdmin;

    console.log('->...', this.reports);
    
  },
};
</script>

<template class="bg-slate-100">
  <div
    class="flex-1 h-auto transition-all duration-300 rounded-lg mx-[20px] w-[calc(100%-40px)] md:w-4/6 mb-20"
  >
    <div
      class="entry flex flex-col bg-white pt-12 pb-12 shadow-davdsm rounded-lg delay"
    >
      <div class="w-full md:grid md:grid-cols-3 gap-3 px-16">
        <div class="md:col-span-2">
          <header>
            <h3 class="text-2xl font-medium title max-sm:text-center">
              Relatórios
            </h3>
            <p class="text-md pt-2 font-medium subtitle max-sm:text-center">
              Um total de {{ pagination.total }} relatórios. 📁
            </p>
          </header>
        </div>
        <div
          class="md:flex max-sm:pt-10 max-sm:pb-10 justify-end max-sm:justify-start md:grid md:grid-cols-2 gap-2"
        >
          <div class="max-sm:w-full">
            <form class="flex items-center" @submit="search">
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
                  v-model="searchTerm"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-full max-sm:pl-4 md:pl-10 p-2.5"
                  placeholder="Search"
                />
              </div>
              <button type="submit" class="hidden">Submit</button>
              <button
                type="reset"
                class="ml-3"
                v-if="searchTerm"
                @click="(e:any) => search(e, true)"
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
        v-if="reports.length > 0"
        :reports="reports"
        :loading="loading"
      />
    </div>
  </div>
</template>
