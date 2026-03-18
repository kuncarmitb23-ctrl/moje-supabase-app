import React, { createContext, useContext, useState, useEffect } from 'react';

// Definice toho, co je v košíku
interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void; // Výborně, tohle tu je!
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // 1. Záchrana košíku při refreshi (načtení z paměti)
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jopc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Ukládání do paměti při každé změně
  useEffect(() => {
    localStorage.setItem('jopc_cart', JSON.stringify(items));
  }, [items]);

  // Funkce pro přidání do košíku
  const addToCart = (product: any) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // 3. TADY JE TA NOVÁ FUNKCE NA VYSYPÁNÍ KOŠÍKU
  const clearCart = () => {
    setItems([]);
  };

  // Výpočet celkové ceny
  const totalPrice = items.reduce((sum, item) => {
    const priceNum = parseInt(item.price.replace(/\s/g, '').replace('Kč', ''));
    return sum + (priceNum * item.quantity);
  }, 0);

  return (
    // 4. NEZAPOMENOUT PŘIDAT clearCart TADY DO VALUE
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}; 