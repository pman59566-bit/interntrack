import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Log in – InternTrack" };

// The login page at "/login"
export default function LoginPage() {
  return (
    <div className="auth-page">
      <h1>Log in</h1>
      <p>Welcome back. Your applications are waiting.</p>
      <AuthForm mode="login" />
    </div>
  );
}
