import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Home from './Home';
import Contact from './Contact';

// TADY JE JEDINÁ ZMĚNA Č. 1 - Importujeme košík
import { CartProvider } from './CartContext';

export default function App() {
  return (
    // TADY JE JEDINÁ ZMĚNA Č. 2 - Obalili jsme Router do CartProvideru
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-orange-500">
          
          {/* NAVIGACE */}
          <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              
              {/* LOGO - Odkazuje na úvod */}
              <Link to="/" className="text-2xl font-black tracking-tighter hover:scale-105 transition-transform cursor-pointer">
                <span className="text-white italic">JO</span><span className="text-orange-500">PC</span>
              </Link>
              
              <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
                <Link to="/" className="hover:text-orange-500 transition-all">Úvod</Link>
                <a href="#" className="hover:text-orange-500 transition-all">Služby</a>
                <a href="#" className="hover:text-orange-500 transition-all">Bazar</a>
                <Link to="/kontakt" className="hover:text-orange-500 transition-all">Kontakt</Link>
              </div>

              <button className="bg-orange-600 hover:bg-orange-500 px-5 py-2 rounded-full flex items-center gap-2 font-bold transition-all transform hover:scale-105">
                <ShoppingCart size={18} /> E-SHOP
              </button>
            </div>
          </nav>

          {/* PŘEPÍNAČ STRÁNEK */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kontakt" element={<Contact />} />
          </Routes>

          {/* FOOTER */}
          <footer className="mt-20 border-t border-white/5 py-10 text-center text-zinc-600 text-sm">
            <p>&copy; 2026 JOPC. Všechna práva vyhrazena.</p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}