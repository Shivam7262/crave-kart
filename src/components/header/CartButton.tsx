
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartButtonProps {
  totalItems: number;
}

const CartButton = ({ totalItems }: CartButtonProps) => {
  return (
    <Link to="/cart" className="relative">
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full w-10 h-10 transition-all hover:shadow-md hover:border-gray-400 dark:hover:border-gray-500"
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white dark:bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-fadeIn">
            {totalItems}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default CartButton;
