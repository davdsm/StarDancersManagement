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
        data: { Paid: false },
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

export const resetJobs = async (page) => {
  var actualPage = page;
  var pageSize = 50;
  if (!actualPage) actualPage = 1;
  return axios
    .get(
      `${apiAddress}/api/students?sort=id:desc&pagination[pageSize]=${pageSize}&pagination[page]=${actualPage}`,
      headers
    )
    .then(async (response) => {
      actualPage = actualPage + 1;
      if (response.data.data.length > 0) {
        await response.data.data.forEach(async (student) => {
          if (!student.attributes.Paid) {
            setStudent(student.id, {
              DelayedPayments: Number(student.attributes.DelayedPayments) + 1,
            });
          } else if (Number(student.attributes.PaidMonths) > 0) {
            setStudent(student.id, {
              PaidMonths: Number(student.attributes.PaidMonths) - 1,
            });
          } else {
            resetJob(student.id);
          }
        });

        resetJobs(actualPage);
      }
    })
    .catch((response) => {
      throw response;
      return false;
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
