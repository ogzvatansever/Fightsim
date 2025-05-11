import { Button } from "@/components/ui/button"
import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import LoginPage from "@/app/login/page"
import { BrowserRouter, Routes, Route } from 'react-router';
import ProtectedRoutes from "./utils/ProtectedRoutes"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold">Welcome to FightSim</h1>
              <p>Use the navigation bar to explore the app.</p>
              <div className="mt-2">
                <a href='/login'>
                  <Button variant="outline">
                    Login
                  </Button>
                </a>
              </div>
            </div>
          } />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
      <div className="fixed top-0 right-0 m-2 z-50">
        <ModeToggle />
      </div>
    </ThemeProvider>
  )
}

export default App
