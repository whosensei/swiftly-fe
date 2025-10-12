"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Button } from "@/components/ui/button";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Divider } from "@/components/auth/divider";
import { EmailField, PasswordField } from "@/components/auth/form-fields";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <SignIn.Root>
          <SignIn.Step name="start" className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-normal font-[family-name:var(--font-instrument-serif)]">
                Welcome to Swiftly
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            <div className="space-y-4">
              <OAuthButtons flow="sign-in" />
              
              <Divider />

              <Clerk.GlobalError className="text-xs text-destructive text-center" />

              <form className="space-y-4">
                <EmailField />
                <PasswordField />

                <div className="flex items-center justify-between text-sm">
                  <SignIn.Action navigate="forgot-password" asChild>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </button>
                  </SignIn.Action>
                </div>

                <SignIn.Action submit asChild>
                  <Button className="w-full font-mono">Sign in</Button>
                </SignIn.Action>
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
          </SignIn.Step>

          <SignIn.Step name="verifications" className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-normal font-[family-name:var(--font-instrument-serif)]">
                Verify your email
              </h1>
              <p className="text-sm text-muted-foreground">
                Check your email for a verification code
              </p>
            </div>

            <SignIn.Strategy name="email_code">
              <form className="space-y-4">
                <Clerk.Field name="code" className="space-y-2">
                  <Clerk.Label className="text-sm font-medium text-foreground">
                    Verification code
                  </Clerk.Label>
                  <Clerk.Input
                    type="text"
                    className="flex items-center gap-3 px-4 py-2.5 shadow-lg border border-border rounded-md w-full bg-transparent outline-none text-sm font-mono"
                    placeholder="Enter code"
                  />
                  <Clerk.FieldError className="text-xs text-destructive" />
                </Clerk.Field>

                <SignIn.Action submit asChild>
                  <Button className="w-full font-mono">Verify</Button>
                </SignIn.Action>
              </form>
            </SignIn.Strategy>

            <SignIn.Action navigate="start" asChild>
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to sign in
              </button>
            </SignIn.Action>
          </SignIn.Step>

          <SignIn.Step name="forgot-password" className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-normal font-[family-name:var(--font-instrument-serif)]">
                Reset password
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email to receive a reset code
              </p>
            </div>

            <form className="space-y-4">
              <EmailField />

              <SignIn.Action submit asChild>
                <Button className="w-full font-mono">Send reset code</Button>
              </SignIn.Action>
            </form>

            <SignIn.Action navigate="start" asChild>
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to sign in
              </button>
            </SignIn.Action>
          </SignIn.Step>

          <SignIn.Step name="reset-password" className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-normal font-[family-name:var(--font-instrument-serif)]">
                Create new password
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter the code and your new password
              </p>
            </div>

            <form className="space-y-4">
              <Clerk.Field name="code" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-foreground">
                  Reset code
                </Clerk.Label>
                <Clerk.Input
                  type="text"
                  className="flex items-center gap-3 px-4 py-2.5 shadow-lg border border-border rounded-md w-full bg-transparent outline-none text-sm font-mono"
                  placeholder="Enter code"
                />
                <Clerk.FieldError className="text-xs text-destructive" />
              </Clerk.Field>

              <PasswordField />

              <Clerk.Field name="confirmPassword" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-foreground">
                  Confirm password
                </Clerk.Label>
                <Clerk.Input
                  type="password"
                  className="flex items-center gap-3 px-4 py-2.5 shadow-lg border border-border rounded-md w-full bg-transparent outline-none text-sm font-mono"
                  placeholder="Confirm password"
                />
                <Clerk.FieldError className="text-xs text-destructive" />
              </Clerk.Field>

              <SignIn.Action submit asChild>
                <Button className="w-full font-mono">Reset password</Button>
              </SignIn.Action>
            </form>
          </SignIn.Step>
        </SignIn.Root>

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

