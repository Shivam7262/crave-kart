
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useShopDetails } from "@/hooks/useShopDetails";
import ShopHero from "@/components/shop/ShopHero";
import ShopOffers from "@/components/shop/ShopOffers";
import CategoryNav from "@/components/shop/CategoryNav";
import ShopMenu from "@/components/shop/ShopMenu";

const ShopDetails = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const { currentUser } = useAuth();
  
  const {
    loading,
    shop,
    categories,
    activeCategory,
    setActiveCategory,
    items,
    shopOffers
  } = useShopDetails(shopId);

  // Determine if the current user is the shop owner
  const isShopOwner = currentUser?.userType === "shopOwner" && currentUser?.ownedShopId === shopId;

  // Log information about the shop and menu items
  console.log("ShopDetails - Shop:", shop);
  console.log("ShopDetails - Categories:", categories);
  console.log("ShopDetails - Active Category:", activeCategory);
  console.log("ShopDetails - Items:", items);
  console.log("ShopDetails - Is Shop Owner:", isShopOwner);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold dark:text-white">Loading shop details...</h2>
        </div>
      </Layout>
    );
  }

  if (!shop) {
    return null;
  }

  return (
    <Layout>
      {/* Hero section */}
      <ShopHero 
        shop={shop} 
        categories={categories} 
        isShopOwner={isShopOwner} 
        shopId={shopId || ""}
      />

      {/* Offers section */}
      <ShopOffers offers={shopOffers} />

      {/* Menu section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <CategoryNav 
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory!}
          />

          {/* Food Items */}
          <ShopMenu 
            items={items} 
            shopId={shopId || ""} 
            isShopOwner={isShopOwner}
          />
        </div>
      </section>
    </Layout>
  );
};

export default ShopDetails;
