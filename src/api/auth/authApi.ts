import { Fetch } from "../axios";

export const loginAdmin = async (email: string, password: string) => {
  const response = await Fetch({
    endpoint: "/admins/login",
    method: "POST",
    body: {
      email,
      password,
    },
  });

  return response;
};
