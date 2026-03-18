import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Search, Cpu, HardDrive, Monitor, MemoryStick, ShoppingCart, ArrowLeft, CheckCircle, X, Trash2 } from 'lucide-react';

export interface Produkt {
  id: number;
  nazev: string;
  cena: string;
  popis: string;
  procesor: string;
  ram: string;
  uloziste: string;
  grafika: string;
  kategorie?: string;
  obrazek_url: string;
  dostupne?: boolean;
}

const Bazar: React.FC = () => {
  const [produkty, setProdukty] = useState<Produkt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [vybranaKategorie, setVybranaKategorie] = useState<string>('Vše');
  const kategorieList: string[] = ['Vše', 'Notebooky', 'Počítače', 'Komponenty', 'Příslušenství'];

  const [vybranyProdukt, setVybranyProdukt] = useState<Produkt | null>(null);
  
  // --- ZCELA NOVÉ STAVY PRO KOŠÍK ---
  const [kosik, setKosik] = useState<Produkt[]>([]);
  const [ukazatKosik, setUkazatKosik] = useState<boolean>(false);
  
  const [jmeno, setJmeno] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [zpracovavamObjednavku, setZpracovavamObjednavku] = useState(false);
  const [objednavkaUspesna, setObjednavkaUspesna] = useState(false);

  useEffect(() => {
    nactiProdukty();
  }, []);

  const nactiProdukty = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('produkty')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Chyba při načítání:', error);
    } else if (data) {
      const dostupneProdukty = data.filter(p => p.dostupne !== false);
      setProdukty(dostupneProdukty as Produkt[]);
    }
    setLoading(false);
  };

  // --- LOGIKA KOŠÍKU ---
  const pridatDoKosiku = (e: React.MouseEvent, produkt: Produkt) => {
    e.stopPropagation();
    // Kontrola, jestli už v košíku produkt náhodou není (v bazaru máme od každého jen 1 kus)
    if (!kosik.find(p => p.id === produkt.id)) {
      setKosik([...kosik, produkt]);
    }
  };

  const odstranitZKosiku = (id: number) => {
    setKosik(kosik.filter(p => p.id !== id));
  };

  // Výpočet celkové ceny (vezme text "15 000 Kč", vytáhne z něj jen čísla a sečte je)
  const celkovaCena = kosik.reduce((soucet, produkt) => {
    const cislo = parseInt(produkt.cena.replace(/\D/g, '') || '0', 10);
    return soucet + cislo;
  }, 0);

  // --- ODESLÁNÍ HROMADNÉ OBJEDNÁVKY ---
  const handleOdeslatObjednavku = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kosik.length === 0) return;

    setZpracovavamObjednavku(true);

    try {
      // Projdeme všechny produkty v košíku a v databázi jim nastavíme dostupne: false
      for (const produkt of kosik) {
        const { error } = await supabase
          .from('produkty')
          .update({ dostupne: false })
          .eq('id', produkt.id);
          
        if (error) throw error;
      }

      setObjednavkaUspesna(true);
      
      // Odstraníme prodané produkty z hlavního výpisu
      const idProdanych = kosik.map(p => p.id);
      setProdukty(prev => prev.filter(p => !idProdanych.includes(p.id)));
      
      // Vyčistíme košík
      setKosik([]);

    } catch (error: any) {
      console.error("Chyba při objednávce:", error);
      alert("Něco se pokazilo, zkuste to prosím znovu.");
    } finally {
      setZpracovavamObjednavku(false);
    }
  };

  const zavritKosikUspesne = () => {
    setUkazatKosik(false);
    setObjednavkaUspesna(false);
    setJmeno('');
    setEmail('');
    setTelefon('');
  };

  const vyfiltrovaneProdukty = vybranaKategorie === 'Vše' 
    ? produkty 
    : produkty.filter(produkt => produkt.kategorie === vybranaKategorie);

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-24 px-6 relative">
      
      {/* PLOVOUCÍ TLAČÍTKO KOŠÍKU (ukáže se jen když v něm něco je) */}
      {kosik.length > 0 && !ukazatKosik && (
        <button 
          onClick={() => setUkazatKosik(true)}
          className="fixed bottom-8 right-8 bg-orange-600 hover:bg-orange-500 text-white p-4 rounded-full shadow-[0_0_30px_rgba(234,88,12,0.4)] flex items-center gap-3 z-40 transition-transform hover:scale-105"
        >
          <div className="relative">
            <ShoppingCart size={28} />
            <span className="absolute -top-2 -right-2 bg-white text-orange-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">
              {kosik.length}
            </span>
          </div>
          <span className="font-black uppercase tracking-widest hidden md:block">Otevřít košík</span>
        </button>
      )}

      {/* VYSKAKOVACÍ OKNO: KOŠÍK A OBJEDNÁVKA */}
      {ukazatKosik && (
        <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
            
            <button onClick={() => setUkazatKosik(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-10">
              <X size={24} />
            </button>

            {objednavkaUspesna ? (
              <div className="p-12 text-center w-full m-auto">
                <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
                <h2 className="text-4xl font-black uppercase mb-4">Objednávka přijata!</h2>
                <p className="text-zinc-400 mb-8 max-w-md mx-auto">Vše jsme zarezervovali a brzy se vám ozveme na zadaný e-mail pro dokončení platby a domluvení dopravy.</p>
                <button onClick={zavritKosikUspesne} className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all">
                  Zpět do bazaru
                </button>
              </div>
            ) : (
              <>
                {/* Levá strana košíku - Seznam produktů */}
                <div className="w-full md:w-3/5 p-8 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto max-h-[50vh] md:max-h-full">
                  <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                    <ShoppingCart size={24} className="text-orange-500" /> Váš košík
                  </h2>
                  
                  {kosik.length === 0 ? (
                    <p className="text-zinc-500 italic">Košík je zatím prázdný.</p>
                  ) : (
                    <div className="space-y-4">
                      {kosik.map(p => (
                        <div key={p.id} className="flex items-center gap-4 bg-black/50 p-4 rounded-2xl border border-white/5">
                          <img src={p.obrazek_url} alt={p.nazev} className="w-16 h-16 object-contain" />
                          <div className="flex-1">
                            <h4 className="text-white font-bold">{p.nazev}</h4>
                            <p className="text-orange-500 font-bold text-sm">{p.cena}</p>
                          </div>
                          <button onClick={() => odstranitZKosiku(p.id)} className="text-zinc-600 hover:text-red-500 p-2 transition-colors">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {kosik.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                      <span className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Celkem k úhradě</span>
                      <span className="text-3xl font-black text-white">{celkovaCena.toLocaleString('cs-CZ')} Kč</span>
                    </div>
                  )}
                </div>

                {/* Pravá strana košíku - Formulář */}
                <div className="w-full md:w-2/5 p-8 bg-zinc-950/50">
                  <h3 className="text-xl font-black uppercase mb-6">Kontaktní údaje</h3>
                  <form onSubmit={handleOdeslatObjednavku} className="space-y-4">
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Jméno a příjmení</label>
                      <input required value={jmeno} onChange={(e) => setJmeno(e.target.value)} type="text" className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-all text-white" />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">E-mail</label>
                      <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-all text-white" />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs font-bold uppercase mb-2">Telefon</label>
                      <input required value={telefon} onChange={(e) => setTelefon(e.target.value)} type="tel" className="w-full bg-black border border-white/10 p-4 rounded-xl focus:border-orange-500 outline-none transition-all text-white" />
                    </div>

                    <button 
                      disabled={zpracovavamObjednavku || kosik.length === 0}
                      type="submit" 
                      className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 mt-6 rounded-xl font-black transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,88,12,0.2)]"
                    >
                      {zpracovavamObjednavku ? 'Zpracovávám...' : 'Odeslat objednávku'}
                    </button>
                    <p className="text-xs text-zinc-600 text-center mt-4">Kliknutím souhlasíte se zpracováním osobních údajů pro vyřízení objednávky.</p>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* HLAVNÍ OBSAH BAZARU */}
      <div className="max-w-7xl mx-auto">
        
        {/* Pokud je otevřený detail produktu */}
        {vybranyProdukt ? (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
            <button 
              onClick={() => setVybranyProdukt(null)}
              className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors mb-8 font-bold uppercase tracking-wider text-sm"
            >
              <ArrowLeft size={20} /> Zpět do bazaru
            </button>

            <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
              <div className="w-full md:w-1/2 bg-black p-10 flex items-center justify-center relative">
                <div className="absolute top-6 left-6 bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest z-10 shadow-lg">
                  {vybranyProdukt.kategorie || 'Nezařazeno'}
                </div>
                <img src={vybranyProdukt.obrazek_url} alt={vybranyProdukt.nazev} className="w-full h-auto max-h-[500px] object-contain drop-shadow-2xl" />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">{vybranyProdukt.nazev}</h1>
                <p className="text-4xl font-black text-orange-500 italic mb-8 border-b border-white/10 pb-8">{vybranyProdukt.cena}</p>
                
                <div className="mb-8">
                  <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-3">Popis stavu</h3>
                  <p className="text-zinc-300 leading-relaxed">{vybranyProdukt.popis}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10 mt-auto">
                  <div className="bg-black/50 p-4 rounded-2xl border border-white/5"><Cpu size={20} className="text-orange-500 mb-2" /><p className="text-zinc-500 text-xs font-bold uppercase mb-1">Procesor</p><p className="text-white font-bold">{vybranyProdukt.procesor}</p></div>
                  <div className="bg-black/50 p-4 rounded-2xl border border-white/5"><MemoryStick size={20} className="text-orange-500 mb-2" /><p className="text-zinc-500 text-xs font-bold uppercase mb-1">RAM</p><p className="text-white font-bold">{vybranyProdukt.ram}</p></div>
                  <div className="bg-black/50 p-4 rounded-2xl border border-white/5"><HardDrive size={20} className="text-orange-500 mb-2" /><p className="text-zinc-500 text-xs font-bold uppercase mb-1">Úložiště</p><p className="text-white font-bold">{vybranyProdukt.uloziste}</p></div>
                  <div className="bg-black/50 p-4 rounded-2xl border border-white/5"><Monitor size={20} className="text-orange-500 mb-2" /><p className="text-zinc-500 text-xs font-bold uppercase mb-1">Grafika</p><p className="text-white font-bold">{vybranyProdukt.grafika}</p></div>
                </div>

                {/* Tlačítko Přidat do košíku v detailu */}
                <button 
                  onClick={(e) => {
                    pridatDoKosiku(e, vybranyProdukt);
                    setVybranyProdukt(null); // Po přidání ho můžeme vrátit do nabídky, ať vybírá dál
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_40px_rgba(234,88,12,0.5)] transform hover:-translate-y-1"
                >
                  <ShoppingCart size={24} /> Přidat do košíku
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-green-500 text-sm font-bold">
                  <CheckCircle size={16} /> Zboží je skladem a připraveno k odeslání
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Pokud nejsme v detailu, zobrazíme klasickou mřížku produktů */
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">Náš <span className="text-orange-500">Bazar</span></h1>
              <p className="text-zinc-400 max-w-2xl mx-auto">Prověřená technika za skvělé ceny. Vše vyčištěno, otestováno a připraveno k okamžitému použití.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {kategorieList.map((kat) => (
                <button
                  key={kat}
                  onClick={() => setVybranaKategorie(kat)}
                  className={`px-6 py-3 rounded-full font-bold transition-all text-sm uppercase tracking-wider ${vybranaKategorie === kat ? 'bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {kat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-20"><div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-zinc-500 font-bold uppercase tracking-widest">Načítám nabídku...</p></div>
            ) : vyfiltrovaneProdukty.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900 border border-white/5 rounded-3xl"><Search size={48} className="mx-auto text-zinc-700 mb-4" /><p className="text-zinc-400 font-bold text-xl mb-2">V této kategorii zatím nic není</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vyfiltrovaneProdukty.map((produkt) => {
                  // Zjistíme, jestli už tento konkrétní produkt v košíku je
                  const jeVKosiku = kosik.some(p => p.id === produkt.id);

                  return (
                    <div key={produkt.id} onClick={() => setVybranyProdukt(produkt)} className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/50 transition-all group flex flex-col cursor-pointer">
                      <div className="h-64 bg-black p-6 relative flex items-center justify-center">
                        <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest z-10">{produkt.kategorie || 'Nezařazeno'}</div>
                        <img src={produkt.obrazek_url} alt={produkt.nazev} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-orange-500 transition-colors">{produkt.nazev}</h2>
                        <p className="text-3xl font-black text-orange-500 italic mb-4">{produkt.cena}</p>
                        <p className="text-zinc-400 text-sm mb-6 line-clamp-2">{produkt.popis}</p>

                        <div className="grid grid-cols-2 gap-3 mb-6 mt-auto">
                          <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2"><Cpu size={16} className="text-orange-500 flex-shrink-0" /><span className="text-xs font-bold text-zinc-300 truncate">{produkt.procesor}</span></div>
                          <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2"><MemoryStick size={16} className="text-orange-500 flex-shrink-0" /><span className="text-xs font-bold text-zinc-300 truncate">{produkt.ram}</span></div>
                        </div>

                        {/* Tlačítko Přidat do košíku na kartě */}
                        <button 
                          disabled={jeVKosiku}
                          onClick={(e) => pridatDoKosiku(e, produkt)} 
                          className={`w-full py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm ${
                            jeVKosiku 
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                            : 'bg-white/5 hover:bg-orange-600 text-white'
                          }`}
                        >
                          <ShoppingCart size={18} /> {jeVKosiku ? 'Již v košíku' : 'Přidat do košíku'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Bazar;