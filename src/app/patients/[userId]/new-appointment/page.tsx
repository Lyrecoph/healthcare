// Cette page gère le flux de création d’un nouveau rendez-vous pour un patient spécifique.
// Elle récupère les données du patient côté serveur, configure Sentry pour le suivi,
// puis affiche le formulaire de création de rendez-vous.

import Image from "next/image";  
import * as Sentry from '@sentry/nextjs'; 

import AppointmentForm from "@/app/components/forms/AppointmentForm"; // Formulaire de rendez-vous réutilisable
import { getPatient } from '@/lib/actions/patient.actions';     // Action serveur pour récupérer les données patient

// Force le rendu dynamique côté serveur (SSR) à chaque requête
export const dynamic = 'force-dynamic';

/**
 * Composant de page pour la création d’un nouveau rendez-vous.
 * @param props.params.userId - Identifiant de l’utilisateur/patient extrait de l’URL.
 */
const NewAppointment = async (props: SearchParamProps) => {
  // Récupération du userId depuis les paramètres dynamiques de la page
  const { userId } = props.params as { userId: string };

  // Appel serveur pour obtenir les informations du patient
  const patient = await getPatient(userId);

  // Configuration de Sentry pour cette session :
  Sentry.setTag("page", "new-appointment");
  Sentry.setUser({ id: userId, username: patient?.name });
  // Log d’information indiquant que la page a été consultée
  Sentry.captureMessage(
    `Page de nouveau rendez-vous consultée par l'utilisateur ${userId}`,
    'info'
  );
    
  return (
    <div className="flex h-screen max-h-screen">
      {/* Conteneur principal centré verticalement */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          {/* Logo en haut du formulaire */}
          <Image 
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo Carepulse"
            className="mb-12 h-10 w-fit"
          />

          {/* Formulaire de création de rendez-vous */}
          <AppointmentForm 
            type="create"                   // Mode création
            userId={userId}                  // Identifiant de l’utilisateur loggé
            patientId={patient.$id}          // Identifiant du document patient
          />

          {/* Copyright en bas du formulaire */}
          <p className="justify-items-end text-dark-600 xl:text-left">
            © 2024 Carepulse
          </p>
        </div>
      </section>

      {/* Image latérale pour le branding (responsive) */}
      <Image
        src="/assets/images/appointment-img1.jpg"
        height={1000}
        width={1000}
        alt="illustration rendez-vous"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}

export default NewAppointment;
