import axiosInstance from "../axios";

export const loginAdmin = async (email: string, password: string) => {
  const response = await axiosInstance.post("/admins/login", {
    email,
    password,
  });

  return response.data;
};