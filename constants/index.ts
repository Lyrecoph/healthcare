// Liste des genres possibles utilisés dans le formulaire du patient.
// Cela permet de limiter les choix à des valeurs contrôlées et cohérentes.
export const GenderOptions = ['masculin', 'feminin', 'autre'];

// Valeurs par défaut pour initialiser le formulaire de création ou d'édition de patient.
// Cela permet d'éviter des erreurs de formulaire non contrôlé et de centraliser les valeurs initiales.
export const PatientFormDefaultValues = {
  firstName: "", // Prénom du patient
  lastName: "", // Nom de famille du patient
  email: "", // Adresse email du patient
  phone: "", // Numéro de téléphone du patient
  birthDate: new Date(Date.now()), // Date de naissance (valeur par défaut = date actuelle)
  gender: "masculin" as Gender, // Genre sélectionné par défaut
  address: "", // Adresse du patient
  occupation: "", // Profession du patient
  emergencyContactName: "", // Nom de la personne à contacter en cas d'urgence
  emergencyContactNumber: "", // Numéro de la personne à contacter en cas d'urgence
  primaryPhysician: "", // Médecin traitant du patient
  insuranceProvider: "", // Compagnie d'assurance du patient
  insurancePolicyNumber: "", // Numéro de la police d'assurance
  allergies: "", // Allergies connues
  currentMedication: "", // Médicaments actuellement pris
  familyMedicalHistory: "", // Antécédents médicaux familiaux
  pastMedicalHistory: "", // Antécédents médicaux personnels
  identificationType: "Acte de naissance", // Type de pièce d'identité fournie
  identificationNumber: "", // Numéro de la pièce d'identité
  identificationDocument: [], // Fichiers uploadés correspondant à la pièce d'identité
  treatmentConsent: false, // Consentement pour les soins
  disclosureConsent: false, // Consentement pour le partage des informations médicales
  privacyConsent: false, // Consentement pour la politique de confidentialité
};

// Liste des types de pièces d'identité acceptées.
// Permet d'afficher dynamiquement les options dans le formulaire.
export const IdentificationTypes = [
  "Acte de naissance",
  "Le permis de conduire",
  "Carte/police d'assurance médicale",
  "Carte d'identité militaire",
  "Carte Nationale d'Identité",
  "Passeport",
  "Carte de résident étranger (carte verte)",
  "Carte de sécurité sociale",
  "Carte d'identité d'État",
  "Carte d'étudiant",
  "Carte d'électeur",
];

// Liste des médecins disponibles dans l'établissement, avec leur image et leur nom.
// Ces données peuvent être affichées dans une liste déroulante ou une vue de profil.
export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

// Association des statuts de rendez-vous avec leur icône respective.
// Utilisé dans les interfaces pour afficher un statut avec un visuel parlant.
export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",   // Rendez-vous programmé
  pending: "/assets/icons/pending.svg",   // Rendez-vous en attente
  canceled: "/assets/icons/cancelled.svg", // Rendez-vous annulé
};
