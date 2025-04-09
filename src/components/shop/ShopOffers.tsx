
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface ShopOffersProps {
  offers: Offer[];
}

const ShopOffers = ({ offers }: ShopOffersProps) => {
  if (offers.length === 0) return null;
  
  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center dark:text-white">
            <Tag className="mr-2 h-5 w-5" />
            Special Offers
          </h2>
          <Button variant="outline" asChild>
            <Link to="/offers">View All Offers</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm"
            >
              <h3 className="font-semibold text-lg mb-2 dark:text-white">{offer.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{offer.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="bg-black text-white px-3 py-1 rounded-full text-sm">
                  {offer.type === "percentage" 
                    ? `${offer.value}% OFF` 
                    : offer.type === "bogo" 
                      ? "Buy 1 Get 1" 
                      : "Free Delivery"}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Min. order: ₹{offer.minimumOrder}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm font-medium dark:text-white">
                  {offer.code}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopOffers;
