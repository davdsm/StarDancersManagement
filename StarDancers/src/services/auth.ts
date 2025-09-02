import { useUserStore } from "@/stores/user";
import axios from "axios";
import { useCookies } from "vue3-cookies";

const headers = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

export const doLogin = async (username: String, password: String) => {
  return axios
    .post(`${import.meta.env.VITE_ADDRESS}/api/auth/local`, {
      identifier: username,
      password: password,
    })
    .then((response) => {      
      createCookie("user", response.data.user.username);
      createCookie("token", response.data.jwt);
      const user = useUserStore();
      user.fetchUser();
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

export const updatePassword = async (password: String) => {
  const user = await getCurrentUser();
  const id = user.id;

  return axios
    .put(
      `${import.meta.env.VITE_ADDRESS}/api/users/${id}`,
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

export const createUser = async (email: string, password: string) => {
  const url = `${import.meta.env.VITE_ADDRESS}/api/auth/local/register`;
  const { data } = await axios.post(url, {
    username: email,
    email,
    password,
  });
  return data;
};

export const updateUserPassword = async (email: string, password: string) => {
  const usersUrl = `${
    import.meta.env.VITE_ADDRESS
  }/api/users?filters[email][$eq]=${email}`;
  const { data: users } = await axios.get(usersUrl, headers);

  if (users.length > 0) {
    const userId = users[0].id;

    await axios.put(
      `${import.meta.env.VITE_ADDRESS}/api/users/${userId}`,
      { password },
      headers
    );
  }
};

/**
 * Delete a user by email
 * @param email - user's email
 */
export const deleteUser = async (email: string) => {
  // find user by email
  const { data } = await axios.get(
    `${import.meta.env.VITE_ADDRESS}/api/users?filters[email][$eq]=${email}`,
    headers
  );

  if (data.length > 0) {
    const userId = data[0].id;
    await axios.delete(
      `${import.meta.env.VITE_ADDRESS}/api/users/${userId}`,
      headers
    );
  }
};
