import axios from "axios";
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
};
