export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  shopId?: string;
}

export interface Shop {
  id: string;
  name: string;
  logo: string;
  description: string;
  categories: string[];
  status?: string;
}

export const shops: Shop[] = [
  // {
  //   id: "wow-momo",
  //   name: "Wow Momo",
  //   logo: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
  //   description: "Authentic Asian cuisine with a modern twist.",
  //   categories: ["Chinese", "Momos", "Asian"],
  // },
  {
    id: "burger-club",
    name: "Burger Club",
    logo: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=1780&auto=format&fit=crop",
    description: "Premium burgers made with the finest ingredients.",
    categories: ["Burger", "Fast Food", "American"],
  },
  // {
  //   id: "pizza-paradise",
  //   name: "Pizza Paradise",
  //   logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
  //   description: "Authentic Italian pizzas with premium toppings.",
  //   categories: ["Pizza", "Italian", "Fast Food"],
  // },
  // {
  //   id: "taste-of-india",
  //   name: "Taste of India",
  //   logo: "https://images.unsplash.com/photo-1585937421612-70a008356c36?q=80&w=2036&auto=format&fit=crop",
  //   description: "Authentic Indian cuisine featuring traditional recipes and spices.",
  //   categories: ["Indian", "Curry", "Biryani"],
  // },
  // {
  //   id: "dragon-wok",
  //   name: "Dragon Wok",
  //   logo: "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=2070&auto=format&fit=crop",
  //   description: "Authentic Chinese dishes prepared by master chefs.",
  //   categories: ["Chinese", "Noodles", "Dim Sum"],
  // },
  // {
  //   id: "bella-italia",
  //   name: "Bella Italia",
  //   logo: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=2070&auto=format&fit=crop",
  //   description: "Traditional Italian cuisine with recipes passed down through generations.",
  //   categories: ["Italian", "Pasta", "Risotto"],
  // },
  // {
  //   id: "sushi-spot",
  //   name: "Sushi Spot",
  //   logo: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop",
  //   description: "Fresh and authentic Japanese sushi prepared by skilled chefs.",
  //   categories: ["Japanese", "Sushi", "Asian"],
  // },
  // {
  //   id: "taco-fiesta",
  //   name: "Taco Fiesta",
  //   logo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=2080&auto=format&fit=crop",
  //   description: "Vibrant Mexican flavors with authentic street-style tacos and more.",
  //   categories: ["Mexican", "Tacos", "Burritos"],
  // },
  // // New shops
  // {
  //   id: "spice-junction",
  //   name: "Spice Junction",
  //   logo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop",
  //   description: "Experience the authentic flavors of India with our traditional recipes.",
  //   categories: ["Indian", "Curry", "Tandoori"],
  // },
  // {
  //   id: "golden-dragon",
  //   name: "Golden Dragon",
  //   logo: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2012&auto=format&fit=crop",
  //   description: "Classic Chinese cuisine with modern techniques and fresh ingredients.",
  //   categories: ["Chinese", "Dim Sum", "Noodles"],
  // },
  // {
  //   id: "little-italy",
  //   name: "Little Italy",
  //   logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop",
  //   description: "Authentic Italian pasta, pizza and other delicacies made with love.",
  //   categories: ["Italian", "Pizza", "Pasta"],
  // },
  // {
  //   id: "bombay-street-food",
  //   name: "Bombay Street Food",
  //   logo: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=2071&auto=format&fit=crop",
  //   description: "Experience the vibrant street food culture of Mumbai.",
  //   categories: ["Indian", "Street Food", "Chaat"],
  // },
  // {
  //   id: "szechuan-house",
  //   name: "Szechuan House",
  //   logo: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?q=80&w=2070&auto=format&fit=crop",
  //   description: "Authentic Szechuan cuisine known for bold flavors and spices.",
  //   categories: ["Chinese", "Spicy", "Szechuan"],
  // }
];

