
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Percent, ShoppingCart, Truck } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  type: z.enum(["percentage", "bogo", "freeDelivery"], {
    required_error: "Please select an offer type",
  }),
  value: z.coerce.number().min(0, { message: "Value must be a positive number" }),
  minimumOrder: z.coerce.number().min(0, { message: "Minimum order must be a positive number" }),
  code: z.string().min(3, { message: "Promo code must be at least 3 characters" }),
  expiryDate: z.string().min(1, { message: "Please select an expiry date" }),
});

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

interface PromotionalOffersManagerProps {
  shopId: string;
}

const PromotionalOffersManager = ({ shopId }: PromotionalOffersManagerProps) => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "percentage",
      value: 0,
      minimumOrder: 0,
      code: "",
      expiryDate: new Date().toISOString().split("T")[0],
    },
  });

  // Load offers
  useEffect(() => {
    const storedOffers = JSON.parse(localStorage.getItem("promotionalOffers") || "[]");
    const shopOffers = storedOffers.filter((offer: Offer) => offer.shopId === shopId);
    setOffers(shopOffers);
  }, [shopId]);

  const resetForm = () => {
    form.reset({
      title: "",
      description: "",
      type: "percentage",
      value: 0,
      minimumOrder: 0,
      code: "",
      expiryDate: new Date().toISOString().split("T")[0],
    });
    setEditingOfferId(null);
  };

  const openAddOfferDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditOfferDialog = (offer: Offer) => {
    form.reset({
      title: offer.title,
      description: offer.description,
      type: offer.type,
      value: offer.value,
      minimumOrder: offer.minimumOrder,
      code: offer.code,
      expiryDate: offer.expiryDate,
    });
    setEditingOfferId(offer.id);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const allOffers = JSON.parse(localStorage.getItem("promotionalOffers") || "[]");
      
      if (editingOfferId) {
        // Update existing offer
        const offerIndex = allOffers.findIndex((offer: Offer) => offer.id === editingOfferId);
        
        if (offerIndex !== -1) {
          allOffers[offerIndex] = {
            ...allOffers[offerIndex],
            ...values,
          };
          
          toast({
            title: "Success",
            description: "Offer updated successfully",
          });
        }
      } else {
        // Add new offer
        const newOffer = {
          id: Math.random().toString(36).substring(2, 15),
          shopId,
          ...values,
        };
        
        allOffers.push(newOffer);
        
        toast({
          title: "Success",
          description: "Offer added successfully",
        });
      }
      
      localStorage.setItem("promotionalOffers", JSON.stringify(allOffers));
      
      // Update local state
      const updatedShopOffers = allOffers.filter((offer: Offer) => offer.shopId === shopId);
      setOffers(updatedShopOffers);
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save offer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOffer = (offerId: string) => {
    try {
      const allOffers = JSON.parse(localStorage.getItem("promotionalOffers") || "[]");
      const updatedOffers = allOffers.filter((offer: Offer) => offer.id !== offerId);
      
      localStorage.setItem("promotionalOffers", JSON.stringify(updatedOffers));
      
      // Update local state
      const updatedShopOffers = updatedOffers.filter((offer: Offer) => offer.shopId === shopId);
      setOffers(updatedShopOffers);
      
      toast({
        title: "Success",
        description: "Offer deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete offer",
      });
    }
  };

  const getOfferIcon = (type: Offer["type"]) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-6 w-6" />;
      case "bogo":
        return <ShoppingCart className="h-6 w-6" />;
      case "freeDelivery":
        return <Truck className="h-6 w-6" />;
      default:
        return <Percent className="h-6 w-6" />;
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Promotional Offers</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddOfferDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingOfferId ? "Edit Promotional Offer" : "Add Promotional Offer"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Special Discount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Get amazing discounts this summer..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select offer type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage Discount</SelectItem>
                          <SelectItem value="bogo">Buy One Get One</SelectItem>
                          <SelectItem value="freeDelivery">Free Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch("type") === "percentage" && (
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Percentage (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="15" 
                            min="0"
                            max="100"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="minimumOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Order Value ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="20" 
                          min="0"
                          step="0.01"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promo Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="SUMMER2023" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : (editingOfferId ? "Save Changes" : "Add Offer")}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div 
              key={offer.id}
              className="bg-gray-50 dark:bg-gray-900 rounded-lg border overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start mb-4">
                  <div className="mr-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {getOfferIcon(offer.type)}
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <h4 className="font-semibold">{offer.title}</h4>
                      <span className="ml-2 px-2 py-1 bg-black text-white text-xs rounded-full">
                        {formatOfferValue(offer)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{offer.description}</p>
                    <div className="mt-2 space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Type:</span> {getOfferTypeLabel(offer.type)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Code:</span> {offer.code}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Minimum order:</span> ${offer.minimumOrder}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Expires:</span> {new Date(offer.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEditOfferDialog(offer)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this promotional offer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No offers found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't created any promotional offers yet.
          </p>
          <Button onClick={openAddOfferDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Offer
          </Button>
        </div>
      )}
    </div>
  );
};

export default PromotionalOffersManager;
