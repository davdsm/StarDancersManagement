import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const apiToken = process.env.API_TOKEN;
const apiAddress = process.env.API_ADDRESS;

const headers = {
  headers: {
    Authorization: `Bearer ${apiToken}`,
  },
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const resetJob = async (id) => {
  return axios
    .put(
      `${apiAddress}/api/students/${id}`,
      {
        data: { Paid: false, PaymentMethod: null },
      },
      headers
    )
    .then(() => true);
};

const setStudent = async (id, data) => {
  return axios
    .put(
      `${apiAddress}/api/students/${id}`,
      {
        data,
      },
      headers
    )
    .then(() => true);
};

export const getStudents = async (page) => {
  let filters = page ? `&pagination[page]=${page}` : "";
  return axios
    .get(
      `${apiAddress}/api/students?filters[Paid][$eq]=false${filters}`,
      headers
    )
    .then((response) => {
      return response.data;
    })
    .catch((response) => {
      console.log(response);
      return response.response ? response.response.status : 500;
    });
};



/*
 * Get all students whose birthday is today
 */
export const getTodayBirthdays = async () => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0"); // e.g. "04"
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // e.g. "09"

  return axios
    .get(
      `${apiAddress}/api/students?filters[BornDate][$contains]=-${month}-${day}`,
      headers
    )
    .then((response) => {
      return response.data.data;
    })
    .catch((error) => {
      console.log(error);
      return error.response ? error.response.status : 500;
    });
};
export const resetJobs = async (page) => {
  var actualPage = page;
  var pageSize = 50;
  if (!actualPage) actualPage = 1;
  return axios
    .get(
      `${apiAddress}/api/students?sort=id:desc&pagination[pageSize]=${pageSize}&pagination[page]=${actualPage}`, // &filters[Class][$eq]=TESTE
      headers
    )
    .then(async (response) => {
      actualPage = actualPage + 1;
      if (response.data.data.length > 0) {
        for (const student of response.data.data) {
          const paid = !!student.attributes.Paid;
          const paidMonths = Number(student.attributes.PaidMonths || 0);
          const delayedPayments = Number(student.attributes.DelayedPayments || 0);

          // 1) Quem tem Paid = false (ou null/undefined): em cada reset aumenta DelayedPayments em 1 (0→1, 1→2, …)
          if (!paid) {
            await setStudent(student.id, {
              Paid: false,
              DelayedPayments: delayedPayments + 1,
            });
          }
          // 2) Quem tem Paid = true e PaidMonths > 1, diminui PaidMonths em 1 e mantém Paid = true
          else if (paidMonths > 1) {
            await setStudent(student.id, {
              Paid: true,
              PaidMonths: paidMonths - 1,
            });
          }
          // 3) Quem tem Paid = true e PaidMonths <= 1: passa a não pago e PaidMonths=0 (DelayedPayments só aumenta no próximo reset, quando já estiver Paid=false)
          else if (paid && paidMonths <= 1) {
            await setStudent(student.id, {
              Paid: false,
              PaidMonths: 0,
              PaymentMethod: null,
            });
          }
        }

        resetJobs(actualPage);
      }
    })
    .catch((response) => {
      throw response;
      return false;
    });
};