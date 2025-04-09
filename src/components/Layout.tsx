
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ChatBot from "./ChatBot";
import ThemeToggle from "./ThemeToggle";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <div className="fixed bottom-6 left-6 z-50">
        <ThemeToggle />
      </div>
      <ChatBot />
    </div>
  );
};

export default Layout;
