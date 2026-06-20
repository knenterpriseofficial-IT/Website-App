import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
{ label: "Home", href: "/" },
{ label: "Services", href: "/#services" },
{ label: "About", href: "/#about" },
{ label: "Contact", href: "/#contact" }];


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const id = href.replace("/#", "");
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const id = href.replace("/#", "");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/web-logo.png"
            alt="K&N Enterprises"
            className="h-10 w-10 object-cover scale-[0.82] [clip-path:circle(50%)] bg-black" />
          
          <div className="hidden sm:block">
            <div className="font-bold text-lg text-primary leading-tight">K&N Enterprises</div>
            <div className="text-xs text-muted-foreground tracking-widest">RESEARCH · INNOVATION · TECHNOLOGY</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) =>
          <button
            key={link.href}
            onClick={() => handleNav(link.href)}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            
              {link.label}
            </button>
          )}
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          aria-label="Menu">
          
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile + Admin Dropdown */}
      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-16 left-0 right-0 bg-card border-b border-border shadow-xl z-50">
          
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) =>
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-left px-4 py-3 rounded-lg hover:bg-secondary transition-colors font-medium cursor-pointer">
              
                  {link.label}
                </button>
            )}
              <div className="border-t border-border my-2" />
              <button
              onClick={() => {setOpen(false);navigate("/admin");}}
              className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-muted-foreground cursor-pointer">
              
                <Shield className="h-4 w-4" />
                <span className="text-sm">Admin Login</span>
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}