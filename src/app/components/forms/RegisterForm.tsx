"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { PatientFormValidation } from "@/lib/validation";
import { registerPatient } from "@/lib/actions/patient.actions";
import { Form, FormControl } from "@/app/components/ui/form";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { 
    Doctors, 
    GenderOptions, 
    IdentificationTypes, 
    PatientFormDefaultValues 
} from "../../../../constants";
import FileUploader from "../FileUploader";
import { FormFieldType } from "./PatientForm";



const RegisterForm = ({ user }: { user: User })  => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),

    defaultValues: {
      ...PatientFormDefaultValues, 
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    let formData;

    if(values.identificationDocument && values.identificationDocument.length > 0) {
        const blobFile = new Blob([values.identificationDocument[0]], {
            type: values.identificationDocument[0].type
        });

        formData = new FormData();
        formData.append('blobFile', blobFile);
        formData.append('fileName', values.identificationDocument[0].name);
    }

    try {
        const patient = {
            userId: user.$id,
            name: values.name,
            email: values.email,
            phone: values.phone,
            birthDate: new Date(values.birthDate),
            gender: values.gender,
            address: values.address,
            occupation: values.occupation,
            emergencyContactName: values.emergencyContactName,
            emergencyContactNumber: values.emergencyContactNumber,
            primaryPhysician: values.primaryPhysician,
            insuranceProvider: values.insuranceProvider,
            insurancePolicyNumber: values.insurancePolicyNumber,
            allergies: values.allergies,
            currentMedication: values.currentMedication,
            familyMedicalHistory: values.familyMedicalHistory,
            pastMedicalHistory: values.pastMedicalHistory,
            identificationType: values.identificationType,
            identificationNumber: values.identificationNumber,
            identificationDocument: values.identificationDocument
              ? formData
              : undefined,
            privacyConsent: values.privacyConsent,
          };

      const newPatient = await registerPatient(patient);

      if(newPatient) router.push(`/patients/${user.$id}/new-appointment`)
    } catch (error) {
        console.error("Erreur lors de la création d'un patient :", error);
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="header">Bienvenue 👋</h1>
            <p className="text-dark-700">Dites-nous en plus sur vous.</p>
        </section>

        {/* Informations Personnelles */}
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Informations Personnelles</h2>
            </div>
        </section>
        
        {/* Nom */}
        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Nom complet"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        {/* EMAIL & Téléphone */}
        <div className="flex flex-col gap-6 xl:flex-row">
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
                label="Numero de téléphone"
                placeholder="+229 0167658025"
            />
        </div>

        {/* Date de naissance & Genre */}
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Date de naissance"
            />
            <CustomFormField 
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Genre"
                renderSkeleton={(field) => (
                    <FormControl>
                        <RadioGroup 
                            className="flex h-11 gap-6 xl:justify-between"
                            onValueChange={field.onChange} 
                            defaultValue={field.value}   
                        >
                            {GenderOptions.map((option, i) => (
                                <div key={option + i} className="radio-group">
                                    <RadioGroupItem value={option} id={option}/>
                                    <Label 
                                        htmlFor={option} 
                                        className="cursor-pointer"
                                    >
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </FormControl>
                )}
            />
        </div>

        {/* Addresse & Profession */}
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Adresse"
                placeholder="Rue de la marina"
            />
            
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Profession"
                placeholder="Developpeur web"
            />
        </div>

        {/* Nom du contact d'urgence & Numéro du contact d'urgence */}
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                label="Nom du contact d'urgence"
                placeholder="Nom du gardien"
            />

            <CustomFormField 
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Numéro du contact d'urgence"
                placeholder="+229 0167658025"
            />
        </div>
        
        {/* Informations médicales */}
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Informations médicales</h2>
            </div>
        </section>
        
        {/* Médecin traitant */}
        {/* <div className="flex flex-col gap-6 xl:flex-row"> */}
            <CustomFormField 
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Médecin traitant"
                placeholder="Sélectionnez un médecin"
            >
                {Doctors.map((doctor, i) => (
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
        {/* </div> */}
        
        {/* Fournisseur d'assurance  & Numéro de police d'assurance */}
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insuranceProvider"
                label="Fournisseur d'assurance"
                placeholder="Croix Bleue CHNU"
            />
            
            <CustomFormField 
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                label="Numéro de police d'assurance"
                placeholder="ABC12345678"
            />
        </div>

        {/* Allergies & Médicaments actuels */}
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="allergies"
                label="Allergies (le cas échéant)"
                placeholder="Arachides, pénicilline, pollen"
            />
            
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="currentMedication"
                label="Médicaments actuels (le cas échéant)"
                placeholder="Amoxiciline 200mg, Paracetamol 500mg"
            />
        </div>
        
        {/* Antécédents médicaux & familiaux */}
        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="familyMedicalHistory"
                label="Antécédents médicaux familiaux"
                placeholder="La mère avait le drépanocytose, 
                Le père avait une maladie cardiaque"
            />
            
            <CustomFormField 
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Antécédents médicaux"
                placeholder="Prothèse de genou, Cholecystectomie"

            />
        </div>
        
        {/* Identification et vérification */}
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Identification et vérification</h2>
            </div>
        </section>

        {/* Type d'identification */}
        <CustomFormField 
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Type d'identification"
            placeholder="Sélectionnez le type d'identification"
        >
            {IdentificationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                   {type}
                </SelectItem>
            ))}
        </CustomFormField>
        
        {/* Numéro d'identification */}
        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Numéro d'identification"
            placeholder="45865283"
        />

        {/* Copie numérisée du document d'identité */}
        <CustomFormField 
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Copie numérisée du document d'identité"
            renderSkeleton={(field) => (
                <FormControl>
                    <FileUploader 
                        files={field.value} 
                        onChange={field.onChange}
                    />
                </FormControl>
            )}
        />

        {/* Consentement et confidentialité */}
        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Consentement et confidentialité</h2>
            </div>
        </section>

        <CustomFormField 
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="J'accepte le traitement"
        />
        <CustomFormField 
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="Je consens à la divulgation d'informations"
        />
        <CustomFormField 
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="Je consens à la politique de confidentialité"
        />
        
        <SubmitButton isLoading={isLoading}>S&apos;inscrire</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm;
