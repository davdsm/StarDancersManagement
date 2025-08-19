import axios from "axios";
import { useCookies } from "vue3-cookies";

const headers = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

let oficialPage = 1;
let filters = "";

export const doLogin = async (username: String, password: String) => {
  return axios
    .post(`${import.meta.env.VITE_ADDRESS}/api/auth/local`, {
      identifier: username,
      password: password,
    })
    .then((response) => {
      createCookie("user", response.data.user.username);
      createCookie("token", response.data.jwt);
      return response;
    })
    .catch((response) => {
      return response.response ? response.response.status : 500;
    });
};

export const createCookie = (key: string, value: string) => {
  const { cookies } = useCookies();
  cookies.set(key, value);
};

export const getCookie = (key: string) => {
  const { cookies } = useCookies();
  return cookies.get(key);
};

export const removeCookie = (key: string) => {
  const { cookies } = useCookies();
  cookies.remove(key);
  return true;
};

export const getBirthdays = async () => {
  const date = <date>new Date();
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
      console.log(response);
      return response.response ? response.response.status : 500;
    });
};

export const getStudents = async (
  page: Number,
  withFilters: boolean | Boolean
) => {
  oficialPage = page;
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
};

export const searchStudents = async (word: String) => {
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
  key: String,
  value: any,
  id: Integer,
  search: Boolean
) => {
  let payload = value;
  if (key === "Paid") {
    payload = { Paid: value };
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

export const createStudent = async (payload: Object) => {
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

export const updatePassword = async (password: String) => {
  return axios
    .put(
      `${import.meta.env.VITE_ADDRESS}/api/users/2`,
      {
        password: password,
      },
      headers
    )
    .then(() => {
      return true;
    })
    .catch((response) => {
      return response.response ? response.response.status : 500;
    });
};

export const getCurrentUser = async () => {
  const { cookies } = useCookies();
  const token = cookies.get("token");
  if (!token) return null;

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_ADDRESS}/api/users/me?populate=role`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};
