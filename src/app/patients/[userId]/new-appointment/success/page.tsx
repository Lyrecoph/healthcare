// Page affichée après la soumission réussie d'une demande de rendez-vous.
// Affiche un message visuel de succès, détaille le rendez-vous et propose des actions secondaires.

import React from 'react';
import Image from 'next/image';                
import Link from 'next/link';                  

import * as Sentry from '@sentry/nextjs';      // SDK Sentry pour le tracking et la journalisation

import { getUser } from '@/lib/actions/patient.actions';            // Action serveur pour récupérer un utilisateur
import { getAppointment } from '@/lib/actions/appointment.actions'; // Action serveur pour récupérer un rendez-vous
import { formatDateTime } from '../../../../../lib/utils';         // Utilitaire de formatage de dates

import { Doctors } from '../../../../../../constants';            // Liste des médecins prédéfinis
import { Button } from '@/app/components/ui/button';               // Composant Button réutilisable

/**
 * Composant de page Success
 * @param params - Contient userId extrait de l'URL
 * @param searchParams - Contient appointmentId passé en query string
 */
const Success = async ({ params, searchParams }: SearchParamProps) => {
  // Récupération des identifiants
  const userId = params.userId as string;
  const appointmentId = (searchParams?.appointmentId as string) || '';

  // Initialisation du nom d'utilisateur pour le suivi
  let userName = 'inconnu';
  try {
    // Récupère l'utilisateur pour obtenir son nom
    const user = await getUser(userId);
    userName = user?.name ?? userName;
    // Trace l'affichage de la page dans Sentry (niveau info)
    Sentry.captureMessage(
      `Page de réussite du rendez-vous vue par ${userName}`,
      'info'
    );
  } catch (err) {
    // Capture de toute exception lors de la récupération de l'utilisateur
    Sentry.captureException(err);
  }

  // Si aucun appointmentId n'est fourni, on affiche un message d'erreur
  if (!appointmentId) {
    return (
      <p className="text-center text-red-500">
        Aucun rendez-vous trouvé.
      </p>
    );
  }

  // Récupération des détails du rendez-vous
  let appointment;
  try {
    appointment = await getAppointment(appointmentId);
  } catch (error) {
    console.error("Erreur récupération appointment:", error);
    return (
      <p className="text-center text-red-500">
        Erreur lors de la récupération.
      </p>
    );
  }

  // Si le rendez-vous n'existe pas, message approprié
  if (!appointment) {
    return (
      <p className="text-center text-red-500">
        Rendez-vous introuvable.
      </p>
    );
  }

  // Cherche les informations du médecin correspondant au nom stocké
  const doctor = Doctors.find(d => d.name === appointment.primaryPhysician);

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        {/* Logo cliquable pour revenir à l'accueil */}
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>

        {/* Section centrale avec animation de succès */}
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Votre <span className="text-green-500">demande de rendez-vous</span> a été soumise avec succès !
          </h2>
          <p>Nous vous contacterons sous peu pour confirmer.</p>
        </section>

        {/* Détails du rendez-vous si le médecin est trouvé */}
        {doctor ? (
          <section className="request-details">
            <p>Détails :</p>
            <div className="flex items-center gap-3">
              {/* Photo et nom du médecin */}
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={100}
                height={100}
                className="size-6"
              />
              <p className="whitespace-nowrap">
                Dr. {doctor.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Image
                src="/assets/icons/calendar.svg"
                height={24}
                width={24}
                alt="calendar"
              />
              {/* Affichage de la date et heure formatées */}
              <p>{formatDateTime(appointment.schedule).dateTime}</p>
            </div>
          </section>
        ) : (
          <p className="text-gray-500">Médecin non trouvé.</p>
        )}

        {/* Bouton pour planifier un nouveau rendez-vous */}
        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            Nouveau Rendez-vous
          </Link>
        </Button>

        {/* Copyright */}
        <p className="copyright">© 2024 Carepulse</p>
      </div>
    </div>
  );
};

export default Success;
