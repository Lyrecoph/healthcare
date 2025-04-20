/**
 * validation.ts
 *
 * Ce fichier définit les schémas de validation pour les formulaires de l'application
 * en utilisant la librairie Zod. Chaque schéma garantit que les données transmises
 * par l'utilisateur respectent les contraintes attendues (formats, longueurs, valeurs requises...).
 */
import { z } from "zod";

/**
 * Schéma de validation pour un formulaire utilisateur basique.
 * Utilisé pour valider le nom, l'email et le téléphone.
 */
export const UserFormValidation = z.object({
  /**
   * Le nom doit être une chaîne de 2 à 50 caractères.
   */
  name: z
    .string()
    .min(2, "Le nom doit comporter au moins 2 caractères")
    .max(50, "Le nom doit comporter au maximum 50 caractères"),

  /**
   * L'email doit être une adresse valide.
   */
  email: z.string().email("Adresse e-mail invalide"),

  /**
   * Le téléphone doit suivre le format international : + suivi de 10 à 15 chiffres.
   */
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Numéro de téléphone invalide"),
});

/**
 * Schéma de validation complet pour le formulaire d'un patient.
 * Inclut les informations personnelles, médicales et les consentements.
 */
export const PatientFormValidation = z.object({
  /** Nom du patient : 2 à 50 caractères */
  name: z
    .string()
    .min(2, "Le nom doit comporter au moins 2 caractères")
    .max(50, "Le nom doit comporter au maximum 50 caractères"),

  /** Email du patient : doit être valide */
  email: z.string().email("Adresse e-mail invalide"),

  /** Téléphone du patient : format international */
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Numéro de téléphone invalide"),

  /** Date de naissance : coercée en Date */
  birthDate: z.coerce.date(),

  /** Genre : masculin, feminin ou autre */
  gender: z.enum(["masculin", "feminin", "autre"]),

  /** Adresse : 5 à 500 caractères */
  address: z
    .string()
    .min(5, "L'adresse doit comporter au moins 5 caractères")
    .max(500, "L'adresse doit comporter au maximum 500 caractèress"),

  /** Profession : 2 à 500 caractères */
  occupation: z
    .string()
    .min(2, "La profession doit comporter au moins 2 caractères")
    .max(500, "La profession doit comporter au maximum 500 caractères"),

  /** Nom du contact d'urgence : 2 à 50 caractères */
  emergencyContactName: z
    .string()
    .min(2, "Le nom du contact doit comporter au moins 2 caractères")
    .max(50, "Le nom du contact doit comporter au maximum 50 caractères"),

  /** Téléphone du contact d'urgence : format international */
  emergencyContactNumber: z
    .string()
    .refine(
      (value) => /^\+\d{10,15}$/.test(value),
      "Numéro de téléphone invalide"
    ),

  /** Médecin traitant : au moins 2 caractères */
  primaryPhysician: z.string().min(2, "Sélectionnez au moins un médecin"),

  /** Compagnie d'assurance : 2 à 50 caractères */
  insuranceProvider: z
    .string()
    .min(2, "Le nom de l'assurance doit comporter au moins 2 caractères")
    .max(50, "Le nom de l'assurance doit comporter au maximum 50 caractères"),

  /** Numéro de police d'assurance : 2 à 50 caractères */
  insurancePolicyNumber: z
    .string()
    .min(2, "Le numéro de police doit comporter au moins 2 caractères")
    .max(50, "Le numéro de police doit comporter au maximum 50 caractères"),

  /** Champs médicaux optionnels */
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),

  /** Identification optionnelle */
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),

  /** Consentement : cases à cocher obligatoires */
  treatmentConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Vous devez consentir au traitement pour pouvoir continuer",
    }),
  disclosureConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Vous devez consentir à la divulgation afin de procéder",
    }),
  privacyConsent: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Vous devez consentir à la confidentialité pour continuer",
    }),
});

/**
 * Schéma de validation pour la création d'un rendez-vous (création initiale).
 */
export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Sélectionnez au moins un médecin"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "La raison doit comporter au moins 2 caractères")
    .max(500, "La raison doit comporter au maximum 500 caractères"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

/**
 * Schéma de validation pour la programmation (planification) d'un rendez-vous existant.
 * Les champs non modifiés restent optionnels.
 */
export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Sélectionnez au moins un médecin"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

/**
 * Schéma de validation pour l'annulation d'un rendez-vous.
 * Le motif d'annulation devient obligatoire.
 */
export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Sélectionnez au moins un médecin"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "La raison doit comporter au moins 2 caractères")
    .max(500, "La raison doit comporter au maximum 500 caractères"),
});

/**
 * Retourne le schéma de validation adapté au type d'action sur un rendez-vous.
 * @param type - 'create', 'cancel' ou autre (schedule)
 */
export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}
