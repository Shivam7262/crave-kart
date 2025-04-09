
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Percent, ShoppingCart, Truck, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

interface Offer {
  id: string;
  title: string;
  description: string;
  type: "percentage" | "bogo" | "freeDelivery";
  value: number;
  minimumOrder: number;
  code: string;
  expiryDate: string;
  shopId: string;
}

interface Shop {
  id: string;
  name: string;
  logo: string;
}

const OffersPage = () => {
  const [offers, setOffers] = useState<Array<Offer & { shop: Shop }>>([]);
  const [activeCategory, setActiveCategory] = useState<"all" | "percentage" | "bogo" | "freeDelivery">("all");

  useEffect(() => {
    // Load offers and shop details
    const storedOffers = JSON.parse(localStorage.getItem("promotionalOffers") || "[]");
    const shops = JSON.parse(localStorage.getItem("shops") || "[]");
    
    const offersWithShops = storedOffers.map((offer: Offer) => {
      const shop = shops.find((s: Shop) => s.id === offer.shopId) || { 
        id: offer.shopId, 
        name: "Unknown Shop", 
        logo: "" 
      };
      return { ...offer, shop };
    });
    
    setOffers(offersWithShops);
  }, []);

  // Filter offers by type if a category is selected
  const filteredOffers = activeCategory === "all" 
    ? offers 
    : offers.filter(offer => offer.type === activeCategory);

  const getOfferIcon = (type: Offer["type"]) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-8 w-8" />;
      case "bogo":
        return <ShoppingCart className="h-8 w-8" />;
      case "freeDelivery":
        return <Truck className="h-8 w-8" />;
      default:
        return <Percent className="h-8 w-8" />;
    }
  };

  const getOfferTypeLabel = (type: Offer["type"]) => {
    switch (type) {
      case "percentage":
        return "Percentage Discount";
      case "bogo":
        return "Buy One Get One";
      case "freeDelivery":
        return "Free Delivery";
      default:
        return type;
    }
  };

  const formatOfferValue = (offer: Offer) => {
    switch (offer.type) {
      case "percentage":
        return `${offer.value}% off`;
      case "bogo":
        return "Buy 1 Get 1";
      case "freeDelivery":
        return `Free delivery on orders over $${offer.minimumOrder}`;
      default:
        return "";
    }
  };

  const getBadgeColor = (type: Offer["type"]) => {
    switch (type) {
      case "percentage":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "bogo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "freeDelivery":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Special Offers</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing deals and promotions from our partner restaurants
          </p>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveCategory("all")}
          >
            <Tag className="mr-2 h-4 w-4" />
            All Offers
          </Button>
          <Button
            variant={activeCategory === "percentage" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveCategory("percentage")}
          >
            <Percent className="mr-2 h-4 w-4" />
            Discounts
          </Button>
          <Button
            variant={activeCategory === "bogo" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveCategory("bogo")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy One Get One
          </Button>
          <Button
            variant={activeCategory === "freeDelivery" ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setActiveCategory("freeDelivery")}
          >
            <Truck className="mr-2 h-4 w-4" />
            Free Delivery
          </Button>
        </div>
        
        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border"
              >
                <div className="relative">
                  <div className="absolute top-0 right-0 m-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(offer.type)}`}>
                      {formatOfferValue(offer)}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {offer.shop.logo ? (
                        <img 
                          src={offer.shop.logo} 
                          alt={offer.shop.name} 
                          className="w-14 h-14 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold">
                            {offer.shop.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{offer.shop.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          {getOfferIcon(offer.type)}
                          <span className="ml-1">{getOfferTypeLabel(offer.type)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2">{offer.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{offer.description}</p>
                    
                    <div className="flex flex-col gap-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Promo Code:</span>
                        <span className="font-semibold bg-gray-100 dark:bg-gray-700 px-2 rounded">{offer.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Min. Order:</span>
                        <span>${offer.minimumOrder}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Valid Until:</span>
                        <span>{new Date(offer.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Link to={`/shop/${offer.shopId}`}>
                      <Button className="w-full flex items-center justify-center gap-2">
                        Order Now
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No offers available</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {activeCategory === "all"
                ? "There are currently no special offers available."
                : `There are no ${getOfferTypeLabel(activeCategory).toLowerCase()} offers available.`}
            </p>
            <Button asChild>
              <Link to="/shops">Browse Shops</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OffersPage;
