"use client";

import 
{ useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router'; // Assuming this is still the intended router
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, UserCircle, Sun, Moon, LayoutDashboard, CheckSquare } from 'lucide-react';
import { Button } from '../common/Button'; // Import the new Button

// TODO: Replace with actual logo component or SVG
const Logo = ({ isScrolled }: { isScrolled: boolean }) => (
  <Link to="/" className="flex items-center space-x-2 group">
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="text-brand-accent-blue group-hover:text-brand-accent-blue/80 dark:text-brand-accent-blue dark:group-hover:text-brand-accent-blue/80 transition-colors duration-subtle"
    >
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className={`text-2xl font-semibold transition-colors duration-subtle ${isScrolled ? 'text-brand-light-surface' : 'text-brand-light-text-primary dark:text-brand-dark-text-primary'} group-hover:text-brand-accent-blue dark:group-hover:text-brand-accent-blue`}>
      TaskForge
    </span>
  </Link>
);

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isDarkMode = theme === 'dark';

  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.assign('/login'); // Or use router navigation if available
  };

  // toggleTheme is now obtained from useTheme hook

  const navLinks = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    ...(user ? [{ href: "/tasks", label: "My Tasks", icon: CheckSquare }] : []),
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-subtle ease-apple 
                  ${isScrolled 
                    ? 'bg-brand-dark-surface/80 backdrop-blur-md shadow-subtle-md border-b border-brand-dark-border/30'
                    : 'bg-transparent border-b border-transparent'}
                 `}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo isScrolled={isScrolled} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Button 
                key={link.href} 
                href={link.href} 
                variant="ghost" 
                size="md"
                className={isScrolled ? "text-brand-light-surface": ""}
                leftIcon={link.icon ? <link.icon size={18} /> : undefined}
              >
                {link.label}
              </Button>
            ))}
          </nav>

          {/* Desktop Auth & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            <Button onClick={toggleTheme} variant="ghost" size="icon" aria-label="Toggle theme" className={isScrolled ? "text-brand-light-surface": ""}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="md" className={isScrolled ? "text-brand-light-surface": ""}>
                  <UserCircle size={20} className="mr-2" /> {user.username}
                </Button>
                <Button onClick={handleLogout} variant="outline" size="md" leftIcon={<LogOut size={18}/>} className={isScrolled ? "text-brand-light-surface bg-brand-accent-blue dark:bg-brand-dark-surface": ""}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button href="/login" variant="ghost" size="md" className={isScrolled ? "text-brand-light-surface": ""}>Log In</Button>
                <Button href="/signup" variant="primary" size="md" className={isScrolled ? "text-brand-light-surface bg-brand-accent-blue": "text-brand-light-surface"}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} variant="ghost" size="icon" aria-label="Open menu">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 dark:bg-brand-dark-surface bg-brand-light-surface shadow-subtle-lg pb-4 border-t border-brand-dark-border">
          <nav className="flex flex-col space-y-2 px-4 pt-4">
            {navLinks.map((link) => (
              <Button 
                key={link.href} 
                href={link.href} 
                variant="ghost" 
                size="lg"
                className="w-full justify-start"
                leftIcon={link.icon ? <link.icon size={20} /> : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Button>
            ))}
          </nav>
          <div className="mt-4 px-4 border-t border-brand-dark-border pt-4">
            {user ? (
              <div className="space-y-3">
                 <Button variant="ghost" size="lg" className="w-full justify-start">
                  <UserCircle size={20} className="mr-2" /> {user.username}
                </Button>
                <Button onClick={handleLogout} variant="outline" size="lg" className="w-full justify-start" leftIcon={<LogOut size={20}/>}>
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button href="/login" variant="ghost" size="lg" className="w-full justify-start">Log In</Button>
                <Button href="/signup" variant="primary" size="lg" className="w-full justify-start text-brand-light-surface">Sign Up</Button>
              </div>
            )}
             <Button onClick={toggleTheme} variant="ghost" size="lg" className="w-full justify-start mt-3" leftIcon={isDarkMode ? <Sun size={20} /> : <Moon size={20}/>}>
              Toggle Theme
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
