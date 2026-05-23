import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <NavLink to="/" className="nav-brand">AJ.</NavLink>

      <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''}>About</NavLink></li>
        <li><NavLink to="/projects" className={({isActive}) => isActive ? 'active' : ''}>Projects</NavLink></li>
        <li><NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>Contact</NavLink></li>
      </ul>

      <NavLink to="/contact" className="nav-cta">Hire Me ✦</NavLink>
    </nav>
  )
}
