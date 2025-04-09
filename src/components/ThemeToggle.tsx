
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="h-10 w-10 rounded-full border border-slate-200 bg-white shadow-md hover:bg-slate-100 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-300" />
        )}
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;
