<script lang="ts" type="text/x-template" id="table-modal">
import DeletePoup from "./DeletePoup.vue";

export default {
  props: ["close", "student", "update", "delete", "create"],
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
    };
  },
  methods: {
    submit(e: any) {
      e.preventDefault();
      if (this.local_student.id === 0) {
        this.create(this.local_student.attributes);
      } else {
        this.update(this.local_student.id, this.local_student.attributes);
      }
    },
  },
  components: { DeletePoup },
};
</script>

<template>
  <div
    class="z-40 w-full h-full flex justify-center items-top fixed top-0 right-0 left-0"
  >
    <div
      class="fixed w-full h-full z-40 bg-slate-400 opacity-30"
      @click="() => close()"
    ></div>
    <div
      class="mt-5 relative w-full max-w-2xl h-full md:h-auto overflow-y-auto overflow-x-hidden z-50"
    >
      <!-- Modal content -->
      <form
        action="#"
        @submit="(e) => submit(e)"
        class="relative bg-white rounded-lg shadow"
      >
        <!-- Modal header -->
        <div class="flex justify-between items-start p-4 rounded-t border-b">
          <h3 class="text-xl font-semibold text-gray-900">
            Editar {{ local_student.attributes.Name }}
          </h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
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
                type="texxt"
                name="class"
                id="class"
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                :placeholder="local_student.attributes.Class"
                v-model="local_student.attributes.Class"
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
              ></textarea>
            </div>
          </div>
          <div class="">
            <label class="block mb-2 text-sm font-medium text-gray-900"
              >Semana</label
            >
            <div class="flex">
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
  </div>
  <DeletePoup
    v-if="deleteConfirmation"
    :name="student.attributes.Name"
    :no="() => (deleteConfirmation = false)"
    :yes="() => that.delete(student.id)"
  />
</template>
