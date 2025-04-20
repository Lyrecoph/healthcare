// Ce composant encapsule un bouton de soumission avec un état de chargement (loading).
// Il affiche un loader animé lorsque l'action est en cours et désactive le bouton.

import Image from 'next/image';            
import { Button } from './ui/button';      // Composant Button réutilisable de l'UI

/**
 * Props pour le composant SubmitButton
 * @property isLoading - Indique si l'action est en cours (affiche un loader et désactive le bouton)
 * @property className - Classe CSS optionnelle pour styliser le bouton
 * @property children - Contenu du bouton lorsque isLoading est false
 */
type SubmitButtonProps = {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * SubmitButton
 * 
 * Ce composant rend un <Button> de type submit qui :
 * - Est désactivé pendant le chargement (isLoading = true).
 * - Affiche soit :
 *    • un spinner animé + texte "Loading ..."
 *    • le contenu (children) autrement
 * - Accepte des classes CSS personnalisées via className.
 *
 * @param isLoading - Booléen de contrôle du loader et de l'état désactivé
 * @param className - Classes CSS optionnelles (défaut : 'shad-primary-btn w-full')
 * @param children - Élément(s) à afficher dans le bouton quand non en chargement
 */
const SubmitButton = ({ isLoading, className, children }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"                          // Définit le type pour soumettre un formulaire
      disabled={isLoading}                     // Désactive le bouton lorsqu'on charge
      className={className ?? 'shad-primary-btn w-full'} // Applique des classes CSS par défaut ou celles fournies
    >
      {isLoading ? (
        // Affichage du loader animé et du texte "Loading ..."
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"    // Icône de loader (SVG statique)
            alt="loader"                      // Texte alternatif pour accessibilité
            width={24}                         // Dimensions du loader
            height={24}
            className="animate-spin"          // Classe Tailwind pour animer la rotation
          />
          Loading ...                          // Texte affiché à côté du loader
        </div>
      ) : (
        // Affiche le contenu enfant du bouton lorsque non en chargement
        children
      )}
    </Button>
  );
};

export default SubmitButton;  