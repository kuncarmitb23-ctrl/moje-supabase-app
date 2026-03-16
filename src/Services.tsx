import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, Monitor, Cpu, HardDrive, ShieldCheck, 
  Globe, Printer, Database, Layout, Video 
} from 'lucide-react';

const serviceGroups = [
  {
    title: "Servis & Opravy",
    icon: <Wrench className="text-orange-500" />,
    items: [
      "Opravy notebooků a počítačů",
      "Opravy základních desek a adaptérů",
      "Výměna prasklých LCD displejů",
      "Čištění ventilace a údržba",
      "Servis a opravy tiskáren"
    ]
  },
  {
    title: "Software & Data",
    icon: <ShieldCheck className="text-orange-500" />,
    items: [
      "Odvirování a zabezpečení",
      "Záloha a obnova dat z disků",
      "Instalace antivirové ochrany",
      "Digitalizace VHS kazet"
    ]
  },
  {
    title: "IT Řešení & Prodej",
    icon: <Cpu className="text-orange-500" />,
    items: [
      "Sestavení PC na přání",
      "Vzdálená správa sítí",
      "Tvorba e-shopů a WWW stránek",
      "SEO optimalizace",
      "Renovace tonerů a náplní"
    ]
  }
];

const Services = () => {
  return (
    <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-black mb-4 italic">
          NAŠE <span className="text-orange-500">SLUŽBY</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto font-medium">
          Od roku 1998 se staráme o vaši techniku. Nabízíme kompletní portfolio služeb od servisu po správu sítí.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {serviceGroups.map((group, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className="bg-zinc-900 border border-white/5 p-8 rounded-3xl hover:border-orange-500/50 transition-all shadow-2xl"
          >
            <div className="bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              {React.cloneElement(group.icon, { size: 32 })}
            </div>
            <h3 className="text-2xl font-bold mb-6">{group.title}</h3>
            <ul className="space-y-4">
              {group.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-400 group/item">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  <span className="group-hover/item:text-white transition-colors cursor-default">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;