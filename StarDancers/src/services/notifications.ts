// src/api/notifications.ts

import axios from "axios";
import qs from "qs";

const headers = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
  },
};

/**
 * Get notifications with pagination and filters
 */
export const getNotifications = async (page: number, filters: any = {}) => {
  const query = qs.stringify(
    {
      publicationState: "live",
      sort: ["id:desc"],
      pagination: { page, pageSize: 25 },
      populate: { Families: "*" },
    },
    { encodeValuesOnly: true }
  );

  const url = `${import.meta.env.VITE_ADDRESS}/api/notifications?${query}`;
  const { data } = await axios.get(url, headers);  

  return [data.data, data.meta.pagination];
};

/**
 * Create a new notification
 */
export const createNotification = async (
  type: string,
  title: string,
  message: string,
  target: string,
  active: boolean,
  familyIds?: number[],
  turma?: string
) => {
  const url = `${import.meta.env.VITE_ADDRESS}/api/notifications`;

  const { data } = await axios.post(
    url,
    {
      data: {
        Type: type,
        Title: title,
        Message: message,
        Target: target,
        Active: active,
        Families: familyIds,
        Turma: turma,
      },
    },
    headers
  );

  return data;
};

/**
 * Update an existing notification
 */
export const updateNotification = async (
  id: number,
  type: string,
  title: string,
  message: string,
  target: string,
  active: boolean,
  familyIds?: number[],
  turma?: string
) => {
  const url = `${import.meta.env.VITE_ADDRESS}/api/notifications/${id}`;

  const { data } = await axios.put(
    url,
    {
      data: {
        Type: type,
        Title: title,
        Message: message,
        Target: target,
        Active: active,
        Families: familyIds,
        Turma: turma,
      },
    },
    headers
  );

  return data;
};

/**
 * Delete a notification
 */
export const deleteNotification = async (id: number) => {
  const url = `${import.meta.env.VITE_ADDRESS}/api/notifications/${id}`;
  const { data } = await axios.delete(url, headers);
  return data;
};

/**
 * Get notifications for a specific family name and classes
 * - Shows notifications targeted at "Todos"
 * - Or targeted at a family
 * - Or targeted at a turma/class
 */
export const getNotificationsForFamily = async (
  familyName: string,
  classes: string[]
) => {
  const query = qs.stringify(
    {
      publicationState: "live",
      sort: ["id:desc"],
      filters: {
        Active: { $eq: true },
        $or: [
          { Target: { $eq: "Todos" } },
          { Families: { Name: { $eq: familyName } } },
          { Turma: { $in: classes } },
        ],
      },
    },
    { encodeValuesOnly: true }
  );

  const url = `${import.meta.env.VITE_ADDRESS}/api/notifications?${query}`;
  const { data } = await axios.get(url, headers);

  return data.data;
};
