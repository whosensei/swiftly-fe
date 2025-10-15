"use client";

import * as Clerk from "@clerk/elements/common";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function EmailField() {
  return (
    <Clerk.Field name="identifier" className="space-y-2">
      <Clerk.Label className="text-sm font-medium text-foreground">
        Email address
      </Clerk.Label>
      <Clerk.Input type="email" asChild>
        <Input placeholder="Enter your email" className="font-mono" />
      </Clerk.Input>
      <Clerk.FieldError className="text-xs text-destructive" />
    </Clerk.Field>
  );
}

export function EmailFieldSignUp() {
  return (
    <Clerk.Field name="emailAddress" className="space-y-2">
      <Clerk.Label className="text-sm font-medium text-foreground">
        Email address
      </Clerk.Label>
      <Clerk.Input type="email" asChild>
        <Input placeholder="Enter your email" className="font-mono" />
      </Clerk.Input>
      <Clerk.FieldError className="text-xs text-destructive" />
    </Clerk.Field>
  );
}

export function PasswordField() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Clerk.Field name="password" className="space-y-2">
      <Clerk.Label className="text-sm font-medium text-foreground">
        Password
      </Clerk.Label>
      <div className="relative">
        <Clerk.Input type={showPassword ? "text" : "password"} asChild>
          <Input placeholder="Enter your password" className="font-mono pr-10" />
        </Clerk.Input>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      <Clerk.FieldError className="text-xs text-destructive" />
    </Clerk.Field>
  );
}

export function PasswordFieldWithValidation() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Clerk.Field name="password" className="space-y-2">
      <Clerk.Label className="text-sm font-medium text-foreground">
        Password
      </Clerk.Label>
      <div className="relative">
        <Clerk.Input type={showPassword ? "text" : "password"} asChild>
          <Input placeholder="Create a password" className="font-mono pr-10" />
        </Clerk.Input>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      <Clerk.FieldError className="text-xs text-destructive" />
      <p className="text-xs text-muted-foreground">
        Password must be at least 8 characters
      </p>
    </Clerk.Field>
  );
}

export function CodeField() {
  return (
    <Clerk.Field name="code" className="space-y-2">
      <Clerk.Label className="text-sm font-medium text-foreground">
        Verification code
      </Clerk.Label>
      <Clerk.Input asChild>
        <Input placeholder="Enter code" className="font-mono" />
      </Clerk.Input>
      <Clerk.FieldError className="text-xs text-destructive" />
    </Clerk.Field>
  );
}

