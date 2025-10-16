"use client";

import { Button } from "@/components/ui/button";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Divider } from "@/components/auth/divider";
import {
  EmailFieldSignUp,
  PasswordFieldWithValidation,
  NameField,
} from "@/components/auth/form-fields";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      }, {
        onError: (ctx) => {
          setError(ctx.error.message || "Failed to create account");
        },
        onSuccess: () => {
          router.push("/");
        },
      });

      if (result.error) {
        setError(result.error.message || "Failed to create account");
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
        <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-normal font-[family-name:var(--font-instrument-serif)]">
                Create your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Get started with your free account
              </p>
            </div>

            <div className="space-y-4">
              <OAuthButtons />

              <Divider />

              {error && (
                <div className="text-xs text-destructive text-center">{error}</div>
              )}

              <form className="space-y-4" onSubmit={handleSignUp}>
                <NameField value={name} onChange={setName} />
                <EmailFieldSignUp value={email} onChange={setEmail} />
                <PasswordFieldWithValidation value={password} onChange={setPassword} />

                <Button 
                  className="w-full font-mono" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-foreground hover:underline">
                Sign in
              </Link>
            </p>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
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
