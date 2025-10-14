import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-gradient-sunset transition-transform duration-300 group-hover:scale-110">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-sunset bg-clip-text text-transparent">
              ShingaBot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/chat" className="text-foreground hover:text-primary transition-colors">
              Chat
            </Link>
            <Link to="/affirmations" className="text-foreground hover:text-primary transition-colors">
              Daily Affirmations
            </Link>
            <Link to="/mood-tracker" className="text-foreground hover:text-primary transition-colors">
              Mood Tracker
            </Link>
            <Link to="/resources" className="text-foreground hover:text-primary transition-colors">
              Resources
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/chat"
              className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Chat
            </Link>
            <Link
              to="/affirmations"
              className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Daily Affirmations
            </Link>
            <Link
              to="/mood-tracker"
              className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Mood Tracker
            </Link>
            <Link
              to="/resources"
              className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
