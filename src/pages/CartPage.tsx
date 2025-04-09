
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingBag, X } from "lucide-react";
import { motion } from "framer-motion";
import { shops } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Layout from "@/components/Layout";
import CartItem from "@/components/CartItem";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

// Helper function to format currency in Indian Rupees
const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

// Constants
const DELIVERY_FEE = 49.99;
const TAX_RATE = 0.08; // 8%
const DISCOUNT_THRESHOLD = 200;
const DISCOUNT_RATE = 0.25; // 25%

const CartPage = () => {
  const { cartItems, subtotal, clearCart, currentShop } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);
  
  const shop = shops.find((s) => s.id === currentShop);
  
  // Calculate discount if subtotal exceeds threshold
  const discountAmount = subtotal >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
  
  // Calculate tax on the discounted amount
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * TAX_RATE;
  
  // Calculate total
  const totalAmount = taxableAmount + taxAmount + DELIVERY_FEE;
  
  const handleCheckout = () => {
    if (!currentUser) {
      navigate("/login?redirect=cart");
      return;
    }
    
    navigate("/checkout");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link
                to={currentShop ? `/shop/${currentShop}` : "/shops"}
                className="mr-4 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold">Your Cart</h1>
            </div>
            
            {cartItems.length > 0 && (
              <Button
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-50"
                onClick={() => setClearCartDialogOpen(true)}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>

          {cartItems.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {shop && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Items from <span className="font-medium">{shop.name}</span>
                  </p>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flow-root">
                  <ul className="divide-y">
                    {cartItems.map((item) => (
                      <li key={item.id} className="py-4">
                        <CartItem
                          id={item.id}
                          name={item.name}
                          price={item.price}
                          image={item.image}
                          quantity={item.quantity}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">{formatCurrency(subtotal)}</p>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <p>Discount (25%)</p>
                      <p className="font-medium">-{formatCurrency(discountAmount)}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Delivery Fee</p>
                    <p className="font-medium">{formatCurrency(DELIVERY_FEE)}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Tax (8%)</p>
                    <p className="font-medium">{formatCurrency(taxAmount)}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <p>Total</p>
                  <p>{formatCurrency(totalAmount)}</p>
                </div>
                
                {discountAmount > 0 && (
                  <div className="mt-4 bg-green-50 p-3 rounded-md text-sm text-green-700">
                    <p className="font-medium">You saved {formatCurrency(discountAmount)}!</p>
                    <p>25% discount applied on orders above ₹200</p>
                  </div>
                )}
                
                {subtotal > 0 && subtotal < DISCOUNT_THRESHOLD && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                    <p>Add items worth {formatCurrency(DISCOUNT_THRESHOLD - subtotal)} more to get 25% off!</p>
                  </div>
                )}
                
                <Button
                  className="mt-6 w-full bg-black hover:bg-gray-800 text-white"
                  onClick={handleCheckout}
                >
                  {currentUser ? "Proceed to Checkout" : "Sign in to Checkout"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet.
                Start browsing our shops to find your favorite food!
              </p>
              
              <Link to="/shops">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Browse Shops
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <Dialog open={clearCartDialogOpen} onOpenChange={setClearCartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear your cart?</DialogTitle>
            <DialogDescription>
              This will remove all items from your cart. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setClearCartDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearCart();
                setClearCartDialogOpen(false);
              }}
            >
              Clear Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CartPage;
