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

function App() {
  const auth = useAuth();

  const test = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

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
      <div className="fixed top-0 right-0 m-2 z-50 flex items-end justify-end">
        <ModeToggle />
        <div></div>
        <Button variant="outline" className="mx-1" onClick={test}>{JSON.parse(localStorage.getItem("user") || JSON.stringify({email: "User"})).email}</Button>
      </div>
    </ThemeProvider>
  )
}

export default App
