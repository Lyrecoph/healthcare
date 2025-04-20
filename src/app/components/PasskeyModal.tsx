'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';                            
import { usePathname, useRouter } from 'next/navigation'; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";                // Composants UI pour la modale d'alerte

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/components/ui/input-otp";                   // Composants UI pour la saisie du mot de passe (OTP)

import { encryptKey, decryptKey } from '@/lib/utils';     // Fonctions utilitaires pour chiffrer/déchiffrer le mot de passe

/**
 * 
 * 
 * Ce composant protège l’accès à la page d’administration via un mot de passe à 6 chiffres.
 * 
 * Fonctionnalités :
 * - Vérifie si l'utilisateur a déjà une `accessKey` chiffrée dans le `localStorage`
 * - Si la clé est valide, redirige automatiquement vers /admin
 * - Sinon, affiche une modale de saisie OTP
 * - Chiffre et stocke la clé si le mot de passe est correct
 * - Affiche un message d’erreur si le mot de passe est invalide
 */
const PasskeyModal = () => {
  const router = useRouter();                     // Permet de rediriger l'utilisateur
  const path = usePathname();                     // Récupère le chemin actuel
  const [open, setOpen] = useState(true);         // Contrôle l'affichage de la modale
  const [passkey, setPasskey] = useState('');     // Stocke le code entré par l'utilisateur
  const [error, setError] = useState('');         // Message d'erreur si le mot de passe est incorrect

  // Récupère la clé d’accès chiffrée dans le localStorage (si côté client uniquement)
  const encryptedKey = 
    typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : null;

  // Effet qui vérifie si la clé stockée permet d'accéder à /admin
  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    
    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setOpen(false);
        router.push('/admin'); // Accès autorisé, redirection vers la page admin
      } else {
        setOpen(true); // Sinon, modale ouverte pour vérification
      }
    }
  }, [encryptedKey]);

  /**
   * Ferme la modale et redirige vers la page d'accueil
   */
  const closeModal = () => {
    setOpen(false);
    router.push('/');
  };

  /**
   * Valide le mot de passe saisi par l’utilisateur :
   * - Si valide : chiffre et stocke la clé, puis ferme la modale
   * - Sinon : affiche un message d’erreur
   * 
   * @param e - Événement de clic sur le bouton de validation
   */
  const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem('accessKey', encryptedKey);
      setOpen(false);
    } else {
      setError('Mot de passe invalide. Veuillez réessayer.');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className='shad-alert-dialog'>
        <AlertDialogHeader>
          {/* Titre de la modale avec bouton de fermeture */}
          <AlertDialogTitle className='flex items-start justify-between'>
            Vérification de l&apos;accès à l&apos;espace administrateur
            <Image 
              src='/assets/icons/close.svg'
              alt="fermer"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className='cursor-pointer'
            />
          </AlertDialogTitle>

          {/* Description de la demande */}
          <AlertDialogDescription>
            Pour accéder à la page d&apos;administration, veuillez saisir le mot de passe.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Champ de saisie OTP (6 chiffres) */}
        <div>
          <InputOTP 
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className='shad-otp'>
              <InputOTPSlot className='shad-otp-slot' index={0} />
              <InputOTPSlot className='shad-otp-slot' index={1} />
              <InputOTPSlot className='shad-otp-slot' index={2} />
              <InputOTPSlot className='shad-otp-slot' index={3} />
              <InputOTPSlot className='shad-otp-slot' index={4} />
              <InputOTPSlot className='shad-otp-slot' index={5} />
            </InputOTPGroup>
          </InputOTP>

          {/* Affichage du message d’erreur en cas de mot de passe incorrect */}
          {error && (
            <p className='shad-error text-14-regular mt-4 flex justify-center'>
              {error} 
            </p>
          )}
        </div>

        {/* Bouton de validation */}
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className='shad-primary-btn w-full'
          >
            Entrez le mot de passe administrateur
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;
