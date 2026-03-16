import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Link } from 'react-router-dom';

const ImagesSlider = () => {
  const [produkty, setProdukty] = useState<any[]>([]);

  useEffect(() => {
    const fetchProdukty = async () => {
      // Stáhneme 10 nejnovějších produktů z databáze
      const { data } = await supabase
        .from('produkty')
        .select('id, obrazek_url, nazev')
        .order('id', { ascending: false })
        .limit(10);
      
      if (data) {
         setProdukty(data);
      }
    };
    fetchProdukty();
  }, []);

  // Pokud v bazaru zatím nic není, posuvník schováme
  if (produkty.length === 0) return null;

  return (
    <div className="w-full overflow-hidden py-12 relative bg-zinc-950 border-y border-white/5">
      
      {/* CSS animace pro nekonečný posun */}
      <style>
        {`
          @keyframes nekonecnyPosun {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .posuvnik-animace {
            display: flex;
            width: max-content;
            animation: nekonecnyPosun 30s linear infinite; 
          }
          .posuvnik-animace:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <h3 className="text-center text-zinc-500 font-bold uppercase tracking-[0.2em] text-sm mb-8">
        Právě teď v našem bazaru
      </h3>

      <div className="posuvnik-animace gap-6 px-3">
        {/* Zdvojíme seznam produktů, aby posun běžel plynule a bez mezer */}
        {[...produkty, ...produkty].map((produkt, index) => (
          <Link 
            to={`/produkt/${produkt.id}`} 
            key={`${produkt.id}-${index}`}
            // Přidal jsem "p-4", aby měla fotka kolem sebe trochu místa
            className="block w-72 h-48 flex-shrink-0 rounded-2xl overflow-hidden border border-white/10 group relative bg-black shadow-lg p-4"
          >
            <img 
              src={produkt.obrazek_url} 
              alt={produkt.nazev} 
              // TADY JE TA ZMĚNA: object-contain místo object-cover
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
            />
            {/* Tmavý přechod s názvem při najetí myší (přidal jsem pointer-events-none, aby to neblokovalo klikání) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
              <span className="text-orange-500 font-black uppercase text-sm truncate">{produkt.nazev}</span>
            </div>
          </Link>
        ))}
      </div>
      
    </div>
  );
};

export default ImagesSlider;