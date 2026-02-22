"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, Trash2, Edit3, Star, PlusCircle, MessageSquare, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavoriteStore } from "../../store/useFavoriteStore";

type Post = {
  id: string; // Siempre string para evitar problemas de key
  user: string;
  content: string;
};

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites, toggleFavorite } = useFavoriteStore();
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [postContent, setPostContent] = useState('');
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  // Cargar posts desde API
  const { data: apiPosts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/posts?_limit=10")
        .then(res => res.json())
        .then(data => data.map((p: any) => ({
          id: `api-${p.id}`,
          user: `Usuario ${p.userId}`,
          content: p.body,
        }))),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (id.startsWith("api-")) {
        await fetch(`https://jsonplaceholder.typicode.com/posts/${id.replace("api-", "")}`, { method: 'DELETE' });
      }
      return id;
    },
   onMutate: async (id: string) => {
    if (id.startsWith("new-")) {
      setLocalPosts(prev => prev.filter(p => p.id !== id));
      return;
    }

    await queryClient.cancelQueries({ queryKey: ["posts"] });
    const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
    queryClient.setQueryData<Post[]>(["posts"], old => old?.filter(p => p.id !== id) || []);
    return { previousPosts };
  },
    onError: (err, id, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
  });

  const combinedPosts = useMemo(() => [...localPosts, ...apiPosts], [localPosts, apiPosts]);

  const filteredPosts = useMemo(() => {
    if (!showFavorites || !user) return combinedPosts;

    return combinedPosts.filter(p =>
      favorites.includes(`${user.email}-${p.id}`)
    );
  }, [combinedPosts, showFavorites, favorites, user?.email]);

  const { data: comments, isLoading: loadingComments } = useQuery({
    queryKey: ["comments", expandedPostId],
    queryFn: () =>
      fetch(`https://jsonplaceholder.typicode.com/posts/${expandedPostId?.replace("api-", "")}/comments`)
        .then(res => res.json()),
    enabled: !!expandedPostId,
  });

  // Crear o editar post
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !postContent.trim()) return;

    if (editingPostId) {
      // Editar post existente
      setLocalPosts(prev =>
        prev.map(p => p.id === editingPostId ? { ...p, content: postContent } : p)
      );
      setEditingPostId(null);
    } else {
      // Nuevo post
      const newPost: Post = {
        id: `new-${Date.now()}`,
        user: user.email,
        content: postContent,
      };
      setLocalPosts([newPost, ...localPosts]);
    }

    setPostContent('');
    setShowForm(false);
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-indigo-950 to-blue-950 text-white p-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      <div className="p-6 border-b border-white/10 flex justify-between items-center backdrop-blur-xl sticky top-0 z-50">
        <h2 className="text-2xl font-black italic tracking-tighter">POSTS</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <button onClick={() => { setShowForm(true); setEditingPostId(null); }}>
              <PlusCircle size={35} className="text-blue-400"/>
            </button>

            {showForm && (
              <form className="absolute right-0 mt-2 w-80 p-4 bg-black/80 border border-white/20 rounded-xl flex flex-col gap-2">
                <textarea
                  placeholder="Escribe tu post..."
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  rows={4}
                  className="border px-2 py-1 rounded bg-black/70"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1 border rounded">Cancelar</button>
                  <button type="submit" onClick={handleSubmit} className="px-3 py-1 bg-blue-400 text-white rounded">
                    {editingPostId ? "Guardar" : "Publicar"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <button onClick={() => setShowFavorites(!showFavorites)}>
            <Star size={35} className={showFavorites ? "text-blue-400 fill-blue-400" : "text-gray-600"} />
          </button>

          <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full text-xs font-bold text-blue-400">
            {isAdmin ? '🛡️ ADMIN' : '👤 USER'}
          </div>

          <button onClick={() => { localStorage.removeItem("user"); router.replace("/"); }} className="hover:text-red-400 transition-colors">
            <LogOut size={22} />
          </button>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map(post => {
            const isFav = user ? favorites.includes(`${user.email}-${post.id}`) : false;

            return (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-8 flex gap-6 hover:bg-white/5 transition-colors group relative"
              >
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-600 to-blue-700 shadow-lg shadow-indigo-500/20 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-indigo-300">{post.user}</span>
                    {isAdmin && (
                      <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="text-gray-500 hover:text-blue-400"
                          onClick={() => {
                            setEditingPostId(post.id);
                            setPostContent(post.content);
                            setShowForm(true);
                          }}
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => {
                            if (confirm("¿Eliminar?")) deleteMutation.mutate(post.id)
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-300 my-4 text-lg font-light leading-relaxed">{post.content}</p>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileTap={{ scale: 1.5, rotate: 145 }}
                        onClick={() => {
                          if (!user || !user.email) return;
                          toggleFavorite(user.email, post.id);
                        }}
                        className="focus:outline-none"
                      >
                        <Star size={24} className={`transition-all duration-300 ${isFav ? "text-blue-400 fill-blue-400" : "text-gray-600"}`} />
                      </motion.button>
                      <span className="text-[10px] font-mono text-gray-500 tracking-tighter uppercase">
                        {isFav ? "1 Favorite" : "0 Favorites"}
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors group/btn"
                    >
                      <MessageSquare size={18} />
                      <span className="uppercase tracking-widest">{expandedPostId === post.id ? "Cerrar" : "Comentarios"}</span>
                      <motion.div animate={{ rotate: expandedPostId === post.id ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown size={16} />
                      </motion.div>
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedPostId === post.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/5 rounded-xl mt-6 p-6 border-l-2 border-indigo-500/50 shadow-inner"
                      >
                        <h4 className="text-[10px] font-black text-indigo-400 mb-4 tracking-widest uppercase">Conversación</h4>
                        {loadingComments ? (
                          <div className="space-y-2">
                            <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
                          </div>
                        ) : (
                          comments?.map((c: any) => (
                            <div key={c.id} className="mb-4 last:mb-0 border-b border-white/5 pb-3 last:border-0">
                              <p className="text-[10px] text-blue-300/70 font-bold mb-1">{c.email}</p>
                              <p className="text-sm text-gray-400 font-light italic leading-snug">"{c.body}"</p>
                            </div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}