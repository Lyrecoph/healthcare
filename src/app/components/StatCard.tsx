
import clsx from 'clsx'; // Permet de gérer dynamiquement les classes CSS selon les conditions
import Image from 'next/image'; 

// Définition du type des props acceptées par le composant StatCard
type StatCardProps = {
  type: "scheduled" | "pending" | "canceled"; // Type de statistique (pour style et contexte)
  count: number;    // Nombre associé à la statistique
  label: string;    // Texte descriptif (ex. : "Rendez-vous planifiés")
  icon: string;     // URL ou chemin de l'icône à afficher
};

// Définition du composant StatCard
export const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  return (
    // Conteneur principal avec une couleur de fond dynamique selon le type de statistique
    <div 
      className={clsx('stat-card', {
        'bg-appointments': type === 'scheduled', // Fond spécifique pour les rendez-vous programmés
        'bg-pending': type === 'pending',        // Fond pour les rendez-vous en attente
        'bg-cancelled': type === 'canceled',     // Fond pour les rendez-vous annulés
      })}
    >
      {/* Ligne contenant l’icône et le nombre */}
      <div className='flex items-center gap-4'>
        {/* Icône visuelle représentant la statistique */}
        <Image 
          src={icon}            // URL ou chemin de l'image
          height={32}           // Hauteur fixe
          width={32}            // Largeur fixe
          alt={label}           // Texte alternatif pour l'accessibilité
          className='size-8 w-fit' // Style personnalisé
        />
        {/* Nombre mis en avant avec une grande taille et en blanc */}
        <h2 className='text-32-bold text-white'>{count}</h2>
      </div>

      {/* Texte descriptif de la statistique */}
      <p className='text-14-regular'>{label}</p>
    </div>
  );
};
