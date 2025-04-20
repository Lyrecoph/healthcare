'use client';

import { E164Number } from "libphonenumber-js/core";     // Type pour numéro de téléphone au format international
import Image from 'next/image';                            
import { Control } from 'react-hook-form';                 // Type de contrôle pour la gestion des formulaires avec react-hook-form
import 'react-phone-number-input/style.css';              // Styles CSS pour le composant PhoneInput
import PhoneInput from 'react-phone-number-input';         // Composant d'input pour les numéros de téléphone international
import DatePicker from "react-datepicker";                 // Composant pour sélectionner une date
import "react-datepicker/dist/react-datepicker.css";       // Styles CSS pour DatePicker
import { Input } from "@/app/components/ui/input";        // Composant d'input personnalisé de l'application
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";                        // Composants pour créer des éléments de formulaire (contrôles, labels, etc.)
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/app/components/ui/select'; // Composants pour un select personnalisé
import { Textarea } from '@/app/components/ui/textarea';   // Composant Textarea personnalisé
import { Checkbox } from '@/app/components/ui/checkbox';   // Composant Checkbox personnalisé
import { FormFieldType } from './forms/PatientForm';        // Enumération pour les différents types de champs de formulaire

/**
 * Props pour le composant CustomFormField
 * 
 * @property control - Contrôle de formulaire pour gérer la validation et les valeurs des champs
 * @property name - Nom unique du champ dans le formulaire
 * @property label - Libellé à afficher à côté du champ (facultatif)
 * @property placeholder - Texte d'espace réservé pour l'input (facultatif)
 * @property iconSrc - Source de l'icône à afficher à gauche du champ (facultatif)
 * @property iconAlt - Texte alternatif pour l'icône (facultatif)
 * @property disabled - Si le champ est désactivé ou non (facultatif)
 * @property dateFormat - Format de la date dans le DatePicker (facultatif)
 * @property showTimeSelect - Si l'option pour sélectionner l'heure est activée (facultatif)
 * @property children - Composants enfants pour le Select (facultatif)
 * @property renderSkeleton - Fonction pour rendre un skeleton loader (facultatif)
 * @property fieldType - Type de champ à afficher dans le formulaire (input, textarea, etc.)
 */
type CustomFormProps = {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    iconSrc?: string;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
    fieldType: FormFieldType;
};

/**
 * RenderInput
 * 
 * Fonction qui rend un champ de formulaire basé sur son type (input, textarea, date picker, etc.)
 * Elle prend en charge différents types de champs et les rend de manière appropriée.
 * 
 * @param field - Les propriétés du champ gérées par react-hook-form
 * @param props - Props supplémentaires comme le type de champ, le placeholder, etc.
 */
const RenderInput = ({field, props}: { field: any, props: CustomFormProps}) => {
    const { fieldType, iconSrc, iconAlt, placeholder, 
        showTimeSelect, dateFormat, renderSkeleton } = props;

    // Switch sur le type de champ pour rendre le bon composant
    switch (fieldType) {
        case FormFieldType.INPUT:
            // Rendu pour un champ de type 'input' avec une icône en option
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    {iconSrc && (
                        <Image 
                            src={iconSrc}
                            height={24}
                            width={24}
                            alt={iconAlt || 'icon'}
                            className='ml-2'
                        />
                    )}
                    <FormControl>
                        <Input 
                            placeholder={placeholder}
                            {...field}
                            className="shad-input border-0"
                        />
                    </FormControl>
                </div>
            );
        case FormFieldType.TEXTAREA:
            // Rendu pour un champ de type 'textarea'
            return (
                <FormControl>
                    <Textarea 
                        placeholder={placeholder}
                        {...field}
                        className='shad-textArea'
                        disabled={props.disabled}
                    />
                </FormControl>
            );
        case FormFieldType.PHONE_INPUT:
            // Rendu pour un champ de type 'PhoneInput' pour gérer les numéros de téléphone
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    <FormControl>
                        <PhoneInput 
                            defaultCountry="BJ"                     // Pays par défaut
                            placeholder={placeholder}
                            international
                            withCountryCallingCode
                            value={field.value as E164Number | undefined}
                            onChange={field.onChange}
                            className="shad-input border-0"
                        />
                    </FormControl>
                </div>
            );
        case FormFieldType.DATE_PICKER:
            // Rendu pour un champ de type 'DatePicker'
            return(
                <div className='flex w-60 rounded-md border border-dark-500 bg-dark-400'>
                    <Image 
                        src="/assets/icons/calendar.svg"
                        height={24}
                        width={24}
                        alt="calendar"
                        className='ml-2'
                    />
                    <FormControl>
                        <DatePicker 
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={dateFormat ?? 'MM/dd/yyyy'}
                            showTimeSelect={showTimeSelect ?? false}
                            timeInputLabel='Time:'
                            wrapperClassName='date-picker'
                        />
                    </FormControl>
                </div>
            );
        case FormFieldType.SELECT:
            // Rendu pour un champ de type 'Select' (liste déroulante)
            return (
                <FormControl>
                    <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={placeholder}/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className='shad-select-content'>
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            );
        case FormFieldType.CHECKBOX:
            // Rendu pour un champ de type 'Checkbox'
            return (
                <FormControl>
                    <div className='flex items-center gap-4'>
                        <Checkbox 
                            id={props.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <label htmlFor={props.name} className='checkbox-label'>
                            {props.label}
                        </label>
                    </div>
                </FormControl>
            );
        case FormFieldType.SKELETON:
            // Rendu pour un skeleton loader si défini
            return renderSkeleton ? renderSkeleton(field) : null;
        default:
            break;
    }
};

/**
 * CustomFormField
 * 
 * Composant principal qui gère l'affichage des champs de formulaire et leur validation.
 * Il utilise react-hook-form pour la gestion de la validation et l'affichage des messages d'erreur.
 * 
 * @param control - Le contrôle react-hook-form pour la gestion du formulaire
 * @param name - Le nom unique du champ
 * @param label - Le label associé au champ (facultatif)
 * @param fieldType - Le type du champ de formulaire à afficher (input, textarea, etc.)
 */
const CustomFormField = (props: CustomFormProps) => {
    const {control, fieldType, name, label} = props;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
            <FormItem>
                {/* Si ce n'est pas un checkbox, affiche le label */}
                {fieldType !== FormFieldType.CHECKBOX && label && (
                    <FormLabel className="shad-input-label">{label}</FormLabel>
                )}
                {/* Rend le champ de formulaire spécifique basé sur le type */}
                <RenderInput field={field} props={props} />

                {/* Affiche les messages d'erreur de validation */}
                <FormMessage className="shad-error" />
            </FormItem>
            )}
        />
    );
};

export default CustomFormField;