export const menuItems: FoodItem[] = [
  // {
  //   id: "classic-burger",
  //   name: "Classic Burger",
  //   description: "Juicy chicken patty with fresh lettuce, tomato, and special sauce.",
  //   price: 90,
  //   image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop",
  //   category: "Burger",
  // },
  // {
  //   id: "cheese-burger",
  //   name: "Cheese Burger",
  //   description: "Classic burger topped with melted cheddar cheese.",
  //   price: 99,
  //   image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=1964&auto=format&fit=crop",
  //   category: "Burger",
  // },
  // {
  //   id: "bacon-burger",
  //   name: "Bacon Burger",
  //   description: "chicken patty with crispy bacon, cheese, and BBQ sauce.",
  //   price: 110,
  //   image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop",
  //   category: "Burger",
  // },
  // {
  //   id: "veggie-burger",
  //   name: "Veggie Burger",
  //   description: "Plant-based patty with fresh vegetables and herb sauce.",
  //   price: 90,
  //   image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=2130&auto=format&fit=crop",
  //   category: "Burger",
  // },
  // {
  //   id: "french-fries",
  //   name: "French Fries",
  //   description: "Crispy golden fries with a sprinkle of sea salt.",
  //   price: 70,
  //   image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=1935&auto=format&fit=crop",
  //   category: "Fast Food",
  // },
  // {
  //   id: "onion-rings",
  //   name: "Onion Rings",
  //   description: "Crispy battered onion rings with dipping sauce.",
  //   price: 60,
  //   image: "https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=1887&auto=format&fit=crop",
  //   category: "Fast Food",
  // },
  // {
  //   id: "margherita-pizza",
  //   name: "Margherita Pizza",
  //   description: "Classic pizza with tomato sauce, mozzarella, and basil.",
  //   price: 12.99,
  //   image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1769&auto=format&fit=crop",
  //   category: "Pizza",
  // },
  // {
  //   id: "pepperoni-pizza",
  //   name: "Pepperoni Pizza",
  //   description: "Traditional pizza topped with spicy pepperoni slices.",
  //   price: 14.99,
  //   image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1780&auto=format&fit=crop",
  //   category: "Pizza",
  // },
  // {
  //   id: "vegetarian-pizza",
  //   name: "Vegetarian Pizza",
  //   description: "Pizza loaded with bell peppers, olives, mushrooms, and onions.",
  //   price: 13.99,
  //   image: "https://images.unsplash.com/photo-1604917877934-07d8d248d396?q=80&w=1887&auto=format&fit=crop",
  //   category: "Pizza",
  // },
  // {
  //   id: "hawaiian-pizza",
  //   name: "Hawaiian Pizza",
  //   description: "Pizza with ham, pineapple, and extra cheese.",
  //   price: 15.99,
  //   image: "https://images.unsplash.com/photo-1600628421055-4d30de868b8f?q=80&w=1887&auto=format&fit=crop",
  //   category: "Pizza",
  // },
  // {
  //   id: "garlic-bread",
  //   name: "Garlic Bread",
  //   description: "Warm bread with garlic butter and herbs.",
  //   price: 5.99,
  //   image: "https://imgs.search.brave.com/wtM7mKBGmj6UXPA0MvNhXSi9gmrr-xaHed_vcRQZLt0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA2LzIxLzg2LzQz/LzM2MF9GXzYyMTg2/NDMzMF9XRTFHSjJs/NW1JM3QzRFAydUpT/bzFZbzlGSHZLejV5/My5qcGc",
  //   category: "Italian",
  // },
  // {
  //   id: "steamed-momos",
  //   name: "Steamed Momos",
  //   description: "Delicate dumplings filled with vegetables or meat.",
  //   price: 7.99,
  //   image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=1770&auto=format&fit=crop",
  //   category: "Momos",
  // },
  // {
  //   id: "fried-momos",
  //   name: "Fried Momos",
  //   description: "Crispy fried dumplings served with spicy dipping sauce.",
  //   price: 8.99,
  //   image: "https://images.unsplash.com/photo-1534422646206-65e256c91b91?q=80&w=1964&auto=format&fit=crop",
  //   category: "Momos",
  // },
  // {
  //   id: "chili-momos",
  //   name: "Chili Momos",
  //   description: "Momos tossed in spicy chili sauce with peppers and onions.",
  //   price: 9.99,
  //   image: "https://images.unsplash.com/photo-1624517607896-1ef60eab6767?q=80&w=1887&auto=format&fit=crop",
  //   category: "Momos",
  // },
  // {
  //   id: "noodles",
  //   name: "Hakka Noodles",
  //   description: "Stir-fried noodles with vegetables and choice of protein.",
  //   price: 10.99,
  //   image: "https://images.unsplash.com/photo-1634864572865-1cf8ff8bd23d?q=80&w=1924&auto=format&fit=crop",
  //   category: "Chinese",
  // },
  // {
  //   id: "fried-rice",
  //   name: "Fried Rice",
  //   description: "Aromatic rice stir-fried with vegetables and eggs.",
  //   price: 9.99,
  //   image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1925&auto=format&fit=crop",
  //   category: "Chinese",
  // },
  // {
  //   id: "spring-rolls",
  //   name: "Spring Rolls",
  //   description: "Crispy rolls filled with vegetables or chicken.",
  //   price: 6.99,
  //   image: "https://images.unsplash.com/photo-1548507231-1207d2687641?q=80&w=2069&auto=format&fit=crop",
  //   category: "Asian",
  // },
  // {
  //   id: "butter-chicken",
  //   name: "Butter Chicken",
  //   description: "Tender chicken in a rich, creamy tomato sauce.",
  //   price: 14.99,
  //   image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop",
  //   category: "Curry",
  // },
  // {
  //   id: "paneer-tikka",
  //   name: "Paneer Tikka",
  //   description: "Marinated cottage cheese cubes grilled to perfection.",
  //   price: 12.99,
  //   image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=2017&auto=format&fit=crop",
  //   category: "Tandoori",
  // },
  // {
  //   id: "biryani",
  //   name: "Chicken Biryani",
  //   description: "Fragrant rice cooked with spices and tender chicken.",
  //   price: 15.99,
  //   image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1974&auto=format&fit=crop",
  //   category: "Biryani",
  // },
  // {
  //   id: "samosa",
  //   name: "Vegetable Samosa",
  //   description: "Crispy pastry filled with spiced potatoes and peas.",
  //   price: 6.99,
  //   image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2071&auto=format&fit=crop",
  //   category: "Street Food",
  // },
  // {
  //   id: "pav-bhaji",
  //   name: "Pav Bhaji",
  //   description: "Spiced vegetable mash served with buttered rolls.",
  //   price: 9.99,
  //   image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=2071&auto=format&fit=crop",
  //   category: "Street Food",
  // },
  // {
  //   id: "kung-pao-chicken",
  //   name: "Kung Pao Chicken",
  //   description: "Stir-fried chicken with peanuts, vegetables, and chili peppers.",
  //   price: 13.99,
  //   image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=2070&auto=format&fit=crop",
  //   category: "Chinese",
  // },
  // {
  //   id: "mapo-tofu",
  //   name: "Mapo Tofu",
  //   description: "Soft tofu in a spicy sauce with minced pork.",
  //   price: 11.99,
  //   image: "https://images.unsplash.com/photo-1582452919408-5d2e38045383?q=80&w=1974&auto=format&fit=crop",
  //   category: "Szechuan",
  // },
  // {
  //   id: "dim-sum-platter",
  //   name: "Dim Sum Platter",
  //   description: "Assorted steamed dumplings with various fillings.",
  //   price: 16.99,
  //   image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2012&auto=format&fit=crop",
  //   category: "Dim Sum",
  // },
  // {
  //   id: "fettuccine-alfredo",
  //   name: "Fettuccine Alfredo",
  //   description: "Pasta in a rich, creamy parmesan sauce.",
  //   price: 14.99,
  //   image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=2070&auto=format&fit=crop",
  //   category: "Pasta",
  // },
  // {
  //   id: "risotto-mushroom",
  //   name: "Mushroom Risotto",
  //   description: "Creamy arborio rice with sautéed mushrooms and parmesan.",
  //   price: 15.99,
  //   image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=2070&auto=format&fit=crop",
  //   category: "Risotto",
  // },
  // {
  //   id: "carbonara",
  //   name: "Spaghetti Carbonara",
  //   description: "Classic pasta with eggs, cheese, pancetta, and black pepper.",
  //   price: 13.99,
  //   image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=2071&auto=format&fit=crop",
  //   category: "Pasta",
  // }
];

