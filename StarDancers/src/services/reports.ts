// src/api/reports.ts

import axios from "axios";
import qs from "qs";

const headers = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

/**
 * Get reports with pagination and filters
 */
export const getReports = async (page: number, filters: any = {}) => {
  const query = qs.stringify({
    publicationState: "live",
    sort: ["id:desc"],
    pagination: { page, pageSize: 25 },
  });

  const url = `${import.meta.env.VITE_ADDRESS}/api/reports?${query}`;
  const { data } = await axios.get(url, headers);

  return [data.data, data.meta.pagination];
};

/**
 * Delete a report
 */
export const deleteReport = async (id: number) => {
  const url = `${import.meta.env.VITE_ADDRESS}/api/reports/${id}`;
  const { data } = await axios.delete(url, headers);
  return data;
};
