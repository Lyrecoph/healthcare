// Ce composant fournit un wrapper pour gérer les thèmes sombres/clairs dans l'application Next.js.

"use client"; 

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes"; // Provider de gestion de thèmes (light/dark)

/**
 * ThemeProvider
 * Ce composant enveloppe l'application pour fournir le contexte de thème.
 * Il passe tous les props reçus au provider de "next-themes".
 *
 * @param children - Éléments enfants à rendre à l'intérieur du contexte de thème
 * @param props - Propriétés optionnelles supportées par NextThemesProvider
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    // Le provider s'occupe de détecter et appliquer le thème (light/dark)
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}
