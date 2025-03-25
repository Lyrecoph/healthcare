"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.action"
import { FormFieldType } from "./PatientForm"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { Doctors } from "../../../constants"

const AppointmentForm = (
    {
        userId, 
        patientId, 
        type
    }: {
        userId: string;
        patientId: string;
        type: "create" | "cancel" | "schedule";
    })  => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    try {
      const userData = {name, email, phone};

      const user = await createUser(userData);

      if(user) router.push(`/patients/${user.$id}/register`)
    } catch (error) {
      console.log(error)
    }
  }

  let buttonLabel;

  switch (type) {
    case 'cancel':
      buttonLabel = 'Rendez-vous annulé'
      break;
    case 'create':
      buttonLabel = 'Créer un rendez-vous'
      break;
    case 'schedule':
      buttonLabel = 'Planifier un rendez-vous'
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Nouveau rendez-vous</h1>
            <p className="text-dark-700">Demandez un nouveau rendez-vous en 10 secondes</p>
        </section>
        
        {type !== "cancel" && (
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
                    name="notes"
                    label="Remarques"
                    placeholder="Saisir les remarques"
                  />
                </div>
            </>
        )}

        {type ===  "cancel" && (
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
          className={`${type === 'cancel' ? 
          'shad-danger-btn': 'shadow-primary-btn'} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm;
