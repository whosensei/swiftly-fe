"use client";

import { Button } from "@/components/ui/button";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Divider } from "@/components/auth/divider";
import { EmailField, PasswordField } from "@/components/auth/form-fields";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Step = "start" | "forgot-password" | "reset-password";

export default function SignInPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("start");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      }, {
        onError: (ctx) => {
          setError(ctx.error.message || "Failed to sign in");
        },
        onSuccess: () => {
          router.push("/");
        },
      });
      
      if (result.error) {
        setError(result.error.message || "Failed to sign in");
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.forgetPassword({
        email,
        redirectTo: "/sign-in",
      });

      if (result.error) {
        setError(result.error.message || "Failed to send reset code");
      } else {
        setStep("reset-password");
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword,
      });

      if (result.error) {
        setError(result.error.message || "Failed to reset password");
      } else {
        router.push("/");
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        {step === "start" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-normal font-[family-name:var(--font-instrument-serif)]">
                Welcome to Swiftly
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            <div className="space-y-4">
              <OAuthButtons />
              
              <Divider />

              {error && (
                <div className="text-xs text-destructive text-center">{error}</div>
              )}

              <form className="space-y-4" onSubmit={handleSignIn}>
                <EmailField value={email} onChange={setEmail} />
                <PasswordField value={password} onChange={setPassword} />

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setStep("forgot-password")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button 
                  className="w-full font-mono" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-foreground hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        )}

        {step === "forgot-password" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-normal font-[family-name:var(--font-instrument-serif)]">
                Reset password
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email to receive a reset link
              </p>
            </div>

            {error && (
              <div className="text-xs text-destructive text-center">{error}</div>
            )}

            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <EmailField value={email} onChange={setEmail} />

              <Button 
                className="w-full font-mono" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => setStep("start")}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to sign in
            </button>
          </div>
        )}

        {step === "reset-password" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-normal font-[family-name:var(--font-instrument-serif)]">
                Create new password
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your new password
              </p>
            </div>

            {error && (
              <div className="text-xs text-destructive text-center">{error}</div>
            )}

            <form className="space-y-4" onSubmit={handleResetPassword}>
              <PasswordField value={newPassword} onChange={setNewPassword} />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Confirm password
                </label>
                <input
                  type="password"
                  className="flex items-center gap-3 px-4 py-2.5 shadow-lg border border-border rounded-md w-full bg-transparent outline-none text-sm font-mono"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button 
                className="w-full font-mono" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-muted-foreground">
          By signing in you agree to our{" "}
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of service
          </Link>{" "}
          &{" "}
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy policy
          </Link>
        </div>
      </div>
    </div>
  );
}
