
import { Button } from "@/components/ui/button";

interface CategoryNavProps {
  categories: string[];
  activeCategory: string | null;
  setActiveCategory: (category: string) => void;
}

const CategoryNav = ({ categories, activeCategory, setActiveCategory }: CategoryNavProps) => {
  return (
    <div className="mb-8 overflow-auto">
      <div className="flex space-x-2 pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap ${
              activeCategory === category
                ? "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                : "dark:text-white dark:border-gray-600"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
