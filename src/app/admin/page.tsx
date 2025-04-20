// Importations nécessaires pour le bon fonctionnement du composant.
// - `Link` est utilisé pour la navigation entre les pages.
// - `React` est utilisé pour la création de composants React.
// - `Image` est un composant de Next.js permettant d'afficher des images de manière optimisée.
// - `StatCard` est un composant personnalisé pour afficher des cartes statistiques.
// - `getRecentAppointmentList` est une fonction permettant de récupérer les rendez-vous récents.
// - `DataTable` est un composant qui affiche un tableau de données.
// - `columns` contient la configuration des colonnes du tableau.

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { StatCard } from '@/app/components/StatCard';  // Composant pour afficher une carte statistique
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';  // Fonction pour récupérer les rendez-vous récents
import { DataTable } from '@/app/components/table/DataTable';  // Composant pour afficher un tableau de données
import { columns } from '@/app/components/table/columns';  // Colonnes du tableau de rendez-vous

// Le composant `Admin` est un composant async qui récupère la liste des rendez-vous récents,
// puis les affiche dans un tableau et sous forme de cartes statistiques.

const Admin = async () => {
  // Récupération des données des rendez-vous récents via une API ou action
  const appointments = await getRecentAppointmentList();

  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      {/* En-tête avec le logo et le titre du tableau de bord */}
      <header className='admin-header'>
        <Link href='/' className='cursor-pointer'>
          {/* Image du logo */}
          <Image 
            src='/assets/icons/logo-full.svg'
            height={32}
            width={162}
            alt="Logo"
            className='h-8 w-fit'
          />
        </Link>
        {/* Titre du tableau de bord */}
        <p className='text-16-semibold'>Tableau de bord d&apos;administration</p>
      </header>

      {/* Contenu principal du tableau de bord */}
      <main className='admin-main'>
        {/* Section d'introduction avec un message de bienvenue */}
        <section className='w-full space-y-4'>
          <h1 className='header'>Bienvenue 👋</h1>
          <p className='text-dark-700'>Commencez la journée en gérant de nouveaux rendez-vous</p>
        </section>

        {/* Section des statistiques avec des cartes affichant les rendez-vous */}
        <section className='admin-stat'>
          {/* Carte des rendez-vous programmés */}
          <StatCard 
            type='scheduled'
            count={appointments.scheduledCount}
            label='Rendez-vous programmés'
            icon='/assets/icons/appointments.svg'  // Icône associée aux rendez-vous programmés
          />
          {/* Carte des rendez-vous en attente */}
          <StatCard 
            type='pending'
            count={appointments.pendingCount}
            label='Rendez-vous en attente'
            icon='/assets/icons/pending.svg'  // Icône associée aux rendez-vous en attente
          />
          {/* Carte des rendez-vous annulés */}
          <StatCard 
            type='canceled'
            count={appointments.cancelledCount}
            label='Rendez-vous annulés'
            icon='/assets/icons/cancelled.svg'  // Icône associée aux rendez-vous annulés
          />
        </section>

        {/* Affichage du tableau avec les rendez-vous récupérés */}
        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};


export default Admin;
