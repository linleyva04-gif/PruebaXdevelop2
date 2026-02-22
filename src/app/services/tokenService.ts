import Cookies from "js-cookie";

export const checkToken = () => {
  const token = Cookies.get("accessToken");

  if (!token) return false;

  return true;
};
