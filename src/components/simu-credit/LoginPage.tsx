"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { AlertCircle, LineChart, LogIn } from "lucide-react";
import React, { useEffect, useState } from "react";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAppContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(username, password);
    if (!success) {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-skote-dark font-poppins">
      <Card className="w-full max-w-sm shadow-xl border-0 rounded-[0.75rem]">
        <CardHeader className="text-center pb-0">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-skote-primary mb-4 shadow-lg">
            <LineChart className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-skote-dark font-poppins">
            SimuCredit Pro
          </CardTitle>
          <CardDescription className="text-skote-secondary font-normal">
            Ingrese sus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-5 pt-2"
          >
            <div className="space-y-2 text-left">
              <Label
                htmlFor="username"
                className="font-semibold text-skote-dark"
              >
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 text-left">
              <Label
                htmlFor="password"
                className="font-semibold text-skote-dark"
              >
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-skote-danger font-semibold">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full text-base font-semibold h-11 mt-2"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-skote-secondary text-center w-full font-normal">
            &copy; {isClient ? new Date().getFullYear() : ""} SimuCredit Pro.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
