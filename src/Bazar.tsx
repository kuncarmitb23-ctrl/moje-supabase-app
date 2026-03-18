import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Package, Search, Cpu, HardDrive, Monitor, MemoryStick, ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react';

// --- DEFINICE TYPU PRO TS ---
export interface Produkt {
  id: number;
  nazev: string;
  cena: string;
  popis: string;
  procesor: string;
  ram: string;
  uloziste: string;
  grafika: string;
  kategorie?: string; // S otazníkem, kdyby náhodou starší produkty kategorii neměly
  obrazek_url: string;
}

const Bazar: React.FC = () => {
  // Správně otypované stavy
  const [produkty, setProdukty] = useState<Produkt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [vybranaKategorie, setVybranaKategorie] = useState<string>('Vše');
  const kategorieList: string[] = ['Vše', 'Notebooky', 'Počítače', 'Komponenty', 'Příslušenství'];

  const [vybranyProdukt, setVybranyProdukt] = useState<Produkt | null>(null);

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
        // Přetypujeme data ze Supabase na naše pole Produktů
        setProdukty(data as Produkt[]);
      }
      setLoading(false);
    };

    fetchProdukty();
  }, []);

  // Otypovaný event (kliknutí na tlačítko) a produkt
  const handlePridatDoKosiku = (e: React.MouseEvent<HTMLButtonElement>, produkt: Produkt) => {
    e.stopPropagation();
    alert(`🛒 Produkt "${produkt.nazev}" byl přidán do košíku!`);
  };

  const vyfiltrovaneProdukty = vybranaKategorie === 'Vše' 
    ? produkty 
    : produkty.filter(produkt => produkt.kategorie === vybranaKategorie);

  // 1. ZOBRAZENÍ: DETAIL PRODUKTU
  if (vybranyProdukt) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          
          <button 
            onClick={() => setVybranyProdukt(null)}
            className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors mb-8 font-bold uppercase tracking-wider text-sm"
          >
            <ArrowLeft size={20} /> Zpět do bazaru
          </button>

          <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
            
            <div className="w-full md:w-1/2 bg-black p-10 flex items-center justify-center relative">
              <div className="absolute top-6 left-6 bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest z-10 shadow-lg">
                {vybranyProdukt.kategorie || 'Nezařazeno'}
              </div>
              <img 
                src={vybranyProdukt.obrazek_url} 
                alt={vybranyProdukt.nazev} 
                className="w-full h-auto max-h-[500px] object-contain drop-shadow-2xl"
              />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
                {vybranyProdukt.nazev}
              </h1>
              <p className="text-4xl font-black text-orange-500 italic mb-8 border-b border-white/10 pb-8">
                {vybranyProdukt.cena}
              </p>
              
              <div className="mb-8">
                <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-3">Popis stavu</h3>
                <p className="text-zinc-300 leading-relaxed">
                  {vybranyProdukt.popis}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10 mt-auto">
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <Cpu size={20} className="text-orange-500 mb-2" />
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Procesor</p>
                  <p className="text-white font-bold">{vybranyProdukt.procesor}</p>
                </div>
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <MemoryStick size={20} className="text-orange-500 mb-2" />
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-1">RAM</p>
                  <p className="text-white font-bold">{vybranyProdukt.ram}</p>
                </div>
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <HardDrive size={20} className="text-orange-500 mb-2" />
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Úložiště</p>
                  <p className="text-white font-bold">{vybranyProdukt.uloziste}</p>
                </div>
                <div className="bg-black/50 p-4 rounded-2xl border border-white/5">
                  <Monitor size={20} className="text-orange-500 mb-2" />
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Grafika</p>
                  <p className="text-white font-bold">{vybranyProdukt.grafika}</p>
                </div>
              </div>

              <button 
                onClick={(e) => handlePridatDoKosiku(e, vybranyProdukt)}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_40px_rgba(234,88,12,0.5)] transform hover:-translate-y-1"
              >
                <ShoppingCart size={24} />
                Přidat do košíku
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-green-500 text-sm font-bold">
                <CheckCircle size={16} /> Zboží je skladem a připraveno k odeslání
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // 2. ZOBRAZENÍ: HLAVNÍ BAZAR
  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Náš <span className="text-orange-500">Bazar</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Prověřená technika za skvělé ceny. Vše vyčištěno, otestováno a připraveno k okamžitému použití.
          </p>
        </div>

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

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest">Načítám nabídku...</p>
          </div>
        ) : vyfiltrovaneProdukty.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 border border-white/5 rounded-3xl">
            <Search size={48} className="mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-400 font-bold text-xl mb-2">V této kategorii zatím nic není</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vyfiltrovaneProdukty.map((produkt) => (
              <div 
                key={produkt.id} 
                onClick={() => setVybranyProdukt(produkt)}
                className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col cursor-pointer"
              >
                
                <div className="h-64 bg-black p-6 relative flex items-center justify-center">
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest z-10">
                    {produkt.kategorie || 'Nezařazeno'}
                  </div>
                  <img src={produkt.obrazek_url} alt={produkt.nazev} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-orange-500 transition-colors">{produkt.nazev}</h2>
                  <p className="text-3xl font-black text-orange-500 italic mb-4">{produkt.cena}</p>
                  <p className="text-zinc-400 text-sm mb-6 line-clamp-2">{produkt.popis}</p>

                  <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2"><Cpu size={16} className="text-orange-500 flex-shrink-0" /><span className="text-xs font-bold text-zinc-300 truncate">{produkt.procesor}</span></div>
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2"><MemoryStick size={16} className="text-orange-500 flex-shrink-0" /><span className="text-xs font-bold text-zinc-300 truncate">{produkt.ram}</span></div>
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2"><HardDrive size={16} className="text-orange-500 flex-shrink-0" /><span className="text-xs font-bold text-zinc-300 truncate">{produkt.uloziste}</span></div>
                    <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2"><Monitor size={16} className="text-orange-500 flex-shrink-0" /><span className="text-xs font-bold text-zinc-300 truncate">{produkt.grafika}</span></div>
                  </div>

                  <button 
                    onClick={(e) => handlePridatDoKosiku(e, produkt)}
                    className="w-full bg-white/5 hover:bg-orange-600 text-white py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                  >
                    <ShoppingCart size={18} />
                    Přidat do košíku
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