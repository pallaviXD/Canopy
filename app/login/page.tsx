import { AuthLayout } from "@/components/canopy/auth-layout"
import { AuthForm } from "@/components/canopy/auth-form"

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthForm mode="login" />
    </AuthLayout>
  )
}
