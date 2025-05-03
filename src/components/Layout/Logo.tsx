import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };
  
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className={`${sizeClasses[size]} rounded-full bg-purple-500 flex items-center justify-center`}>
        <span className={`text-white font-bold ${textSizeClasses[size]}`}>PT</span>
      </div>
      {showText && (
        <h1 className="font-semibold text-lg text-foreground">Productivity Tracker</h1>
      )}
    </Link>
  );
};

export default Logo;
