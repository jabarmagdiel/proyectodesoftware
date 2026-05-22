import { AuthLayout } from "@/shared/components/layout";
import { LoginForm } from "@/features/auth";
import { UI } from "@/config/constants";

export default function LoginPage() {
  return (
    <AuthLayout title={UI.LOGIN_TITLE} subtitle={UI.LOGIN_SUBTITLE}>
      <LoginForm />
    </AuthLayout>
  );
}
