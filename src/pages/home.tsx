import { supabase } from '@/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    console.log('getUser');

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log(error.message);
      return;
    }

    console.log(data);
    setUser(data.user);
  };

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <h1 className="text-cyan-800 text-6xl my-8 font-serif">Tech Test Bed</h1>
      <img src="/logo.png" alt="logo" width={300} height={300} />
      {user?.email ? <small>Welcome! {user.email}</small> : null}
    </div>
  );
}
