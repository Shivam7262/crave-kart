
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FoodCard from "@/components/FoodCard";
import { FoodItem } from "@/lib/data";

interface ShopMenuProps {
  items: FoodItem[];
  shopId: string;
  isShopOwner: boolean;
}

const ShopMenu = ({ items, shopId, isShopOwner }: ShopMenuProps) => {
  const navigate = useNavigate();
  
  console.log("ShopMenu - Received items:", items);
  console.log("ShopMenu - Shop owner status:", isShopOwner);
  
  return (
    <div>
      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <FoodCard
              key={item.id || index}
              item={item}
              shopId={shopId || ""}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2 dark:text-white">No items found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No items available in this category. Try another category or add menu items if you're the shop owner.
          </p>
          
          {isShopOwner && (
            <Button 
              className="mt-4"
              onClick={() => navigate("/shop-dashboard")}
            >
              Add Menu Items
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopMenu;
