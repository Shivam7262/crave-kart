
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FoodItem, getShopItems } from "@/lib/data";
import * as shopService from "@/services/shopService";
import * as foodItemService from "@/services/foodItemService";
import { useToast } from "@/hooks/use-toast";

export interface Offer {
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

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  categories: string[];
  status?: string;
  source?: 'api' | 'local';
}

export const useShopDetails = (shopId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [allItems, setAllItems] = useState<FoodItem[]>([]);
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopOffers, setShopOffers] = useState<Offer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load shop details
  useEffect(() => {
    if (!shopId) return;
    
    const fetchShopData = async () => {
      try {
        setLoading(true);
        console.log("useShopDetails - Fetching shop data for:", shopId);
        
        // Try to fetch from API first (for shop owner created shops)
        try {
          const apiShop = await shopService.getAllShops();
          console.log("useShopDetails - API shops response:", apiShop);
          
          // Find the specific shop in the API response
          const foundShop = Array.isArray(apiShop) ? 
            apiShop.find((s: any) => (s._id || s.id) === shopId) : null;
          
          if (foundShop) {
            console.log("useShopDetails - Found shop in API:", foundShop);
            
            // Format shop data consistently
            const formattedShop = {
              id: foundShop._id || foundShop.id,
              name: foundShop.name,
              description: foundShop.description,
              logo: foundShop.logo,
              categories: foundShop.categories || [],
              status: foundShop.status,
              source: 'api' as const
            };
            
            setShop(formattedShop);
            setCategories(formattedShop.categories);
            
            // Set initial active category
            if (formattedShop.categories && formattedShop.categories.length > 0) {
              setActiveCategory(formattedShop.categories[0]);
            }
            
            // Fetch food items for API shop
            const shopIdToUse = formattedShop.id;
            console.log("useShopDetails - Fetching food items for API shop:", shopIdToUse);
            
            try {
              const foodItems = await foodItemService.getShopFoodItems(shopIdToUse);
              console.log("useShopDetails - API shop food items:", foodItems);
              
              if (Array.isArray(foodItems) && foodItems.length > 0) {
                const formattedItems = foodItems.map((item: any) => ({
                  id: item._id || item.id,
                  name: item.name,
                  description: item.description,
                  price: item.price,
                  image: item.image,
                  category: item.category,
                  shopId: item.shopId
                }));
                
                console.log("useShopDetails - Formatted items:", formattedItems);
                setAllItems(formattedItems);
                
                // If we have an active category, filter by it
                if (activeCategory) {
                  filterItemsByActiveCategory(formattedItems, activeCategory);
                } else if (formattedShop.categories.length > 0) {
                  // Otherwise filter by first category
                  filterItemsByActiveCategory(formattedItems, formattedShop.categories[0]);
                } else {
                  // If no categories, show all items
                  setItems(formattedItems);
                }
              } else {
                console.log("useShopDetails - No food items found for this shop");
                setAllItems([]);
                setItems([]);
              }
            } catch (error) {
              console.error("useShopDetails - Error fetching food items:", error);
              setAllItems([]);
              setItems([]);
            }
            
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log("useShopDetails - Error with API shops, checking individual shop:", error);
          // Continue to try the individual shop endpoint
        }
        
        // If we didn't find the shop in the getAllShops response, try getShopById
        try {
          const apiShop = await shopService.getShopById(shopId);
          console.log("useShopDetails - API shop response from direct lookup:", apiShop);
          
          if (apiShop && (apiShop._id || apiShop.id)) {
            // Format shop data consistently
            const formattedShop = {
              id: apiShop._id || apiShop.id,
              name: apiShop.name,
              description: apiShop.description,
              logo: apiShop.logo,
              categories: apiShop.categories || [],
              status: apiShop.status,
              source: 'api' as const
            };
            
            setShop(formattedShop);
            setCategories(formattedShop.categories);
            
            // Set initial active category and fetch food items
            if (formattedShop.categories && formattedShop.categories.length > 0) {
              setActiveCategory(formattedShop.categories[0]);
            }
            
            try {
              const foodItems = await foodItemService.getShopFoodItems(formattedShop.id);
              if (Array.isArray(foodItems) && foodItems.length > 0) {
                const formattedItems = foodItems.map((item: any) => ({
                  id: item._id || item.id,
                  name: item.name,
                  description: item.description,
                  price: item.price,
                  image: item.image,
                  category: item.category,
                  shopId: item.shopId
                }));
                
                setAllItems(formattedItems);
                
                // Filter items by active category if applicable
                if (activeCategory) {
                  filterItemsByActiveCategory(formattedItems, activeCategory);
                } else if (formattedShop.categories.length > 0) {
                  filterItemsByActiveCategory(formattedItems, formattedShop.categories[0]);
                } else {
                  setItems(formattedItems);
                }
              }
            } catch (error) {
              console.error("useShopDetails - Error fetching food items:", error);
            }
            
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log("useShopDetails - Shop not found in API, checking local data", error);
        }
        
        // If we get here, check local data for shop information
        // Check if this is a custom shop
        const customShops = JSON.parse(localStorage.getItem("shops") || "[]");
        const customShop = customShops.find((s: any) => s.id === shopId);
        
        // Import shops data from local data
        import('@/lib/data').then(({ shops }) => {
          // Check default shops if not found in custom shops
          const defaultShop = shops.find((s: any) => s.id === shopId);
          
          if (customShop) {
            console.log("useShopDetails - Found custom shop:", customShop);
            setShop({...customShop, source: 'local'});
            setCategories(customShop.categories || []);
            if (customShop.categories && customShop.categories.length > 0) {
              setActiveCategory(customShop.categories[0]);
            }
          } else if (defaultShop) {
            console.log("useShopDetails - Found default shop:", defaultShop);
            setShop({...defaultShop, source: 'local'});
            setCategories(defaultShop.categories || []);
            if (defaultShop.categories && defaultShop.categories.length > 0) {
              setActiveCategory(defaultShop.categories[0]);
            }
          } else {
            // Shop not found, redirect
            toast({
              variant: "destructive",
              title: "Shop not found",
              description: "The shop you're looking for doesn't exist."
            });
            navigate("/shops");
            return;
          }
          
          // Load items for local or predefined shop
          console.log("useShopDetails - Loading items for local/predefined shop:", shopId);
          const shopItems = getShopItems(shopId);
          console.log("useShopDetails - Local shop items:", shopItems);
          setAllItems(shopItems);
          
          // Filter items by the active category if there is one
          if (activeCategory) {
            filterItemsByActiveCategory(shopItems, activeCategory);
          } else if ((defaultShop?.categories?.length > 0 || customShop?.categories?.length > 0)) {
            const category = (defaultShop || customShop).categories[0];
            filterItemsByActiveCategory(shopItems, category);
          } else {
            setItems(shopItems);
          }
          
          setLoading(false);
        });
        
        // Load shop offers
        const storedOffers = JSON.parse(localStorage.getItem("promotionalOffers") || "[]");
        const offers = storedOffers.filter((offer: Offer) => offer.shopId === shopId);
        setShopOffers(offers);
      } catch (error) {
        console.error("useShopDetails - Error fetching shop:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load shop details."
        });
        setLoading(false);
      }
    };
    
    fetchShopData();
  }, [shopId, navigate, toast]);

  // Helper function to filter items by category with fallback
  const filterItemsByActiveCategory = (allItems: FoodItem[], category: string) => {
    console.log("useShopDetails - Filtering by category:", category);
    
    // First try exact match (case-insensitive)
    const exactMatches = allItems.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
    
    console.log("useShopDetails - Exact category matches:", exactMatches);
    
    if (exactMatches.length > 0) {
      setItems(exactMatches);
    } else {
      // If no exact matches, try contains match
      const containsMatches = allItems.filter(item => 
        item.category.toLowerCase().includes(category.toLowerCase()) ||
        category.toLowerCase().includes(item.category.toLowerCase())
      );
      
      console.log("useShopDetails - Contains category matches:", containsMatches);
      
      if (containsMatches.length > 0) {
        setItems(containsMatches);
      } else {
        // If still no matches, show all items as fallback
        console.log("useShopDetails - No category matches, showing all items");
        setItems(allItems);
      }
    }
  };

  // Update items when active category changes
  useEffect(() => {
    if (!shopId || !shop || activeCategory === null || allItems.length === 0) return;
    
    console.log("useShopDetails - Active category changed to:", activeCategory);
    filterItemsByActiveCategory(allItems, activeCategory);
    
  }, [shopId, shop, activeCategory, allItems]);

  return {
    loading,
    shop,
    categories,
    activeCategory,
    setActiveCategory,
    items,
    shopOffers
  };
};
