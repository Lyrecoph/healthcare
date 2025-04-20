import Image from "next/image";

// Déclaration et exportation du composant fonctionnel Loading
export default function Loading() {
  return (
    // Conteneur principal : centre son contenu à la fois horizontalement et verticalement
    // `size-full` : prend toute la largeur et hauteur de son parent
    // `h-screen` : prend toute la hauteur de l'écran
    // `gap-3` : espace entre les éléments enfants
    // `text-white` : texte en blanc
    <div className="flex-center size-full h-screen gap-3 text-white">
      
      {/* Affichage d'une image de chargement (spinner) */}
      {/* Le fichier SVG est situé dans le dossier public sous /assets/icons/loader.svg */}
      {/* L'image tourne grâce à la classe Tailwind `animate-spin` */}
      <Image
        src="/assets/icons/loader.svg" 
        alt="loader" 
        width={40} 
        height={3240} 
        className="animate-spin" 
      />
      
      {/* Texte à côté du spinner */}
      Loading...
    </div>
  );
}
