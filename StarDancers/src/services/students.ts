import { useUserStore } from "@/stores/user";
import axios from "axios";
import qs from "qs";

const headers = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

let oficialPage = 1;
let filters = "";

export const getBirthdays = async () => {
  const date = <Date>new Date();
  const filters = <string>(
    `${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(
      -2
    )}`
  );

  return axios
    .get(
      `${
        import.meta.env.VITE_ADDRESS
      }/api/students?filters[BornDate][$endsWith]=${filters}`,
      headers
    )
    .then((response) => {
      return response.data.data;
    })
    .catch((response) => {
      return response.response ? response.response.status : 500;
    });
};

export const getStudents = async (
  page: Number,
  withFilters: boolean | Boolean
) => {
  const user = useUserStore();
  await user.fetchUser();

  if (user.isAdmin) {
    oficialPage = page as number;
    if (!withFilters) {
      filters = "";
    }

    return axios
      .get(
        `${
          import.meta.env.VITE_ADDRESS
        }/api/students?publicationState=live&pagination[page]=${page}&sort=id:desc${filters}`,
        headers
      )
      .then((response) => {
        return [response.data.data, response.data.meta.pagination];
      })
      .catch((response) => {
        return response.response ? response.response.status : 500;
      });
  } else {
    return [await user.getStudents(), {}];
  }
};

export const searchStudents = async (word: string) => {
  if (word) {
    filters = `&filters[$or][0][Name][$containsi]=${word}&filters[$or][3][Class][$containsi]=${word}&filters[$or][5][StudentID][$containsi]=${word}`;
    return axios
      .get(
        `${import.meta.env.VITE_ADDRESS}/api/students?sort=id:desc${filters}`,
        headers
      )
      .then((response) => {
        return [response.data.data, response.data.meta.pagination];
      })
      .catch((response) => {
        return response.response ? response.response.status : 500;
      });
  } else {
    return getStudents(1, false);
  }
};

export const setStudent = async (
  key: string,
  value: any,
  id: number,
  search: boolean,
  paymentMethod?: string
) => {
  let payload = value;
  if (key === "Paid") {
    payload = { Paid: value };
    Object.assign(payload, { PaymentMethod: value ? paymentMethod : null });
  }
  return axios
    .put(
      `${import.meta.env.VITE_ADDRESS}/api/students/${id}`,
      {
        data: payload,
      },
      headers
    )
    .then(() => {
      return getStudents(oficialPage, search);
    })
    .catch((response) => {
      return response.response
        ? [false, response.response.data.error.message]
        : 500;
    });
};

export const removeStudent = async (id: number) => {
  return axios
    .delete(`${import.meta.env.VITE_ADDRESS}/api/students/${id}`, headers)
    .then(() => {
      return getStudents(oficialPage, false);
    })
    .catch((response) => {
      return response.response ? response.response.status : 500;
    });
};

export const createStudent = async (payload: any) => {
  const data = payload;
  data.ParentContact = String(data.ParentContact);
  return axios
    .post(
      `${import.meta.env.VITE_ADDRESS}/api/students/`,
      {
        data: payload,
      },
      headers
    )
    .then(() => {
      return getStudents(1, false);
    })
    .catch((response) => {
      return response.response
        ? [false, response.response.data.error.message]
        : 500;
    });
};

export const getNotifications = async (family: string, classes: string[]) => {

  const query = qs.stringify(
    {
      publicationState: "live",
      sort: ["id:desc"],
      filters: {
        $and: [
          {
            Active: { $eq: true },
          },
          {
            $or: [
              { Target: { $eq: "Todos" } },
              { Families: { Name: { $containsi: family } } },
              ...classes.map((c) => ({
                Turma: { $containsi: c },
              })),
            ],
          },
        ],
      },
    },
    { encodeValuesOnly: true }
  );

  const url = `${import.meta.env.VITE_ADDRESS}/api/notifications?${query}`;

  return axios
    .get(url, headers)
    .then((response) => {
      return response.data.data;
    })
    .catch((response) => {
      return response.response ? response.response.status : 500;
    });
};
