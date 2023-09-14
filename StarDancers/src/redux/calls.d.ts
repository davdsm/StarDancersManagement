import axios from "axios";

const headers = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

let oficialPage = 1;
let filters = "";

export const doLogin: DoLogin = async (username: String, password: String) => {
  return axios
    .post(`${import.meta.env.VITE_ADDRESS}/api/auth/local`, {
      identifier: username,
      password: password,
    })
    .then((response) => {
      createCookie("user", response.data.user.username);
      return response.status;
    })
    .catch((response) => {
      return response.response ? response.response.status : 500;
    });
};

export const createCookie: CreateCookie = async (
  key: String,
  value: String
) => {
  $cookies.set(key, value);
};

export const getCookie: GetCookie = async (key: String) => {
  return $cookies.get(key);
};

export const removeCookie: RemoveCookie = async (key: String) => {
  $cookies.remove(key);
  return true;
};

export const getBirthdays: GetBirthdays = async () => {
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

export const getStudents: GetStudents = async (page: Number, withFilters) => {
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

export const searchStudents: SearchStudents = async (word: String) => {
  if (word) {
    filters = `&filters[$or][0][Name][$containsi]=${word}&filters[$or][1][ParentName][$containsi]=${word}&filters[$or][2][ParentEmail][$containsi]=${word}&filters[$or][3][Class][$containsi]=${word}&filters[$or][4][ParentContact][$containsi]=${word}`;
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

export const setStudent: SetStudent = async (
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

export const removeStudent: RemoveStudent = async (id: Integer) => {
  return axios
    .delete(`${import.meta.env.VITE_ADDRESS}/api/students/${id}`, headers)
    .then(() => {
      return getStudents(oficialPage, false);
    })
    .catch((response) => {
      return response.response ? response.response.status : 500;
    });
};

export const createStudent: CreateStudent = async (payload: Object) => {
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

export const updatePassword: UpdatePassword = async (password: String) => {
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
