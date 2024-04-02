import { supabase } from '@/supabaseClient';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { isEmail, isStrongPassword } from 'validator';

export type LoginFormType = 'signup' | 'login' | 'reset' | 'recovery';

export interface LoginFormProps {
  type: LoginFormType;
  reset?: boolean;
}

export default function LoginForm({ type }: LoginFormProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [captchaToken, setCaptchaToken] = useState<string>('');

  const linkTo = useMemo(() => {
    if (type === 'login') {
      return '/signup';
    }

    return '/login';
  }, [type]);

  const buttonTextArr = useMemo(() => {
    if (type === 'reset') return ['Send Email'];

    if (type === 'recovery') return ['Reset'];

    const arr = ['Log in', 'Sign up'];

    if (type === 'login') {
      return arr;
    }

    return arr.reverse();
  }, [type]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    switch (type) {
      case 'signup':
        await handleSignup();
        break;
      case 'login':
        await handleLogin();
        break;
      case 'reset':
        await handleSendEmail();
        break;
      case 'recovery':
        await handleResetPassword();
        break;
      default:
        break;
    }
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      },
    });

    console.log(data);

    if (error) {
      console.log(error.message);
    }
  };

  const validateForm = (): boolean => {
    if (!isEmail(email)) {
      return false;
    }

    if (!isStrongPassword(password)) {
      return false;
    }

    return true;
  };
  const handleSignup = async () => {
    if (!validateForm()) return;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
      },
    });

    if (error) {
      console.log(error.message);
    }

    data && console.log(data);
  };

  const handleSendEmail = async () => {
    if (!isEmail(email)) return;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
      captchaToken,
    });

    if (error) {
      console.log(error.message);
    }

    console.log(data);
  };

  const handleResetPassword = async () => {
    if (!isStrongPassword(password)) return;

    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.log(error.message);
    }

    console.log(data);
  };

  return (
    <div className="w-96 relative flex flex-col p-4 rounded-md text-black bg-white shadow gap-4">
      <h2 className="text-2xl font-bold text-cyan-700 text-center">
        Tech Test Bed
      </h2>
      <form className="flex flex-col gap-3" onSubmit={(e) => handleSubmit(e)}>
        <div
          className={'block relative ' + (type === 'recovery' ? 'hidden' : '')}
        >
          <label
            htmlFor="email"
            className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
          >
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            id="email"
            className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0"
          />
        </div>
        <div className={'block relative ' + (type === 'reset' ? 'hidden' : '')}>
          <label
            htmlFor="password"
            className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
          >
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
          />
          {type === 'login' ? (
            <Link
              className="text-xs w-full text-right inline-block text-cyan-700 hover:text-cyan-900"
              to={'/reset-password'}
            >
              forgot password?
            </Link>
          ) : null}
        </div>
        <div className="w-full relative flex justify-center">
          <HCaptcha
            sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
            onVerify={(token) => {
              setCaptchaToken(token);
            }}
          />
        </div>
        <button
          type="submit"
          className={
            'bg-cyan-700 w-max m-auto px-6 py-2 rounded text-white text-sm font-normal ' +
            (!captchaToken ? 'bg-cyan-700/30 cursor-not-allowed' : '')
          }
          disabled={!captchaToken && type !== 'recovery'}
        >
          {buttonTextArr[0]}
        </button>
      </form>
      {type === 'reset' ? null : (
        <div className="text-sm text-right mt-6">
          <Link
            to={linkTo}
            className="text-cyan-700 cursor-pointer hover:text-cyan-900"
          >
            {buttonTextArr[1]}
          </Link>
        </div>
      )}
    </div>
  );
}
