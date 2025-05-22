import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

const apiToken = process.env.API_TOKEN;
const apiAddress = process.env.API_ADDRESS;

const headers = {
  headers: {
    Authorization: `Bearer ${apiToken}`,
  },
};

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const resetJob = async (id) => {
  try {
    // erro de teste apenas para id = 123
    if (id === 123) throw new Error("Erro proposital de teste no resetJob");

    /* return axios
         .put(
           `${apiAddress}/api/students/${id}`,
           { data: { Paid: false } },
           headers
         )
         .then(() => true); */

    console.log("reset", id);
  } catch (error) {
    console.error(`Erro ao resetar job para o ID ${id}:`, error.message);
    // continua sem relançar
  }
  return true;
};

export const getStudents = async (page) => {
  let filters = page ? `&pagination[page]=${page}` : '';
  return axios
    .get(
      `${apiAddress}/api/students?filters[Paid][$eq]=false${filters}`,
      headers
    )
    .then((response) => response.data)
    .catch((response) => {
      console.log(response);
      return response.response ? response.response.status : 500;
    });
};

export const resetJobs = async () => {
  return axios
    .get(
      `${apiAddress}/api/students?filters[Paid][$eq]=true`,
      headers
    )
    .then(async (response) => {
      if (response.data.meta.pagination.pageCount > 1) {
        await response.data.data.forEach(async (student) => resetJob(student.id));
        resetJobs();
      } else {
        return response.data.data.forEach(async (student) => resetJob(student.id));
      }       
    })
    .catch((response) => {
      throw response;
      return false;
    });
};

// ————————————————————————————
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  resetJob(123).then(() => {
    console.log("Teste de resetJob concluído.");
  });
}