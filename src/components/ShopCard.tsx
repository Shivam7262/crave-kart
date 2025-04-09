
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { Shop } from "@/lib/data";

interface ShopCardProps {
  shop: Shop;
  index: number;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  type: "percentage" | "bogo" | "freeDelivery";
  value: number;
  code: string;
  expiryDate: string;
  shopId: string;
}

const ShopCard = ({ shop, index }: ShopCardProps) => {
  const [shopOffers, setShopOffers] = useState<Offer[]>([]);
  
  useEffect(() => {
    // Load shop offers
    const storedOffers = JSON.parse(localStorage.getItem("promotionalOffers") || "[]");
    const offers = storedOffers.filter((offer: Offer) => offer.shopId === shop.id);
    setShopOffers(offers);
  }, [shop.id]);

  // Determine if this is a custom shop by checking cuisine type
  const isIndian = shop.categories.includes("Indian");
  const isChinese = shop.categories.includes("Chinese");
  const isItalian = shop.categories.includes("Italian");
  
  let cuisineClass = "";
  if (isIndian) cuisineClass = "border-l-4 border-orange-500 dark:border-orange-400";
  else if (isChinese) cuisineClass = "border-l-4 border-red-500 dark:border-red-400";
  else if (isItalian) cuisineClass = "border-l-4 border-green-500 dark:border-green-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] dark:bg-gray-800 dark:border-gray-700 ${cuisineClass}`}
    >
      <Link to={`/shop/${shop.id}`} className="block h-full">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={shop.logo}
            alt={shop.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {shopOffers.length > 0 && (
            <div className="absolute top-2 right-2">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
                <Tag className="h-3 w-3 mr-1" />
                {shopOffers.length} {shopOffers.length === 1 ? 'Offer' : 'Offers'}
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-xl font-semibold dark:text-white">{shop.name}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{shop.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {shop.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200"
              >
                {category}
              </span>
            ))}
          </div>
          
          {shopOffers.length > 0 && (
            <div className="mt-4 pt-3 border-t dark:border-gray-700">
              <div className="flex items-center text-red-500 dark:text-red-400 text-sm font-medium">
                <Tag className="h-3 w-3 mr-1" />
                <span>
                  {shopOffers[0].type === "percentage" 
                    ? `${shopOffers[0].value}% OFF` 
                    : shopOffers[0].type === "bogo" 
                      ? "Buy 1 Get 1" 
                      : "Free Delivery"}
                </span>
                {shopOffers.length > 1 && (
                  <span className="ml-1">+ {shopOffers.length - 1} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ShopCard;
