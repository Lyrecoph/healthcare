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
import { createUser } from "@/lib/actions/patient.actions"
import * as Sentry from "@sentry/nextjs"

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    },
  });

  const onSubmit = async ({ name, email, phone }: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      const userData = { name, email, phone };
      const user = await createUser(userData);

      if (!user?.$id) {
        throw new Error("Utilisateur non créé ou réponse invalide.");
      }

      router.push(`/patients/${user.$id}/register`);
    } catch (error: any) {
      Sentry.captureException(error, {
        tags: { section: "PatientForm Submit" },
        extra: { formValues: form.getValues() }
      });

      setErrorMsg("Une erreur est survenue. Veuillez réessayer.");
      console.error("Erreur lors de la création de l'utilisateur :", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Salut 👋</h1>
          <p className="text-dark-700">Planifiez votre premier rendez-vous.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Nom complet"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Adresse Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Numéro de téléphone"
          placeholder="+229 0167658025"
        />

        {errorMsg && (
          <p className="text-red-500 text-sm">{errorMsg}</p>
        )}

        <SubmitButton isLoading={isLoading}>Soumettre</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm;
