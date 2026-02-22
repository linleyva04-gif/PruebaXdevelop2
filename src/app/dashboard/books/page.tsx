"use client"; 

import { useState } from 'react';
import { motion } from "framer-motion";
import { useEffect } from "react"; 
import { useRouter } from "next/navigation";

interface Libro {
  title: string;
  cover_i?: number;
  author_name?: string[];
  first_publish_year?: number;
  publisher?: string[];
  language?: string[];
  subject?: string[];
  key: string; 
}

const LibrosSeccion = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [books, setBooks] = useState<Libro[]>([]);
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  if (loading || !user) return <div>Cargando...</div>;

  const buscarLibros = async () => {
    if (!query && !author && !year) return;

    setLoading(true);
    
    const params = new URLSearchParams();
    if (query) params.append('title', query);
    if (author) params.append('author', author);
    if (year) params.append('year', year);

    try {
      const response = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
      
      if (!response.ok) throw new Error('Error en la red');
      
      const data = await response.json();
      setBooks(data.docs.slice(0, 24)); 
    } catch (error) {
      console.error("Error al buscar:", error);
      alert("No se pudo conectar con la librería. Revisa tu internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-linear-to-br from-black via-indigo-950 to-blue-950 text-white p-10 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 opacity-20 blur-3xl rounded-full"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>    

      <div className="flex flex-wrap gap-4 mb-8 bg-white/5 p-6 rounded-2xl border border-white/10">
        <input 
          placeholder="Título (ej: The Hunger Games)" 
          className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-blue-500"
          onChange={(e) => setQuery(e.target.value)} />

        <input 
          placeholder="Autor" 
          className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-blue-500"
          onChange={(e) => setAuthor(e.target.value)} />

        <input 
          placeholder="Año" 
          className="w-24 p-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:border-blue-500"
          onChange={(e) => setYear(e.target.value)} />

        <button 
            onClick={buscarLibros}
            disabled={loading}
            className="flex items-center gap-1 px-5 py-2 rounded-full 
                   bg-white/5 backdrop-blur-sm border border-white/10 
                   text-slate-300 hover:text-white hover:bg-indigo-300/70 
                   hover:border-indigo-300/70 transition-all duration-300 group"        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col items-center">
            <div className="w-full h-48 bg-black/20 rounded-md mb-4 overflow-hidden flex items-center justify-center">
              {book.cover_i ? (
                <img 
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} 
                  alt={book.title}
                  className="h-full object-contain"
                />
              ) : (
                <span className="text-gray-600 text-xs">Sin portada</span>
              )}
            </div>
            <h3 className="font-bold text-center line-clamp-2">{book.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{book.author_name?.[0]}</p>
            <p className="text-blue-500 text-xs mt-2 font-bold">{book.first_publish_year}</p>

                <div 
                    key={index} 
                    onClick={() => setSelectedBook(book)} 
                    className=" cursor-pointer bg-white/5 px-3 rounded-xl border border-white/10 hover:border-yellow-500/50 transition-all">
                        Ver mas
                </div>
          </div>
          
        ))}
      </div>
      
      
      {selectedBook && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-[#1a1a1a] border border-white/10 p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      
      <button 
        onClick={() => setSelectedBook(null)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white">
        ✕
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          {selectedBook.cover_i ? (
            <img 
              src={`https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`} 
              className="w-full rounded-xl shadow-lg"
              alt={selectedBook.title}/>) : 
              
              (<div className="w-full aspect-2/3 bg-white/5 rounded-xl flex items-center justify-center">Sin portada</div>)}
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-2">{selectedBook.title}</h2>
          <p className="text-blue-500 text-lg mb-4">{selectedBook.author_name?.join(', ')}</p>
          
          <div className="space-y-3 text-gray-300">
            <p><strong>Primera publicación:</strong> {selectedBook.first_publish_year}</p>
            {selectedBook.publisher && (
              <p><strong>Editorial:</strong> {selectedBook.publisher[0]}</p>
            )}
            {selectedBook.language && (
              <p><strong>Idiomas disponibles:</strong> {selectedBook.language.length}</p>
            )}
            {selectedBook.subject && (
              <div className="mt-4">
                <p className="mb-2"><strong>Temas:</strong></p>
                <div className="flex flex-wrap gap-2">
                  {selectedBook.subject.slice(0, 5).map((s, i) => (
                    <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="mt-30 w-full bg-blue-500 text-black font-bold py-3 rounded-xl hover:bg-blue-400 transition-colors"
            onClick={() => window.open(`https://openlibrary.org${selectedBook.key}`, '_blank')}>
            Ver más en Open Library
          </button>
        </div>
      </div>
    </motion.div>
  </div>
)}
    </div>
  );
};

export default LibrosSeccion;