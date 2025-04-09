
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import * as shopService from "@/services/shopService";

const formSchema = z.object({
  name: z.string().min(2, { message: "Shop name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  logo: z.string().url({ message: "Please enter a valid URL for your logo" }),
  categories: z.array(z.string()).min(1, { message: "Add at least one category" }),
});

interface ShopEditFormProps {
  shopId: string;
  onSuccess?: () => void;
}

const ShopEditForm = ({ shopId, onSuccess }: ShopEditFormProps) => {
  const { updateShop, getUserOwnedShop, currentUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [shop, setShop] = useState<any>(null);

  // Fetch the shop data when component mounts
  useEffect(() => {
    const fetchShop = async () => {
      setIsLoading(true);
      try {
        // First try to get from auth context
        let shopData = getUserOwnedShop();
        
        // If not available there, fetch it from API
        if (!shopData && shopId) {
          const fetchedShop = await shopService.getShopById(shopId, currentUser?.id);
          shopData = {
            ...fetchedShop,
            id: fetchedShop.id || fetchedShop._id
          };
        }
        
        console.log("ShopEditForm: Loaded shop data:", shopData);
        setShop(shopData);
      } catch (error) {
        console.error("ShopEditForm: Error loading shop details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load shop details",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShop();
  }, [shopId, getUserOwnedShop, toast, currentUser]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: "",
      categories: [],
    },
  });

  // Update form values when shop data is loaded
  useEffect(() => {
    if (shop) {
      form.reset({
        name: shop.name || "",
        description: shop.description || "",
        logo: shop.logo || "",
        categories: shop.categories || [],
      });
    }
  }, [shop, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      console.log("ShopEditForm: Updating shop with data:", values);
      await updateShop(shopId, {
        name: values.name,
        description: values.description,
        logo: values.logo,
        categories: values.categories,
      });
      
      toast({
        title: "Success!",
        description: "Your shop has been updated.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("ShopEditForm: Error updating shop:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update shop",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    const currentCategories = form.getValues("categories");
    if (currentCategories.includes(newCategory.trim())) {
      toast({
        variant: "destructive",
        description: "This category already exists",
      });
      return;
    }
    
    form.setValue("categories", [...currentCategories, newCategory.trim()]);
    setNewCategory("");
  };

  const removeCategory = (category: string) => {
    const currentCategories = form.getValues("categories");
    form.setValue(
      "categories",
      currentCategories.filter((c) => c !== category)
    );
  };

  if (isLoading && !shop) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-500" />
        <p className="text-gray-600 dark:text-gray-300">Loading shop details...</p>
      </div>
    );
  }

  // Check if current user is the owner
  if (shop && currentUser && shop.ownerId !== currentUser.id && shop.ownerId !== currentUser._id) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500 font-medium">You don't have permission to edit this shop.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
    >
      <h2 className="text-2xl font-semibold mb-6">Edit Shop Details</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Shop Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="My Awesome Restaurant" 
                    {...field} 
                    className="focus-visible:ring-black dark:focus-visible:ring-white"
                  />
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
                <FormLabel className="text-gray-700 dark:text-gray-300">Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell customers about your shop and what makes it special..." 
                    {...field} 
                    className="min-h-24 focus-visible:ring-black dark:focus-visible:ring-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Logo URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/your-logo.jpg" 
                    {...field} 
                    className="focus-visible:ring-black dark:focus-visible:ring-white"
                  />
                </FormControl>
                <FormMessage />
                {field.value && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-500 mb-1">Logo Preview:</p>
                    <img 
                      src={field.value} 
                      alt="Logo Preview" 
                      className="h-16 w-16 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Categories</FormLabel>
                <div className="space-y-4">
                  <div className="flex">
                    <Input
                      placeholder="Add a category (e.g., Italian, Desserts)"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="rounded-r-none focus-visible:ring-black dark:focus-visible:ring-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCategory();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addCategory}
                      className="rounded-l-none bg-black hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {form.watch("categories").map((category) => (
                      <div
                        key={category}
                        className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2 animate-fadeIn"
                      >
                        <span>{category}</span>
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="bg-black hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : "Save Changes"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default ShopEditForm;
