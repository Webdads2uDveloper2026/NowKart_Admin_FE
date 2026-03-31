import { Fetch } from "../axios";

export const getProfile = async () => {
  const response = await Fetch({
    endpoint: "/admins/me",
    method: "GET",
  });

  return response;
};
