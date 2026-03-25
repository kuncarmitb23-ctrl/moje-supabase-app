import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

// Tvoje stránky
import Home from './Home';
import Contact from './Contact';
import Bazar from './Bazar';
import Services from './Services';
import Admin from './Admin';

// TADY JE ZMĚNA: Importujeme tvůj vizuální košík a funkce pro něj
import { CartProvider, useCart } from './CartContext';
import Cart from './Cart';

// Vytvořili jsme menší komponentu pro Navigaci, abychom mohli používat "useCart" z Contextu
const Navigation = () => {
  const { items, setIsCartOpen } = useCart();

  // Spočítáme, kolik položek je v košíku
  const pocetPolozekVKosiku = items.length;

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-tighter hover:scale-105 transition-transform cursor-pointer">
          <span className="text-white italic">JO</span><span className="text-orange-500">PC</span>
        </Link>
        
        {/* ODKAZY V MENU */}
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <Link to="/" className="hover:text-orange-500 transition-all">Úvod</Link>
          <Link to="/sluzby" className="hover:text-orange-500 transition-all">Služby</Link>
          <Link to="/bazar" className="hover:text-orange-500 transition-all">Bazar</Link>
          <Link to="/kontakt" className="hover:text-orange-500 transition-all">Kontakt</Link>
        </div>

        <div className="flex items-center gap-4">
          {/* TLAČÍTKO E-SHOP -> Otevírá PDF katalog v novém okně */}
          <a 
            href="/katalog.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-5 py-2 rounded-full items-center gap-2 font-bold transition-all border border-white/5"
          >
            CENÍK SLUŽEB
          </a>

          {/* TLAČÍTKO KOŠÍKU (Otevírá Cart.tsx) */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative bg-orange-600 hover:bg-orange-500 px-5 py-2 rounded-full flex items-center gap-2 font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            <ShoppingCart size={18} /> 
            <span className="hidden sm:inline">KOŠÍK</span>
            
            {/* Červená bublinka s počtem položek, pokud nějaké jsou */}
            {pocetPolozekVKosiku > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black animate-bounce">
                {pocetPolozekVKosiku}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-orange-500 flex flex-col">
          
          {/* Použijeme naši novou Navigaci */}
          <Navigation />

          {/* TADY JE ZMĚNA: Přidán vizuální košík. Vyskakuje přes celou obrazovku */}
          <Cart />

          {/* PŘEPÍNAČ STRÁNEK */}
          <main className="flex-grow pt-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/sluzby" element={<Services />} />
              <Route path="/bazar" element={<Bazar />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          {/* FOOTER */}
          <footer className="border-t border-white/5 py-10 text-center text-zinc-600 text-sm mt-auto flex flex-col items-center gap-2">
            <p>&copy; 2026 JOPC. Všechna práva vyhrazena.</p>
            <Link to="/admin" className="text-zinc-800 hover:text-orange-500 transition-colors text-xs font-bold uppercase tracking-widest">
              Administrace
            </Link>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}