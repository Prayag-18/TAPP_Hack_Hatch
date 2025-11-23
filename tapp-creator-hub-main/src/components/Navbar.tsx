import { useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { Menu, X, LogOut } from 'lucide-react';
import tappLogo from '@/assets/tapp-logo.png';
import { useAuth } from '@/hooks/useAPI';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/community', label: 'Community' },
    { to: '/browse-projects', label: 'Browse Projects' },
    { to: '/profile', label: 'Profile' },
    { to: '/feedback', label: 'Feedback' },
    { to: '/projects', label: 'My Projects' },
    { to: '/my-investments', label: 'Investments' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center">
            <img src={tappLogo} alt="TAPP" className="h-10" />
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-foreground/70 hover:text-foreground transition-colors font-light"
                activeClassName="text-primary glow-text"
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-foreground/70 hover:text-foreground hover:bg-transparent"
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 glass rounded-lg p-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="block py-2 text-foreground/70 hover:text-foreground transition-colors"
                activeClassName="text-primary glow-text"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left py-2 text-foreground/70 hover:text-foreground transition-colors flex items-center"
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
