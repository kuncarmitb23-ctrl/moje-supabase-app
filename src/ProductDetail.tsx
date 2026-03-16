import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from './supabase';
import { useCart } from './CartContext';
import { ShoppingCart, ArrowLeft, Cpu, MonitorPlay, MemoryStick, HardDrive } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [produkt, setProdukt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const nactiDetail = async () => {
      try {
        const { data, error } = await supabase
          .from('produkty')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) setProdukt(data);
      } catch (error) {
        console.error("Chyba při načítání detailu:", error);
      } finally {
        setLoading(false);
      }
    };

    nactiDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-40 pb-24 text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-400 font-bold uppercase tracking-widest">Načítám detaily...</p>
      </div>
    );
  }

  if (!produkt) {
    return (
      <div className="pt-40 pb-24 text-center">
        <h2 className="text-3xl font-black mb-4 uppercase">Produkt nenalezen</h2>
        <Link to="/bazar" className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-500 transition-all">
          <ArrowLeft size={20} /> ZPĚT DO BAZARU
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
      <Link to="/bazar" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors uppercase font-bold text-sm tracking-wider">
        <ArrowLeft size={16} /> Zpět na nabídku
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden p-6 lg:p-12">
        
        {/* Lévá strana: Fotka - TADY JE TA ZMĚNA (p-8 pro odsazení) */}
        <div className="aspect-square bg-black rounded-2xl overflow-hidden border border-white/5 p-8 flex items-center justify-center">
          <img 
            src={produkt.obrazek_url} 
            alt={produkt.nazev} 
            // TADY JE TA ZMĚNA (object-contain místo cover)
            className="w-full h-full object-contain"
          />
        </div>

        {/* Pravá strana: Informace */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-black uppercase mb-4 leading-tight">{produkt.nazev}</h1>
          <p className="text-3xl font-black text-orange-500 italic mb-8">{produkt.cena}</p>

          <div className="grid grid-cols-2 gap-4 mb-8 bg-black/50 p-6 rounded-2xl border border-white/5">
            <h3 className="col-span-2 text-zinc-500 font-bold uppercase tracking-wider mb-2 text-sm">Specifikace</h3>
            <div className="flex items-center gap-3">
              <Cpu className="text-orange-500" size={20} />
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Procesor</p>
                <p className="font-bold text-sm">{produkt.procesor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MonitorPlay className="text-orange-500" size={20} />
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Grafika</p>
                <p className="font-bold text-sm">{produkt.grafika}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MemoryStick className="text-orange-500" size={20} />
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">RAM</p>
                <p className="font-bold text-sm">{produkt.ram}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HardDrive className="text-orange-500" size={20} />
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Úložiště</p>
                <p className="font-bold text-sm">{produkt.uloziste}</p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-zinc-500 font-bold uppercase tracking-wider mb-3 text-sm">Popis stavu</h3>
            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {produkt.popis}
            </p>
          </div>

          <button 
            onClick={() => {
              addToCart({
                id: produkt.id,
                name: produkt.nazev,
                price: produkt.cena,
                image: produkt.obrazek_url
              });
              alert('Přidáno do košíku!');
            }}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] uppercase tracking-wider shadow-[0_0_30px_rgba(234,88,12,0.3)]"
          >
            <ShoppingCart size={24} /> Přidat do košíku
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;