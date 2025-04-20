"use client";

import React, { useCallback } from "react";
import Image from "next/image";                          
import { useDropzone } from "react-dropzone";    // Hook pour gérer le glisser-déposer de fichiers
import { convertFileToUrl } from "@/lib/utils";  // Fonction utilitaire pour convertir un fichier en URL utilisable (blob)

/**
 * Props du composant FileUploader
 * @property files - Liste des fichiers actuellement sélectionnés ou téléchargés
 * @property onChange - Fonction appelée lorsqu'un ou plusieurs fichiers sont déposés ou sélectionnés
 */
type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

/**
 * FileUploader
 * 
 * Composant qui permet à l'utilisateur de télécharger une image en utilisant :
 * - Le glisser-déposer (drag & drop)
 * - Ou un clic pour ouvrir l'explorateur de fichiers
 * 
 * Il utilise le hook `useDropzone` pour gérer le comportement du téléchargement.
 * Lorsqu’un fichier est déposé ou sélectionné, il est transmis au parent via la fonction `onChange`.
 * Si un fichier est présent, une preview est affichée. Sinon, des instructions visuelles sont montrées.
 * 
 * @param files - Tableau de fichiers sélectionnés
 * @param onChange - Callback déclenchée lorsqu’un fichier est uploadé
 */
const FileUploader: React.FC<FileUploaderProps> = ({ files, onChange }) => {

  // Callback déclenchée lors du dépôt de fichiers (via drag & drop ou sélection manuelle)
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);             // Met à jour les fichiers sélectionnés via la fonction du parent
    },
    [onChange]
  );

  // Hook pour gérer le drag & drop et obtenir les props nécessaires
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    // Zone cliquable et droppable
    <div {...getRootProps()} className="file-upload">
      {/* Input de type file, invisible mais essentiel pour le dropzone */}
      <input {...getInputProps()} />

      {files && files.length > 0 ? (
        // Si un fichier est présent, affiche un aperçu de l’image
        <Image
          src={convertFileToUrl(files[0])}              // Conversion du fichier en URL affichable
          width={1000}
          height={1000}
          alt="image téléchargée"
          className="max-h-[400px] overflow-hidden object-cover"
        />
      ) : (
        // Sinon, affiche les instructions de téléchargement
        <>
          <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt="télécharger"
          />
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">Cliquez pour télécharger</span> 
              ou glisser-déposer
            </p>
            <p>SVG, PNG, JPG ou GIF (max 800x400px)</p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploader;
