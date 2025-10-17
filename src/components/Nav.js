import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as MoonIcon } from '../icons/moon.svg';
import { ReactComponent as SunIcon } from '../icons/sun.svg';

import '../stylesheets/Navigation.css';
import '../stylesheets/DarkMode.css';

function Nav() {
  const storedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(storedTheme || "light");
  const [scrolled, setScrolled] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  }, [storedTheme]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navContainer">
      <div className="navTopContainer">

        {/* Logo */}
        <div className={`navLogo ${scrolled ? 'iconAlignLeft' : ''}`}>
          <Link to='/' className="navLogoLink">
            <svg id="navLogo" alt="Joint Amsterdam Logo" className={`navLogoImage iconImage ${!scrolled ? 'logoFade--visible' : 'logoFade--hidden'}`} viewBox="0 0 220.58 34.62">
              <defs>
                <style>
                  {`.cls-1 { fill: currentColor; }`}
                </style>
              </defs>
              <g id="Layer_1-2" data-name="Layer 1">
                <g>
                  <path className="cls-1" d="M0,28.91l5.94-5.61c1.62,1.95,3.14,3.09,5.18,3.09,2.33,0,3.8-1.57,3.8-4.66V.67h9.18v21.11c0,4.18-1.05,7.13-3.28,9.37s-5.33,3.38-9.13,3.38c-5.8,0-9.37-2.43-11.7-5.61Z"/>
                  <path className="cls-1" d="M41.37,17.4v-.1C41.37,7.75,49.08,0,59.35,0s17.88,7.66,17.88,17.21v.09c0,9.56-7.7,17.31-17.97,17.31s-17.88-7.66-17.88-17.21ZM67.81,17.4v-.1c0-4.8-3.47-8.99-8.56-8.99s-8.41,4.09-8.41,8.89v.09c0,4.8,3.47,8.99,8.51,8.99s8.46-4.09,8.46-8.89Z"/>
                  <path className="cls-1" d="M94.04.67h9.27v33.28h-9.27V.67Z"/>
                  <path className="cls-1" d="M124.57.67h8.61l13.7,17.59V.67h9.13v33.28h-8.08l-14.22-18.26v18.26h-9.13V.67Z"/>
                  <path className="cls-1" d="M181.24,8.75h-9.98V.67h29.2v8.08h-9.99v25.2h-9.22V8.75Z"/>
                  <path className="cls-1" d="M212.53.67h8.05v8.08h-8.05V.67Z"/>
                </g>
              </g>
            </svg>
            <svg id="navLogo" alt="Joint Amsterdam Icon" className={`navLogoImage logoImage ${scrolled ? 'logoFade--visible' : 'logoFade--hidden'}`} viewBox="0 0 74.05 74.05">
              <defs>
                <style>
                  {`.cls-1 { fill: currentColor; }`}
                </style>
              </defs>
              <g id="Layer_1-2" data-name="Layer 1">
                <g>
                  <path className="cls-1" d="M22.69,49.62l5.94-5.61c1.62,1.95,3.14,3.09,5.18,3.09,2.33,0,3.8-1.57,3.8-4.66v-21.06h9.18v21.11c0,4.18-1.05,7.13-3.28,9.37-2.19,2.19-5.33,3.38-9.13,3.38-5.8,0-9.37-2.43-11.7-5.61Z"/>
                  <polygon className="cls-1" points="67.05 67.05 7 67.05 7 7 67.05 7 67.05 21.38 74.05 21.38 74.05 0 0 0 0 74.05 74.05 74.05 74.05 29.46 67.05 29.46 67.05 67.05"/>
                </g>
              </g>
            </svg>
          </Link>
        </div>

        {/* Navigation links */}
        <div className="navLinks">
          <Link to='/work' className="navLink">work</Link>
          <Link to='/about' className="navLink">about</Link>
          <a href='mailto:###?Subject=Hi%20there!' className="navLink">contact</a>
        </div>
      </div>

      {/* Dark mode toggle */}
      <div className="navColorChange">
        <div className="navDarkMode" onClick={toggleTheme} aria-label="Toggle theme">
          <SunIcon className={`navThemeIcon ${theme === 'light' ? 'themeVisible' : 'themeHidden'}`} />
          <MoonIcon className={`navThemeIcon ${theme === 'dark' ? 'themeVisible' : 'themeHidden'}`} />
        </div>
      </div>
    </nav>
  );
}

export default Nav;
