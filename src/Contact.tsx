import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Building2, ExternalLink } from 'lucide-react';

const Contact = () => {
  // Odkazy na Google Maps pro obě provozovny
  const mapSumperk = "https://www.google.com/maps/search/?api=1&query=Slovanská+2,+Šumperk";
  const mapUnicov = "https://www.google.com/maps/search/?api=1&query=Masarykovo+náměstí+41,+Uničov";

  return (
    <section id="kontakt" className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-4">KDE NÁS <span className="text-orange-500">NAJDETE?</span></h2>
        <p className="text-zinc-400 font-medium">Navštivte nás v našich provozovnách v Šumperku a Uničově.</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* PROVOZOVNA ŠUMPERK */}
        <motion.div whileHover={{ y: -5 }} className="bg-zinc-900 border border-white/5 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-orange-500 mb-6">Provozovna Šumperk</h3>
            <div className="space-y-4 text-zinc-300">
              <div className="flex items-start gap-3">
                <MapPin className="text-orange-500 shrink-0 mt-1" size={20} />
                <p>Slovanská č.2, 787 01 Šumperk</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-orange-500 shrink-0 mt-1" size={20} />
                <p>Po - Pá: 09:00 - 16:00</p>
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <a href="tel:+420777094513" className="flex items-center gap-3 hover:text-orange-500 transition-colors">
                  <Phone size={18} /> 777 094 513
                </a>
                <a href="mailto:info@jopc.cz" className="flex items-center gap-3 hover:text-orange-500 transition-colors">
                  <Mail size={18} /> info@jopc.cz
                </a>
              </div>
            </div>
          </div>
          {/* TLAČÍTKO S ODKAZEM */}
          <a 
            href={mapSumperk} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-8 w-full bg-white/5 hover:bg-orange-500 hover:text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-bold no-underline"
          >
            <ExternalLink size={16} /> Otevřít mapu
          </a>
        </motion.div>

        {/* PROVOZOVNA UNIČOV */}
        <motion.div whileHover={{ y: -5 }} className="bg-zinc-900 border border-white/5 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-orange-500 mb-6">Provozovna Uničov</h3>
            <div className="space-y-4 text-zinc-300">
              <div className="flex items-start gap-3">
                <MapPin className="text-orange-500 shrink-0 mt-1" size={20} />
                <p>Masarykovo Náměstí č.41, 783 91 Uničov</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-orange-500 shrink-0 mt-1" size={20} />
                <p>Po - Pá: 8:00 - 12:00, 13:00 - 16:00</p>
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <a href="tel:+420736744648" className="flex items-center gap-3 hover:text-orange-500 transition-colors">
                  <Phone size={18} /> 736 744 648
                </a>
                <a href="mailto:unicov@jopc.cz" className="flex items-center gap-3 hover:text-orange-500 transition-colors">
                  <Mail size={18} /> unicov@jopc.cz
                </a>
              </div>
            </div>
          </div>
          {/* TLAČÍTKO S ODKAZEM */}
          <a 
            href={mapUnicov} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-8 w-full bg-white/5 hover:bg-orange-500 hover:text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-bold no-underline"
          >
            <ExternalLink size={16} /> Otevřít mapu
          </a>
        </motion.div>

        {/* FAKTURAČNÍ ÚDAJE (Sídlo společnosti) */}
        <motion.div className="bg-orange-600 p-8 rounded-3xl text-white shadow-[0_20px_50px_rgba(234,88,12,0.3)]">
          <Building2 className="mb-6" size={40} />
          <h3 className="text-2xl font-bold mb-6">Fakturační údaje</h3>
          <div className="space-y-2 opacity-95">
            <p className="font-bold text-lg text-black underline decoration-black/20">JOPC Group s.r.o.</p>
            <p>Sídlo: Lidická 1817/97, 787 01 Šumperk</p>
            <div className="pt-6 space-y-1">
              <p><span className="font-bold opacity-70">IČ:</span> 07596791</p>
              <p><span className="font-bold opacity-70">DIČ:</span> CZ07596791</p>
            </div>
            <p className="text-xs mt-10 opacity-70 italic border-t border-white/20 pt-4">Registrace u ŽÚ Šumperk č.j.01/1429/92</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;