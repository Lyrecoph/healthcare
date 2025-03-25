import { FC } from 'react';
import AppointmentForm from "@/components/forms/AppointmentForm";
import Image from "next/image";
import { getPatient } from '@/lib/actions/patient.action';

const NewAppointment: FC<SearchParamProps> = async ({ params: { userId } }) => {
    const patient = await getPatient(userId);
    
  return (
    <div className="flex h-screen max-h-screen">
      
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
            <Image 
                src="assets/icons/logo-full.svg"
                height={1000}
                width={1000}
                alt="patient"
                className="mb-12 h-10 w-fit"
            />

            <AppointmentForm 
                type="create" 
                userId={userId}
                patientId={patient.$id}
            />

            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 Carepulse
            </p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img1.jpg"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}

export default NewAppointment
