
import { Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";

interface NavLinksProps {
  isAdmin: boolean;
}

const NavLinks = ({ isAdmin }: NavLinksProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link
        to="/"
        className={`transition-colors relative pb-1 ${
          isActive("/")
            ? "text-black dark:text-white font-medium after:content-[''] after:absolute after:h-0.5 after:w-full after:bg-black dark:after:bg-white after:bottom-0 after:left-0" 
            : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
        }`}
      >
        Home
      </Link>
      <Link
        to="/shops"
        className={`transition-colors relative pb-1 ${
          isActive("/shops")
            ? "text-black dark:text-white font-medium after:content-[''] after:absolute after:h-0.5 after:w-full after:bg-black dark:after:bg-white after:bottom-0 after:left-0" 
            : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
        }`}
      >
        Shops
      </Link>
      
      {/* Admin Dashboard Link - Only shown for admin users */}
      {isAdmin && (
        <Link
          to="/admin"
          className={`transition-colors relative pb-1 flex items-center gap-1 ${
            isActive("/admin")
              ? "text-black dark:text-white font-medium after:content-[''] after:absolute after:h-0.5 after:w-full after:bg-black dark:after:bg-white after:bottom-0 after:left-0" 
              : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
          }`}
        >
          <Shield className="h-4 w-4" />
          Admin
        </Link>
      )}
    </nav>
  );
};

export default NavLinks;
