import Image from "next/image";
import Link from "next/link";
import PatientForm from "@/app/components/forms/PatientForm";
import PasskeyModal from "@/app/components/PasskeyModal";

export default function Home({ searchParams }: SearchParamProps) {
 
  // Vérifie si le mode admin est activé via un paramètre dans l'URL
  const isAdmin = searchParams?.admin === 'true';

  return (
    <div className="flex h-screen max-h-screen">
      {/* Affiche la modal d'authentification uniquement si l'utilisateur est en mode admin */}
      {isAdmin && <PasskeyModal />}

      {/* Section principale contenant le formulaire */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] flex-1 flex-col py-10">

          {/* Logo Carepulse */}
          <Image 
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          {/* Formulaire de saisie d'information pour le patient */}
          <PatientForm />

          {/* Pied de page avec lien vers la version admin */}
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 Carepulse
            </p>

            {/* Lien pour activer le mode admin (ajoute ?admin=true dans l'URL) */}
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      
      {/* Image d'illustration à droite de l'écran (pour les grandes résolutions) */}
      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
