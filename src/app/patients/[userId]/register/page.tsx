import { getUser } from '@/lib/actions/patient.actions';
import RegisterForm from '@/components/forms/RegisterForm';
import Image from 'next/image';
import * as Sentry from '@sentry/nextjs';

type Props = {
  params: { userId: string }
};

export default async function Register({ params }: Props) {
  const { userId } = params;

  let user = null;
  try {
    user = await getUser(userId);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
  }

  if (user) {
    Sentry.captureMessage(`Register page viewed for user: ${user.name}`, 'info');
  }

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image 
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          {user ? (
            <RegisterForm user={user} />
          ) : (
            <p className="text-red-500">Utilisateur introuvable</p>
          )}
          
          <p className="copyright py-12">© 2024 Carepulse</p>
        </div>
      </section>
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
