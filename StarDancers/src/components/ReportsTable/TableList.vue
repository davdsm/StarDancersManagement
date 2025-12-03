<script lang="ts">
export default {
  props: ["reports", "query", "loading"],
  data() {
    return {
      local_reports: this.reports,
    };
  },
  watch: {
    notifications() {
      this.local_reports = this.reports;
    },
  },
};
</script>

<template class="bg-slate-100 dark:bg-transparent">
  <div class="pt-10 md:pr-16 md:pl-16 overflow-x-auto relative sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-white">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#161e32] dark:text-white"
      >
        <tr>
          <th scope="col" class="w-40 py-3 px-6 font-medium">Nome</th>
          <th scope="col" class="w-40 py-3 px-6">Ficheiro</th>
          <th scope="col" class="w-20 py-3 px-6">Gerir</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in local_reports"
          :key="item.id"
          class="bg-white border-b hover:bg-gray-50 dark:bg-[#161e32] dark:border-slate-700 dark:hover:bg-slate-700"
        >
          <th
            scope="row"
            class="py-4 px-6 font-medium title whitespace-nowrap dark:text-white"
          >
            {{ item.attributes.Name }}
          </th>
          <td
            class="py-4 px-6 py-4 px-6 font-medium title whitespace-nowrap dark:text-white"
          >
            <div class="flex flex-col">
              <a
                target="_blank"
                :href="item.attributes.File"
                class="cursor-pointer"
                >Ver Relatório</a
              >
            </div>
          </td>

          <td class="py-4 px-6 flex justify-start dark:text-white">
            <button>
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
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
