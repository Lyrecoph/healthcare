import clsx from 'clsx'; // Permet de conditionner dynamiquement les classes CSS
import React from 'react';
import Image from 'next/image'; 
import { StatusIcon } from '../../../constants'; // Objet contenant les icônes associées à chaque statut

// Composant visuel affichant un badge de statut avec une icône et du texte
export const StatusBadge = ({ status }: { status: Status }) => {
  return (
    // Conteneur principal du badge avec une couleur de fond conditionnelle selon le statut
    <div
      className={clsx('status-badge', {
        'bg-green-600': status === 'scheduled', // Fond vert pour les rendez-vous programmés
        'bg-blue-600': status === 'pending',    // Fond bleu pour les rendez-vous en attente
        'bg-reed-600': status === 'canceled'    // Fond rouge pour les rendez-vous annulés (NB : "reed" semble être une faute de frappe pour "red")
      })}
    >
      {/* Icône correspondant au statut, récupérée dynamiquement depuis l’objet StatusIcon */}
      <Image 
        src={StatusIcon[status]} // Ex: StatusIcon['pending']
        alt={status}             // Texte alternatif pour l'accessibilité
        width={24}
        height={24}
        className='h-fit w-3'    // Taille personnalisée de l’icône
      />

      {/* Libellé textuel du statut avec une couleur de texte conditionnelle */}
      <p
        className={clsx('text-12-semibold capitalize', {
          'text-green-500': status === 'scheduled',
          'text-blue-500': status === 'pending',
          'text-reed-500': status === 'canceled'
        })}
      >
        {status} {/* Affiche le texte du statut ("scheduled", "pending", "canceled") */}
      </p>
    </div>
  );
};
