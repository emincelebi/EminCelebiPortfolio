import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BackgroundCodeStream } from './components/BackgroundCodeStream';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Articles } from './components/Articles';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Admin } from './pages/Admin';
import { FloatingTerminal } from './components/terminal/FloatingTerminal';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <LanguageProvider>
      <PortfolioProvider>
        {currentPath === '/admin' ? (
          <Admin />
        ) : (
          <div className="min-h-screen bg-[#080A0F] text-[#F5F7FA] font-sans selection:bg-[#43D9C3] selection:text-[#080A0F] relative overflow-x-hidden antialiased flex flex-col justify-between">
            <BackgroundCodeStream />
            <Navbar />
            <main className="grow relative z-10">
              <Hero />
              <About />
              <Projects />
              <Articles />
              <Contact />
              <FloatingTerminal />
            </main>
            <Footer />
          </div>
        )}
      </PortfolioProvider>
    </LanguageProvider>
  );
}

export default App;