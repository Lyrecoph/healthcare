// Ce fichier contient des fonctions "server-action" pour gérer les utilisateurs et patients
// via le SDK Node Appwrite, ainsi que la capture d'erreurs avec Sentry.

"use server"; 

import * as Sentry from "@sentry/nextjs";    // SDK Sentry pour la capture d'exceptions
import { ID, Query } from "node-appwrite";     // Utilitaires Appwrite pour IDs uniques et queries
import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PROJECT_ID,
  PATIENT_COLLECTION_ID,
  databases,
  storage,
  users
} from "../appwrite.config";               // Configuration et instances Appwrite

import { InputFile } from "node-appwrite/file"; // Pour créer un InputFile à partir d'un buffer
import { parseStringify } from "../utils";      // Fonction utilitaire pour cloner un objet

/**
 * Crée un nouvel utilisateur Appwrite ou récupère l'existant si email déjà présent.
 * @param user - Objet contenant name, email et phone.
 * @returns Les données de l'utilisateur (nouveau ou existant).
 */
export const createUser = async (user: CreateUserParams) => {
  try {
    // Appelle l'API Appwrite pour créer un utilisateur unique
    const newUser = await users.create(
      ID.unique(),      // Génère un ID unique pour l'utilisateur
      user.email,       // Email (obligatoire)
      user.phone,       // Téléphone (obligatoire)
      undefined,        // Mot de passe non fourni (peut être géré séparément)
      user.name         // Nom complet (optionnel)
    );

    // Renvoie une copie JSON-serializable de l'objet utilisateur
    return parseStringify(newUser);
  } catch (error: any) {
    // Gestion du cas d'erreur 409 : conflit (utilisateur déjà existant)
    if (error?.code === 409) {
      // Recherche l'utilisateur existant par email
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);
      return existingUser.users[0]; // Retourne le premier utilisateur trouvé
    }

    // Enregistre l'exception dans Sentry pour investigation
    Sentry.captureException(error, {
      tags: { section: "createUser" },
      extra: { user }
    });

    // Relance une erreur générique pour le frontend
    throw new Error("Échec de création d'utilisateur");
  }
};

/**
 * Récupère un utilisateur Appwrite par son ID.
 * @param userId - Identifiant Appwrite de l'utilisateur.
 * @returns Les données de l'utilisateur ou undefined en cas d'erreur.
 */
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId); // Appel API Appwrite
    return parseStringify(user);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération de l'utilisateur :",
      error
    );
    // On peut décider de retourner null/undefined selon le besoin
  }
};

/**
 * Enregistre un nouveau patient dans la base Appwrite, avec upload de document si fourni.
 * @param param0 - Objet RegisterUserParams destructuré (données patient + fichier).
 * @returns Le document patient créé.
 */
export const registerPatient = async (
  { identificationDocument, ...patient }: RegisterUserParams
) => {
  try {
    let file;
    // Si un FormData de document est fourni, on crée un InputFile pour Appwrite
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument.get('blobFile') as Blob,
        identificationDocument.get('fileName') as string
      );
      // Upload du fichier dans le bucket Appwrite
      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Création du document patient en base de données Appwrite
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
          : null,
        ...patient // Ajoute toutes les autres propriétés du patient
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la création d'un patient :",
      error
    );
  }
};

/**
 * Récupère le premier patient associé à un userId donné.
 * @param userId - Identifiant Appwrite de l'utilisateur.
 * @returns Le document patient ou undefined en cas d'erreur.
 */
export const getPatient = async (userId: string) => {
  try {
    // Liste les documents patients où userId correspond
    const result = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );
    return parseStringify(result.documents[0]);
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération du patient :",
      error
    );
  }
};
