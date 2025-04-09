
import { Link } from "react-router-dom";
import { ShoppingCart, User, LogOut, Shield } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  currentUser: any | null;
  isAdmin: boolean;
  totalItems: number;
  onClose: () => void;
  onLogout: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  currentUser, 
  isAdmin, 
  totalItems, 
  onClose, 
  onLogout 
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-b-lg p-4 md:hidden animate-slideIn">
      <nav className="flex flex-col space-y-4">
        <Link
          to="/"
          className="py-2 text-black dark:text-white font-medium"
          onClick={onClose}
        >
          Home
        </Link>
        <Link
          to="/shops"
          className="py-2 text-black dark:text-white font-medium"
          onClick={onClose}
        >
          Shops
        </Link>
        
        {/* Admin Dashboard Link for Mobile - Only shown for admin users */}
        {currentUser && isAdmin && (
          <Link
            to="/admin"
            className="py-2 text-black dark:text-white font-medium flex items-center"
            onClick={onClose}
          >
            <Shield className="h-5 w-5 mr-2" />
            Admin Dashboard
          </Link>
        )}
        
        <Link
          to="/cart"
          className="py-2 text-black dark:text-white font-medium flex items-center"
          onClick={onClose}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart {totalItems > 0 && <span className="ml-1">({totalItems})</span>}
        </Link>
        {currentUser ? (
          <>
            <Link
              to="/profile"
              className="py-2 text-black dark:text-white font-medium flex items-center"
              onClick={onClose}
            >
              <User className="h-5 w-5 mr-2" />
              My Profile
            </Link>
            <Link
              to="/orders"
              className="py-2 text-black dark:text-white font-medium"
              onClick={onClose}
            >
              My Orders
            </Link>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="py-2 text-red-500 font-medium flex items-center"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="py-2 text-black dark:text-white font-medium"
            onClick={onClose}
          >
            Sign In
          </Link>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
