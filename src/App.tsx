import { useState } from 'react';
import { supabase } from './supabaseClient';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function App() {
  const [captchaToken, setCaptchaToken] = useState<string>();

  const handleClick = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: '',
      password: '',
      options: {
        captchaToken,
      },
    });

    console.log('data', data);
    console.log('error', error);
  };

  return (
    <div>
      <h1>Hello</h1>
      <button onClick={handleClick}>Click</button>
      <HCaptcha
        sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
        onVerify={(token) => {
          setCaptchaToken(token);
        }}
      />
    </div>
  );
}
