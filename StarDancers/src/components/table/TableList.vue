<script lang="ts">
export default {
  props: ["students", "query", "loading", "show", "student", "pay"],
  data() {
    return {
      local_students: JSON.parse(JSON.stringify(this.students)),
    };
  },
  watch: {
    students() {
      this.local_students = JSON.parse(JSON.stringify(this.students));
    },
  },
};
</script>

<template class="bg-slate-100">
  <div class="pt-10 md:pr-16 md:pl-16 overflow-x-auto relative sm:rounded-lg">
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
          v-for="item in local_students"
          :key="item.id"
          class="bg-white border-b hover:bg-gray-50"
        >
          <th
            scope="row"
            class="py-4 px-6 font-medium title whitespace-nowrap cursor-pointer"
            @click="() => show(item)"
          >
            {{ item.attributes.Name }}
          </th>
          <td class="py-4 px-6 py-4 px-6 font-medium title whitespace-nowrap">
            <div class="flex flex-col">
              {{ item.attributes.ParentName }}
              <span class="pt-1 text-slate-600">{{
                item.attributes.ParentContact
              }}</span>
            </div>
          </td>
          <td class="py-4 px-6 py-4 px-6 font-medium title whitespace-nowrap">
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
</template>
