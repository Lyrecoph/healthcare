import * as Sentry from '@sentry/nextjs';

/**
 * Fonction d'initialisation de Sentry en fonction du runtime utilisé par Next.js.
 * 
 * - Si le code s'exécute dans un environnement Node.js (server-side),
 *   on importe dynamiquement la configuration Sentry côté serveur.
 * - Si le code s'exécute dans un environnement Edge (middleware ou fonctions Edge),
 *   on importe dynamiquement la configuration adaptée à l'Edge runtime.
 * 
 * Cette approche permet de charger uniquement la configuration pertinente
 * selon le contexte d'exécution pour éviter tout conflit ou chargement inutile.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Configuration spécifique au runtime Node.js
    await import('../sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Configuration spécifique au runtime Edge
    await import('../sentry.edge.config');
  }
}

/**
 * Raccourci pour capturer automatiquement les erreurs de requêtes HTTP
 * à l’aide de la méthode dédiée de Sentry.
 * 
 * Cela permet de tracer les erreurs (ex : erreurs API, exceptions côté serveur, etc.)
 * et de les afficher sur le tableau de bord Sentry pour le monitoring en production.
 */
export const onRequestError = Sentry.captureRequestError;
