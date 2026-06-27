"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Film, Tv, Check, Trash2, X, Link as LinkIcon, Edit2, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { AVAILABLE_CATEGORIES } from "@/lib/constants";

const API_KEY = "c71d55c790adcb0fa9ea6ebcbc9a61a7";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function AdminControl() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<"search" | "url">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"movie" | "tv">("movie");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [urlInput, setUrlInput] = useState("");

  const [savedMedia, setSavedMedia] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editTab, setEditTab] = useState<'basic' | 'watch' | 'download' | 'categories'>('basic');
  const [filterQuery, setFilterQuery] = useState("");
  
  const [pendingAdd, setPendingAdd] = useState<{item: any, type: "movie" | "tv"} | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredMedia = savedMedia.filter(item => item.title.toLowerCase().includes(filterQuery.toLowerCase()));

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedMedia();
    }
  }, [isAuthenticated]);

  const fetchSavedMedia = async () => {
    try {
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setSavedMedia(data || []);
    } catch (err) {
      console.error("Failed to fetch saved media", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Credenciales incorrectas o usuario no encontrado");
    } else {
      setError("");
    }
    setLoading(false);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/${searchType}?query=${encodeURIComponent(searchQuery)}&api_key=${API_KEY}&language=es`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFromUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    // Extract ID and type from URL (e.g. https://www.themoviedb.org/movie/550-fight-club)
    const movieMatch = urlInput.match(/movie\/(\d+)/);
    const tvMatch = urlInput.match(/tv\/(\d+)/);

    let tmdbId = "";
    let type: "movie" | "tv" = "movie";

    if (movieMatch) {
      tmdbId = movieMatch[1];
      type = "movie";
    } else if (tvMatch) {
      tmdbId = tvMatch[1];
      type = "tv";
    } else {
      // Maybe it's just an ID
      if (/^\d+$/.test(urlInput)) {
        tmdbId = urlInput;
        type = searchType; // use selected radio
      } else {
        alert("URL no válida. Debe ser de themoviedb.org o un ID numérico.");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${API_KEY}&language=es`);
      const data = await res.json();
      if (data.id) {
        handleOpenEditModal(data, type);
        setUrlInput("");
      } else {
        alert("No se encontró contenido con ese ID");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (item: any, type: "movie" | "tv") => {
    const isMovie = type === "movie";
    const formattedItem = {
      id: item.id.toString(),
      title: isMovie ? item.title : item.name,
      year: isMovie ? item.release_date?.substring(0,4) : item.first_air_date?.substring(0,4),
      type: isMovie ? "Película" : "Serie",
      rating: item.vote_average?.toFixed(1) || "N/A",
      slug: (isMovie ? item.title : item.name).toLowerCase().replace(/[\s\W-]+/g, '-'),
      imageUrl: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : "https://via.placeholder.com/400x600?text=No+Image",
      category: "",
      overview: item.overview,
      isNew: true
    };
    setEditingItem(formattedItem);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este elemento?")) return;
    
    try {
      const { error } = await supabase.from('media').delete().eq('id', id);
      if (error) throw error;
      fetchSavedMedia();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    // Validate basic fields
    if (!editingItem.category) {
      alert("Por favor selecciona al menos una categoría en la pestaña 'Categorías'");
      setEditTab('categories');
      return;
    }

    try {
      if (editingItem.isNew) {
        const { isNew, ...itemToSave } = editingItem;
        const { error } = await supabase.from('media').insert([itemToSave]);
        if (error) throw error;
        alert("¡Agregado y guardado con éxito!");
      } else {
        const { error } = await supabase.from('media').update(editingItem).eq('id', editingItem.id);
        if (error) throw error;
        alert("¡Actualizado con éxito!");
      }
      
      setEditingItem(null);
      fetchSavedMedia();
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar");
    }
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const toggleEditCategory = (cat: string) => {
    const currentCats = editingItem.category ? editingItem.category.split(",").map((c: string) => c.trim()) : [];
    const currentCatsLower = currentCats.map((c: string) => c.toLowerCase());
    
    let newCats;
    if (currentCatsLower.includes(cat.toLowerCase())) {
      newCats = currentCats.filter((c: string) => c.toLowerCase() !== cat.toLowerCase());
    } else {
      newCats = [...currentCats, cat];
    }
    setEditingItem({ ...editingItem, category: newCats.join(", ") });
  };

  const addLink = (type: 'watchLinks' | 'downloadLinks') => {
    const currentLinks = editingItem[type] || [];
    setEditingItem({
      ...editingItem,
      [type]: [...currentLinks, { serverName: "", lang: "", url: "" }]
    });
  };

  const removeLink = (type: 'watchLinks' | 'downloadLinks', index: number) => {
    const currentLinks = editingItem[type] || [];
    setEditingItem({
      ...editingItem,
      [type]: currentLinks.filter((_: any, i: number) => i !== index)
    });
  };

  const updateLink = (type: 'watchLinks' | 'downloadLinks', index: number, field: string, value: string) => {
    const currentLinks = [...(editingItem[type] || [])];
    currentLinks[index] = { ...currentLinks[index], [field]: value };
    setEditingItem({
      ...editingItem,
      [type]: currentLinks
    });
  };

  const addSeason = () => {
    const customData = editingItem.customData || {};
    const currentSeasons = customData.seasonsData || [];
    const newSeasonNumber = currentSeasons.length + 1;
    setEditingItem({
      ...editingItem,
      customData: {
        ...customData,
        seasonsData: [...currentSeasons, { seasonNumber: newSeasonNumber, title: `Temporada ${newSeasonNumber}`, episodes: [] }]
      }
    });
  };

  const removeSeason = (seasonIndex: number) => {
    const customData = editingItem.customData || {};
    const currentSeasons = [...(customData.seasonsData || [])];
    currentSeasons.splice(seasonIndex, 1);
    setEditingItem({ ...editingItem, customData: { ...customData, seasonsData: currentSeasons } });
  };

  const addEpisode = (seasonIndex: number) => {
    const customData = editingItem.customData || {};
    const currentSeasons = [...(customData.seasonsData || [])];
    const newEpisodeNumber = currentSeasons[seasonIndex].episodes.length + 1;
    currentSeasons[seasonIndex].episodes.push({ episodeNumber: newEpisodeNumber, title: `Capítulo ${newEpisodeNumber}`, watchLinks: [], downloadLinks: [] });
    setEditingItem({ ...editingItem, customData: { ...customData, seasonsData: currentSeasons } });
  };

  const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
    const customData = editingItem.customData || {};
    const currentSeasons = [...(customData.seasonsData || [])];
    currentSeasons[seasonIndex].episodes.splice(episodeIndex, 1);
    setEditingItem({ ...editingItem, customData: { ...customData, seasonsData: currentSeasons } });
  };

  const addSeasonLink = (seasonIndex: number, episodeIndex: number, type: 'watchLinks' | 'downloadLinks' = 'watchLinks') => {
    const customData = editingItem.customData || {};
    const currentSeasons = [...(customData.seasonsData || [])];
    if (!currentSeasons[seasonIndex].episodes[episodeIndex][type]) currentSeasons[seasonIndex].episodes[episodeIndex][type] = [];
    currentSeasons[seasonIndex].episodes[episodeIndex][type].push({ serverName: "", lang: "", url: "" });
    setEditingItem({ ...editingItem, customData: { ...customData, seasonsData: currentSeasons } });
  };

  const updateSeasonLink = (seasonIndex: number, episodeIndex: number, linkIndex: number, field: string, value: string, type: 'watchLinks' | 'downloadLinks' = 'watchLinks') => {
    const customData = editingItem.customData || {};
    const currentSeasons = [...(customData.seasonsData || [])];
    currentSeasons[seasonIndex].episodes[episodeIndex][type][linkIndex][field] = value;
    setEditingItem({ ...editingItem, customData: { ...customData, seasonsData: currentSeasons } });
  };

  const removeSeasonLink = (seasonIndex: number, episodeIndex: number, linkIndex: number, type: 'watchLinks' | 'downloadLinks' = 'watchLinks') => {
    const customData = editingItem.customData || {};
    const currentSeasons = [...(customData.seasonsData || [])];
    currentSeasons[seasonIndex].episodes[episodeIndex][type].splice(linkIndex, 1);
    setEditingItem({ ...editingItem, customData: { ...customData, seasonsData: currentSeasons } });
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0d0d11] flex items-center justify-center p-4">
        <div className="bg-[#1a1a24] p-8 rounded-xl border border-white/5 w-full max-w-md">
          <div className="text-2xl font-black tracking-tight text-white uppercase flex items-center justify-center mb-8">
            <span className="bg-[#e50914] text-white px-2 py-1 rounded-sm mr-2 text-sm">ADMIN</span>
            Panel
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0d11] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e50914] transition"
                placeholder="admin@correo.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0d11] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e50914] transition"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            {error && <p className="text-[#e50914] text-sm text-center">{error}</p>}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#e50914] hover:bg-[#b80710] disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0d11] pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="bg-[#e50914] text-white p-2 rounded-lg">
              <Film size={24} />
            </span>
            Gestor de Contenido
          </h1>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition flex items-center gap-2"
          >
            <X size={20} />
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel Izquierdo: Buscador/Agregar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1a1a24] rounded-xl border border-white/5 p-1 flex">
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${activeTab === 'search' ? 'bg-[#e50914] text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab("search")}
              >
                Buscar Nombre
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${activeTab === 'url' ? 'bg-[#e50914] text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab("url")}
              >
                URL / ID
              </button>
            </div>

            <div className="bg-[#1a1a24] rounded-xl border border-white/5 p-6">
              {activeTab === "search" ? (
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex bg-[#0d0d11] rounded-lg p-1 border border-white/10">
                    <label className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-md cursor-pointer transition ${searchType === 'movie' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                      <input type="radio" name="type" className="hidden" checked={searchType === 'movie'} onChange={() => setSearchType('movie')} />
                      <Film size={16} /> Películas
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-md cursor-pointer transition ${searchType === 'tv' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                      <input type="radio" name="type" className="hidden" checked={searchType === 'tv'} onChange={() => setSearchType('tv')} />
                      <Tv size={16} /> Series
                    </label>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ej. Avengers, Euphoria..."
                      className="w-full bg-[#0d0d11] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#e50914] transition"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#e50914] hover:bg-[#b80710] disabled:bg-[#e50914]/50 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {loading ? "Buscando..." : <><Search size={20} /> Buscar en TMDB</>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAddFromUrl} className="space-y-4">
                  <p className="text-sm text-gray-400 mb-2">Pega la URL de themoviedb.org o el ID de la película/serie.</p>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                      type="text" 
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://www.themoviedb.org/movie/550..."
                      className="w-full bg-[#0d0d11] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#e50914] transition"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#e50914] hover:bg-[#b80710] disabled:bg-[#e50914]/50 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {loading ? "Procesando..." : <><Plus size={20} /> Agregar Directamente</>}
                  </button>
                </form>
              )}
            </div>

            {/* Resultados de búsqueda */}
            {activeTab === "search" && searchResults.length > 0 && (
              <div className="bg-[#1a1a24] rounded-xl border border-white/5 p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                <h3 className="text-white font-medium mb-4 sticky top-0 bg-[#1a1a24] py-2 z-10">Resultados</h3>
                <div className="space-y-4">
                  {searchResults.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-[#0d0d11] p-3 rounded-lg border border-white/5 group hover:border-white/20 transition">
                      <img 
                        src={item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : "https://via.placeholder.com/100x150?text=No+Img"} 
                        alt={item.title || item.name}
                        className="w-16 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm line-clamp-1">{item.title || item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.release_date?.substring(0,4) || item.first_air_date?.substring(0,4)}</p>
                        <div className="flex mt-3">
                          <button 
                            onClick={() => handleOpenEditModal(item, searchType)}
                            className="bg-[#e50914]/20 text-[#e50914] hover:bg-[#e50914] hover:text-white px-3 py-1.5 rounded transition flex-1 text-sm font-bold flex items-center justify-center gap-1"
                          >
                            <Plus size={16} /> Configurar y Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel Derecho: Lista de agregados */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a24] rounded-xl border border-white/5 p-6 h-full min-h-[600px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-white">Contenido Agregado ({savedMedia.length})</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Filtrar por título..." 
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="w-full bg-[#0d0d11] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[#e50914] transition"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredMedia.map((item) => (
                  <div key={item.id} className="relative group rounded-lg overflow-hidden border border-white/10">
                    <img src={item.imageUrl} alt={item.title} className="w-full aspect-[2/3] object-cover" />
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                      <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-400 mb-3">{item.year} • {item.type}</p>
                      
                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                        {(item.category || "").split(",").map((cat: string, i: number) => {
                          if (!cat.trim()) return null;
                          return (
                            <span key={i} className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded-sm">
                              {cat.trim()}
                            </span>
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingItem(item)}
                          className="bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white p-2 rounded-full transition"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full transition"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {savedMedia.length > 0 && filteredMedia.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500">
                    <p>No se encontraron resultados para "{filterQuery}"</p>
                  </div>
                )}
                
                {savedMedia.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-500">
                    <Film size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No hay contenido agregado aún.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1a1a24] rounded-xl border border-white/10 w-full max-w-2xl my-8 flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#14141c]">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Edit2 className="text-[#e50914]" size={24} /> Editar Contenido
              </h2>
              <button onClick={() => setEditingItem(null)} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-white/5 bg-[#1a1a24] overflow-x-auto custom-scrollbar">
              <button onClick={() => setEditTab('basic')} className={`px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${editTab === 'basic' ? 'text-[#e50914] border-b-2 border-[#e50914] bg-white/5' : 'text-gray-400 hover:text-white'}`}>Información Básica</button>
              <button onClick={() => setEditTab('categories')} className={`px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${editTab === 'categories' ? 'text-[#e50914] border-b-2 border-[#e50914] bg-white/5' : 'text-gray-400 hover:text-white'}`}>Categorías</button>
              <button onClick={() => setEditTab('watch')} className={`px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${editTab === 'watch' ? 'text-[#e50914] border-b-2 border-[#e50914] bg-white/5' : 'text-gray-400 hover:text-white'}`}>Reproductor</button>
              <button onClick={() => setEditTab('download')} className={`px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${editTab === 'download' ? 'text-[#e50914] border-b-2 border-[#e50914] bg-white/5' : 'text-gray-400 hover:text-white'}`}>Descargas</button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar max-h-[60vh] bg-[#0d0d11]">
              
              {editTab === 'basic' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-[#1a1a24] p-5 rounded-lg border border-white/5">
                    <p className="text-sm text-gray-400 mb-4 italic">Solo llena estos campos si deseas reemplazar la información original que viene de TMDB.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Nuevo Título</label>
                        <input type="text" placeholder={editingItem.title} value={editingItem.customData?.title || ''} onChange={e => setEditingItem({...editingItem, customData: {...(editingItem.customData || {}), title: e.target.value}})} className="w-full bg-[#0d0d11] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e50914] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Nueva Sinopsis</label>
                        <textarea placeholder={editingItem.overview} value={editingItem.customData?.overview || ''} onChange={e => setEditingItem({...editingItem, customData: {...(editingItem.customData || {}), overview: e.target.value}})} className="w-full bg-[#0d0d11] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e50914] min-h-[120px] transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {editTab === 'categories' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-[#1a1a24] p-5 rounded-lg border border-white/5">
                    <h3 className="font-bold text-white mb-4">Selecciona las categorías para este contenido</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {AVAILABLE_CATEGORIES.map((cat) => {
                        const isChecked = editingItem.category ? editingItem.category.toLowerCase().split(",").map((c: string) => c.trim()).includes(cat.toLowerCase()) : false;
                        return (
                          <label key={cat} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'bg-[#e50914]/20 border-[#e50914]' : 'bg-[#0d0d11] border-white/10 hover:border-white/30'}`}>
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={isChecked}
                              onChange={() => toggleEditCategory(cat)}
                            />
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${isChecked ? 'bg-[#e50914] border-[#e50914]' : 'border-gray-500'}`}>
                              {isChecked && <Check size={14} className="text-white" />}
                            </div>
                            <span className="text-sm font-medium text-white">{cat}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {editTab === 'watch' && (
                <div className="space-y-4 animate-fade-in">
                  {editingItem.type === "Serie" ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-[#1a1a24] p-4 rounded-lg border border-white/5">
                        <div>
                          <h3 className="font-bold text-white">Temporadas y Capítulos</h3>
                          <p className="text-xs text-gray-400">Agrega temporadas y sus respectivos capítulos con enlaces de video.</p>
                        </div>
                        <button onClick={addSeason} className="bg-[#e50914] hover:bg-[#b80710] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                          <Plus size={16} /> Agregar Temporada
                        </button>
                      </div>

                      <div className="space-y-6">
                        {(editingItem.customData?.seasonsData || []).map((season: any, sIdx: number) => (
                          <div key={sIdx} className="bg-[#14141c] p-4 rounded-xl border border-white/10 relative">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                              <h4 className="font-bold text-white text-lg">Temporada {season.seasonNumber}</h4>
                              <div className="flex gap-2">
                                <button onClick={() => addEpisode(sIdx)} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors">
                                  <Plus size={14} /> Capítulo
                                </button>
                                <button onClick={() => removeSeason(sIdx)} className="text-gray-500 hover:text-red-500 bg-white/5 hover:bg-red-500/10 p-1.5 rounded transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {season.episodes?.map((ep: any, eIdx: number) => (
                                <div key={eIdx} className="bg-[#1a1a24] p-4 rounded-lg border border-white/5">
                                  <div className="flex justify-between items-center mb-3">
                                    <h5 className="font-semibold text-white text-sm">Capítulo {ep.episodeNumber}: {ep.title}</h5>
                                    <div className="flex gap-2">
                                      <button onClick={() => addSeasonLink(sIdx, eIdx, 'watchLinks')} className="text-[#e50914] hover:text-[#ff0a16] text-xs font-bold flex items-center gap-1 transition-colors">
                                        <Plus size={14} /> Reproductor
                                      </button>
                                      <button onClick={() => addSeasonLink(sIdx, eIdx, 'downloadLinks')} className="text-[#2196f3] hover:text-[#42a5f5] text-xs font-bold flex items-center gap-1 transition-colors">
                                        <Plus size={14} /> Descarga
                                      </button>
                                      <button onClick={() => removeEpisode(sIdx, eIdx)} className="text-gray-500 hover:text-red-500 transition-colors ml-2">
                                        <X size={16} />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    {ep.watchLinks?.length > 0 && (
                                      <div className="space-y-2">
                                        <h6 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Enlaces de Reproductor</h6>
                                        {ep.watchLinks.map((link: any, lIdx: number) => (
                                          <div key={lIdx} className="flex flex-col gap-2 bg-[#0d0d11] p-3 rounded border border-white/5 relative group">
                                            <button onClick={() => removeSeasonLink(sIdx, eIdx, lIdx, 'watchLinks')} className="absolute top-2 right-2 text-gray-600 hover:text-red-500"><X size={14} /></button>
                                            <div className="grid grid-cols-2 gap-3 pr-6">
                                              <input type="text" placeholder="Servidor (Ej: Mega)" value={link.serverName} onChange={e => updateSeasonLink(sIdx, eIdx, lIdx, 'serverName', e.target.value, 'watchLinks')} className="w-full bg-[#1a1a24] border border-white/5 rounded px-3 py-1.5 text-white text-xs outline-none" />
                                              <input type="text" placeholder="Idioma (Ej: Latino)" value={link.lang} onChange={e => updateSeasonLink(sIdx, eIdx, lIdx, 'lang', e.target.value, 'watchLinks')} className="w-full bg-[#1a1a24] border border-white/5 rounded px-3 py-1.5 text-white text-xs outline-none" />
                                            </div>
                                            <input type="text" placeholder="URL del iframe..." value={link.url} onChange={e => updateSeasonLink(sIdx, eIdx, lIdx, 'url', e.target.value, 'watchLinks')} className="w-full bg-[#1a1a24] border border-white/5 rounded px-3 py-1.5 text-white text-xs outline-none" />
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {ep.downloadLinks?.length > 0 && (
                                      <div className="space-y-2">
                                        <h6 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Enlaces de Descarga</h6>
                                        {ep.downloadLinks.map((link: any, lIdx: number) => (
                                          <div key={`dl-${lIdx}`} className="flex flex-col gap-2 bg-[#0d0d11] p-3 rounded border border-white/5 relative group">
                                            <button onClick={() => removeSeasonLink(sIdx, eIdx, lIdx, 'downloadLinks')} className="absolute top-2 right-2 text-gray-600 hover:text-red-500"><X size={14} /></button>
                                            <div className="grid grid-cols-2 gap-3 pr-6">
                                              <input type="text" placeholder="Servidor (Ej: Mega)" value={link.serverName} onChange={e => updateSeasonLink(sIdx, eIdx, lIdx, 'serverName', e.target.value, 'downloadLinks')} className="w-full bg-[#1a1a24] border border-white/5 rounded px-3 py-1.5 text-white text-xs outline-none" />
                                              <input type="text" placeholder="Calidad/Idioma" value={link.lang} onChange={e => updateSeasonLink(sIdx, eIdx, lIdx, 'lang', e.target.value, 'downloadLinks')} className="w-full bg-[#1a1a24] border border-white/5 rounded px-3 py-1.5 text-white text-xs outline-none" />
                                            </div>
                                            <input type="text" placeholder="URL de descarga..." value={link.url} onChange={e => updateSeasonLink(sIdx, eIdx, lIdx, 'url', e.target.value, 'downloadLinks')} className="w-full bg-[#1a1a24] border border-white/5 rounded px-3 py-1.5 text-white text-xs outline-none" />
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {!(ep.watchLinks?.length > 0) && !(ep.downloadLinks?.length > 0) && (
                                      <p className="text-xs text-gray-500 text-center py-2">Sin enlaces para este capítulo</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {!(season.episodes?.length > 0) && (
                                <p className="text-sm text-gray-500 text-center py-4 border border-dashed border-white/5 rounded-lg">No hay capítulos en esta temporada</p>
                              )}
                            </div>
                          </div>
                        ))}
                        {!(editingItem.customData?.seasonsData?.length > 0) && (
                          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-white/5 rounded-lg">
                            No has agregado ninguna temporada.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-[#1a1a24] p-4 rounded-lg border border-white/5">
                        <div>
                          <h3 className="font-bold text-white">Servidores de Video</h3>
                          <p className="text-xs text-gray-400">Agrega enlaces iframe para que se vean directamente en la página.</p>
                        </div>
                        <button onClick={() => addLink('watchLinks')} className="bg-[#e50914] hover:bg-[#b80710] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                          <Plus size={16} /> Agregar
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {(editingItem.watchLinks || []).map((link: any, idx: number) => (
                          <div key={idx} className="bg-[#1a1a24] p-4 rounded-lg border border-white/10 flex flex-col gap-3 relative group">
                            <button onClick={() => removeLink('watchLinks', idx)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                            <div className="grid grid-cols-2 gap-4 pr-8">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Nombre del Servidor</label>
                                <input type="text" placeholder="Ej: Fembed" value={link.serverName} onChange={e => updateLink('watchLinks', idx, 'serverName', e.target.value)} className="w-full bg-[#0d0d11] border border-white/5 rounded px-3 py-2 text-white text-sm focus:border-white/20 outline-none" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Idioma / Calidad</label>
                                <input type="text" placeholder="Ej: Latino HD" value={link.lang} onChange={e => updateLink('watchLinks', idx, 'lang', e.target.value)} className="w-full bg-[#0d0d11] border border-white/5 rounded px-3 py-2 text-white text-sm focus:border-white/20 outline-none" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Enlace del iframe (URL)</label>
                              <input type="text" placeholder="https://..." value={link.url} onChange={e => updateLink('watchLinks', idx, 'url', e.target.value)} className="w-full bg-[#0d0d11] border border-white/5 rounded px-3 py-2 text-white text-sm focus:border-white/20 outline-none" />
                            </div>
                          </div>
                        ))}
                        {!(editingItem.watchLinks?.length > 0) && (
                          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-white/5 rounded-lg">
                            No hay servidores de video. Se mostrará el tráiler de YouTube.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {editTab === 'download' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center bg-[#1a1a24] p-4 rounded-lg border border-white/5">
                    <div>
                      <h3 className="font-bold text-white">Enlaces de Descarga</h3>
                      <p className="text-xs text-gray-400">Agrega enlaces externos para descargar la película.</p>
                    </div>
                    <button onClick={() => addLink('downloadLinks')} className="bg-[#e50914] hover:bg-[#b80710] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                      <Plus size={16} /> Agregar
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {(editingItem.downloadLinks || []).map((link: any, idx: number) => (
                      <div key={idx} className="bg-[#1a1a24] p-4 rounded-lg border border-white/10 flex flex-col gap-3 relative group">
                        <button onClick={() => removeLink('downloadLinks', idx)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                        <div className="grid grid-cols-2 gap-4 pr-8">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Servidor (Ej: Mega)</label>
                            <input type="text" placeholder="Mega" value={link.serverName} onChange={e => updateLink('downloadLinks', idx, 'serverName', e.target.value)} className="w-full bg-[#0d0d11] border border-white/5 rounded px-3 py-2 text-white text-sm focus:border-white/20 outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Detalles (Ej: Latino 1080p)</label>
                            <input type="text" placeholder="Latino 1080p" value={link.lang} onChange={e => updateLink('downloadLinks', idx, 'lang', e.target.value)} className="w-full bg-[#0d0d11] border border-white/5 rounded px-3 py-2 text-white text-sm focus:border-white/20 outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Enlace de descarga (URL)</label>
                          <input type="text" placeholder="https://..." value={link.url} onChange={e => updateLink('downloadLinks', idx, 'url', e.target.value)} className="w-full bg-[#0d0d11] border border-white/5 rounded px-3 py-2 text-white text-sm focus:border-white/20 outline-none" />
                        </div>
                      </div>
                    ))}
                    {!(editingItem.downloadLinks?.length > 0) && (
                      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-white/5 rounded-lg">
                        No hay enlaces de descarga configurados.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-[#14141c] flex justify-end gap-3">
              <button onClick={() => setEditingItem(null)} className="px-6 py-3 rounded-lg text-gray-400 hover:text-white font-bold transition-colors">
                Cancelar
              </button>
              <button onClick={handleSaveEdit} className="px-8 py-3 bg-[#e50914] hover:bg-[#b80710] text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-[#e50914]/20 hover:shadow-[#e50914]/40 hover:-translate-y-0.5">
                <Save size={18} /> Guardar Película
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal para Seleccionar Categorías al Agregar */}
      {pendingAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a24] rounded-xl border border-white/10 w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-5 border-b border-white/5 bg-[#14141c]">
              <h2 className="text-xl font-bold text-white">Categorías</h2>
              <button onClick={() => setPendingAdd(null)} className="text-gray-400 hover:text-white bg-white/5 p-1.5 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 bg-[#0d0d11]">
              <p className="text-sm text-gray-400 mb-4">
                Elige en qué carruseles quieres que aparezca <strong>{pendingAdd.item.title || pendingAdd.item.name}</strong>.
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {AVAILABLE_CATEGORIES.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label key={cat} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'bg-[#e50914]/20 border-[#e50914]' : 'bg-[#1a1a24] border-white/5 hover:border-white/20'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={isChecked}
                        onChange={() => toggleCategory(cat)}
                      />
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${isChecked ? 'bg-[#e50914] border-[#e50914]' : 'border-gray-500'}`}>
                        {isChecked && <Check size={14} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium text-white">{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="p-5 border-t border-white/5 bg-[#14141c] flex justify-end gap-3">
              <button onClick={() => setPendingAdd(null)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white font-medium transition-colors">
                Cancelar
              </button>
              <button onClick={saveToDatabase} className="px-6 py-2 bg-[#e50914] hover:bg-[#b80710] text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-[#e50914]/20">
                <Save size={16} /> Guardar Contenido
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
