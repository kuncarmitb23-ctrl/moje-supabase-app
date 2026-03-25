import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

// Tvoje stránky
import Home from './Home';
import Contact from './Contact';
import Bazar from './Bazar';
import Services from './Services';

// Mozek košíku
import { CartProvider } from './CartContext';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-orange-500 flex flex-col">
          
          {/* NAVIGACE */}
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

              {/* TLAČÍTKO E-SHOP -> Otevírá PDF katalog v novém okně */}
              <a 
                href="/COMFOR_noviny_03_2026+cz_final_compressed.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-orange-600 hover:bg-orange-500 px-5 py-2 rounded-full flex items-center gap-2 font-bold transition-all transform hover:scale-105"
              >
                <ShoppingCart size={18} /> E-SHOP
              </a>
            </div>
          </nav>

          {/* PŘEPÍNAČ STRÁNEK */}
          <main className="flex-grow pt-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/sluzby" element={<Services />} />
              <Route path="/bazar" element={<Bazar />} />
            </Routes>
          </main>

          {/* FOOTER */}
          <footer className="border-t border-white/5 py-10 text-center text-zinc-600 text-sm mt-auto">
            <p>&copy; 2026 JOPC. Všechna práva vyhrazena.</p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}