"use client"; 

import Image from "next/image"; 
import { ColumnDef } from "@tanstack/react-table"; // Fournit des définitions de colonnes pour les tableaux avec React Table.

import { StatusBadge } from "../StatusBadge"; // Un composant qui affiche un badge de statut personnalisé.
import { formatDateTime } from "@/lib/utils"; // Une fonction utilitaire pour formater des dates et heures.

import AppointmentModal from "../AppointmentModal"; // Un composant modal pour afficher et gérer les rendez-vous.
import { Doctors } from "../../../../constants"; // Liste des médecins disponible dans les constantes de l'application.
import { Appointment } from "../../../../types/appwrite.types"; // Type défini pour l'objet "Rendez-vous".

// Définition des colonnes de la table avec @tanstack/react-table
// Chaque colonne a un 'accessorKey' qui fait référence à une clé dans les données de la ligne, un 'header' qui définit l'en-tête de la colonne,
// et un 'cell' qui est une fonction qui détermine ce qui est rendu dans la cellule pour chaque ligne.
export const columns: ColumnDef<Appointment>[] = [
  {
    header: 'ID', // Titre de la colonne
    // La cellule affiche l'index de la ligne + 1 (pour commencer à 1 au lieu de 0)
    cell: ({row}) => <p className="text-14-medium">{row.index + 1}</p>
  },
  {
    accessorKey: 'patient', // Clé pour accéder à l'information sur le patient
    header: 'Patient', // Titre de la colonne
    // Affiche le nom du patient (extrait de la ligne de données)
    cell: ({row}) => <p className="text-14-medium">{row.original.patient.name}</p>
  },

  {
    accessorKey: "status", // Clé pour accéder à l'état du rendez-vous
    header: "Statut", // Titre de la colonne
    // Affiche un badge de statut pour le rendez-vous, personnalisé en fonction du statut.
    cell: ({row}) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status}/>
      </div>
    )
  },
  {
    accessorKey: "schedule", // Clé pour accéder à l'horaire du rendez-vous
    header: "Rendez-vous", // Titre de la colonne
    // Affiche la date et l'heure formatée du rendez-vous en utilisant la fonction formatDateTime
    cell: ({row}) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    )
  },
  {
    accessorKey: "primaryPhysician", // Clé pour accéder au médecin principal
    header: () => 'Médecin', // Titre de la colonne
    // Affiche le nom et la photo du médecin principal en utilisant l'image du médecin et son nom
    cell: ({ row }) => {
      const doctor = Doctors.find((doc) => doc.name === row.original.primaryPhysician)
      const imageSrc = doctor?.image || "assets/images/dr-lee.png";
      return (
        <div className="flex items-center gap-3">
          <Image 
            src={imageSrc} 
            alt="médecin"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p> {/* Affichage du nom du médecin */}
        </div>
      )
    },
  },

  {
    id: "actions", // Identifiant pour la colonne des actions
    header: () => <div className="pl-4">Actions</div>, // Titre de la colonne des actions
    // Affiche deux boutons modaux pour programmer ou annuler un rendez-vous
    cell: ({ row: { original: data} }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModal 
            type='programmer' // Type d'action : planifier un rendez-vous
            patientId={data.patient.$id} // L'ID du patient pour le rendez-vous
            userId={data.userId} // L'ID de l'utilisateur associé
            appointment={data} // Détails du rendez-vous
            title="Planifier un rendez-vous" // Titre du modal
            description="Veuillez confirmer les détails suivants pour planifier." // Description du modal
          />
          <AppointmentModal 
            type="annuler" // Type d'action : annuler un rendez-vous
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
            title="Annuler le rendez-vous" // Titre du modal
            description="Êtes-vous sûr de vouloir annuler votre rendez-vous ?" // Description du modal
          />
        </div>
      );
    },
  },
];
