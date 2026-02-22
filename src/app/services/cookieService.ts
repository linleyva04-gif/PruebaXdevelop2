import Cookies from "js-cookie";

export const saveToken = (accessToken: string, refreshToken: string) => {
  Cookies.set("accessToken", accessToken, { 
    expires: 1, 
    secure: true, 
    sameSite: "lax" 
  });

  Cookies.set("refreshToken", refreshToken, { 
    secure: true, 
    sameSite: "lax" 
  });
};

export const removeToken = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

export const getToken = () => {
  return Cookies.get("accessToken");
};
