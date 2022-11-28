import axios from "axios";

const headers = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

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

export const getStudents: GetStudents = async () => {
  return axios
    .get(`${import.meta.env.VITE_ADDRESS}/api/students`, headers)
    .then((response) => {
      return response.data.data.reverse();
    })
    .catch((response) => {
      return response.response ? response.response.status : 500;
    });
};

export const setStudent: SetStudent = async (
  key: String,
  value: any,
  id: Integer
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
      return getStudents();
    })
    .catch((response) => {
      return response.response ? response.response.status : 500;
    });
};

export const removeStudent: RemoveStudent = async (id: Integer) => {
  return axios
    .delete(`${import.meta.env.VITE_ADDRESS}/api/students/${id}`, headers)
    .then(() => {
      return getStudents();
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
      return getStudents();
    })
    .catch((response) => {
      return response.response ? response.response.status : 500;
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
