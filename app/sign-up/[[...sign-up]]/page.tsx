"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { Button } from "@/components/ui/button";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Divider } from "@/components/auth/divider";
import {
  EmailFieldSignUp,
  PasswordFieldWithValidation,
} from "@/components/auth/form-fields";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <SignUp.Root>
          <SignUp.Step name="start" className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-normal font-[family-name:var(--font-instrument-serif)]">
                Create your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Get started with your free account
              </p>
            </div>

            <div className="space-y-4">
              <OAuthButtons flow="sign-up" />

              <Divider />

              <Clerk.GlobalError className="text-xs text-destructive text-center" />

              <form className="space-y-4">
                <EmailFieldSignUp />
                <PasswordFieldWithValidation />

                <SignUp.Captcha className="empty:hidden" />

                <SignUp.Action submit asChild>
                  <Button className="w-full font-mono">Create account</Button>
                </SignUp.Action>
              </form>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-foreground hover:underline">
                Sign in
              </Link>
            </p>
          </SignUp.Step>

          <SignUp.Step name="verifications" className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-normal font-[family-name:var(--font-instrument-serif)]">
                Verify your email
              </h1>
              <p className="text-sm text-muted-foreground">
                We sent a code to your email address
              </p>
            </div>

            <SignUp.Strategy name="email_code">
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

                <SignUp.Action submit asChild>
                  <Button className="w-full font-mono">Verify email</Button>
                </SignUp.Action>

                <SignUp.Action
                  resend
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  fallback={({ resendableAfter }) => (
                    <p className="text-sm text-muted-foreground text-center">
                      Resend code in {resendableAfter} seconds
                    </p>
                  )}
                >
                  Didn&apos;t receive code? Resend
                </SignUp.Action>
              </form>
            </SignUp.Strategy>

            <SignUp.Action navigate="start" asChild>
              <button
                type="button"
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to sign up
              </button>
            </SignUp.Action>
          </SignUp.Step>

          <SignUp.Step name="continue" className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-normal font-[family-name:var(--font-instrument-serif)]">
                Complete your profile
              </h1>
              <p className="text-sm text-muted-foreground">
                Add additional information to complete your account
              </p>
            </div>

            <form className="space-y-4">
              <Clerk.Field name="username" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-foreground">
                  Username (optional)
                </Clerk.Label>
                <Clerk.Input
                  type="text"
                  className="flex items-center gap-3 px-4 py-2.5 shadow-lg border border-border rounded-md w-full bg-transparent outline-none text-sm font-mono"
                  placeholder="Choose a username"
                />
                <Clerk.FieldError className="text-xs text-destructive" />
              </Clerk.Field>

              <SignUp.Action submit asChild>
                <Button className="w-full font-mono">Continue</Button>
              </SignUp.Action>
            </form>
          </SignUp.Step>
        </SignUp.Root>

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

