"use client";

import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface FieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function EmailField({ value, onChange, error }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Email address
      </label>
      <Input
        type="email"
        placeholder="Enter your email"
        className="font-mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function EmailFieldSignUp({ value, onChange, error }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Email address
      </label>
      <Input
        type="email"
        placeholder="Enter your email"
        className="font-mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function PasswordField({ value, onChange, error }: FieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Password</label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="font-mono pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
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
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function PasswordFieldWithValidation({ value, onChange, error }: FieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Password</label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          className="font-mono pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
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
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Password must be at least 8 characters
      </p>
    </div>
  );
}

export function CodeField({ value, onChange, error }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Verification code
      </label>
      <Input
        placeholder="Enter code"
        className="font-mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function NameField({ value, onChange, error }: NameFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Name (optional)
      </label>
      <Input
        type="text"
        placeholder="Enter your name"
        className="font-mono"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
