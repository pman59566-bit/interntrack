import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Sign up – InternTrack" };

// The sign-up page at "/signup"
export default function SignupPage() {
  return (
    <div className="auth-page">
      <h1>Create your account</h1>
      {/* Keep this sentence true. The full list of what is stored is in README.md, under Privacy */}
      <p>Free. Only you can see the applications you add.</p>
      <AuthForm mode="signup" />
    </div>
  );
}
