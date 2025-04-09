
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Heart } from "lucide-react";
import { FoodItem } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface FoodCardProps {
  item: FoodItem;
  shopId: string;
  index: number;
}

// Helper function to format currency in Indian Rupees
const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

const FoodCard = ({ item, shopId, index }: FoodCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    toast({
      title: !isFavorite ? "Added to Favorites" : "Removed from Favorites",
      description: !isFavorite 
        ? `${item.name} has been added to your favorites.` 
        : `${item.name} has been removed from your favorites.`
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative rounded-xl border bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md overflow-hidden"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/70 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full"
          onClick={toggleFavorite}
        >
          <Heart 
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} 
          />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{item.name}</h3>
          <span className="font-semibold text-lg">{formatCurrency(item.price)}</span>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{item.description}</p>
        
        <Button 
          onClick={() => addToCart(item, shopId)}
          className="mt-3 w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default FoodCard;
