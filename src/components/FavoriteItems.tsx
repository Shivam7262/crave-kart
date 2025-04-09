
import React, { useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FoodItem } from "@/lib/data";

interface FavoriteItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
  shopName: string;
  shopId: string;
}

// Helper function to format currency in Indian Rupees
const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

const FavoriteItems: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItemProps[]>([
    {
      id: "1",
      name: "Classic Burger",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&h=1000&q=80",
      price: 8.99,
      shopName: "Burger Club",
      shopId: "shop1"
    },
    {
      id: "2",
      name: "Margherita Pizza",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&h=1000&q=80",
      price: 12.99,
      shopName: "Pizza Paradise",
      shopId: "shop2"
    }
  ]);
  const { toast } = useToast();

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Item has been removed from favorites"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Favorite Items</h3>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((item) => (
            <div key={item.id} className="flex rounded-lg border overflow-hidden">
              <div className="w-24 h-24">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.shopName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{formatCurrency(item.price)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFavorite(item.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium mb-2">No favorites yet</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start exploring and add items to your favorites
          </p>
          <Button onClick={() => window.location.href = "/shops"}
                  className="bg-orange-500 hover:bg-orange-600 text-white">
            Browse Shops
          </Button>
        </div>
      )}
    </div>
  );
};

export default FavoriteItems;
