/**
 * Ce fichier regroupe des fonctions utilitaires réutilisables dans l'application,
 * notamment pour la gestion des classes CSS, le formatage de données, et le chiffrement simple.
 */

// Importation des outils de composition de classes CSS
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine et fusionne dynamiquement plusieurs classes CSS Tailwind.
 *
 * - clsx permet de conditionner ou concaténer des classes.
 * - twMerge supprime les classes conflictuelles ou dupliquées selon les règles Tailwind.
 *
 * @param inputs - Liste de valeurs de classes (chaînes, objets conditionnels, tableaux...).
 * @returns Chaîne de classes finale optimisée.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Clone un objet JavaScript en profondeur via sérialisation JSON.
 * Utile pour nettoyer les objets (supprime les références, fonctions, propriétés non sérialisables).
 *
 * @param value - Objet ou valeur à cloner.
 * @returns Nouvelle instance clonée via JSON.parse(JSON.stringify(value)).
 */
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

/**
 * Génère une URL utilisable dans le navigateur pour prévisualiser un fichier local.
 *
 * @param file - Fichier File issu d'un input ou d'un drag-and-drop.
 * @returns URL temporaire pointant vers le contenu du fichier.
 */
export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

// -----------------------------------------------------------------------------
// FORMAT DATE TIME
// -----------------------------------------------------------------------------

/**
 * Formate une date (ou chaîne de date) en plusieurs affichages (date + heure, jour, date seule, heure seule).
 * Utilise Intl.DateTimeFormat pour respecter le fuseau horaire fourni.
 *
 * @param dateString - Objet Date ou chaîne à convertir.
 * @param timeZone - Fuseau horaire (par défaut, celui du navigateur).
 * @returns Objet contenant :
 *   - dateTime : date et heure (ex: "Mar 25, 2023, 08:30 AM")
 *   - dateDay  : jour et date (ex: "Mon, 03/25/2023")
 *   - dateOnly : date seule (ex: "Mar 25, 2023")
 *   - timeOnly : heure seule (ex: "08:30 AM")
 */
export const formatDateTime = (
  dateString: Date | string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  // Options de format pour date + heure
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone,
  };

  // Options de format pour jour + date
  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  };

  // Options de format pour date seule
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
    timeZone,
  };

  // Options de format pour heure seule
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone,
  };

  // Génération des chaînes formatées
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );
  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

/**
 * Encode une chaîne (passkey) en base64.
 * Note : base64 n'est pas un chiffrement sécurisé, juste un encodage.
 *
 * @param passkey - Chaîne à encoder.
 * @returns Chaîne encodée en base64.
 */
export function encryptKey(passkey: string) {
  return btoa(passkey);
}

/**
 * Décode une chaîne base64 vers son texte original.
 *
 * @param passkey - Chaîne encodée en base64.
 * @returns Chaîne décodée.
 */
export function decryptKey(passkey: string) {
  return atob(passkey);
}
