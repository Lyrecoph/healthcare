'use client';


import { useState } from "react"; 
import { Button } from "@/app/components/ui/button"; // Importation du composant Button pour afficher un bouton dans la modale
import {
  Dialog, // Importation des composants Dialog pour gérer la fenêtre modale
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"; // Ces composants proviennent de la bibliothèque UI, permettant de créer et gérer des fenêtres modales
import { Appointment } from "../../../types/appwrite.types"; // Type représentant un rendez-vous, importé depuis les types définis dans le projet
import AppointmentForm from "./forms/AppointmentForm"; // Importation du formulaire pour ajouter ou modifier un rendez-vous

/**
 * `AppointmentModal` est un composant qui gère l'affichage d'une fenêtre modale permettant à l'utilisateur
 * de programmer ou annuler un rendez-vous.
 * Il prend plusieurs props pour déterminer le type d'action (programmer ou annuler), ainsi que l'ID du patient,
 * l'ID de l'utilisateur et, éventuellement, un objet de rendez-vous pour la modification.
 */
const AppointmentModal = ({ 
    type, // Le type de l'action, soit "programmer", soit "annuler"
    patientId, // L'ID du patient associé au rendez-vous
    userId, // L'ID de l'utilisateur (par exemple, un médecin ou un administrateur) qui gère le rendez-vous
    appointment, // Un objet optionnel représentant le rendez-vous, utilisé si l'utilisateur souhaite le modifier
}: {
    type: 'programmer' | 'annuler'; // Le type de l'action que l'utilisateur souhaite effectuer
    patientId: string; // L'ID du patient
    userId: string; // L'ID de l'utilisateur qui interagit avec le rendez-vous
    appointment?: Appointment; // L'objet rendez-vous, optionnel
    title: string; // Titre (optionnel, pour une future extension possible)
    description: string; // Description (optionnel, pour une future extension possible)
}) => {
    // Déclaration d'un état local pour gérer l'ouverture et la fermeture de la modale
    const [open, setOpen] = useState(false);
    
    return (
        // Le composant Dialog qui gère l'affichage de la fenêtre modale
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Le bouton qui déclenche l'ouverture de la modale */}
            <DialogTrigger asChild>
                <Button 
                    variant="ghost" // Variante de bouton sans fond pour une interface propre
                    className={`capitalize ${type === 'programmer' && 'text-green-500'}`} // La couleur du texte est ajustée en fonction du type (vert pour "programmer")
                >
                    {type} {/* Affichage du type de l'action, soit "programmer", soit "annuler" */}
                </Button>
            </DialogTrigger>

            {/* Contenu de la fenêtre modale */}
            <DialogContent className="shad-dialog sm:max-w-md">
                <DialogHeader className="mb-4 space-y-3">
                    <DialogTitle className="capitalize">{type} le rendez-vous</DialogTitle>
                    <DialogDescription>
                        {/* Description expliquant à l'utilisateur l'action qu'il doit entreprendre */}
                        Veuillez remplir les informations suivantes pour {type} un rendez-vous
                    </DialogDescription>
                </DialogHeader>

                {/* Le formulaire de rendez-vous, qui varie en fonction du type d'action */}
                <AppointmentForm 
                    userId={userId} // L'ID de l'utilisateur qui gère l'action
                    patientId={patientId} // L'ID du patient pour lequel l'action est effectuée
                    type={type} // Le type d'action ("programmer" ou "annuler")
                    appointment={appointment} // L'objet de rendez-vous à modifier (optionnel)
                    setOpen={setOpen} // Fonction pour ouvrir ou fermer la modale
                />
            </DialogContent>
        </Dialog>
    );
}

export default AppointmentModal;
