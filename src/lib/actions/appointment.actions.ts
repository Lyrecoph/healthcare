// Ce fichier définit les actions serveur pour la gestion des rendez-vous
// via l’API Appwrite (CRUD) et intègre la revalidation de cache Next.js ainsi que l’envoi de SMS.

'use server'; 

import { revalidatePath } from 'next/cache';
import { ID, Query } from 'node-appwrite';
import {
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
  databases,
  messaging
} from "../appwrite.config"; // Configuration Appwrite et instances prêtes à l’emploi
import { Appointment } from "../../../types/appwrite.types"; // TypeScript type pour un rendez-vous
import { formatDateTime, parseStringify } from "../utils"; // Utilitaires génériques

/**
 * Crée un nouveau rendez-vous.
 * @param appointment - Données nécessaires à la création (CreateAppointmentParams).
 * @returns Document du rendez-vous créé (clone JSON) ou undefined si erreur.
 */
export const createAppointment = async (appointment: CreateAppointmentParams) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),        // Génère un identifiant unique pour le nouveau document
      appointment         // Payload avec les données du rendez-vous
    );

    // Invalide le cache de la route '/admin' pour forcer la mise à jour\ de l’affichage
    revalidatePath('/admin');

    return parseStringify(newAppointment);
  } catch (error) {
    console.error("Erreur création rendez-vous :", error);
  }
};

/**
 * Récupère un rendez-vous existant par son identifiant.
 * @param appointmentId - ID du document Appwrite.
 * @returns La donnée du rendez-vous (clone JSON) ou undefined si erreur.
 */
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId       // Identifiant du rendez-vous à récupérer
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error("Erreur récupération rendez-vous :", error);
  }
};

/**
 * Récupère la liste des rendez-vous, triée par date de création décroissante,
 * et calcule des statistiques (total, programmés, en attente, annulés).
 * @returns Objet avec totalCount, scheduledCount, pendingCount, cancelledCount et documents[].
 */
export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')] // Tri par date de création décroissante
    );

    if (!appointments) throw new Error("Aucune donnée reçue d'Appwrite");

    // Initialisation des compteurs
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    // Parcours des documents pour incrémenter les compteurs selon le statut
    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appt) => {
        switch (appt.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "canceled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    // Construction de l’objet de réponse avec statistiques et documents
    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error("Erreur récupération rendez-vous récents :", error);
  }
};

/**
 * Envoie une notification SMS à un utilisateur via Appwrite Messaging.
 * @param userId - ID de l’utilisateur destinataire.
 * @param content - Contenu du message SMS.
 * @returns Le message SMS créé (clone JSON) ou undefined si erreur.
 */
export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    // Appelle l’API Appwrite Messaging pour créer et envoyer un SMS
    const message = await messaging.createSms(
      ID.unique(),       // ID unique pour le message
      content,           // Contenu textuel du SMS
      [],                // Canaux (vide => par défaut)
      [userId]           // Liste des destinataires par ID
    );
    return parseStringify(message);
  } catch (error) {
    console.error("Erreur envoi SMS :", error);
  }
};

/**
 * Met à jour un rendez-vous existant, envoie une notification SMS selon l’action,
 * et revalide le chemin '/admin'.
 * @param params - Paramètres de mise à jour (UpdateAppointmentParams) incluant:
 *   appointmentId, userId, timeZone, appointment (payload), type ('programmer'|'annuler').
 * @returns Le rendez-vous mis à jour (clone JSON) ou undefined si erreur.
 */
export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    // Mise à jour du document Appwrite
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error('Rendez-vous non trouvé');
    }

    // Prépare le contenu du SMS en fonction du type d’action
    const smsMessage = type === 'programmer'
      ? `Votre rendez-vous est programmé pour ${formatDateTime(
          appointment.schedule!, timeZone
        ).dateTime} avec ${appointment.primaryPhysician}.`
      : `Votre rendez-vous prévu le ${formatDateTime(
          appointment.schedule!, timeZone
        ).dateTime} a été annulé pour la raison suivante : ${appointment.cancellationReason}.`;

    // Envoi du SMS de notification
    await sendSMSNotification(userId, smsMessage);

    // Réactualisation du cache pour la page admin
    revalidatePath('/admin');

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.error("Erreur mise à jour rendez-vous :", error);
  }
};
