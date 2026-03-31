import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;
const TIMEOUT = 90000;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  withCredentials: true,
});

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface AxiosApiParams {
  endpoint: string;
  method?: HttpMethod;
  body?: any;
  token?: string | null;
}

export const Fetch = async ({
  endpoint,
  method = "GET",
  body = {},
  token = null,
}: AxiosApiParams) => {
  try {
    const headers: Record<string, string> = {};
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const authToken = token || localStorage.getItem("token");
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await axiosInstance({
      url: endpoint,
      method: method.toLowerCase() as any,
      headers,
      ...(method !== "GET" ? { data: body } : {}),
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError<any>;

    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.replace("/login");
      throw new Error("Session expired");
    }

    if (err.code === "ECONNABORTED") {
      throw new Error("Request timed out. Please try again.");
    }

    const data = err.response?.data;

    const errorMessage =
      data?.data?.message ||
      data?.data?.errors ||
      data?.errors ||
      data?.message ||
      err.message ||
      "Something went wrong";

    throw new Error(errorMessage);
  }
};
