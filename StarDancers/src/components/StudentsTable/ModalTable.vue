<script lang="ts" type="text/x-template" id="table-modal">
import { getFamilyByStudentId } from "@/services/families";
import DeletePoup from "./DeletePoup.vue";
import ErrorModal from "./ErrorModal.vue";
import { useUserStore } from "@/stores/user";
import type { Family } from "../FamiliesTable/ModalTable.vue";

export default {
  props: ["close", "student", "update", "delete", "create", "error", "pay"],
  data() {
    return {
      local_student: JSON.parse(JSON.stringify(this.student)),
      terms: false,
      deleteConfirmation: false,
      week: [
        "Segunda",
        "Terca",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sabado",
        "Domingo",
      ],
      that: this,
      errorMsg: this.error,
      isAdmin: false,
      family: <Family | undefined>undefined,
      paymentMethod: <undefined | string>undefined,
      loading: <boolean | number>false,
      openFamily: false,
      showMonths: <boolean>false,
      monthsNumber: <number>1,
    };
  },
  watch: {
    students() {
      this.family = JSON.parse(JSON.stringify(this.family));
    },
  },
  methods: {
    async submit(e: any) {
      e.preventDefault();
      let success: 200 | string = "";
      if (this.local_student.id === 0) {
        success = await this.create(this.local_student.attributes);
      } else {
        success = await this.update(
          this.local_student.id,
          this.local_student.attributes
        );
      }
      if (typeof success === "string") {
        this.errorMsg = success;
      }
    },
    async payFamilyStudent(studentId: number, status: boolean) {
      this.loading = studentId;
      await this.pay(studentId, status, status && this.paymentMethod);
      const fam = await getFamilyByStudentId(this.student.id);
      this.family = fam;
      this.loading = false;
      if (this.monthsNumber > 1) {
        this.payMonths(
          studentId,
          this.local_student.attributes.DelayedPayments
        );
      }
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
  },
  components: { DeletePoup, ErrorModal },
  async mounted() {
    const user = useUserStore();
    if (this.student) {
      const fam = await getFamilyByStudentId(this.student.id);
      if (fam) this.family = fam;

      this.isAdmin = user.isAdmin;
    }
  },
};
</script>

<template>
  <div
    class="z-40 w-full h-full flex justify-center items-start fixed top-0 right-0 left-0 gap-8"
  >
    <div
      class="fixed w-full h-full z-40 bg-slate-400 opacity-30"
      @click="() => close()"
    ></div>
    <div
      class="md:h-auto max-h-[calc(100%-2rem)] mt-5 relative w-full max-w-2xl h-full overflow-y-auto overflow-x-hidden z-50 bg-white rounded-lg shadow"
    >
      <!-- Modal content -->
      <form
        action="#"
        @submit="(e: any) => isAdmin ? submit(e) : null"
        class="relative"
      >
        <!-- Modal header -->
        <div
          class="flex justify-between items-center p-4 rounded-t border-b gap-4"
        >
          <h3 class="text-xl font-semibold text-gray-900" v-if="isAdmin">
            Editar {{ local_student.attributes.Name }}
          </h3>
          <h3 class="text-xl font-semibold text-gray-900" v-if="!isAdmin">
            Ver {{ local_student.attributes.Name }}
          </h3>
          <span
            v-if="family && family.attributes.Name !== ''"
            @click="isAdmin ? (openFamily = true) : null"
            class="ml-auto px-4 py-2 font-bold bg-teal-200 rounded text-xs text-teal-800"
            :class="isAdmin ? 'cursor-pointer' : 'cursor-initial'"
          >
            Família {{ family.attributes.Name }}
          </span>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center"
            @click="() => close()"
          >
            <svg
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
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-3">
              <label
                for="first-name"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Nome</label
              >
              <input
                type="text"
                name="first-name"
                id="first-name"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="local_student.attributes.Name"
                v-model="local_student.attributes.Name"
                :disabled="!isAdmin"
                required
              />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="student-id"
                class="block mb-2 text-sm font-medium text-gray-900"
                >ID de Estudante</label
              >
              <input
                type="text"
                name="student-id"
                id="student-id"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="local_student.attributes.StudentID"
                v-model="local_student.attributes.StudentID"
                :disabled="!isAdmin"
                required
              />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="message"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Data de Nascimento</label
              >
              <input
                type="date"
                name="bornDate"
                id="bornDate"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="local_student.attributes.BornDate"
                v-model="local_student.attributes.BornDate"
                :disabled="!isAdmin"
                required
              />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="last-name"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Nome Responsável</label
              >
              <input
                type="text"
                name="last-name"
                id="last-name"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="local_student.attributes.ParentName"
                v-model="local_student.attributes.ParentName"
                :disabled="!isAdmin"
                required
              />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Email Responsável</label
              >
              <input
                type="email"
                name="email"
                id="email"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="local_student.attributes.ParentEmail"
                v-model="local_student.attributes.ParentEmail"
                :disabled="!isAdmin"
                required
              />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="phone-number"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Contacto Responsável</label
              >
              <input
                type="text"
                name="phone-number"
                id="phone-number"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="local_student.attributes.ParentContact"
                v-model="local_student.attributes.ParentContact"
                :disabled="!isAdmin"
                required
              />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="nif"
                class="block mb-2 text-sm font-medium text-gray-900"
                >NIF Responsável</label
              >
              <input
                type="number"
                name="nif"
                id="nif"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="local_student.attributes.ParentNIF"
                v-model="local_student.attributes.ParentNIF"
                :disabled="!isAdmin"
                required
              />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="class"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Turma</label
              >
              <input
                type="text"
                name="class"
                id="class"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="local_student.attributes.Class"
                v-model="local_student.attributes.Class"
                :disabled="!isAdmin"
                required
              />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="value"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Preço</label
              >
              <input
                type="price"
                name="value"
                id="value"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="local_student.attributes.Price"
                v-model="local_student.attributes.Price"
                :disabled="!isAdmin"
                required
              />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label
                for="message"
                class="block mb-2 text-sm font-medium text-gray-900"
                >Observações</label
              >
              <textarea
                id="message"
                rows="4"
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="local_student.attributes.Observations"
                v-model="local_student.attributes.Observations"
                :disabled="!isAdmin"
              ></textarea>
            </div>
          </div>
          <div class="">
            <label class="block mb-2 text-sm font-medium text-gray-900"
              >Semana</label
            >
            <div class="flex" :class="!isAdmin && 'pointer-events-none'">
              <div class="mr-1" v-for="day in week" :key="day">
                <label
                  :for="day"
                  v-if="local_student.attributes.Week.includes(day)"
                  class="font-medium text-white w-10 h-10 rounded-full bg-slate-500 flex cursor-pointer text-lg items-center justify-center"
                  >{{ day[0] }}</label
                >
                <label
                  :for="day"
                  v-if="!local_student.attributes.Week.includes(day)"
                  class="font-medium text-white w-10 h-10 rounded-full bg-slate-300 flex cursor-pointer text-lg items-center justify-center"
                  >{{ day[0] }}</label
                >
                <input
                  type="checkbox"
                  :name="day"
                  :id="day"
                  class="hidden"
                  :value="day"
                  v-model="local_student.attributes.Week"
                  :disabled="!isAdmin"
                />
              </div>
            </div>
          </div>
          <div class="grid grid-col-2 grid-flow-col gap-3">
            <div>
              <div
                class="flex items-center pl-4 rounded border border-gray-200"
              >
                <input
                  id="bordered-checkbox-1"
                  type="checkbox"
                  v-model="local_student.attributes.ImageRights"
                  name="bordered-checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                  :disabled="!isAdmin"
                />
                <label
                  for="bordered-checkbox-1"
                  class="py-4 ml-2 w-full block text-sm font-medium text-gray-900"
                  >Direitos de Imagem</label
                >
              </div>
            </div>
            <div>
              <div
                class="flex items-center pl-4 rounded border border-gray-200"
              >
                <input
                  id="bordered-checkbox-2"
                  type="checkbox"
                  v-model="local_student.attributes.Paid"
                  name="bordered-checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                  :disabled="!isAdmin"
                />
                <label
                  for="bordered-checkbox-2"
                  class="py-4 ml-2 w-full block text-sm font-medium text-gray-900"
                  >Pago</label
                >
              </div>
            </div>
          </div>
          <div v-if="local_student.id === 0">
            <div class="flex items-center pl-4 rounded border border-gray-200">
              <input
                id="bordered-checkbox-3"
                type="checkbox"
                v-model="terms"
                name="bordered-checkbox"
                required
                class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
              />
              <label
                for="bordered-checkbox-3"
                class="py-4 ml-2 w-full block text-sm font-medium text-gray-900"
                >Aceito os
                <a
                  class="text-sm font-medium text-gray-900 underlined underline decoration-indigo-500"
                  href=""
                  target="_blank"
                  >Termos e Condições</a
                >.</label
              >
            </div>
          </div>
        </div>
        <!-- Modal footer -->
        <div
          v-if="isAdmin"
          class="flex items-center justify-between p-6 space-x-2 rounded-b border-t border-gray-200"
        >
          <button
            type="submit"
            v-if="local_student.id === 0"
            class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Criar {{ local_student.attributes.Name }}
          </button>
          <button
            type="submit"
            v-if="local_student.id !== 0"
            class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Atualizar {{ local_student.attributes.Name }}
          </button>
          <button
            type="button"
            v-if="local_student.id !== 0"
            @click="() => (deleteConfirmation = true)"
            class="flex items-center text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
    <div
      v-if="family && openFamily"
      class="mt-5 relative w-1/5 bg-white rounded-lg shadow z-50 flex justify-center items-center flex-col gap-4"
    >
      <div
        class="flex justify-between items-center p-4 rounded-t border-b gap-4"
      >
        <h3 class="text-xl font-semibold text-gray-900" v-if="isAdmin">
          Família {{ family.attributes.Name }}
        </h3>
        <button
          type="button"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center"
          @click="openFamily = false"
        >
          <svg
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
        </button>
      </div>
      <div
        v-if="
          family?.attributes?.Students.data.find(
            (student) => !student.attributes.Paid
          )
        "
      >
        <ul class="flex flex-row gap-6 justify-between items-center py-4">
          <li>
            <button
              @click="paymentMethod = 'MBWay'"
              :class="paymentMethod === 'MBWay' ? 'opacity-100' : 'opacity-30'"
            >
              <img
                src="../../assets/paymentMethods/mbway.png"
                class="w-5 h-8 object-contain aspect-square"
              />
            </button>
          </li>
          <li>
            <button
              @click="paymentMethod = 'Multibanco'"
              :class="
                paymentMethod === 'Multibanco' ? 'opacity-100' : 'opacity-30'
              "
            >
              <img
                src="../../assets/paymentMethods/multibanco.png"
                class="w-5 h-8 object-contain aspect-square"
              />
            </button>
          </li>
          <li>
            <button
              @click="paymentMethod = 'Money'"
              :class="paymentMethod === 'Money' ? 'opacity-100' : 'opacity-30'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
            </button>
          </li>
          <li>
            <button
              @click="paymentMethod = 'Transfer'"
              :class="
                paymentMethod === 'Transfer' ? 'opacity-100' : 'opacity-30'
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                />
              </svg>
            </button>
          </li>
          <li class="">
            <div
              :class="
                showMonths
                  ? 'flex flex-col justify-between items-center gap-2'
                  : ''
              "
            >
              <button
                @click="showMonths = !showMonths"
                :class="showMonths ? 'opacity-100' : 'opacity-30'"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
                  />
                </svg>
              </button>

              <input
                v-if="showMonths"
                type="number"
                placeholder="1"
                v-model="monthsNumber"
                class="bg-gray-100 pl-5 w-12 rounded p-0"
              />
            </div>
          </li>
          <li>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center"
              @click="
                (paymentMethod = undefined),
                  (showMonths = false),
                  (monthsNumber = 1)
              "
            >
              <svg
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
            </button>
          </li>
        </ul>
      </div>
      <div class="w-full px-6 pb-8">
        <ul class="w-full relative flex flex-col gap-2">
          <li
            v-for="student in family?.attributes?.Students.data"
            class="flex justify-between items-center w-full"
          >
            <div class="w-3/5 flex items-center gap-2">
              <span
                v-if="Number(student.attributes.DelayedPayments) > 0"
                class="w-8 group p-2 bg-amber-400 rounded text-white relative flex justify-center items-center"
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
                  class="group-hover:block hidden absolute -top-10 -left-2 bg-slate-800 p-2 text-white rounded w-40"
                  >Atraso de Meses:
                  {{ Number(student.attributes.DelayedPayments) }}</span
                >
              </span>
              {{ student.attributes.Name }}
            </div>
            <img
              v-if="student.attributes.PaymentMethod === 'MBWay'"
              src="../../assets/paymentMethods/mbway.png"
              class="w-4 h-8 object-contain aspect-square"
            />
            <img
              v-if="student.attributes.PaymentMethod === 'Multibanco'"
              src="../../assets/paymentMethods/multibanco.png"
              class="w-4 h-8 object-contain aspect-square"
            />
            <svg
              v-if="student.attributes.PaymentMethod === 'Money'"
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
              v-if="student.attributes.PaymentMethod === 'Transfer'"
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
            <span
              v-if="student.attributes.Paid && loading !== student.id"
              @click="payFamilyStudent(student.id, false)"
              class="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900 shrink-0"
              :class="isAdmin ? 'cursor-pointer' : 'cursor-not-allowed'"
              >Pago
              <span
                v-if="student.attributes.PaidMonths > 1 || monthsNumber > 1"
                class="absolute text-xs bg-teal-400 text-white rounded-full p-[2px] -top-2 -right-3"
                >x{{ monthsNumber > 1 && monthsNumber || student.attributes.PaidMonths }}</span
              >
            </span>
            <span
              v-if="!student.attributes.Paid && loading !== student.id"
              @click="payFamilyStudent(student.id, true)"
              class="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900"
              :class="isAdmin ? 'cursor-pointer' : 'cursor-not-allowed'"
              >Não Pago</span
            >
            <span v-if="loading === student.id">
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
          </li>
        </ul>
      </div>
    </div>
  </div>
  <DeletePoup
    v-if="deleteConfirmation"
    :name="student.attributes.Name"
    :no="() => (deleteConfirmation = false)"
    :yes="() => that.delete(student.id)"
  />
  <ErrorModal
    v-if="errorMsg"
    :msg="errorMsg"
    :close="() => (errorMsg = false)"
  />
</template>
