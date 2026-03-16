import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { 
  Upload, CheckCircle, AlertCircle, Lock, KeyRound, 
  LayoutDashboard, PlusCircle, Package, LogOut, 
  TrendingUp, MonitorPlay, Trash2, Pencil, Tags
} from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'manage'>('dashboard');
  const [stats, setStats] = useState({ total: 0, latest: '' });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');
  
  // Přidán stav pro kategorii (výchozí je Notebooky)
  const [nazev, setNazev] = useState('');
  const [kategorie, setKategorie] = useState('Notebooky');
  const [cena, setCena] = useState('');
  const [popis, setPopis] = useState('');
  const [procesor, setProcesor] = useState('');
  const [ram, setRam] = useState('');
  const [uloziste, setUloziste] = useState('');
  const [grafika, setGrafika] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [seznamProduktu, setSeznamProduktu] = useState<any[]>([]);
  const [loadingManage, setLoadingManage] = useState(false);

  const ADMIN_HESLO = "admin";

  const fetchStatsAndProducts = async () => {
    const { count } = await supabase.from('produkty').select('*', { count: 'exact', head: true });
    const { data: latestData } = await supabase.from('produkty').select('nazev').order('id', { ascending: false }).limit(1);

    setStats({ 
      total: count || 0, 
      latest: latestData && latestData.length > 0 ? latestData[0].nazev : 'Zatím žádné produkty' 
    });

    setLoadingManage(true);
    const { data: productsData } = await supabase.from('produkty').select('*').order('id', { ascending: false });
    if (productsData) setSeznamProduktu(productsData);
    setLoadingManage(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchStatsAndProducts();
  }, [isAuthenticated, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_HESLO) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setPassword('');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNazev(''); setCena(''); setPopis(''); setKategorie('Notebooky');
    setProcesor(''); setRam(''); setUloziste(''); setGrafika('');
    setExistingImageUrl('');
    setFile(null);
  };

  const handleEdit = (produkt: any) => {
    setEditingId(produkt.id);
    setNazev(produkt.nazev);
    setCena(produkt.cena);
    setPopis(produkt.popis);
    setKategorie(produkt.kategorie || 'Notebooky'); // Načteme kategorii, nebo dáme výchozí
    setProcesor(produkt.procesor);
    setRam(produkt.ram);
    setUloziste(produkt.uloziste);
    setGrafika(produkt.grafika);
    setExistingImageUrl(produkt.obrazek_url);
    setFile(null);
    setActiveTab('add');
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId && !file) {
      setMessage({ type: 'error', text: 'Musíš vybrat fotku!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      let finalImageUrl = existingImageUrl;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('bazar-obrazky').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('bazar-obrazky').getPublicUrl(fileName);
        finalImageUrl = urlData.publicUrl;
      }

      // Do odesílaných dat jsme přidali kategorii
      const produktData = {
        nazev, cena, popis, procesor, ram, uloziste, grafika, kategorie, obrazek_url: finalImageUrl
      };

      if (editingId) {
        const { error: updateError } = await supabase.from('produkty').update(produktData).eq('id', editingId);
        if (updateError) throw updateError;
        setMessage({ type: 'success', text: 'Produkt byl úspěšně upraven!' });
      } else {
        const { error: insertError } = await supabase.from('produkty').insert([produktData]);
        if (insertError) throw insertError;
        setMessage({ type: 'success', text: 'Produkt byl úspěšně přidán!' });
      }

      resetForm();
      setTimeout(() => setActiveTab('manage'), 2000);

    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: `Chyba: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nazev_produktu: string) => {
    if (!window.confirm(`Opravdu chceš smazat produkt "${nazev_produktu}" z bazaru?`)) return;

    try {
      const { error } = await supabase.from('produkty').delete().eq('id', id);
      if (error) throw error;
      fetchStatsAndProducts();
      alert(`Produkt "${nazev_produktu}" byl smazán.`);
    } catch (error: any) {
      alert(`Chyba při mazání: ${error.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-[80vh] flex items-center justify-center">
        <div className="bg-zinc-900 border border-white/10 p-10 rounded-3xl w-full max-w-md text-center shadow-2xl">
          <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"><Lock size={40} /></div>
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Administrace</h2>
          <form onSubmit={handleLogin} className="space-y-4 mt-8">
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="" className="w-full bg-black border border-white/10 py-4 pl-12 pr-4 rounded-xl focus:border-orange-500 outline-none transition-all" />
            </div>
            {loginError && <p className="text-red-500 text-sm font-bold animate-pulse">Nesprávné heslo!</p>}
            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-black transition-all uppercase tracking-wider">Vstoupit</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-950 pt-20">
      
      <aside className="w-full md:w-64 bg-zinc-900 md:border-r border-b md:border-b-0 border-white/5 flex flex-col md:min-h-[calc(100vh-80px)]">
        <div className="p-6 border-b border-white/5 hidden md:block">
          <h2 className="text-2xl font-black italic uppercase"><span className="text-orange-500">ADMIN</span> PANEL</h2>
        </div>
        <nav className="flex-1 p-4 flex md:flex-col gap-2 overflow-x-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={20} /> Přehled
          </button>
          <button onClick={() => { resetForm(); setActiveTab('add'); }} className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'add' ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
            {editingId ? <Pencil size={20} /> : <PlusCircle size={20} />} 
            {editingId ? 'Upravit produkt' : 'Přidat produkt'}
          </button>
          <button onClick={() => setActiveTab('manage')} className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'manage' ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
            <Package size={20} /> Správa produktů
          </button>
        </nav>
        <div className="p-4 md:border-t border-white/5">
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-zinc-400 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider">
            <LogOut size={16} /> Odhlásit se
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        
        {activeTab === 'dashboard' && (
          <div className="transition-opacity duration-500">
            <h1 className="text-3xl font-black uppercase mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
              <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl">
                <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center mb-4"><Package size={24} /></div>
                <p className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-1">Počet položek v bazaru</p>
                <p className="text-4xl font-black">{stats.total}</p>
              </div>
              <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4"><TrendingUp size={24} /></div>
                <p className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-1">Naposledy přidáno</p>
                <p className="text-lg font-bold truncate text-white" title={stats.latest}>{stats.latest}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="max-w-3xl transition-opacity duration-500">
            <h1 className="text-3xl font-black uppercase mb-8">
              {editingId ? 'Upravit produkt' : 'Přidat nový produkt'}
            </h1>
            
            <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl shadow-xl">
              {message && (
                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-zinc-400 font-bold mb-2 text-sm uppercase">Kategorie</label>
                    <div className="relative">
                      <select required value={kategorie} onChange={(e) => setKategorie(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-all text-white appearance-none cursor-pointer">
                        <option value="Notebooky">Notebooky</option>
                        <option value="Počítače">Stolní PC</option>
                        <option value="Komponenty">Komponenty</option>
                        <option value="Příslušenství">Příslušenství</option>
                      </select>
                      <Tags className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={20} />
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-zinc-400 font-bold mb-2 text-sm uppercase">Název</label>
                    <input required value={nazev} onChange={(e) => setNazev(e.target.value)} type="text" className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-all text-white" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-zinc-400 font-bold mb-2 text-sm uppercase">Cena</label>
                    <input required value={cena} onChange={(e) => setCena(e.target.value)} type="text" className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-all text-white" />
                  </div>
                </div>

                <div className="bg-black/50 p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <h3 className="md:col-span-2 text-orange-500 font-bold uppercase tracking-wider mb-2">Parametry</h3>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-2 text-xs uppercase">Procesor</label>
                    <input required value={procesor} onChange={(e) => setProcesor(e.target.value)} type="text" className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-orange-500 outline-none transition-all text-white" />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-2 text-xs uppercase">Grafika</label>
                    <input required value={grafika} onChange={(e) => setGrafika(e.target.value)} type="text" className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-orange-500 outline-none transition-all text-white" />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-2 text-xs uppercase">RAM</label>
                    <input required value={ram} onChange={(e) => setRam(e.target.value)} type="text" className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-orange-500 outline-none transition-all text-white" />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-2 text-xs uppercase">Úložiště</label>
                    <input required value={uloziste} onChange={(e) => setUloziste(e.target.value)} type="text" className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-orange-500 outline-none transition-all text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-2 text-sm uppercase">Krátký popis</label>
                  <textarea required value={popis} onChange={(e) => setPopis(e.target.value)} rows={3} className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-all resize-none text-white"></textarea>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-2 text-sm uppercase">Fotka {editingId && <span className="text-zinc-600">(Nepovinné)</span>}</label>
                  <div className="w-full bg-black border border-white/10 p-4 rounded-xl border-dashed hover:border-orange-500 transition-all cursor-pointer relative overflow-hidden">
                    <input {...(!editingId && { required: true })} type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="flex items-center justify-center gap-3 text-zinc-500">
                      <Upload size={24} />
                      <span className="font-bold">{file ? file.name : editingId ? 'Ponechat současnou fotku nebo klikni pro změnu' : 'Klikni pro nahrání fotky'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  {editingId && (
                    <button type="button" onClick={() => { resetForm(); setActiveTab('manage'); }} className="w-1/3 bg-zinc-800 text-white py-4 rounded-xl font-black hover:bg-zinc-700 transition-all uppercase tracking-widest text-sm">
                      ZRUŠIT
                    </button>
                  )}
                  <button disabled={loading} type="submit" className={`flex-1 bg-orange-600 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-orange-500 transition-all disabled:opacity-50 tracking-widest uppercase ${editingId ? 'text-sm' : ''}`}>
                    {loading ? 'UKLÁDÁM...' : editingId ? 'ULOŽIT ZMĚNY' : 'ULOŽIT PRODUKT'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="max-w-4xl transition-opacity duration-500">
            <h1 className="text-3xl font-black uppercase mb-8">Správa produktů</h1>
            
            <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl p-6">
              {loadingManage ? (
                <div className="text-center py-12"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div></div>
              ) : seznamProduktu.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-zinc-700 mb-4" />
                  <p className="text-zinc-400 font-bold text-lg mb-2">Bazar je momentálně prázdný</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {seznamProduktu.map((produkt) => (
                    <div key={produkt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black p-4 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all gap-4">
                      
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-20 h-20 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0 border border-white/5 p-2 relative">
                          <img src={produkt.obrazek_url} alt={produkt.nazev} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          {/* Zobrazení štítku kategorie */}
                          <div className="inline-block px-2 py-1 bg-zinc-800 text-zinc-300 text-[10px] uppercase font-black tracking-widest rounded-md mb-1">
                            {produkt.kategorie || 'Nezařazeno'}
                          </div>
                          <h3 className="font-bold text-lg uppercase tracking-tight">{produkt.nazev}</h3>
                          <p className="text-orange-500 font-black italic">{produkt.cena}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 sm:ml-auto w-full sm:w-auto mt-2 sm:mt-0">
                        <button onClick={() => handleEdit(produkt)} className="flex-1 sm:flex-none bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white p-4 rounded-xl transition-all flex items-center justify-center">
                          <Pencil size={20} />
                        </button>
                        <button onClick={() => handleDelete(produkt.id, produkt.nazev)} className="flex-1 sm:flex-none bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-4 rounded-xl transition-all flex items-center justify-center">
                          <Trash2 size={20} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;