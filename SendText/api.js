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

export const sleep = ms => new Promise(r => setTimeout(r, ms));

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

export const getStudents = async () => {
  return axios
    .get(
      `${apiAddress}/api/students?filters[Paid][$eq]=false`,
      headers
    )
    .then((response) => {
      return response.data.data;
    })
    .catch((response) => {
      console.log(response)
      return response.response ? response.response.status : 500;
    });
};

export const resetJobs = async () => {
  return axios
    .get(
      `${apiAddress}/api/students?filters[Paid][$eq]=true`,
      headers
    )
    .then((response) => {
      return response.data.data.forEach((student) => resetJob(student.id));
    })
    .catch((response) => {
      throw response;
      return false;
    });
};
