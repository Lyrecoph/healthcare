export const GenderOptions = ['masculin', 'feminin', 'autre'];

export const PatientFormDefaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: new Date(Date.now()),
    gender: "masculin" as Gender,
    address: "",
    occupation: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    primaryPhysician: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    allergies: "",
    currentMedication: "",
    familyMedicalHistory: "",
    pastMedicalHistory: "",
    identificationType: "Acte de naissance",
    identificationNumber: "",
    identificationDocument: [],
    treatmentConsent: false,
    disclosureConsent: false,
    privacyConsent: false,
  };
  
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
  
  export const StatusIcon = {
    scheduled: "/assets/icons/check.svg",
    pending: "/assets/icons/pending.svg",
    canceled: "/assets/icons/cancelled.svg",
  };