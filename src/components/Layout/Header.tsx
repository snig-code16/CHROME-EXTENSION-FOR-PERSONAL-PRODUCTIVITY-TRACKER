
import { Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-3 py-2 bg-background sticky top-0 z-10 border-b border-border/30">
      <Logo showText={true} size="sm" />
      <div className="flex items-center space-x-1">
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
