import { lazy, Suspense, useEffect } from "react";
import { useLenis } from "./lib/useLenis";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Route, Switch, useLocation } from "wouter";
import { SiteLoader } from "./components/ui/SiteLoader";

const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const Contact = lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const Service = lazy(() => import("./pages/Service").then(m => ({ default: m.Service })));
const Services = lazy(() => import("./pages/Services").then(m => ({ default: m.Services })));
const Packages = lazy(() => import("./pages/Packages").then(m => ({ default: m.Packages })));
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const HowItWorks = lazy(() => import("./pages/HowItWorks").then(m => ({ default: m.HowItWorks })));
const ChatWidget = lazy(() => import("./components/ui/ChatWidget").then(m => ({ default: m.ChatWidget })));

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
        <Suspense fallback={<div className="min-h-screen bg-[#030305]" />}>
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
        </Suspense>
      </main>

      <Footer />
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </>
  );
}
