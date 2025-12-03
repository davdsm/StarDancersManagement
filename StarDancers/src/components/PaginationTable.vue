<script lang="ts">
export default {
  props: ["page", "pagination", "handlePagination"],
};
</script>

<template>
  <div class="flex flex-col items-center max-w-full">
    <!-- Help text -->
    <span class="mt-10 text-sm text-gray-700 mb-4 dark:text-gray-300">
      A mostrar
      <span class="font-semibold text-gray-900 dark:text-white">{{
        pagination.pageSize
      }}</span>
      de
      <span class="font-semibold text-gray-900 dark:text-white">{{
        pagination.total
      }}</span>
      Resultados
    </span>

    <nav class="mb-10">
      <ul class="inline-flex items-center -space-x-px">
        <li>
          <a
            v-if="page > 1"
            @click="(e: any) => handlePagination(e, page - 1)"
            href=""
            class="block px-3 py-2 ml-0 leading-tight"
          >
            <span class="sr-only">Previous</span>
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>
        </li>
        <li v-for="i in pagination.pageCount" :key="i">
          <a
            v-if="page === i"
            class="px-3 py-2 leading-tight text-black font-bold dark:text-white"
            >{{ i }}</a
          >
          <a
            v-if="page !== i"
            href=""
            @click="(e:any) => handlePagination(e, i)"
            class="px-3 py-2 leading-tight hover:text-gray-400 dark:text-gray-400 dark:hover:text-white"
            >{{ i }}</a
          >
        </li>
        <li>
          <a
            v-if="page !== pagination.pageCount"
            @click="(e:any) => handlePagination(e, page + 1)"
            href=""
            class="block px-3 py-2 leading-tight text-gray-500 dark:text-gray-400"
          >
            <span class="sr-only">Next</span>
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
