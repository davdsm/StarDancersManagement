<script lang="ts">
import { useUserStore } from "@/stores/user";

export default {
  props: ["students", "query", "loading", "show", "student", "pay", "update"],
  data() {
    return {
      local_students: JSON.parse(JSON.stringify(this.students)),
      isAdmin: false,
      activePaymentSelector: <null | number>null,
      showMonths: <boolean>false,
      monthsNumber: <number>1,
    };
  },
  watch: {
    students() {
      this.local_students = JSON.parse(JSON.stringify(this.students));
    },
  },
  methods: {
    togglePaymentSelector(itemId: number) {
      this.pay(itemId, true);
      this.monthsNumber = 1;
      this.activePaymentSelector =
        this.activePaymentSelector === itemId ? null : itemId;
    },
    selectPaymentMethod(itemId: number, method: string) {
      this.pay(itemId, true, method);
      this.cancelPaymentSelection();
    },
    payMonths(itemId: number, delayedPayments: number) {
      if (this.monthsNumber >= delayedPayments) {
        this.update(itemId, {
          DelayedPayments: 0,
          PaidMonths: this.monthsNumber - delayedPayments,
        });
      } else if (this.monthsNumber <= delayedPayments) {
        this.update(itemId, {
          DelayedPayments: delayedPayments - this.monthsNumber,
          PaidMonths: 0,
        });
      } else {
        this.update(itemId, { PaidMonths: this.monthsNumber });
      }
      this.showMonths = false;
    },
    cancelPaymentSelection() {
      this.activePaymentSelector = null;
      this.monthsNumber = 1;
      this.showMonths = false;
    },
  },
  mounted() {
    const user = useUserStore();
    this.isAdmin = user.isAdmin;
  },
};
</script>

<template class="bg-slate-100 dark:bg-transparent">
  <div class="pt-10 md:px-4 overflow-x-auto relative sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-white">
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#161e32] dark:text-white"
      >
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
          class="bg-white border-b hover:bg-gray-50 relative dark:bg-[#161e32] dark:border-slate-700 dark:hover:bg-slate-700"
        >
          <td
            scope="row"
            class="py-4 px-6 font-medium title whitespace-nowrap cursor-pointer dark:text-white"
            @click="() => show(item)"
          >
            <div class="flex justify-left items-center gap-2">
              <div
                v-if="Number(item.attributes.DelayedPayments) > 0"
                class="group p-2 bg-amber-400 rounded text-white relative flex justify-center items-center"
              >
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
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
                <span
                  class="group-hover:block hidden absolute -top-10 -left-2 bg-slate-800 p-2 text-white rounded"
                  >Atraso de Meses:
                  {{ Number(item.attributes.DelayedPayments) }}</span
                >
              </div>
              {{ item.attributes.Name }}
            </div>
          </td>
          <td
            class="py-4 px-6 py-4 px-6 font-medium title whitespace-nowrap dark:text-white"
          >
            <div class="flex flex-col">
              {{ item.attributes.ParentName }}
              <span class="pt-1 text-slate-600 dark:text-gray-400">{{
                item.attributes.ParentContact
              }}</span>
            </div>
          </td>
          <td
            class="py-4 px-6 py-4 px-6 font-medium title whitespace-nowrap dark:text-white"
          >
            <div class="flex flex-col relative">
              {{ item.attributes.Price }}€
              <span class="pt-1 text-slate-600 dark:text-gray-400">Mensal</span>
            </div>
          </td>
          <td class="py-4 px-6 dark:text-white">
            {{ item.attributes.Class }}
          </td>
          <td
            class="py-4 px-6 flex justify-start items-center static"
            :class="[
              activePaymentSelector === item.id
                ? `before:content-[''] before:absolute before:left-0 before:w-full before:h-full before:bg-black/20 before:top-0`
                : '',
              isAdmin
                ? 'cursor-pointer'
                : 'pointer-events-none cursor-not-allowed',
            ]"
          >
            <span
              v-if="loading !== item.id && item.attributes.Paid"
              @click="
                pay(item.id, !item.attributes.Paid) && cancelPaymentSelection()
              "
              class="flex items-center bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900 shrink-0"
              >Pago
              <span
                v-if="item.attributes.PaidMonths > 1"
                class="text-xs bg-green-400 font-bold text-white rounded-full w-5 h-5 flex items-center justify-center ml-2"
                >x{{ item.attributes.PaidMonths }}</span
              >
            </span>
            <span v-if="loading === item.id">
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
            <span
              v-if="loading !== item.id && !item.attributes.Paid"
              @click="togglePaymentSelector(item.id)"
              class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900"
              :class="isAdmin ? 'cursor-pointer' : 'cursor-not-allowed'"
              >Não Pago</span
            >
            <img
              v-if="item.attributes.PaymentMethod === 'MBWay'"
              src="../../assets/paymentMethods/mbway.png"
              class="w-4 h-8 object-contain aspect-square"
            />
            <img
              v-if="item.attributes.PaymentMethod === 'Multibanco'"
              src="../../assets/paymentMethods/multibanco.png"
              class="w-4 h-8 object-contain aspect-square"
            />
            <svg
              v-if="item.attributes.PaymentMethod === 'Money'"
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
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
            <svg
              v-if="item.attributes.PaymentMethod === 'Transfer'"
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
                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
              />
            </svg>

            <ul
              class="absolute flex flex-row flex-no-wrap gap-4 items-center left-1/2 -translate-x-1/2 p-4 bg-white rounded top-2 justify-center"
              v-if="activePaymentSelector === item.id && isAdmin"
            >
              <li class="shrink-0">
                <button @click="selectPaymentMethod(item.id, 'MBWay')">
                  <img
                    src="../../assets/paymentMethods/mbway.png"
                    class="shrink-0 w-6 h-6 aspect-square object-contain"
                  />
                </button>
              </li>
              <li class="shrink-0">
                <button @click="selectPaymentMethod(item.id, 'Multibanco')">
                  <img
                    src="../../assets/paymentMethods/multibanco.png"
                    class="shrink-0 w-6 h-6 aspect-square object-contain"
                  />
                </button>
              </li>
              <li class="shrink-0">
                <button @click="selectPaymentMethod(item.id, 'Money')">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                    />
                  </svg>
                </button>
              </li>

              <li class="shrink-0">
                <button @click="selectPaymentMethod(item.id, 'Transfer')">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                    />
                  </svg>
                </button>
              </li>

              <li class="shrink-0 relative">
                <button @click="() => (showMonths = true)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
                    />
                  </svg>
                </button>
                <span
                  v-if="monthsNumber > 1"
                  class="absolute text-xs bg-teal-400 text-white rounded-full p-[2px] -top-2 -right-3"
                  >x{{ monthsNumber }}</span
                >
              </li>

              <li v-if="showMonths" class="shrink-0 flex items-center gap-4">
                <input
                  type="number"
                  placeholder="1"
                  v-model="monthsNumber"
                  class="bg-gray-100 pl-5 w-12 rounded p-0"
                />
                <button
                  class="text-white bg-teal-400 p-[4px] rounded-full"
                  @click="
                    () => payMonths(item.id, item.attributes.DelayedPayments)
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </button>
              </li>

              <li class="shrink-0">
                <button @click="cancelPaymentSelection">
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
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
