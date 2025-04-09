
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
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
import * as foodItemService from "@/services/foodItemService";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0" }),
  image: z.string().url({ message: "Please enter a valid URL for your item image" }),
  category: z.string({ required_error: "Please select a category" }),
});

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  shopId: string;
}

interface MenuItemsManagerProps {
  shopId: string;
  categories: string[];
}

// Helper function to format currency in Indian Rupees
const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

const MenuItemsManager = ({ shopId, categories }: MenuItemsManagerProps) => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: "",
      category: categories[0] || "",
    },
  });

  // Load menu items
  useEffect(() => {
    const loadMenuItems = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from API first
        try {
          console.log("MenuItemsManager - Fetching items for shop:", shopId);
          const apiItems = await foodItemService.getShopFoodItems(shopId);
          console.log("MenuItemsManager - API items:", apiItems);
          
          if (Array.isArray(apiItems) && apiItems.length > 0) {
            const formattedItems = apiItems.map((item: any) => ({
              id: item._id || item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              image: item.image,
              category: item.category,
              shopId: item.shopId || shopId
            }));
            
            setMenuItems(formattedItems);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error("MenuItemsManager - Error fetching API items:", error);
        }
        
        // Fallback to local storage
        console.log("MenuItemsManager - Falling back to local storage items");
        const storedItems = JSON.parse(localStorage.getItem("foodItems") || "[]");
        const shopItems = storedItems.filter((item: FoodItem) => item.shopId === shopId);
        setMenuItems(shopItems);
      } catch (error) {
        console.error("MenuItemsManager - Error loading menu items:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load menu items",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMenuItems();
  }, [shopId, toast]);

  // Filter items by category
  const filteredItems = selectedCategory === "all"
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      price: 0,
      image: "",
      category: categories[0] || "",
    });
    setEditingItemId(null);
  };

  const openAddItemDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditItemDialog = (item: FoodItem) => {
    form.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    setEditingItemId(item.id);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (editingItemId) {
        // Update existing item
        console.log("MenuItemsManager - Updating item:", editingItemId);
        
        try {
          // Try to update in API first
          await foodItemService.updateFoodItem(editingItemId, {
            ...values,
            shopId
          });
          
          toast({
            title: "Success",
            description: "Menu item updated successfully in API",
          });
        } catch (error) {
          console.error("MenuItemsManager - Error updating in API:", error);
          
          // Fallback to local storage
          const allItems = JSON.parse(localStorage.getItem("foodItems") || "[]");
          const itemIndex = allItems.findIndex((item: FoodItem) => item.id === editingItemId);
          
          if (itemIndex !== -1) {
            allItems[itemIndex] = {
              ...allItems[itemIndex],
              ...values,
            };
            
            localStorage.setItem("foodItems", JSON.stringify(allItems));
            
            toast({
              title: "Success",
              description: "Menu item updated successfully in local storage",
            });
          }
        }
        
        // Update local state
        setMenuItems(prevItems => 
          prevItems.map(item => 
            item.id === editingItemId 
              ? { ...item, ...values } 
              : item
          )
        );
      } else {
        // Add new item
        console.log("MenuItemsManager - Creating new item");
        try {
          // Try to create in API first
          const newApiItem = await foodItemService.createFoodItem({
            name: values.name,
            description: values.description,
            price: values.price,
            image: values.image,
            category: values.category,
            shopId: shopId
          });
          
          console.log("MenuItemsManager - Created in API:", newApiItem);
          
          // Add to local state
          setMenuItems(prevItems => [...prevItems, {
            id: newApiItem._id || newApiItem.id,
            name: values.name,
            description: values.description,
            price: values.price,
            image: values.image,
            category: values.category,
            shopId: shopId
          }]);
          
          toast({
            title: "Success",
            description: "Menu item added successfully to API",
          });
        } catch (error) {
          console.error("MenuItemsManager - Error creating in API:", error);
          
          // Fallback to local storage
          const newItem = {
            id: Math.random().toString(36).substring(2, 15),
            name: values.name,
            description: values.description,
            price: values.price,
            image: values.image,
            category: values.category,
            shopId: shopId,
          };
          
          const allItems = JSON.parse(localStorage.getItem("foodItems") || "[]");
          allItems.push(newItem);
          localStorage.setItem("foodItems", JSON.stringify(allItems));
          
          // Add to local state
          setMenuItems(prevItems => [...prevItems, newItem]);
          
          toast({
            title: "Success",
            description: "Menu item added successfully to local storage",
          });
        }
      }
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("MenuItemsManager - Error saving menu item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save menu item",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      console.log("MenuItemsManager - Deleting item:", itemId);
      
      try {
        // Try to delete from API first
        await foodItemService.deleteFoodItem(itemId);
        
        toast({
          title: "Success",
          description: "Menu item deleted successfully from API",
        });
      } catch (error) {
        console.error("MenuItemsManager - Error deleting from API:", error);
        
        // Fallback to local storage
        const allItems = JSON.parse(localStorage.getItem("foodItems") || "[]");
        const updatedItems = allItems.filter((item: FoodItem) => item.id !== itemId);
        localStorage.setItem("foodItems", JSON.stringify(updatedItems));
        
        toast({
          title: "Success",
          description: "Menu item deleted successfully from local storage",
        });
      }
      
      // Update local state regardless of storage method
      setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("MenuItemsManager - Error deleting menu item:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete menu item",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Menu Items</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddItemDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItemId ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Pizza Margherita" {...field} />
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
                          placeholder="Fresh mozzarella, tomatoes, and basil..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="9.99" 
                            step="0.01"
                            min="0"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/pizza.jpg" 
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
                    {isLoading ? "Saving..." : (editingItemId ? "Save Changes" : "Add Item")}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="text-sm font-medium">Filter by category:</h3>
          <Select 
            value={selectedCategory} 
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="max-w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Loading menu items...</h3>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-gray-50 dark:bg-gray-900 rounded-lg border overflow-hidden"
            >
              <div 
                className="h-48 bg-cover bg-center" 
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.category}</span>
                  </div>
                  <div className="font-semibold">{formatCurrency(item.price)}</div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEditItemDialog(item)}
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
                          This will permanently delete this menu item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteItem(item.id)}
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
          <h3 className="text-xl font-medium mb-2">No items found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {selectedCategory === "all"
              ? "You haven't added any menu items yet."
              : `No items in the '${selectedCategory}' category.`}
          </p>
          <Button onClick={openAddItemDialog} variant="indian">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Menu Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuItemsManager;
