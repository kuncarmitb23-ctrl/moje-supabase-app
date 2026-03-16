import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Monitor, Globe, ArrowRight } from 'lucide-react';
import ImageSlider from './ImageSlider';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* HERO SEKCE */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-block bg-orange-500/10 text-orange-500 border border-orange-500/20 px-4 py-1 rounded-full text-xs font-bold mb-6">
            PŮSOBÍME JIŽ OD ROKU 1998
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-6">
            TECH PRO <br /> <span className="text-orange-500">PROFÍKY.</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-10 max-w-md">
            Kompletní servis, prodej a správa sítí. Vaše kancelářská technika v nejlepších rukou.
          </p>
          <div className="flex gap-4">
          {/* tlacitko prozkoumat di */}
          <button className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all">
            Chci servis
          </button>

          {/* Změna z <button> na <Link> */}
          <Link 
            to="/bazar" 
            className="group flex items-center gap-2 text-white px-8 py-4 font-bold border border-zinc-800 rounded-xl hover:border-orange-500 transition-all no-underline"
          >
            Prozkoumat bazar 
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
          <ImageSlider />
        </motion.div>
      </section>

      {/* SLUŽBY */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {[
          { icon: <Wrench />, title: "Expresní servis", text: "Opravy do 24 hodin přímo u vás." },
          { icon: <Monitor />, title: "Prodej techniky", text: "Nové i repasované stroje se zárukou." },
          { icon: <Globe />, title: "Správa sítí", text: "Zabezpečení a správa firemních LAN." }
        ].map((item, i) => (
          <div key={i} className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl hover:border-orange-500/50 transition-all">
            <div className="text-orange-500 mb-6">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-zinc-500">{item.text}</p>
          </div>
        ))}
      </section>
    </>
  );
};
export default Home;