// Cette page dynamique gère l'inscription des patients existants via leur userId.
// et capture un événement Sentry lors de l'affichage.

import Image from 'next/image';
import { getUser } from '@/lib/actions/patient.actions'; // Action serveur pour récupérer un utilisateur par ID
import RegisterForm from '@/app/components/forms/RegisterForm'; // Formulaire d'enregistrement du patient
import * as Sentry from '@sentry/nextjs'; // SDK Sentry pour la journalisation

// Force Next.js à rendre cette page côté serveur à chaque requête
export const dynamic = 'force-dynamic';

/**
 * Page d'inscription pour un patient identifié par userId.
 * @param params - Contient userId extrait de l'URL dynamique
 */
export default async function Register({ params }: SearchParamProps) {
  const { userId } = params; // Extraction de l'ID utilisateur depuis les paramètres d'URL

  let user = null;
  try {
    // Appel serveur pour récupérer les données utilisateur
    user = await getUser(userId);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
  }

  // Si l'utilisateur existe, on capture un événement info dans Sentry
  if (user) {
    Sentry.captureMessage(`Register page viewed for user: ${user.name}`, 'info');
  }

  return (
    <div className="flex h-screen max-h-screen">
      {/* Section centrale contenant le logo et le formulaire */}
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          {/* Logo de l'application */}
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          {/* Affiche le formulaire si l'utilisateur est trouvé, sinon un message d'erreur */}
          {user ? (
            <RegisterForm user={user} />
          ) : (
            <p className="text-red-500">Utilisateur introuvable</p>
          )}

          {/* Copyright */}
          <p className="copyright py-12">© 2024 Carepulse</p>
        </div>
      </section>

      {/* Image latérale pour l'aspect visuel/branding */}
      <Image
        src="/assets/images/register1-logo.jpg"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[550px]"
      />
    </div>
  );
}
