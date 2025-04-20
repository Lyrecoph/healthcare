"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import CustomFormField from "../CustomFormField"; // Formulaire personnalisé avec gestion de champs
import SubmitButton from "../SubmitButton"; // Bouton de soumission avec gestion de l'état de chargement
import { FormFieldType } from "./PatientForm"; // Définition des types des champs du formulaire
import { SelectItem } from "../ui/select"; // Sélection des éléments dans un menu déroulant
import { Form } from "@/app/components/ui/form"; // Composant de formulaire
import { getAppointmentSchema } from "@/lib/validation"; // Validation du schéma de rendez-vous
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"; // Actions liées aux rendez-vous (création et mise à jour)
import { Doctors } from "../../../../constants"; // Liste des médecins disponibles
import { Appointment } from "../../../../types/appwrite.types"; // Type Appointment pour les rendez-vous

/**
 * Composant de formulaire pour la gestion des rendez-vous.
 * 
 * @param {Object} props - Propriétés passées au composant
 * @param {string} props.userId - Identifiant de l'utilisateur (médecin)
 * @param {string} props.patientId - Identifiant du patient
 * @param {string} props.type - Type d'action (création, annulation, programmation)
 * @param {Appointment} [props.appointment] - Données de rendez-vous existantes (facultatif, utilisé lors de la modification ou annulation)
 * @param {(open: boolean) => void} [props.setOpen] - Fonction pour gérer l'état d'ouverture/fermeture du formulaire
 */
const AppointmentForm = ({
  userId, 
  patientId, 
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "annuler" | "programmer";
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
}) => {

  // Utilisation du hook useRouter pour la navigation programmatique
  const router = useRouter();
  
  // Gestion de l'état de chargement et des messages d'erreur
  const [isLoading, setIsLoading] = useState(false);

  // Validation du formulaire en fonction du type d'action (création, annulation, programmation)
  const AppointmentFormValidation = getAppointmentSchema(type);

  // Initialisation du formulaire avec useForm, en définissant les valeurs par défaut et la validation
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : '',
      schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment?.note || '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  });

  /**
   * Fonction de soumission du formulaire
   * @param {Object} values - Valeurs du formulaire
   */
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);
    let status;

    // Détermination du statut en fonction du type de formulaire
    switch (type) {
      case 'programmer':
        status = 'scheduled';
        break;
      case 'annuler':
        status = 'canceled';
        break;
      default:
        status = 'pending';
        break;
    }

    try {
      // Création d'un nouveau rendez-vous
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status
        };

        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset(); // Réinitialisation du formulaire après création
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`); // Redirection vers la page de succès
        }
      } 
      // Mise à jour ou annulation d'un rendez-vous existant
      else if (appointment) {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason
          },
          type,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          if (setOpen) setOpen(false); // Fermeture du formulaire si setOpen est défini
          form.reset(); // Réinitialisation du formulaire après modification
        }
      }
    } catch (error) {
      console.error("Erreur lors de la création d'un rendez-vous :", error); // Gestion des erreurs
    }

    setIsLoading(false); // Fin de l'état de chargement
  }

  // Définition du texte du bouton en fonction du type de formulaire
  let buttonLabel;

  switch (type) {
    case 'annuler':
      buttonLabel = 'Rendez-vous annulé';
      break;
    case 'create':
      buttonLabel = 'Créer un rendez-vous';
      break;
    case 'programmer':
      buttonLabel = 'Planifier un rendez-vous';
      break;
    default:
      break;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {/* Section d'introduction pour la création d'un rendez-vous */}
        {type === 'create' && (
          <section className="mb-12 space-y-4">
            <h1 className="header">Nouveau rendez-vous</h1>
            <p className="text-dark-700">
              Demandez un nouveau rendez-vous en 10 secondes
            </p>
          </section>
        )}

        {/* Champs du formulaire pour programmer un rendez-vous */}
        {type !== "annuler" && (
          <>
            {/* Sélection du médecin pour le rendez-vous */}
            <CustomFormField 
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Médecin"
              placeholder="Sélectionnez un médecin"
            >
              {Doctors.map((doctor,i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image 
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            {/* Sélection de la date et heure du rendez-vous */}
            <CustomFormField 
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Date de rendez-vous prévue"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

            {/* Motif du rendez-vous et autres remarques */}
            <div className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}>
              <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Motif du rendez-vous"
                placeholder="Entrez le motif du rendez-vous" 
                disabled={type === "programmer"}
              />

              <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Remarques"
                placeholder="Saisir les remarques"
                disabled={type === "programmer"}
              />
            </div>
          </>
        )}

        {/* Champ pour annuler un rendez-vous */}
        {type ===  "annuler" && (
          <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Raison de l'annulation"
            placeholder="Entrez le motif de l'annulation"
          />
        )}

        {/* Bouton de soumission du formulaire */}
        <SubmitButton 
          isLoading={isLoading} 
          className={`${type === 'annuler' ? 
          'shad-danger-btn': 'shad-primary-btn'} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
