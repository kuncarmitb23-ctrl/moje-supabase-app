import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, FileText } from 'lucide-react';
import Home from './Home';
import Contact from './Contact';
import Bazar from './Bazar';
import Services from './Services';
import ProductDetail from './ProductDetail';
import { CartProvider, useCart } from './CartContext'; 
import Cart from './Cart'; // Ujisti se, že máš soubor Cart.tsx
import Admin from './Admin';

function Navbar() {
  const { items } = useCart(); 

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-black tracking-tighter hover:scale-105 transition-transform cursor-pointer">
          <span className="text-white italic">JO</span><span className="text-orange-500">PC</span>
        </Link>
        
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <Link to="/" className="hover:text-orange-500 transition-all">Úvod</Link>
          <Link to="/bazar" className="hover:text-orange-500 transition-all">Bazar</Link>
          <Link to="/sluzby" className="hover:text-orange-500 transition-all">Služby</Link>
          <Link to="/kontakt" className="hover:text-orange-500 transition-all">Kontakt</Link>
          
          <a 
            href="/images/COMFOR_noviny_03_2026+cz_final_compressed.pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-orange-500 transition-all flex items-center gap-1"
          >
            <FileText size={14} className="text-orange-500" /> Leták
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="https://jopc.ekatalog.biz/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-orange-600 hover:bg-orange-500 px-5 py-2 rounded-full flex items-center gap-2 font-bold transition-all transform hover:scale-105 no-underline text-white shadow-[0_0_20px_rgba(234,88,12,0.3)]"
          >
            <ShoppingCart size={18} /> E-SHOP
          </a>

          {/* OPRAVENO: Tlačítko je nyní Link, který tě hodí do košíku */}
          <Link to="/kosik" className="relative p-2 text-zinc-400 hover:text-white transition-colors">
            <ShoppingCart size={24} />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950 animate-pulse">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <CartProvider> 
      <Router>
        <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-orange-500">
          
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/kontakt" element={<Contact />} />
              <Route path="/bazar" element={<Bazar />} />
              <Route path="/sluzby" element={<Services />} />
              <Route path="/produkt/:id" element={<ProductDetail />} />
              <Route path="/kosik" element={<Cart />} /> {/* PŘIDÁNA CESTA PRO KOŠÍK */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/produkt/:id" element={<ProductDetail />} />
            </Routes>
          </main>

          <footer className="mt-20 border-t border-white/5 py-10 text-center text-zinc-600 text-sm">
            <p>&copy; 2026 JOPC Group s.r.o. | Všechna práva vyhrazená.</p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}