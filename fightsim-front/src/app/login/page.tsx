import { LoginForm } from "@/components/login-form"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigate } from "react-router"

export default function LoginPage() {
  const user = true
  if (user) {
    return <Navigate to="/" />
  }
  return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
  )
}
