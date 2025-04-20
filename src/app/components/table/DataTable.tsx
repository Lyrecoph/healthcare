"use client";

import { useEffect } from "react"; 
import Image from "next/image"; 
import { redirect } from "next/navigation"; 
import {
  ColumnDef, // Importation des types et hooks nécessaires pour la gestion des colonnes du tableau avec React Table
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"; // Bibliothèque React Table pour gérer les tables avec pagination et modèles de ligne
import {
  Table, // Composants d'interface pour afficher un tableau
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"; // Ces composants permettent de créer une table avec un en-tête, un corps, des cellules, etc.
import { Button } from "../ui/button"; // Composant Button utilisé pour les boutons de pagination dans le tableau
import { decryptKey } from "@/lib/utils"; // Fonction utilitaire pour déchiffrer la clé d'accès stockée dans le localStorage

// Définition des types des props du composant DataTable
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Colonnes du tableau, définies par le développeur
  data: TData[]; // Données du tableau, sous forme d'un tableau d'objets
}

/**
 * `DataTable` est un composant générique pour afficher un tableau avec des colonnes définies par les props `columns`
 * et des données fournies dans `data`. Il gère également la pagination et l'accès sécurisé à la page.
 */
export function DataTable<TData, TValue>({
  columns, // Colonnes à afficher dans le tableau
  data, // Données à afficher dans le tableau
}: DataTableProps<TData, TValue>) {
  // Récupération de la clé d'accès stockée dans le localStorage, qui est utilisée pour vérifier l'autorisation d'accès
  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  // Utilisation de useEffect pour vérifier la clé d'accès et rediriger l'utilisateur si la clé est invalide
  useEffect(() => {
    // Déchiffrement de la clé d'accès stockée
    const accessKey = encryptedKey && decryptKey(encryptedKey);

    // Vérification de la validité de la clé d'accès
    if (accessKey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {
      // Si la clé d'accès n'est pas valide, rediriger l'utilisateur vers la page d'accueil
      redirect("/");
    }
  }, [encryptedKey]);

  // Configuration du tableau avec React Table
  const table = useReactTable({
    data, // Données du tableau
    columns, // Colonnes du tableau
    getCoreRowModel: getCoreRowModel(), // Modèle de base pour les lignes du tableau
    getPaginationRowModel: getPaginationRowModel(), // Modèle pour la gestion de la pagination
  });

  return (
    <div className="data-table">
      {/* Le tableau principal */}
      <Table className="shad-table">
        {/* En-tête du tableau */}
        <TableHeader className="bg-dark-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="shad-table-row-header">
              {/* Affichage des en-têtes des colonnes */}
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        {/* Corps du tableau avec les données */}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            // Affichage des lignes de données si elles existent
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"} // Indication de sélection de ligne
                className="shad-table-row"
              >
                {/* Affichage des cellules de chaque ligne */}
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {/* Rendu dynamique du contenu de chaque cellule */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Message affiché si aucune donnée n'est présente dans le tableau
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Section de pagination */}
      <div className="table-actions">
        {/* Bouton pour la page précédente */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()} // Navigue vers la page précédente
          disabled={!table.getCanPreviousPage()} // Désactive le bouton si la page précédente n'est pas disponible
          className="shad-gray-btn"
        >
          {/* Icône de flèche vers la gauche */}
          <Image 
            src="/assets/icons/arrow.svg"
            width={24}
            height={24}
            alt="arrow"
          />
        </Button>

        {/* Bouton pour la page suivante */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()} // Navigue vers la page suivante
          disabled={!table.getCanNextPage()} // Désactive le bouton si la page suivante n'est pas disponible
          className="shad-gray-btn"
        >
          {/* Icône de flèche vers la droite (rotation de 180 degrés) */}
          <Image 
            src="/assets/icons/arrow.svg"
            width={24}
            height={24}
            alt="arrow"
            className="rotate-180"
          />
        </Button>
      </div>
    </div>
  );
}
