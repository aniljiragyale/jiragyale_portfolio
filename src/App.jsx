import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteContentProvider } from './context/SiteContentContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Chatbot from './components/Chatbot'
import VisitorTracker from './components/VisitorTracker'

// Helper component to scroll window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <SiteContentProvider>
    <BrowserRouter>
      <ScrollToTop />
      <VisitorTracker />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
            <Chatbot />
          </>
        } />
      </Routes>
    </BrowserRouter>
    </SiteContentProvider>
  )
}

export default App
