import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Package, Search, Cpu, HardDrive, Monitor, MemoryStick } from 'lucide-react';

const Bazar = () => {
  const [produkty, setProdukty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // TADY JE STAV PRO VYBRANOU KATEGORII (výchozí je 'Vše')
  const [vybranaKategorie, setVybranaKategorie] = useState('Vše');

  // Seznam kategorií pro tlačítka
  const kategorieList = ['Vše', 'Notebooky', 'Počítače', 'Komponenty', 'Příslušenství'];

  useEffect(() => {
    const fetchProdukty = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('produkty')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Chyba při načítání produktů:', error);
      } else if (data) {
        setProdukty(data);
      }
      setLoading(false);
    };

    fetchProdukty();
  }, []);

  // FILTROVÁNÍ PRODUKTŮ
  // Pokud je vybráno 'Vše', ukážeme všechno. Jinak ukážeme jen to, co sedí do kategorie.
  const vyfiltrovaneProdukty = vybranaKategorie === 'Vše' 
    ? produkty 
    : produkty.filter(produkt => produkt.kategorie === vybranaKategorie);

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HLAVIČKA BAZARU */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Náš <span className="text-orange-500">Bazar</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Prověřená technika za skvělé ceny. Vše vyčištěno, otestováno a připraveno k okamžitému použití.
          </p>
        </div>

        {/* TLAČÍTKA PRO FILTROVÁNÍ KATEGORIÍ */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {kategorieList.map((kat) => (
            <button
              key={kat}
              onClick={() => setVybranaKategorie(kat)}
              className={`px-6 py-3 rounded-full font-bold transition-all text-sm uppercase tracking-wider ${
                vybranaKategorie === kat 
                  ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' 
                  : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* VÝPIS PRODUKTŮ */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest">Načítám nabídku...</p>
          </div>
        ) : vyfiltrovaneProdukty.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 border border-white/5 rounded-3xl">
            <Search size={48} className="mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-400 font-bold text-xl mb-2">V této kategorii zatím nic není</p>
            <p className="text-zinc-600">Zkus vybrat jinou kategorii nebo se podívej na "Vše".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vyfiltrovaneProdukty.map((produkt) => (
              <div key={produkt.id} className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col">
                
                {/* OBRÁZEK S KATEGORIÍ */}
                <div className="h-64 bg-black p-6 relative flex items-center justify-center">
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest z-10">
                    {produkt.kategorie || 'Nezařazeno'}
                  </div>
                  <img 
                    src={produkt.obrazek_url} 
                    alt={produkt.nazev} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* INFO O PRODUKTU */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-2">{produkt.nazev}</h2>
                  <p className="text-3xl font-black text-orange-500 italic mb-4">{produkt.cena}</p>
                  
                  <p className="text-zinc-400 text-sm mb-6 line-clamp-2">{produkt.popis}</p>

                  {/* SPECIFIKACE (Mřížka 2x2) */}
                  <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                      <Cpu size={16} className="text-orange-500 flex-shrink-0" />
                      <span className="text-xs font-bold text-zinc-300 truncate" title={produkt.procesor}>{produkt.procesor}</span>
                    </div>
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                      <MemoryStick size={16} className="text-orange-500 flex-shrink-0" />
                      <span className="text-xs font-bold text-zinc-300 truncate" title={produkt.ram}>{produkt.ram}</span>
                    </div>
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                      <HardDrive size={16} className="text-orange-500 flex-shrink-0" />
                      <span className="text-xs font-bold text-zinc-300 truncate" title={produkt.uloziste}>{produkt.uloziste}</span>
                    </div>
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                      <Monitor size={16} className="text-orange-500 flex-shrink-0" />
                      <span className="text-xs font-bold text-zinc-300 truncate" title={produkt.grafika}>{produkt.grafika}</span>
                    </div>
                  </div>

                  <button className="w-full bg-white/5 hover:bg-orange-600 text-white py-4 rounded-xl font-black transition-all uppercase tracking-widest text-sm">
                    Mám zájem
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Bazar;