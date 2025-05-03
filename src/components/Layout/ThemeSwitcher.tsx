
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      className="rounded-full w-9 h-9 transition-all hover:bg-secondary"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 animate-in fade-in duration-300" />
      ) : (
        <Sun className="h-5 w-5 animate-in fade-in duration-300" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;
