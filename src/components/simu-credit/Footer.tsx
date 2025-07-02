"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export function Footer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <footer className="bg-skote-dark text-white border-t border-skote-secondary/20 font-poppins py-2">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between min-h-[56px]">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="text-base font-bold tracking-tight">
            &copy; {isClient ? new Date().getFullYear() : ""} SimuCredit Pro
          </span>
          <span className="text-skote-secondary text-xs font-normal">
            Simulador de créditos y cálculo de amortización
          </span>
        </div>
        <div className="flex flex-row gap-4 items-center mt-2 sm:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-skote-primary font-semibold underline underline-offset-4 hover:text-white transition text-xs sm:text-sm">
                Términos y condiciones de uso
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Términos y Condiciones de Uso</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                El presente aplicativo web es una herramienta de simulación de
                crédito de carácter meramente informativo. El uso de este
                simulador no genera ningún tipo de obligación contractual para
                la empresa ni para los usuarios.
              </DialogDescription>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-skote-primary font-semibold underline underline-offset-4 hover:text-white transition text-xs sm:text-sm">
                Privacidad y Protección de Datos
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Privacidad y Protección de Datos</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Este sitio web no solicita, recolecta, almacena ni trata datos
                personales de los usuarios. No se guarda información alguna
                relacionada con las simulaciones realizadas, ni se almacena
                información de identificación personal, direcciones IP, nombres,
                correos electrónicos ni ningún otro dato que permita identificar
                a los usuarios.
                <br />
                <br />
                La empresa no asume responsabilidad por las decisiones que los
                usuarios puedan tomar con base en los resultados arrojados por
                el simulador, los cuales son únicamente referenciales.
                <br />
                <br />
                El uso de este sitio implica la aceptación de estos términos y
                condiciones.
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </footer>
  );
}