export const getShopItems = (shopId: string): FoodItem[] => {
  // First check if this is a custom shop added by a shop owner
  const customShops = JSON.parse(localStorage.getItem("shops") || "[]");
  const isCustomShop = customShops.some((shop: Shop) => shop.id === shopId);
  
  // Get default items based on categories if it's a predefined shop
  let items: FoodItem[] = [];
  
  // Check both predefined and custom shops for categories
  const shopFromLocal = customShops.find((s: Shop) => s.id === shopId);
  const shopFromPredefined = shops.find((s) => s.id === shopId);
  
  const shop = shopFromLocal || shopFromPredefined;
  
  if (shop) {
    // Get all menu items that match the shop's categories
    items = menuItems.filter((item) => shop.categories.includes(item.category));
  }
  
  // Get custom items for this shop
  const customItems = JSON.parse(localStorage.getItem("foodItems") || "[]")
    .filter((item: FoodItem) => item.shopId === shopId);
  
  return [...items, ...customItems];
};

export const getShopCategories = (shopId: string): string[] => {
  // Check if this is a custom shop
  const customShops = JSON.parse(localStorage.getItem("shops") || "[]");
  const customShop = customShops.find((shop: Shop) => shop.id === shopId);
  
  if (customShop) {
    return customShop.categories;
  }
  
  // Otherwise return categories for predefined shop
  const shop = shops.find((s) => s.id === shopId);
  return shop ? shop.categories : [];
};

// Function to get all shops (both predefined and custom)
export const getAllShops = (): Shop[] => {
  const customShops = JSON.parse(localStorage.getItem("shops") || "[]");
  return [...shops, ...customShops];
};
