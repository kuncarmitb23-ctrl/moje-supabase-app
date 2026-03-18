import React, { useState } from 'react';
// 1. IMPORTUJEME MOZEK KOŠÍKU (Obalí celou aplikaci)
import { CartProvider } from './CartContext'; // Zkontroluj cestu k souboru

// 2. IMPORTUJEME TVOJE HLAVNÍ STRÁNKY A KOMPONENTY
import Navbar from './Navbar'; // Tvoje horní lišta (uprav název/cestu pokud je jiná)
import Bazar from './Bazar';   // Tvůj katalog produktů ze Supabase
import Admin from './Admin';   // Administrační panel

// --- PŮVODNÍ KOMPONENTY ÚVODNÍ STRANY (Které jsem ti smazal) ---
// Pokud je máš ve zvláštních souborech, importuj je nahoře. 
// Pokud jsi je měl přímo v App.tsx, tady jsou zpátky:

const HeroSection: React.FC = () => (
  <section className="pt-32 pb-24 px-6 text-center bg-zinc-900 border-b border-white/5 animate-in fade-in duration-700">
    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6">
      Vítejte v <span className="text-orange-500 italic">JOPC</span>
    </h1>
    <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-10">
      Váš spolehlivý partner pro špičkový IT hardware a servis. Od výkonných herních mašin po prověřený bazar.
    </p>
    <button 
      onClick={() => {
        // Jednoduchý scroll na sekci bazaru
        const bazarSekce = document.getElementById('bazar-sekce');
        bazarSekce?.scrollIntoView({ behavior: 'smooth' });
      }}
      className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-xl font-black transition-all uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(234,88,12,0.3)]"
    >
      Prozkoumat Bazar
    </button>
  </section>
);

const Contacts: React.FC = () => (
  <section className="py-24 px-6 bg-zinc-900 border-t border-white/5">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-black uppercase mb-12">Kontakty</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-black/30 p-8 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-1">Kde nás najdete?</p>
          <p className="text-xl font-bold text-white">Náměstí Míru 1, Šumperk</p>
        </div>
        <div className="bg-black/30 p-8 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-1">Napište nám</p>
          <p className="text-xl font-bold text-white">info@jopc.cz</p>
        </div>
        <div className="bg-black/30 p-8 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-1">Zavolejte nám</p>
          <p className="text-xl font-bold text-white">+420 123 456 789</p>
        </div>
      </div>
    </div>
  </section>
);

// --- HLAVNÍ KOMPONENTA APP ---
const App: React.FC = () => {
  // Stav pro přepínání mezi Hlavní stranou a Admin panelem
  const [currentPage, setCurrentPage] = useState<'main' | 'admin'>('main');

  return (
    // 3. DŮLEŽITÉ: CartProvider obaluje ÚPLNĚ VŠECHNO.
    <CartProvider>
      <div className="min-h-screen bg-zinc-950 text-white font-sans">
        
        {/* Navbar - tvoje horní lišta */}
        <Navbar />

        {/* --- NAVIGACE PRO PŘEPÍNÁNÍ STRÁNEK --- 
            (Pro ukázku, jak se dostat do Admin panelu, dokud nemáš React Router) */}
        <div className="fixed top-0 right-1/2 translate-x-1/2 z-[1001] flex gap-4 mt-4 bg-zinc-900 p-2 rounded-xl border border-white/10 shadow-lg">
            <button 
              onClick={() => setCurrentPage('main')}
              className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider transition-all ${currentPage === 'main' ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Hlavní Strana
            </button>
            <button 
              onClick={() => setCurrentPage('admin')}
              className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider transition-all ${currentPage === 'admin' ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Administrace
            </button>
        </div>

        {/* --- PODMÍNĚNÉ VYKRESLENÍ OBSAHU --- */}
        {currentPage === 'main' ? (
          // HLAVNÍ STRANA (Vrátili jsme tam všechno!)
          <>
            <HeroSection />
            
            {/* Tady je tvůj katalog produktů ze Supabase */}
            <div id="bazar-sekce">
              <Bazar />
            </div>

            <Contacts />
          
          </>
        ) : (
          // ADMIN STRANA
          <Admin />
        )}

        {/* --- PATIČKA (Footer) --- */}
        <footer className="py-8 px-6 text-center border-t border-white/5 bg-zinc-950 text-zinc-600 text-sm">
          &copy; {new Date().getFullYear()} JOPC Šumperk. Všechna práva vyhrazena.
        </footer>

      </div>
    </CartProvider>
  );
};

export default App;