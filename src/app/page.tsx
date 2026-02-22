"use client";

import { useState } from "react";
import { loginRequest } from "./services/authService";
import { saveToken } from "./services/cookieService";
import { useAuthStore } from "./store/authStore";
import { useRouter } from "next/navigation";
import { login } from "./services/authService";

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async () => {
  try {
    const foundUser = await login(email, password);
    const fakeAccess = "eyJhbGciOiJIUzI1Ni... (token de acceso)";
    const fakeRefresh = "eyJhbGciOiJIUzI1Ni... (token de refresh)";
    
    saveToken(fakeAccess, fakeRefresh); 

    localStorage.setItem("user", JSON.stringify(foundUser));
    router.push("/dashboard");
    const savedRoles = JSON.parse(localStorage.getItem("custom_user_roles") || "{}");
    const finalRole = savedRoles[email] || (email === "eve.holt@reqres.in" ? "admin" : "user");

    localStorage.setItem("user", JSON.stringify({ email, role: finalRole }));
  } catch (error) {
    setError("Usuario no encontrado");
  }
};

  return (
   <div className="min-h-screen flex items-center justify-center bg-black">

  <div className="bg-zinc-900 p-10 rounded-2xl w-96
                border border-indigo-500/20
                shadow-[0_0_40px_rgba(99,102,241,0.25)]
                transition-all duration-500
                hover:shadow-[0_0_60px_rgba(99,102,241,0.45)]">

    <h1 className="text-3xl font-semibold text-indigo-400 mb-8 text-center">
      Bienvenido de nuevo
    </h1>

    <div className="space-y-5">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-black border border-indigo-500/30
                    text-white placeholder-gray-500
                    focus:outline-none focus:border-indigo-500"/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-black border border-indigo-500/30
                    text-white placeholder-gray-500
                    focus:outline-none focus:border-indigo-500"/>

    </div>

    {error && <p className="text-red-500">{error}</p>}

       <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg text-white font-semibold
                    bg-linear-to-r from-indigo-600 to-purple-600
                    transition-all duration-300
                    hover:scale-[1.02]
                    hover:shadow-[0_0_25px_rgba(139,92,246,0.8)]
                    active:scale-95
                    mt-6">
          {loading ? "Entrando..." : "Login"}
        </button>

      </div>
    </div>
  );
}
