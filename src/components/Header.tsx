
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import NavLinks from "./header/NavLinks";
import CartButton from "./header/CartButton";
import UserMenu from "./header/UserMenu";
import MobileMenu from "./header/MobileMenu";

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { theme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? theme === "dark" 
            ? "bg-gray-900/80 backdrop-blur-md shadow-sm" 
            : "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">CraveKart</span>
        </Link>

        {/* Desktop Navigation */}
        <NavLinks isAdmin={isAdmin()} />

        {/* Right Side - Auth & Cart */}
        <div className="hidden md:flex items-center space-x-4">
          <CartButton totalItems={totalItems} />
          <UserMenu 
            currentUser={currentUser}
            isAdmin={isAdmin()}
            onLogout={logout}
          />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          currentUser={currentUser}
          isAdmin={isAdmin()}
          totalItems={totalItems}
          onClose={closeMobileMenu}
          onLogout={logout}
        />
      </div>
    </header>
  );
};

export default Header;
