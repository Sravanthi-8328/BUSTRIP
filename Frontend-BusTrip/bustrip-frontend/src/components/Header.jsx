import React from 'react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function Header({ activeSection, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (section) => {
    onNavigate(section);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
          <button className={activeSection === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('home')}>Home</button>
          <button className={activeSection === 'search' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('search')}>Search trips</button>
          <button className={activeSection === 'manage' ? 'nav-link active' : 'nav-link'} onClick={() => navigate('manage')}>Manage trips</button>
        </nav>
        <button className="header-cta" onClick={() => navigate('manage')}>Manage a trip <span>→</span></button>
      </div>
    </header>
  );
}
