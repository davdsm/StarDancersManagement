<script lang="ts" type="text/x-template" id="table-modal">
export default {
  props: ["close", "student"],
  data() {
    return {
      local_student: JSON.parse(JSON.stringify(this.student)),
    };
  },
};
</script>

<template>
  <transition>
    <div
      class="w-full h-full flex justify-center items-center fixed top-0 right-0 left-0"
    >
      <div
        class="fixed w-full h-full z-40 bg-slate-400 opacity-30"
        @click="() => close()"
      ></div>

      <div
        class="relative w-full max-w-2xl h-full md:h-auto overflow-y-auto overflow-x-hidden z-50"
      >
        <!-- Modal content -->
        <form
          action="#"
          class="relative bg-white rounded-lg shadow"
          @submit="(e) => e.preventDefault()"
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
                  type="number"
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
            <div class="grid grid-rows-2 grid-flow-col gap-3">
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
              <div></div>
              <div>
                <div
                  class="flex items-center pl-4 rounded border border-gray-200"
                >
                  <input
                    id="bordered-checkbox-1"
                    type="checkbox"
                    v-model="local_student.attributes.Paid"
                    name="bordered-checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    for="bordered-checkbox-1"
                    class="py-4 ml-2 w-full block text-sm font-medium text-gray-900"
                    >Pago</label
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200"
          >
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save all
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>
