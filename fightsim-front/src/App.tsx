import { Button } from "@/components/ui/button"
import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {
        <div>
          <div>
            <a href='/login'>
              <Button variant="outline">
                Login
              </Button>
            </a>
          </div>
          <div>
            <ModeToggle />
          </div>
        </div>
      }
    </ThemeProvider>
  )
}

export default App
