import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as MoonIcon } from '../icons/moon.svg';
import { ReactComponent as SunIcon } from '../icons/sun.svg';

import '../stylesheets/Navigation.css';
import '../stylesheets/DarkMode.css';

function Nav() {
    const storedTheme = localStorage.getItem("theme");
    const [theme, setTheme] = useState(storedTheme || "light");
    const [classSun] = useState('navSun');
    const [classMoon] = useState('navMoon');

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            if (storedTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }
    
    return (
        <nav className="navContainer">
            <div className="navTopContainer">
              <div className="navLogo">
                <Link to='/' className="navLogoLink">
                  <span className="navName">Joint</span>
                  <span className="navJobtitle">Amsterdam</span>
                  </Link>
              </div>
              <div className="navLinks">
                  <Link to='/about'><span className="navLink">about</span></Link>
                  <a href='mailto:###?Subject=Hi%20there!'><span className="navLink">contact</span></a>
              </div>
            </div>
            <div className="navColorChange">
              <div className="navDarkMode" onClick={toggleTheme} aria-label="Toggle theme">
                <SunIcon className={`navSun ${theme === 'dark' ? 'navSun--dark' : ''}`} />
                <MoonIcon className={`navMoon ${theme === 'dark' ? '' : 'navMoon--dark'}`} />
              </div>
            </div>
        </nav>
    );
}

export default Nav;