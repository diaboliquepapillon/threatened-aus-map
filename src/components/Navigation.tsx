import { Menu } from 'lucide-react';
import { useState } from 'react';

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-primary">
              Australia's Threatened Animals
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('visualisation')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Visualisation
            </button>
            <button
              onClick={() => scrollToSection('insights')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Insights
            </button>
            <button
              onClick={() => scrollToSection('data')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Data
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => scrollToSection('visualisation')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Visualisation
            </button>
            <button
              onClick={() => scrollToSection('insights')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Insights
            </button>
            <button
              onClick={() => scrollToSection('data')}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              Data
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
