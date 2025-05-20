import { Button } from "@/components/ui/button"
import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import LoginPage from "@/app/login/page"
import { BrowserRouter, Routes, Route } from 'react-router';
import ProtectedRoutes from "./utils/ProtectedRoutes"
import Home from "@/app/home"
import AuthProvider from "./utils/AuthProvider"
import { useAuth } from "./utils/AuthProvider"
import Fighter from "@/app/fighter"
import Fight from "@/app/fight"
import { useEffect, useState, useRef } from "react"

function App() {
  const auth = useAuth();

  const test = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  // XP bar state and fetch logic
  const [xp, setXp] = useState(0);
  const xpMax = 100; // Always 100

  // For animation
  const [animatedBar, setAnimatedBar] = useState(0);
  const prevXp = useRef(0);

  useEffect(() => {
    let isCancelled = false;
    let chunks = Math.floor(xp / xpMax);
    let remainder = xp % xpMax;
    let currentChunk = 0;

    function animateChunk(target: number, onDone: () => void) {
      let progress = 0;
      setAnimatedBar(0);
      // Wait for the reset to render before starting the fill
      setTimeout(() => {
        const interval = setInterval(() => {
          if (isCancelled) {
            clearInterval(interval);
            return;
          }
          progress += 2; // speed: higher = faster
          if (progress >= target) {
            setAnimatedBar(target);
            clearInterval(interval);
            setTimeout(onDone, 200); // short pause before next chunk
          } else {
            setAnimatedBar(progress);
          }
        }, 10); // ms per step
      }, 50); // Wait 50ms for the reset to render
    }

    function runAnimation() {
      if (currentChunk < chunks) {
        animateChunk(xpMax, () => {
          currentChunk++;
          runAnimation();
        });
      } else {
        animateChunk(remainder, () => {});
      }
    }

    runAnimation();

    return () => { isCancelled = true; };
  }, [xp, xpMax]);

  useEffect(() => {
    const fetchXp = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.email) return;
        const res = await fetch(`/api/user/${encodeURIComponent(user.email)}/xp`);
        if (res.ok) {
          const data = await res.json();
          setXp(data.xp ?? 0);
        }
      } catch {
        setXp(0);
      }
    };
    fetchXp();
    const interval = setInterval(fetchXp, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">Welcome to FightSim</h1>
                <p>Use the navigation bar to explore the app.</p>
                <div className="mt-2">
                  <a href='/login'>
                    <Button variant="outline" className="mx-1">
                      Login
                    </Button>
                  </a>
                  <a href='/home'>
                    <Button variant="outline" className="mx-1">
                      Home
                    </Button>
                  </a>
                </div>
              </div>
            } />
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/fighter/:nickname" element={<Fighter />} />
            <Route path="/fight/:id" element={<Fight />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
      <div className="fixed top-0 right-0 m-2 z-50 flex flex-col items-end justify-end min-w-[200px]">
        <ModeToggle />
        <div></div>
        <Button variant="outline" className="mx-1 cursor-pointer" onClick={test}>
          {JSON.parse(localStorage.getItem("user") || JSON.stringify({email: "User"})).email}
        </Button>
        {/* XP Bar */}
        <div className="w-full mt-1">
          <div className="text-xs text-right text-gray-300 mb-0.5">
            XP: {xp % xpMax === 0 && xp !== 0 ? xpMax : xp % xpMax} / {xpMax}
          </div>
          <div
            className="w-full h-2 bg-gray-700 rounded overflow-hidden cursor-pointer"
            onClick={async () => {
              if (xp > xpMax) {
                try {
                  const user = JSON.parse(localStorage.getItem("user") || "{}");
                  if (!user.email) return;
                  await fetch(`/api/user/${encodeURIComponent(user.email)}/xp/collect`, { method: "POST" });
                } catch (e) {
                  // Optionally handle error
                }
              }
            }}
          >
            <div
              className="h-2 rounded bg-blue-500 transition-all duration-300"
              style={{ width: `${(animatedBar / xpMax) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
