import axiosInstance from "../axios";
export const getProfile = async () => {
  const response = await axiosInstance.get("/admins/me");
  return response.data;
};