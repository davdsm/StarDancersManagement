<script lang="ts" type="text/x-template" id="table-modal">
export default {
  props: ["close", "msg"],
};
</script>
<template>
  <transition>
    <div
      id="popup-modal"
      tabindex="-1"
      class="z-40 overflow-y-auto overflow-x-hidden fixed top-0 h-full flex justify-center items-center p-4 md:inset-0 h-modal md:h-full"
    >
      <div
        class="fixed w-full h-full z-40 bg-slate-400 opacity-30"
        @click="() => close()"
      ></div>
      <div class="relative w-full max-w-md md:h-auto z-50 x">
        <div class="relative bg-white rounded-lg shadow">
          <button
            @click="() => close()"
            type="button"
            class="pointer absolute z-40 top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            data-modal-toggle="popup-modal"
          >
            <svg
              aria-hidden="true"
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
            <span class="sr-only">Fechar</span>
          </button>
          <div class="p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <h3
              class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"
            >
              {{ msg }}
            </h3>
            <button
              data-modal-toggle="popup-modal"
              type="button"
              @click="close"
              class="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            >
              Ok, continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
