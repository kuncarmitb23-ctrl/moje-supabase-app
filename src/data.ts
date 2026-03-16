export const PRODUCTS = [
  { 
    id: "lenovo-thinkpad-l14", 
    name: "Lenovo ThinkPad L14", 
    price: "4500,- Kč", 
    category: "Notebooky", 
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1000",
    description: "Profesionální pracovní notebook v legendárním odolném provedení. Ideální pro studenty nebo do kanceláře.",
    specs: {
      procesor: "Intel Core i5-10210U",
      ram: "16GB DDR4",
      disk: "512GB SSD NVMe",
      displej: "14\" Full HD IPS",
      grafika: "Intergrovaná",
      zaruka: "12 měsíců"
    }
  },
  { 
    id: "herni-pc-master", 
    name: "Herní PC Master R5", 
    price: "15 900,- Kč", 
    category: "PC Sestavy", 
    image: "https://images.unsplash.com/photo-1587202371725-5758ffc28a47?q=80&w=1000",
    description: "Výkonná herní mašina sestavená přímo u nás v JOPC. Rozjedeš na tom nejnovější pecky.",
    specs: {
      procesor: "AMD Ryzen 5 5600",
      ram: "32GB DDR4",
      disk: "1TB SSD",
      grafika: "RTX 3060 Ti",
      zaruka: "24 měsíců"
    }
  },
  { 
    id: "Acer Nitro N20-100", // Tohle bude v adrese (např. /produkt/monitor-dell)
    name: "Acer Nitro N20-100", 
    price: "28 990,- Kč", 
    category: "PC Sestavy", // Musí sedět na ty filtry (Notebooky, PC Sestavy, atd.)
    image: "/images/TC011b0q.jpg",
    description: "Herní PC Intel Core i5 13420H Raptor Lake 4.6 GHz, NVIDIA GeForce RTX 5060 8GB, RAM 32GB DDR4, SSD 1000 GB, Wi-Fi, HDMI a DisplayPort, 4× USB 2.0, typ skříně: Mini Tower, Windows 11 Home",
    specs: {
      procesor: "Intel Core i5 13420H Raptor Lake 4.6 GHz",
      ram: "RAM 32GB DDR4",
      disk: "SSD 1000 GB",
      grafika: "NVIDIA GeForce RTX 5060 8GB", // Pokud grafiku nemá, můžeš tohle smazat
      zaruka: "12 měsíců"
    }
    
  }, 
  { 
    id: "HP Smart Tank Wireless 750 All-in-One printer", // Tohle bude v adrese (např. /produkt/monitor-dell)
    name: "HP Smart Tank Wireless 750 All-in-One printer", 
    price: "5 999,- Kč", 
    category: "Tiskárny", // Musí sedět na ty filtry (Notebooky, PC Sestavy, atd.)
    image: "/images/hp-smart-tank-750_ie1657339.png",
    description: "Inkoustová tiskárna multifunkční, barevná, A4, kopírování a skenování, rychlost černobílého tisku 15 str./min., rychlost barevného tisku 9 str./min., tiskové rozlišení 4800 x 1200 DPI, automatický duplex, tankový systém, ADF skener, displej, AirPrint, USB, LAN a WiFi",
    specs: {
      zaruka: "12 měsíců"
    }
  }  
  
];
