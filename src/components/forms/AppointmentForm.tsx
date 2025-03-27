"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { Doctors } from "../../../constants"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment } from "../../../types/appwrite.types"

const AppointmentForm = (
    {
        userId, 
        patientId, 
        type,
        appointment,
        setOpen,
    }: {
        userId: string;
        patientId: string;
        type: "create" | "annuler" | "programmer";
        appointment?: Appointment;
        setOpen: (open: boolean) => void;
    })  => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const AppointmentFormValidation = getAppointmentSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    let status;

    switch (type) {
      case 'programmer':
        status = 'scheduled';
        break;
      case 'annuler':
        status = 'canceled'
        break;
      default:
        status = 'pending';
        break;
    }

    try {
      if(type === 'create' && patientId){
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status
        }

        const appointment = await createAppointment(appointmentData);

        if(appointment){
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
        } else {
          const appointmentToUpdate = {
            userId,
            appointmentId: appointment?.$id!,
            appointment: {
              primaryPhysician: values?.primaryPhysician,
              schedule: new Date(values?.schedule),
              status: status as Status,
              cancellationReason: values?.cancellationReason
            },
            type
          }
          const updatedAppointment = await updateAppointment(appointmentToUpdate);

          if(updateAppointment){
            setOpen && setOpen(false);
            form.reset();
          }
        }
      }

    } catch (error) {
      console.log(error)
    }
  }

  let buttonLabel;

  switch (type) {
    case 'annuler':
      buttonLabel = 'Rendez-vous annulé'
      break;
    case 'create':
      buttonLabel = 'Créer un rendez-vous'
      break;
    case 'programmer':
      buttonLabel = 'Planifier un rendez-vous'
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === 'create' && <section className="mb-12 space-y-4">
            <h1 className="header">Nouveau rendez-vous</h1>
            <p className="text-dark-700">Demandez un nouveau rendez-vous en 10 secondes</p>
        </section>}
        
        {type !== "annuler" && (
            <>
                <CustomFormField 
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    label="Médecin"
                    placeholder="Sélectionnez un médecin"
                >
                {Doctors.map((doctor) => (
                    <SelectItem key={doctor.name} value={doctor.name}>
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

                <CustomFormField 
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="schedule"
                    label="Date de rendez-vous prévue"
                    showTimeSelect
                    dateFormat="MM/dd/yyyy - h:mm aa"
                />

                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField 
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="reason"
                    label="Motif du rendez-vous"
                    placeholder="Entrez le motif du rendez-vous"
                  />

                  <CustomFormField 
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="note"
                    label="Remarques"
                    placeholder="Saisir les remarques"
                  />
                </div>
            </>
        )}

        {type ===  "annuler" && (
          <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Raison de l'annulation"
            placeholder="Entrez le motif de l'annulation"
          />
        )}
        <SubmitButton 
          isLoading={isLoading} 
          className={`${type === 'annuler' ? 
          'shad-danger-btn': 'shad-primary-btn'} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm;
