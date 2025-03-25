import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Le nom doit comporter au moins 2 caractères")
    .max(50, "Le nom doit comporter au maximum 50 caractères"),
  email: z.string().email("Adresse e-mail invalide"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Numéro de téléphone invalide"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Le nom doit comporter au moins 2 caractères")
    .max(50, "Le nom doit comporter au maximum 50 caractères"),
  email: z.string().email("Adresse e-mail invalide"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Numéro de téléphone invalide"),
  birthDate: z.coerce.date(),
  gender: z.enum(["masculin", "femimin", "autre"]),
  address: z
    .string()
    .min(5, "L'adresse doit comporter au moins 5 caractères")
    .max(500, "L'adresse doit comporter au maximum 500 caractèress"),
  occupation: z
    .string()
    .min(2, "La profession doit comporter au moins 2 caractères")
    .max(500, "La profession doit comporter au maximum 500 caractères"),
  emergencyContactName: z
    .string()
    .min(2, "Le nom du contact doit comporter au moins 2 caractères")
    .max(50, "Le nom du contact doit comporter au maximum 50 caractères"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Numéro de téléphone invalide"
    ),
  primaryPhysician: z.string().min(2, "Sélectionnez au moins un médecin"),
  insuranceProvider: z
    .string()
    .min(2, "Le nom de l'assurance doit comporter au moins 2 caractères")
    .max(50, "Le nom de l'assurance doit comporter au maximum 50 caractères"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Le numéro de police doit comporter au moins 2 caractères")
    .max(50, "Le numéro de police doit comporter au maximum 50 caractères"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  identificationDocument: z.custom<File[]>().optional(),
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

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Sélectionnez au moins un médecin"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

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