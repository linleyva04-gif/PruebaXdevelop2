"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { removeToken } from "../services/cookieService";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { attachRoles } from "../services/userService";
import { saveUserRole } from "../services/userService";
import { LogOut, Trash2 } from "lucide-react";


import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

//DEFINIR CAMPOS DE USUARIO, ESTO ES LO QUE APARECE EN LA TABLA
type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "user";
};


export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);


  const isAdmin = user?.role === "admin";
  const [page, setPage] = useState(1);
  
  const setToken = useAuthStore((s) => s.setToken);
  const userRole = useAuthStore((s) => s.role); 

  //CON ESTO SE OBTIENEN LOS DATOS DE LOS USUARIS DE LA API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const res = await fetchWithAuth(`/api/users?page=${page}`);
      if (!res) throw new Error("No response from server");
      if (!res.ok) throw new Error("Error fetching users");
      return res.json();
    },
    placeholderData: (previousData) => previousData,
  });

const [localUsers, setLocalUsers] = useState<any[]>([]);

  useEffect(() => {
    if (data?.data) {
      //SE INSERTAN ROLES
      const usersWithRoles = attachRoles(data.data); 
      setLocalUsers(usersWithRoles);
    }
  }, [data]); 

  //FUNCION PARA QUE LOS ADMINS PUEDAN CAMBIAR LOS ROLES DE USUARIOS SI ES USER SE CAMBIA A ADMIN Y VICEVERSA
const handleToggleRoles = () => {
  const selectedIndices = Object.keys(rowSelection).map(Number);
  
  const updated = localUsers.map((user, index) => {
    if (selectedIndices.includes(index)) {
      const newRole = user.role === "admin" ? "user" : "admin";
      
      saveUserRole(user.email, newRole);
      
      return { ...user, role: newRole };
    }
    return user;
  });

  setLocalUsers(updated);
  setRowSelection({});
  alert("Roles guardados permanentemente en este navegador.");
};

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const totalPages = data?.total_pages ?? 1;

  const filteredUsers = useMemo(() => {
    return localUsers.filter((user) => { 
      const matchesSearch = 
        user.first_name.toLowerCase().includes(globalFilter.toLowerCase()) || 
        user.email.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [localUsers, globalFilter, roleFilter]);

  const columnHelper = createColumnHelper<User>();

//LOGICA PARA ÑA TABLA DE USUARIOS
//EL USEMEMO AYUDA A QUE LA TABLA NO SE RECONSTRUYA DESDE CERO CON CADA BUSQUEDA, ESO HACE QUE SEA MAS RAPIDA
  const columns = useMemo(() => {
  const baseColumns = [
    columnHelper.accessor("first_name", {
      header: "Nombre",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("last_name", {
      header: "Apellido",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("role", {
      header: "Rol",
      cell: (info) => (
        <span className={
          info.getValue() === "admin" 
            ? "text-red-500 font-bold"
            : "text-gray-500"
        }>
          {info.getValue()}
        </span>
      ),
    }),
  ];

  if (!isAdmin) {
    return baseColumns;
  }



  // Estas columnas solo funcionan si el usuario que ingreso es Admin
  return [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <input 
          type="checkbox" 
          checked={table.getIsAllRowsSelected()} 
          onChange={table.getToggleAllRowsSelectedHandler()} 
          className="w-4 h-4 cursor-pointer"/>
      ),
      cell: ({ row }) => (
        <input 
          type="checkbox" 
          checked={row.getIsSelected()} 
          onChange={row.getToggleSelectedHandler()} 
          className="w-4 h-4 cursor-pointer"/>
      ),
    }),
    ...baseColumns,
  ];
}, [isAdmin, columnHelper]);

  const table = useReactTable({
    data: filteredUsers, 
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("user");
    setToken(null);
    router.push("/");
  };

  if (isLoading)
    return <div className="p-10 text-white min-h-screen bg-gray-950 flex items-center justify-center">Cargando usuarios...</div>;

  if (isError)
    return <div className="p-10 text-red-500 min-h-screen bg-gray-950 flex items-center justify-center">Error cargando usuarios</div>;

  return (
<div className="min-h-screen bg-linear-to-br from-black via-indigo-950 to-blue-950 text-white p-10 relative overflow-hidden">
  <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 opacity-20 blur-3xl rounded-full"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>  

      <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-bold text-center">
                  Usuarios
              </h1>

              <div className="flex gap-2 items-center">
                {Object.keys(rowSelection).length > 0 && isAdmin && (
                <button 
                  onClick={handleToggleRoles}
                   className="flex items-center gap-1 px-5 py-2 rounded-full 
                        bg-white/5 backdrop-blur-sm border border-white/10 
                        text-slate-300 hover:text-white hover:bg-indigo-300/70 
                        hover:border-indigo-300/70 transition-all duration-300 group">
                  Cambiar Roles ({Object.keys(rowSelection).length})
                </button>
              )}
              </div>

              <button className="flex items-center gap-1 px-5 py-2 rounded-full 
                        bg-white/5 backdrop-blur-sm border border-white/10 
                        text-slate-300 hover:text-white hover:bg-indigo-300/70 
                        hover:border-indigo-300/70 transition-all duration-300 group"
                          onClick={handleLogout}>
                  <span className="text-sm font-medium">Cerrar sesión</span>
                  <LogOut size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>

      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-2 justify-center items-center">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
        
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white cursor-pointer">
          <option value="all">Todos los Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 mt-0">
        <table className="min-w-full text-left">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-800">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4 font-semibold text-gray-200 border-b border-gray-700">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 text-gray-300">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
          className="flex items-center gap-1 px-15 py-2 rounded-full 
                        bg-white/5 backdrop-blur-sm border border-white/10 
                        text-slate-300 hover:text-white hover:bg-indigo-300/70 
                        hover:border-indigo-300/70 transition-all duration-300 group">
                          Anterior
        </button>

        <span className="text-gray-300 font-medium">
          Página <span className="text-white">{page}</span> de <span className="text-white">{totalPages}</span>
        </span>

        <button
          onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-15 py-2 rounded-full 
                        bg-white/5 backdrop-blur-sm border border-white/10 
                        text-slate-300 hover:text-white hover:bg-indigo-300/70 
                        hover:border-indigo-300/70 transition-all duration-300 group">
          Siguiente
        </button>
      </div>

      </div>
  );
}