import { Models } from "node-appwrite";

/**
 * Représente un patient dans le système, étendant le type `Document` d'Appwrite.
 * Contient toutes les informations médicales et personnelles nécessaires
 * pour un suivi dans une application de gestion de santé.
 */
export interface Patient extends Models.Document {
  userId: string; // ID unique de l'utilisateur lié (souvent un identifiant Appwrite/Auth)
  name: string; // Nom complet du patient
  email: string; // Adresse email du patient
  phone: string; // Numéro de téléphone
  birthDate: Date; // Date de naissance
  gender: Gender; // Genre (masculin, féminin, autre)
  address: string; // Adresse complète
  occupation: string; // Profession
  emergencyContactName: string; // Nom du contact d'urgence
  emergencyContactNumber: string; // Numéro du contact d'urgence
  primaryPhysician: string; // Nom du médecin traitant principal
  insuranceProvider: string; // Compagnie d'assurance santé
  insurancePolicyNumber: string; // Numéro de la police d’assurance
  allergies: string | undefined; // Allergies connues, s'il y en a
  currentMedication: string | undefined; // Médicaments en cours, s'il y en a
  familyMedicalHistory: string | undefined; // Antécédents médicaux familiaux
  pastMedicalHistory: string | undefined; // Antécédents médicaux personnels
  identificationType: string | undefined; // Type de pièce d’identité (CNI, passeport…)
  identificationNumber: string | undefined; // Numéro de la pièce d’identité
  identificationDocument: FormData | undefined; // Fichier de la pièce d’identité (uploadé)
  privacyConsent: boolean; // Consentement aux politiques de confidentialité
}

/**
 * Statuts possibles d’un rendez-vous médical.
 * - `scheduled` : Rendez-vous planifié
 * - `pending` : En attente de confirmation ou d'approbation
 * - `canceled` : Rendez-vous annulé
 */
export type Status = "scheduled" | "pending" | "canceled";

/**
 * Représente un rendez-vous médical dans le système.
 * Contient les informations relatives au rendez-vous d’un patient.
 */
export interface Appointment extends Models.Document {
  patient: Patient; // Patient concerné par le rendez-vous
  schedule: Date; // Date et heure du rendez-vous
  status: Status; // Statut actuel du rendez-vous
  primaryPhysician: string; // Médecin en charge du rendez-vous
  reason: string; // Raison de la consultation ou motif du rendez-vous
  note: string; // Note complémentaire ajoutée par le praticien ou l’assistant
  userId: string; // ID de l'utilisateur qui a créé ou gère le rendez-vous
  cancellationReason: string | null; // Motif d’annulation si le rendez-vous est annulé
}
