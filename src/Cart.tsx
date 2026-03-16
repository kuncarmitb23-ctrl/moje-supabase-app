import React, { useState } from 'react';
import { useCart } from './CartContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';
const Cart = () => {
  const { items, removeFromCart, totalPrice, clearCart } = useCart();
  // Přidali jsme stav pro sledování, jestli už je objednáno
  const [ordered, setOrdered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const customerDetails = Object.fromEntries(formData);

    // 1. Připravíme data přesně podle názvů sloupců ve tvojí databázi
    const objednavka = {
      jmeno: customerDetails.jmeno,
      email: customerDetails.email,
      telefon: customerDetails.telefon,
      adresa: customerDetails.adresa,
      celkova_cena: totalPrice,
      produkty: items // Supabase to chytře uloží jako JSON seznam
    };

    console.log("Odesílám do databáze...", objednavka);

    // 2. Pošleme to do tabulky 'orders' v Supabase
    const { error } = await supabase
      .from('orders')
      .insert([objednavka]);

    // 3. Kontrola, jestli nenastala chyba
    if (error) {
      console.error("Chyba při odesílání do Supabase:", error);
      alert("Něco se pokazilo. Zkuste to prosím znovu.");
      return; // Zastavíme to, neukážeme úspěch
    }

    // 4. Pokud to prošlo bez chyby, ukážeme zelenou fajfku
    setOrdered(true);
    clearCart(); // Tohle košík po úspěšném nákupu úplně vyprázdní
    // Tady by se normálně dalo ještě přidat vyprázdnění košíku, 
    // aby byl po objednání prázdný, ale to můžeme doladit pak.
  };

  // Co se ukáže, když zákazník odešle objednávku
  if (ordered) {
    return (
      <div className="pt-40 pb-24 px-6 text-center max-w-7xl mx-auto">
        <CheckCircle size={80} className="mx-auto text-green-500 mb-6 animate-bounce" />
        <h2 className="text-4xl font-black uppercase mb-4">Objednávka přijata!</h2>
        <p className="text-zinc-400 mb-8 text-lg">Děkujeme za nákup. Brzy se vám ozveme na zadaný e-mail.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-zinc-900 border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-black transition-all">
          ZPĚT NA ÚVOD
        </Link>
      </div>
    );
  }

  // Co se ukáže, když je košík prázdný
  if (items.length === 0) {
    return (
      <div className="pt-40 pb-24 px-6 text-center max-w-7xl mx-auto">
        <ShoppingBag size={64} className="mx-auto text-zinc-800 mb-6" />
        <h2 className="text-3xl font-black uppercase mb-4">Tvůj košík je prázdný</h2>
        <p className="text-zinc-500 mb-8 text-lg">Vypadá to, že sis ještě nic nevybral.</p>
        <Link to="/bazar" className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-500 transition-all">
          <ArrowLeft size={20} /> ZPĚT DO BAZARU
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-black mb-12 italic uppercase">Tvůj <span className="text-orange-500">KOŠÍK</span></h2>
      
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Lévá strana: Seznam produktů */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex items-center gap-6">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-black" />
              <div className="flex-grow">
                <h3 className="font-bold text-lg uppercase leading-tight">{item.name}</h3>
                <p className="text-orange-500 font-black italic">{item.price}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-zinc-500 font-bold">ks: {item.quantity}</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pravá strana: Shrnutí a FORMULÁŘ */}
        <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl h-fit sticky top-32">
          <h3 className="text-xl font-black uppercase mb-6">Shrnutí & Doprava</h3>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-zinc-400">
              <span>Mezisoučet</span>
              <span>{totalPrice.toLocaleString()} Kč</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Doprava</span>
              <span className="text-green-500 font-bold uppercase text-xs">Zdarma</span>
            </div>
            <div className="h-px bg-white/10 my-4" />
            <div className="flex justify-between text-2xl font-black italic">
              <span>CELKEM</span>
              <span className="text-orange-500">{totalPrice.toLocaleString()} Kč</span>
            </div>
          </div>

          {/* TADY JE TEN NOVÝ FORMULÁŘ NAPOJENÝ NA handleSubmit */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required type="text" name="jmeno" placeholder="Jméno a příjmení" className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-orange-500 outline-none transition-all text-sm" />
            <input required type="email" name="email" placeholder="E-mail" className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-orange-500 outline-none transition-all text-sm" />
            <input required type="tel" name="telefon" placeholder="Telefon" className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-orange-500 outline-none transition-all text-sm" />
            <input required type="text" name="adresa" placeholder="Ulice, Město, PSČ" className="w-full bg-black border border-white/10 p-3 rounded-xl focus:border-orange-500 outline-none transition-all text-sm" />
            
            <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white transition-all transform hover:scale-[1.02] mt-4">
              DOKONČIT OBJEDNÁVKU <ArrowRight size={20} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Cart;