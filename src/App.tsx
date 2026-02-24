import { useLenis } from "./lib/useLenis";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Route, Switch, useLocation } from "wouter";
import { Home } from "./pages/Home";
import { Contact } from "./pages/Contact";
import { Service } from "./pages/Service";
import { Services } from "./pages/Services";
import { Packages } from "./pages/Packages";
import { About } from "./pages/About";
import { HowItWorks } from "./pages/HowItWorks";
import { ChatWidget } from "./components/ui/ChatWidget";
import { SiteLoader } from "./components/ui/SiteLoader";
import { useEffect } from "react";

// Wouter doesn't scroll to top automatically, and Lenis can hijack the scroll.
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    // A small timeout ensures Lenis has finished its frame calculation before we force the scroll to 0
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 50);
  }, [location]);
  return null;
}

export function App() {
  // Initialize smooth scrolling globally
  useLenis();

  return (
    <>
      <SiteLoader />
      <ScrollToTop />
      <Navbar />

      <main className="w-full min-h-screen">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/contact" component={Contact} />
          <Route path="/services" component={Services} />
          <Route path="/services/:id" component={Service} />
          <Route path="/packages" component={Packages} />
          <Route path="/about" component={About} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route>
            {/* User requested the site always loads to home screen if unknown route */}
            <Home />
          </Route>
        </Switch>
      </main>

      <Footer />
      <ChatWidget />
    </>
  );
}
