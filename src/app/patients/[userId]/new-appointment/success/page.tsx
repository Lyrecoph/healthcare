import { getAppointment } from '@/lib/actions/appointment.actions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Doctors } from '../../../../../../constants';
import { formatDateTime } from '../../../../../../lib/utils';
import { Button } from '@/components/ui/button';

const Success = async ({ params: { userId }, searchParams }: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || '';

  // Empêcher le rendu si l'ID est manquant
  if (!appointmentId) {
    return <p className="text-center text-red-500">Aucun rendez-vous trouvé.</p>;
  }

  // Récupération sécurisée de l'appointment
  let appointment;
  try {
    appointment = await getAppointment(appointmentId);
  } catch (error) {
    console.error("Erreur lors de la récupération du rendez-vous :", error);
    return <p className="text-center text-red-500">Une erreur s&apos;est produite.</p>;
  }

  if (!appointment) {
    return <p className="text-center text-red-500">Rendez-vous introuvable.</p>;
  }

  const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician);

  return (
    <div className='flex h-screen max-h-screen px-[5%]'>
      <div className='success-img'>
        <Link href='/'>
          <Image 
            src='/assets/icons/logo-full.svg'
            height={1000}
            width={1000}
            alt='logo'
            className='h-10 w-fit'
          />
        </Link>

        <section className='flex flex-col items-center'>
          <Image 
            src='/assets/gifs/success.gif'
            height={300}
            width={280}
            alt='success'
          />
          <h2 className='header mb-6 max-w-[600px] text-center'>
            Votre <span className='text-green-500'>demande de rendez-vous </span>
            a été soumise avec succès !
          </h2>
          <p>Nous vous contacterons sous peu pour confirmer.</p>
        </section>

        {doctor ? (
          <section className='request-details'>
            <p>Détails du rendez-vous demandé:</p>
            <div className='flex items-center gap-3'>
              <Image 
                src={doctor.image}
                alt='doctor'
                width={100}
                height={100}
                className='size-6'
              />
              <p className='whitespace-nowrap'>Dr. {doctor.name}</p>
            </div>
            <div className='flex gap-2'>
              <Image 
                src='/assets/icons/calendar.svg'
                height={24}
                width={24}
                alt='calendar'
              />
              <p>{formatDateTime(appointment.schedule).dateTime}</p>
            </div>
          </section>
        ) : (
          <p className="text-gray-500">Médecin non trouvé.</p>
        )}
        <Button variant="outline" className='shad-primary-btn' asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            Nouveau Rendez-vous
          </Link>
        </Button>

        <p className='copyright'>© 2024 Carepulse</p>
      </div>
    </div>
  );
}

export default Success;
