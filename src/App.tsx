import React, { useState } from 'react';

// 1. IMPORTUJEME MOZEK KOŠÍKU (Obalí celou aplikaci)
import { CartProvider } from './CartContext'; 

// 2. IMPORTUJEME TVOJE HLAVNÍ STRÁNKY
import Bazar from './Bazar';
import Admin from './Admin';
// import Navbar from './Navbar'; // Odkomentuj, pokud máš navigaci ve zvláštním souboru

const App: React.FC = () => {
  // Jednoduchý stav pro přepínání mezi Bazarem a Admin panelem 
  // (pokud nepoužíváš react-router-dom)
  const [aktualniStranka, setAktualniStranka] = useState<'bazar' | 'admin'>('bazar');

  return (
    // TADY JE TA MAGIE: CartProvider obaluje ÚPLNĚ VŠECHNO. 
    // Díky tomu Bazar, Navigace i Košík vidí stejná data a nepadá to.
    <CartProvider>
      <div className="min-h-screen bg-zinc-950 text-white font-sans">
        
        {/* --- HORNÍ NAVIGAČNÍ LIŠTA --- */}
        {/* Zde bys vložil <Navbar />, pokud ho máš zvlášť. 
            Pro ukázku jsem tu udělal jednoduchou lištu na přepínání: */}
        <nav className="fixed top-0 left-0 w-full bg-zinc-900 border-b border-white/10 z-[100] px-6 py-4 flex justify-between items-center">
          <div className="font-black text-xl uppercase tracking-widest cursor-pointer" onClick={() => setAktualniStranka('bazar')}>
            <span className="text-orange-500">JOPC</span> E-SHOP
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setAktualniStranka('bazar')}
              className={`font-bold uppercase tracking-wider text-sm transition-colors ${aktualniStranka === 'bazar' ? 'text-orange-500' : 'text-zinc-400 hover:text-white'}`}
            >
              Bazar
            </button>
            <button 
              onClick={() => setAktualniStranka('admin')}
              className={`font-bold uppercase tracking-wider text-sm transition-colors ${aktualniStranka === 'admin' ? 'text-orange-500' : 'text-zinc-400 hover:text-white'}`}
            >
              Administrace
            </button>

            {/* Tvoje tlačítko košíku, které vyvolá událost z Bazaru */}
            <button 
              onClick={() => window.dispatchEvent(new Event('otevriKosik'))}
              className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-black uppercase tracking-widest text-xs transition-all"
            >
              Košík
            </button>
          </div>
        </nav>

        {/* --- HLAVNÍ OBSAH STRÁNKY --- */}
        <main>
          {aktualniStranka === 'bazar' ? <Bazar /> : <Admin />}
        </main>

      </div>
    </CartProvider>
  );
};

export default App;