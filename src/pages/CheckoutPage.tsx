
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/services/orderService";
import { createPaymentIntent } from "@/services/paymentService";
import PaymentForm from "@/components/PaymentForm";

const formSchema = z.object({
  address: z.string().min(3, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  zipCode: z.string().min(5, { message: "Zip code is required" }),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required" }),
  instructions: z.string().optional(),
});

// Tax and delivery settings
const TAX_RATE = 0.08; // 8% tax
const DELIVERY_FEE = 49.99; // ₹49.99 delivery fee
const DISCOUNT_THRESHOLD = 200; // Minimum amount for discount to apply
const DISCOUNT_RATE = 0.25; // 25% discount

// Helper function to format currency in Indian Rupees
const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

const CheckoutPage = () => {
  const { cartItems, subtotal, clearCart, currentShop } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment'>('details');

  // Calculate discount if subtotal exceeds threshold
  const discountAmount = subtotal >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
  
  // Calculate tax on the discounted amount
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * TAX_RATE;
  
  // Calculate total
  const totalAmount = taxableAmount + taxAmount + DELIVERY_FEE;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      city: "",
      zipCode: "",
      phoneNumber: "",
      instructions: "",
    },
  });

  // Redirect if not logged in or cart is empty
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  if (cartItems.length === 0 && !isSuccess) {
    navigate("/cart");
    return null;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser || !currentShop) return;
    
    setIsLoading(true);
    
    try {
      // Create full address string
      const fullAddress = `${values.address}, ${values.city} ${values.zipCode}. Phone: ${values.phoneNumber}${values.instructions ? `. Notes: ${values.instructions}` : ''}`;
      
      // Get the user ID - handle both MongoDB _id and regular id format
      const userId = currentUser._id || currentUser.id;
      
      if (!userId) {
        throw new Error("User ID is not available. Please log in again.");
      }
      
      // Prepare order data
      const orderData = {
        customerId: userId.toString(),  // Ensure ID is in string format
        shopId: currentShop.toString(),  // Ensure shop ID is in string format
        items: cartItems.map(item => ({
          foodItem: item.id,
          quantity: item.quantity
        })),
        totalAmount: totalAmount,
        address: fullAddress,
      };
      
      console.log("Placing order with user ID:", userId);
      console.log("Order data:", orderData);
      
      // Send order to API
      const order = await createOrder(orderData);
      const orderId = order.id || order._id;
      setOrderId(orderId);
      
      // Create payment intent
      const paymentData = await createPaymentIntent({
        totalAmount: totalAmount,
        orderId: orderId
      });
      
      setClientSecret(paymentData.clientSecret);
      setPaymentStep('payment');
      
      toast({
        description: "Please complete payment to finalize your order",
      });
    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setIsSuccess(true);
    clearCart();
    
    toast({
      description: "Your order has been placed and payment received successfully!",
    });
  };

  const handlePaymentError = (error: string) => {
    toast({
      variant: "destructive",
      title: "Payment Failed",
      description: error,
    });
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="container max-w-md mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-sm border text-center"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-8">
              Your order has been placed successfully. You will receive an update soon.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Return to Home
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={() => paymentStep === 'payment' ? setPaymentStep('details') : navigate("/cart")}
              className="mr-4 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {paymentStep === 'details' ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-sm border p-6 mb-6"
                >
                  <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St, Apt 4B" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code</FormLabel>
                              <FormControl>
                                <Input placeholder="12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(123) 456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Instructions (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="E.g., Ring doorbell, call when you arrive, etc."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full bg-black hover:bg-gray-800 text-white"
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Continue to Payment"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg shadow-sm border p-6 mb-6"
                >
                  <h2 className="text-xl font-semibold mb-6">Payment</h2>
                  <PaymentForm 
                    amount={totalAmount * 100} // Convert to cents/paise
                    clientSecret={clientSecret}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    isLoading={isLoading}
                  />
                </motion.div>
              )}
            </div>

            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm border p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="max-h-60 overflow-auto mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <span>
                        {item.quantity} × {item.name}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
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
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
