
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface ShopHeroProps {
  shop: {
    name: string;
    description: string;
    logo: string;
  };
  categories: string[];
  isShopOwner: boolean;
  shopId: string;
}

const ShopHero = ({ shop, categories, isShopOwner, shopId }: ShopHeroProps) => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  
  return (
    <section className="relative h-[40vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${shop.logo})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-white"
        >
          {shop.name}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-lg text-white/90 max-w-2xl"
        >
          {shop.description}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex flex-wrap gap-2 justify-center"
        >
          {categories.map((category: string) => (
            <span
              key={category}
              className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white"
            >
              {category}
            </span>
          ))}
        </motion.div>
      </div>

      <Link
        to="/shops"
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center text-white hover:text-white/80 transition-colors"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Shops
      </Link>

      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2">
        {isShopOwner && (
          <Button
            className="bg-white text-black hover:bg-white/90 flex items-center gap-2"
            onClick={() => navigate("/shop-dashboard")}
          >
            <Briefcase className="h-5 w-5" />
            Dashboard
          </Button>
        )}
        <Link to="/cart">
          <Button className="bg-white text-black hover:bg-white/90 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart {totalItems > 0 && `(${totalItems})`}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default ShopHero;
