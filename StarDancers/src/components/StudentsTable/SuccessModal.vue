<script lang="ts">
export default {
  props: ["close", "msg"],
};
</script>

<template>
  <div
    class="z-50 w-full h-full flex justify-center items-center fixed top-0 right-0 left-0"
  >
    <div
      class="fixed w-full h-full z-50 bg-slate-400 opacity-30"
      @click="() => close()"
    ></div>
    <div class="relative w-full max-w-md bg-white rounded-lg shadow z-50 p-6">
      <div class="flex flex-col items-center justify-center gap-4">
        <!-- Success Icon -->
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-10 h-10 text-green-600"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <!-- Success Message -->
        <h3 class="text-xl font-semibold text-gray-900 text-center">
          {{ msg }}
        </h3>

        <!-- Close Button -->
        <button
          type="button"
          @click="() => close()"
          class="mt-2 text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-8 py-2.5 text-center"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>
