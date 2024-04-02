import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import LoginForm, { type LoginFormType } from '@/components/login-form';

export default function ResetPasswordPage() {
  const [type, setType] = useState<LoginFormType>('reset');

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event == 'PASSWORD_RECOVERY') {
        setType('recovery');
      }
    });
  }, []);

  return <LoginForm type={type} />;
}
