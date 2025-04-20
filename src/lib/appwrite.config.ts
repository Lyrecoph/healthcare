
import * as sdk from 'node-appwrite';

// Extraction des variables d'environnement nécessaires pour configurer Appwrite.
// Ces variables sont utilisées pour initialiser le client et accéder aux ressources comme les bases de données, collections et bucket de fichiers.
export const {
    NEXT_PUBLIC_ENDPOINT: ENDPOINT,              // URL de l'instance Appwrite (public pour le frontend)
    PROJECT_ID,                                  // ID du projet Appwrite
    API_KEY,                                     // Clé API secrète avec les autorisations nécessaires
    DATABASE_ID,                                 // ID de la base de données utilisée
    PATIENT_COLLECTION_ID,                       // ID de la collection Appwrite pour les patients
    DOCTOR_COLLECTION_ID,                        // ID de la collection Appwrite pour les docteurs
    APPOINTMENT_COLLECTION_ID,                   // ID de la collection Appwrite pour les rendez-vous
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,            // ID du bucket de stockage pour les fichiers (public pour le frontend)
} = process.env;

// Création d'une instance du client Appwrite
const client = new sdk.Client();

// Configuration du client avec les informations du projet :
// - le endpoint (URL de l'API Appwrite)
// - l'ID du projet
// - la clé API (authentification)
client
  .setEndpoint(ENDPOINT!)     // Le "!" indique au compilateur TypeScript que la valeur n'est pas nulle
  .setProject(PROJECT_ID!)
  .setKey(API_KEY!);

// Création d'une instance pour interagir avec les bases de données Appwrite
export const databases = new sdk.Databases(client);

// Création d'une instance pour gérer les utilisateurs (Appwrite Users API)
export const users = new sdk.Users(client);

// Création d'une instance pour gérer le stockage (upload, téléchargement, etc.)
export const storage = new sdk.Storage(client);

// Création d'une instance pour la messagerie (notifications, emails, SMS, etc.)
export const messaging = new sdk.Messaging(client);
