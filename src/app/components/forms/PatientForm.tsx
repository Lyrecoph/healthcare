"use client"; 

import { useState } from "react"; 
import * as Sentry from "@sentry/nextjs"; // Importation de Sentry pour la gestion des erreurs
import { useRouter } from "next/navigation"; 
import { z } from "zod"; // Importation de Zod pour la validation des données
import { zodResolver } from "@hookform/resolvers/zod"; // Importation du résolveur pour connecter Zod avec React Hook Form
import { useForm } from "react-hook-form"; 
import { Form } from "@/app/components/ui/form"; // Importation du composant Form de l'interface utilisateur
import CustomFormField from "../CustomFormField"; // Importation du composant CustomFormField pour les champs de formulaire personnalisés
import SubmitButton from "../SubmitButton"; // Importation du bouton de soumission du formulaire
import { UserFormValidation } from "@/lib/validation"; // Importation du schéma de validation Zod pour le formulaire
import { createUser } from "@/lib/actions/patient.actions"; // Importation de la fonction pour créer un utilisateur

// Enumération des types de champs pour le formulaire. Cela permet de centraliser les types et de les réutiliser facilement.
export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton'
}

const PatientForm = () => {
  // Initialisation des hooks pour la gestion de l'état local du composant
  const router = useRouter(); // Hook pour la navigation vers d'autres pages
  const [isLoading, setIsLoading] = useState(false); // Gestion de l'état de chargement du formulaire
  const [errorMsg, setErrorMsg] = useState(""); // Gestion de l'affichage des messages d'erreur

  // Initialisation du formulaire avec React Hook Form et validation via Zod
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation), // Connecte Zod à React Hook Form pour la validation
    defaultValues: { // Valeurs par défaut pour les champs du formulaire
      name: "",
      email: "",
      phone: ""
    },
  });

  // Fonction de gestion de la soumission du formulaire
  const onSubmit = async ({ name, email, phone }: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true); // Active le mode de chargement
    setErrorMsg(""); // Réinitialise le message d'erreur

    try {
      // Préparation des données à envoyer
      const user = { name, email, phone };
      
      // Création de l'utilisateur via la fonction createUser
      const newUser = await createUser(user);

      // Vérification si l'utilisateur a été créé correctement
      if (!newUser?.$id) {
        throw new Error("Utilisateur non créé ou réponse invalide.");
      }

      // Redirection vers la page d'enregistrement du patient après la création
      router.push(`/patients/${newUser.$id}/register`);
    } catch (error: any) {
      // Capture de l'erreur avec Sentry pour une gestion centralisée des erreurs
      Sentry.captureException(error, {
        tags: { section: "PatientForm Submit" }, // Tag spécifique à la section pour identifier facilement l'erreur
        extra: { formValues: form.getValues() } // Envoi des valeurs du formulaire pour le diagnostic
      });

      // Affichage d'un message d'erreur générique à l'utilisateur
      setErrorMsg("Une erreur est survenue. Veuillez réessayer.");
      console.error("Erreur lors de la création de l'utilisateur :", error); // Affichage de l'erreur dans la console
    } finally {
      setIsLoading(false); // Désactive le mode de chargement
    }
  }

  return (
    <Form {...form}> {/* Application de la logique de formulaire avec React Hook Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {/* Section d'introduction avec un titre et une description */}
        <section className="mb-12 space-y-4">
          <h1 className="header">Salut 👋</h1> {/* Titre principal */}
          <p className="text-dark-700">Planifiez votre premier rendez-vous.</p> {/* Description de l'action */}
        </section>

        {/* Champ de saisie pour le nom complet de l'utilisateur */}
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control} // Liaison avec le contrôle de React Hook Form
          name="name" // Nom du champ dans le formulaire
          label="Nom complet" // Label du champ
          placeholder="John Doe" // Texte par défaut dans le champ
          iconSrc="/assets/icons/user.svg" // Icône affichée dans le champ
          iconAlt="user" // Texte alternatif pour l'icône
        />
        
        {/* Champ de saisie pour l'email de l'utilisateur */}
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Adresse Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        
        {/* Champ de saisie pour le numéro de téléphone de l'utilisateur */}
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Numéro de téléphone"
          placeholder="+229 0167658025"
        />

        {/* Affichage d'un message d'erreur si un problème survient pendant la soumission */}
        {errorMsg && (
          <p className="text-red-500 text-sm">{errorMsg}</p> // Affiche l'erreur en rouge
        )}

        {/* Bouton de soumission avec état de chargement */}
        <SubmitButton isLoading={isLoading}>Soumettre</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm;
