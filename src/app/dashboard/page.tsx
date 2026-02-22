"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, BookOpen, FileText, TextQuote, LogOut, SignalZero, MessageSquareText } from "lucide-react";
import { motion } from "framer-motion";
import { getToken, removeToken } from "../services/cookieService";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.replace("/");
      return;
    }

    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [router]);

  if (loading || !user) return <div>Cargando...</div>;

  const handleLogout = () => {
    removeToken();
    router.replace("/");
  };


  return (
<div className="min-h-screen bg-linear-to-br from-black via-indigo-950 to-blue-950 text-white p-10 relative overflow-hidden">

    
<div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 opacity-20 blur-3xl rounded-full"></div>
<div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>    
    
<div className="flex justify-between items-center mb-10">


        <h1 className="text-3xl font-bold text-center">
        Bienvenido, {user.email}
        </h1>

        <button className="flex items-center gap-1 px-5 py-2 rounded-full 
                   bg-white/5 backdrop-blur-sm border border-white/10 
                   text-slate-300 hover:text-white hover:bg-indigo-300/70 
                   hover:border-indigo-300/70 transition-all duration-300 group"
                    onClick={handleLogout}>
            <span className="text-sm font-medium">Cerrar sesión</span>
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
        </button>

    </div>
 

  <div className="grid grid-cols-2 gap-6">

<motion.div
    whileHover={{ scale: 1.05, translateY: -5 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="group relative z-10 p-8 py-18 rounded-3xl cursor-pointer overflow-hidden
              bg-white/5 backdrop-blur-md 
                border border-white/10
                shadow-2xl
                transition-all duration-500
                hover:border-yellow-400/40
                hover:shadow-[0_0_40px_rgba(253,224,71,0.15)]"
                onClick={() => router.push('/users')}>


     <img src="/remolino.svg" 
                    className="absolute right-[-200] bottom-[-120] w-140 opacity-40 pointer-events-none"
                    alt="decoracion" />

    <Users 
        size={40} 
        className="mb-6 text-indigo-300 transition-colors duration-500 group-hover:text-yellow-300" />
    
    <h2 className="text-2xl font-bold text-white tracking-tight">Usuarios</h2>
    <h4 className="text-gray-100 text-sm mt-3 leading-relaxed font-bold">
        Echa un vistazo a los usuarios registrados en el sistema.
    </h4>

    <div className="absolute bottom-0 right-0 w-16 h-16 bg-linear-to-br from-transparent to-white/5 rounded-full" />
</motion.div>

    <motion.div
        whileHover={{ scale: 1.05, translateY: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative z-10 p-8 py-18 rounded-3xl cursor-pointer overflow-hidden
                  bg-white/5 backdrop-blur-md 
                    border border-white/10
                    shadow-2xl
                    transition-all duration-500
                    hover:border-yellow-400/40
                    hover:shadow-[0_0_40px_rgba(253,224,71,0.15)]"
                    onClick={() => router.push('./dashboard/posts')}>

         <img src="/estrellita.svg" 
                    className="absolute right-[-200] bottom-[-100] w-300 opacity-40 pointer-events-none"
                    alt="decoracion" />

        <MessageSquareText
            size={40} 
            className="mb-6 text-indigo-300 transition-colors duration-500 group-hover:text-yellow-300" />
    
        <h2 className="text-2xl font-bold text-white tracking-tight">Posts</h2>
        <h4 className="text-gray-100 text-sm mt-3 leading-relaxed font-bold">
            ¿Qué tal si echas un vistazo a los posts publicados?
        </h4>

        <div className="absolute bottom-0 right-0 w-16 h-16 bg-linear-to-br from-transparent to-white/5 rounded-full" />
    </motion.div>



    <div className="col-span-2">
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="group relative z-10 p-8 py-18 rounded-3xl cursor-pointer overflow-hidden
                      bg-white/5 backdrop-blur-md 
                        border border-white/10
                        shadow-2xl
                        transition-all duration-500
                        hover:border-yellow-400/40
                        hover:shadow-[0_0_40px_rgba(253,224,71,0.15)]"
                        onClick={() => router.push('/dashboard/books')}>

                <img src="/lunita.svg" 
                    className="absolute right-0 bottom-0 w-200 opacity-40 pointer-events-none"
                    alt="decoracion" />
            <BookOpen size={40} 
                      className="mb-6 text-indigo-300 transition-colors duration-500 group-hover:text-yellow-300" />
            
            
            <h2 className="text-xl font-semibold text-white">Libros</h2>
            <h4 className="text-gray-100 text-sm mt-3 leading-relaxed font-bold">
                ¿Con ganas de leer un rato? Aqui hay historias interesantes, Da click en mi!!!
            </h4>
        </motion.div>
    </div>

  </div>


</div>

)}