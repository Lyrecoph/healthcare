
/**
 * Représente les propriétés passées automatiquement par Next.js à une page dynamique via l’URL.
 * - `params` contient les paramètres dynamiques extraits de l'URL (ex. : userId).
 * - `searchParams` contient les paramètres de la requête (query string).
 */
declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * Enumération des genres possibles pour un utilisateur.
 */
declare type Gender = "masculin" | "feminin" | "autre";

/**
 * Statuts possibles d’un rendez-vous.
 */
declare type Status = "scheduled" | "pending" | "canceled";

/**
 * Données de base nécessaires à la création d’un utilisateur.
 */
declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}

/**
 * Interface représentant un utilisateur complet dans le système,
 * incluant son identifiant unique généré.
 */
declare interface User extends CreateUserParams {
  $id: string; // Identifiant unique de l'utilisateur (ex: Appwrite/MongoDB)
}

/**
 * Paramètres requis pour l’enregistrement complet d’un utilisateur patient.
 * Utilisé lors du remplissage du formulaire de registre patient.
 */
declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined; // Pièce d'identité envoyée en fichier
  privacyConsent: boolean; // Consentement aux conditions de confidentialité
}

/**
 * Données nécessaires à la création d’un rendez-vous médical.
 */
declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  primaryPhysician: string;
  reason: string;
  schedule: Date; // Date et heure prévue du rendez-vous
  status: Status;
  note: string | undefined; // Remarques additionnelles facultatives
};

/**
 * Données utilisées lors de la mise à jour d’un rendez-vous existant.
 */
declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  timeZone: string; // Fuseau horaire du patient ou du médecin
  appointment: Appointment; // Objet complet du rendez-vous à mettre à jour
  type: string; // Type de modification ou d'action (ex. : "reschedule", "cancel")
};
