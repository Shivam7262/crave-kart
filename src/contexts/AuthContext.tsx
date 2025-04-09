import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as auth from "../services/authService";
import * as shopService from "../services/shopService";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextProps {
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, userType: string) => Promise<void>;
  logout: () => void;
  registerShop: (shopData: Omit<Shop, "id" | "ownerId">) => Promise<string>;
  updateShop: (shopId: string, shopData: Partial<Shop>) => Promise<void>;
  deleteShop: (shopId: string) => Promise<void>;
  getUserOwnedShop: () => Shop | null;
  refreshUserShop: () => Promise<boolean>;
  isAdmin: () => boolean;
  approveShop: (shopId: string) => Promise<void>;
  denyShop: (shopId: string) => Promise<void>;
}

export interface CurrentUser {
  id: string;
  email: string;
  userType: string;
  name: string;
  ownedShopId?: string;
  _id?: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo: string;
  categories: string[];
  ownerId: string;
  certificate?: {
    data: string;
    type: string;
    name: string;
  };
  status?: string;
  createdAt?: Date;
  _id?: string; // Add this field to handle MongoDB ID format
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  setCurrentUser: () => {},
  isLoading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  registerShop: async () => "",
  updateShop: async () => {},
  deleteShop: async () => {},
  getUserOwnedShop: () => null,
  refreshUserShop: async () => false,
  isAdmin: () => false,
  approveShop: async () => {},
  denyShop: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userShop, setUserShop] = useState<Shop | null>(null);
  const [shopDataFetchStatus, setShopDataFetchStatus] = useState<'idle' | 'fetching' | 'fetched'>('idle');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check auth status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const user = await auth.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Fetch user's shop when user is loaded
  useEffect(() => {
    const fetchUserShop = async () => {
      // Skip if we're already fetching shop data or if there's no current user
      if (shopDataFetchStatus === 'fetching' || !currentUser) {
        return;
      }
      
      // Check if user is a shop owner and has a shop ID
      if (currentUser && currentUser.userType === "shopOwner" && currentUser.ownedShopId) {
        try {
          setShopDataFetchStatus('fetching');
          console.log("AuthContext: Fetching shop data for user with shop ID:", currentUser.ownedShopId);
          
          // First see if the shop exists in the local state with matching ID
          if (userShop && (userShop.id === currentUser.ownedShopId || userShop._id === currentUser.ownedShopId)) {
            console.log("AuthContext: Shop already loaded:", userShop);
            setShopDataFetchStatus('fetched');
            return;
          }
          
          // Otherwise fetch from API
          const shop = await shopService.getShopById(currentUser.ownedShopId, currentUser.id);
          
          if (shop) {
            console.log("AuthContext: Shop data loaded:", shop);
            setUserShop({
              ...shop,
              id: shop.id || shop._id
            });
          } else {
            console.log("AuthContext: No shop data returned from API");
            setUserShop(null);
          }
        } catch (error) {
          console.error("AuthContext: Failed to load user's shop:", error);
          setUserShop(null);
        } finally {
          setShopDataFetchStatus('fetched');
        }
      } else {
        console.log("AuthContext: User has no shop ID or is not shop owner, clearing shop state");
        setUserShop(null);
        setShopDataFetchStatus('fetched');
      }
    };

    fetchUserShop();
  }, [currentUser, userShop, shopDataFetchStatus]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await auth.login({ email, password });
      setCurrentUser(user);
      
      // Redirect based on user type
      if (user.userType === 'admin') {
        navigate("/admin");
      } else if (user.userType === 'shopOwner') {
        navigate(user.ownedShopId ? "/shop-dashboard" : "/register-shop");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      setError(error.message || "Failed to login");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Failed to login"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, userType: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await auth.register({ email, password, name, userType: userType as "customer" | "shopOwner" | "admin" });
      setCurrentUser(user);
      
      // Redirect based on user type
      if (user.userType === 'admin') {
        navigate("/admin");
      } else if (user.userType === 'shopOwner') {
        navigate("/register-shop");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      setError(error.message || "Failed to register");
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Failed to register"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    auth.logout();
    setCurrentUser(null);
    navigate("/login");
  };

  const registerShop = async (shopData: Omit<Shop, "id" | "ownerId">) => {
    try {
      if (!currentUser) throw new Error("You must be logged in to register a shop");
      
      console.log("Registering shop with currentUser:", currentUser);
      
      // Get user ID, accounting for both id and _id properties
      const userId = currentUser.id || currentUser._id;
      
      if (!userId) {
        throw new Error("User ID is missing. Please log in again.");
      }
      
      // Create shopData object with userId explicitly set as ownerId
      const shopDataWithOwner = {
        ...shopData,
        ownerId: userId,
        status: "pending" // Set default status as pending
      };
      
      console.log("Prepared shop data with owner:", shopDataWithOwner);
      
      const response = await shopService.registerShop(shopDataWithOwner);
      const shopId = response._id || response.id;
      
      // Update local user state to include owned shop
      setCurrentUser(prev => prev ? {
        ...prev,
        ownedShopId: shopId
      } : null);
      
      // Update shop state immediately
      setUserShop({
        ...response,
        id: shopId
      });
      
      toast({
        title: "Shop Registered",
        description: "Your shop has been submitted for approval. You'll be notified once it's approved."
      });
      
      return shopId;
    } catch (error) {
      console.error('Failed to register shop:', error);
      throw error;
    }
  };

  const updateShop = async (shopId: string, shopData: Partial<Shop>) => {
    try {
      if (!currentUser) throw new Error("You must be logged in to update a shop");
      
      await shopService.updateShop(shopId, shopData);
      
      // Update local shop state
      if (userShop && userShop.id === shopId) {
        setUserShop({
          ...userShop,
          ...shopData
        });
      }
      
      toast({
        title: "Success",
        description: "Shop updated successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update shop"
      });
      throw error;
    }
  };

  const deleteShop = async (shopId: string) => {
    try {
      if (!currentUser) throw new Error("You must be logged in to delete a shop");
      
      await shopService.deleteShop(shopId, currentUser.id);
      
      // Update local user state to remove owned shop
      setCurrentUser(prev => prev ? {
        ...prev,
        ownedShopId: undefined
      } : null);
      
      toast({
        title: "Success",
        description: "Shop deleted successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete shop"
      });
      throw error;
    }
  };

  // Add a function to refresh the user's shop data
  const refreshUserShop = async () => {
    // Prevent multiple simultaneous refreshes
    if (shopDataFetchStatus === 'fetching') {
      console.log("RefreshUserShop: Already fetching shop data, skipping");
      return false;
    }
    
    if (currentUser?.ownedShopId) {
      try {
        setShopDataFetchStatus('fetching');
        console.log("Refreshing shop data for:", currentUser.ownedShopId);
        const shopData = await shopService.getShopById(currentUser.ownedShopId, currentUser.id);
        
        if (shopData) {
          console.log("RefreshUserShop: Shop data refreshed:", shopData);
          setUserShop({
            ...shopData,
            id: shopData.id || shopData._id
          });
          setShopDataFetchStatus('fetched');
          return true;
        } else {
          console.log("RefreshUserShop: No shop data returned");
        }
      } catch (error) {
        console.error("Failed to refresh user's shop:", error);
      } finally {
        setShopDataFetchStatus('fetched');
      }
    } else {
      console.log("RefreshUserShop: No shop ID to refresh");
    }
    return false;
  };

  const getUserOwnedShop = () => {
    console.log("getUserOwnedShop called, returning:", userShop);
    return userShop;
  };
  
  // Check if current user is admin
  const isAdmin = () => {
    return currentUser?.userType === 'admin';
  };
  
  // Approve a shop (admin only)
  const approveShop = async (shopId: string) => {
    try {
      if (!currentUser || currentUser.userType !== 'admin') {
        throw new Error("Only admins can approve shops");
      }
      
      await shopService.updateShop(shopId, { status: "approved" }, currentUser.userType);
      
      // Refresh the shop data in context if it's the user's shop
      await refreshUserShop();
      
      toast({
        title: "Shop Approved",
        description: "The shop has been approved and is now visible to customers"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to approve shop"
      });
      throw error;
    }
  };
  
  // Deny a shop (admin only)
  const denyShop = async (shopId: string) => {
    try {
      if (!currentUser || currentUser.userType !== 'admin') {
        throw new Error("Only admins can deny shops");
      }
      
      await shopService.updateShop(shopId, { status: "rejected" }, currentUser.userType);
      
      toast({
        title: "Shop Denied",
        description: "The shop has been rejected"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to deny shop"
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    isLoading,
    error,
    login,
    signup,
    logout,
    registerShop,
    updateShop,
    deleteShop,
    getUserOwnedShop,
    refreshUserShop,
    isAdmin,
    approveShop,
    denyShop
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
