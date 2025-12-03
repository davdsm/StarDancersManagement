import axios from "axios";
import qs from "qs";
import { createUser, deleteUser, updateUserPassword } from "./auth";

const headers = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

export const getFamilies = async (
  page: number,
  filters = "",
  email?: string
) => {
  const filterObj: any = {};

  if (email) {
    filterObj.Email = { $eq: email };
  }

  const query = qs.stringify(
    {
      publicationState: "live",
      sort: ["id:desc"],
      pagination: { page, pageSize: 500 },
      populate: { Students: "*" },
      filters: filterObj,
    },
    { encodeValuesOnly: true }
  );

  const url = `${import.meta.env.VITE_ADDRESS}/api/families?${query}${filters ? `&${filters}` : ""
    }`;

  const { data } = await axios.get(url, headers);

  return [data.data, data.meta.pagination];
};

/**
 * Update a family record in Strapi
 * @param id - Family ID
 * @param payload - Data to update
 * @returns Updated family object
 */
export const updateFamily = async (
  id: number,
  name: string,
  studentsIds?: number[],
) => {
  const url = `${import.meta.env.VITE_ADDRESS}/api/families/${id}`;
  const { data } = await axios.put(
    url,
    {
      data: {
        Name: name,
        Students: studentsIds,
      },
    },
    headers
  );
  return data;
};

export const createFamily = async (
  name: string,
  studentsIds: number[],
) => {
  const url = `${import.meta.env.VITE_ADDRESS}/api/families`;

  const { data } = await axios.post(
    url,
    {
      data: {
        Name: name,
        Students: studentsIds,
      },
    },
    headers
  );

  return data;
};

/**
 * Delete a family record in Strapi and the associated user
 * @param id - Family ID
 * @returns Strapi delete response
 */
export const deleteFamily = async (id: number) => {
  const url = `${import.meta.env.VITE_ADDRESS}/api/families/${id}`;

  // delete family in Strapi
  const { data } = await axios.delete(url, headers);

  return data;
};

/**
 * Get family by student ID
 * @param studentId - Student ID to search for
 * @returns Family object that contains the student
 */
export const getFamilyByStudentId = async (studentId: number) => {
  const query = qs.stringify(
    {
      publicationState: "live",
      populate: { Students: "*" },
      filters: {
        Students: {
          id: {
            $eq: studentId,
          },
        },
      },
    },
    { encodeValuesOnly: true }
  );

  const url = `${import.meta.env.VITE_ADDRESS}/api/families?${query}`;
  const { data } = await axios.get(url, headers);

  // Return the first family found (should be only one) or null if not found
  return data.data.length > 0 ? data.data[0] : null;
};

export const searchFamilies = async (word: string) => {
  if (word) {
    const filters = `&filters[$or][0][Name][$containsi]=${word}&filters[$or][3][Class][$containsi]=${word}&filters[$or][5][StudentID][$containsi]=${word}`;
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
  }
};

export const getFamilyById = async (id: number) => {
  const query = qs.stringify(
    {
      populate: { Students: "*" },
    },
    { encodeValuesOnly: true }
  );
  const url = `${import.meta.env.VITE_ADDRESS}/api/families/${id}?${query}`;
  const { data } = await axios.get(url, headers);
  return data.data;
};
