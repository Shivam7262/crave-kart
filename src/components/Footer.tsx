
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CraveKart</h3>
            <p className="text-sm text-gray-600">
              Order food from your favorite restaurants with our premium delivery service.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shops" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Shops
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Your Orders
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                support@CraveKart.com
              </li>
              <li className="text-sm text-gray-600">
                +1 (555) 123-4567
              </li>
              <li className="text-sm text-gray-600">
                B-48 Sector 36 Greater Noida
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            © {new Date().getFullYear()} CraveKart. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
