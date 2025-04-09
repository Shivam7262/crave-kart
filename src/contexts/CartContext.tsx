
import React, { createContext, useContext, useState, useEffect } from "react";
import { FoodItem } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";

interface CartItem extends FoodItem {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  currentShop: string | null;
  addToCart: (item: FoodItem, shopId: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentShop, setCurrentShop] = useState<string | null>(null);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedShop = localStorage.getItem("currentShop");
    
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    
    if (storedShop) {
      setCurrentShop(storedShop);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Save current shop to localStorage whenever it changes
  useEffect(() => {
    if (currentShop) {
      localStorage.setItem("currentShop", currentShop);
    } else {
      localStorage.removeItem("currentShop");
    }
  }, [currentShop]);

  const addToCart = (item: FoodItem, shopId: string) => {
    // If cart is empty, set current shop
    if (cartItems.length === 0) {
      setCurrentShop(shopId);
    }
    
    // If adding item from a different shop, show warning
    if (currentShop && currentShop !== shopId) {
      toast({
        variant: "destructive",
        title: "Different Shop",
        description: "You already have items from a different shop. Clear your cart first to add from this shop.",
      });
      return;
    }
    
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((cartItem) => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      description: `Added ${item.name} to your cart.`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== itemId);
      
      // If cart becomes empty, reset current shop
      if (updatedItems.length === 0) {
        setCurrentShop(null);
      }
      
      return updatedItems;
    });
    
    toast({
      description: "Item removed from cart.",
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCurrentShop(null);
    
    toast({
      description: "Cart cleared successfully.",
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    currentShop,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
