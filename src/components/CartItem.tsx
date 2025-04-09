
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Helper function to format currency in Indian Rupees
const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

const CartItem = ({ id, name, price, image, quantity }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
      
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium">
          <h3>{name}</h3>
          <p className="ml-4">{formatCurrency(price)}</p>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none rounded-l-md"
              onClick={() => updateQuantity(id, quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="px-3 text-sm flex items-center justify-center min-w-[2rem]">
              {quantity}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none rounded-r-md"
              onClick={() => updateQuantity(id, quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {formatCurrency(price * quantity)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600"
              onClick={() => removeFromCart(id)}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
