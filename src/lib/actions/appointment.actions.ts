'use server'

import { ID, Query } from "node-appwrite"
import { APPOINTMENT_COLLECTION_ID, databases, DATABASE_ID, messaging } from "../appwrite.config"
import { parseStringify } from "../../../lib/utils"
import { Appointment } from "../../../types/appwrite.types"
import { revalidatePath } from "next/cache"
import { formatDateTime } from "../utils"

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
          )
    
          return parseStringify(newAppointment)
        } catch (error) {
          console.log(error)
        }
}

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    )

    return parseStringify(appointment);
  } catch (error) {
    console.log(error)
  }
}

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );

    if (!appointments) throw new Error("No data received from Appwrite");

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
      if(appointment.status === 'scheduled') acc.scheduledCount += 1;
      else if (appointment.status === 'pending') acc.pendingCount += 1;
      else if (appointment.status === 'canceled') acc.cancelledCount += 1;
      return acc;
    }, initialCounts);

    return parseStringify({
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    });

  } catch (error) {
    console.error("Error fetching appointments:", error);
    return null; // Retourner null pour éviter l'erreur `undefined`
  }
};


export const updateAppointment = async ({ 
  appointmentId, 
  userId, 
  appointment,
  type
}:UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    )

    if(!updatedAppointment){
      throw new Error('Rendez-vous non trouvé');
    }

    const smsMessage = `Bonjour, c'est CarePulse. 
      ${type === 'programmer' 
        ? `Votre rendez-vous a été programmé pour ${formatDateTime(appointment.schedule!).dateTime} avec le médecin ${appointment.primaryPhysician}`
        : `Nous avons le regret de vous informer que votre rendez-vous a été annulé 
           pour la raison suivante: ${appointment.cancellationReason}
          `
      }
    `
    await sendSMSNotification(userId, smsMessage);
    // Récupère d'abord le patient pour avoir son phone
    // const patient = await getPatient(userId);
    // await sendSMSNotification(patient.phone, smsMessage);
    revalidatePath('/admin');
    return parseStringify(updatedAppointment)
  } catch (error) {
    console.log(error)
  }
}


export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],         
      [userId],  // ici ton numéro de l'utilisateur
    );
    return parseStringify(message);
  } catch (error) {
    console.error("Erreur SMS:", error);
  }
}
