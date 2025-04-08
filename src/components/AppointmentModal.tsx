'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import AppointmentForm from "./forms/AppointmentForm";
import { Appointment } from "../../types/appwrite.types";
const AppointmentModal = ({ 
    type, 
    patientId,
    userId,
    appointment 
}: {
    type: 'programmer' | 'annuler';
    patientId: string;
    userId: string;
    appointment?: Appointment; 
}) => {
    const [open, setOpen] = useState(false);
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="ghost" className={`capitalize ${type === 'programmer' && 'text-green-500'}`}>
                {type}
            </Button>
        </DialogTrigger>
        <DialogContent className="shad-dialog sm:max-w-md">
            <DialogHeader className="mb-4 space-y-3">
                <DialogTitle className="capitalize">{type} le rendez-vous</DialogTitle>
                <DialogDescription>
                    Veuillez remplir les informations suivantes pour {type} un rendez-vous
                </DialogDescription>
            </DialogHeader>
            <AppointmentForm 
                userId={userId}
                patientId={patientId}
                type={type}
                appointment={appointment}
                setOpen={setOpen}
            />
        </DialogContent>
    </Dialog>

  );
}

export default AppointmentModal;
