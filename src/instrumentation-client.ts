// -----------------------------------------------------------
//  Ce fichier initialise Sentry pour le client (navigateur).
// Toute configuration définie ici sera utilisée lors du chargement
// d'une page dans le navigateur par un utilisateur.
//
//  Documentation officielle : https://docs.sentry.io/platforms/javascript/guides/nextjs/
// -----------------------------------------------------------

import * as Sentry from "@sentry/nextjs";

// Initialisation de Sentry avec la configuration de base
Sentry.init({
  //  DSN (Data Source Name) : identifiant unique du projet Sentry
  dsn: "https://485579fe9fdccdf926c0f530085515ad@o4509057225719808.ingest.de.sentry.io/4509057234632784",

  //  Intégrations optionnelles (ex: pour capturer les replays utilisateurs)
  integrations: [
    Sentry.replayIntegration(), // Permet de rejouer les sessions utilisateur (Replay)
  ],

  //  tracesSampleRate : définit le taux d'échantillonnage des performances (tracing).
  // 1 = 100% des requêtes seront tracées. À ajuster en production pour éviter un surcoût.
  tracesSampleRate: 1,

  // 📹 replaysSessionSampleRate : pourcentage des sessions utilisateur capturées pour Replay (ex: clics, navigation, etc.).
  // Ici, on capture 10% des sessions.
  replaysSessionSampleRate: 0.1,

  //  replaysOnErrorSampleRate : taux de capture des sessions en cas d'erreur.
  // Ici, on capture 100% des sessions si une erreur se produit (utile pour diagnostiquer les bugs).
  replaysOnErrorSampleRate: 1.0,

  //  debug : affiche des logs de debug dans la console pour aider au développement.
  // Utile lors de l'intégration de Sentry mais à désactiver en production.
  debug: false,
});
