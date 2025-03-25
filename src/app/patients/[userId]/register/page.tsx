
import { FC } from 'react';
import RegisterForm from '@/components/forms/RegisterForm';
import { getUser } from '@/lib/actions/patient.action';
import Image from 'next/image'

const Register: FC<SearchParamProps> = async ({ params: { userId } }) => {
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image 
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
  
          <RegisterForm user={user}/>
          <p className="copyright py-12">
            © 2024 Carepulse
          </p>
        </div>
      </section>
      <Image
        src="/assets/images/register1-logo.jpg"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[550px]"
      />
    </div>
  );
}

export default Register;
