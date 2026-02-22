export const loginRequest = async (email: string, password: string) => {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
};


import axios from "axios";
import { attachRoles } from "./userService";

export const login = async (email: string, password: string) => {
  const res = await axios.get("/api/users?page=1");
  const users = attachRoles(res.data.data);

  const foundUser = users.find((u: any) => u.email === email);

  if (!foundUser) {
    throw new Error("Usuario no encontrado");
  }

  if (password !== foundUser.first_name.toLowerCase()) {
  throw new Error("Contraseña incorrecta");
  }

  return foundUser;
};