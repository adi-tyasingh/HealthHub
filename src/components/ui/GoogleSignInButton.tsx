
import { FC, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { IconBrandGoogle } from '@tabler/icons-react';


interface GoogleSignInButtonProps {
  children: ReactNode;
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const loginWithGoogle = () => {
    
     signIn("google",{callbackUrl:"http://localhost:3000"});
    // signIn("google", { callbackUrl: "https://atharva.echelonify.com/home" });
    //  signIn("google",{callbackUrl:"https://workflow-automation-atharvarakshaks-projects.vercel.app/home"});
    }

  return (
    <Button onClick={loginWithGoogle} className='w-[400px] border-2 flex rounded-xl p-6 '>
      <IconBrandGoogle className='mr-4'/>
      {children}
    </Button>
  );
};

export default GoogleSignInButton;