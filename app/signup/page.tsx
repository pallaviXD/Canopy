import { AuthLayout } from "@/components/canopy/auth-layout"
import { AuthForm } from "@/components/canopy/auth-form"

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthForm mode="signup" />
    </AuthLayout>
  )
}
