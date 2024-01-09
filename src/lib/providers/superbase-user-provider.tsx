'use client';

import { AuthUser } from '@supabase/supabase-js';
import { Subscription } from '../superbase/superbase.types';
import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { getUserSubscriptionStatus } from '../superbase/queries';
import { useToast } from '@/components/ui/use-toast';

type SuperbaseUserContextType = {
  user: AuthUser | null;
  subscription: Subscription | null;
};

const SuperbaseUserContext = createContext<SuperbaseUserContextType>({
  user: null,
  subscription: null,
});

export const useSuperbaseUser = () => {
  return useContext(SuperbaseUserContext);
};

interface SuperbaseUserProviderProps {
  children: React.ReactNode;
}

export const SuperbaseUserProvider: React.FC<SuperbaseUserProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

  const superbase = createClientComponentClient();

  const getUser = async () => {
    const {
      data: { user },
    } = await superbase.auth.getUser();

    if (user) {
      setUser(user);
      const { data, error } = await getUserSubscriptionStatus(user.id);

      if (data) {
        setSubscription(data);
      }

      if (error)
        toast({
          title: 'Unexpected error',
          description: 'Oops! Unexpected error has occured.',
        });
    }
  };

  useEffect(() => {
    getUser();
  }, [superbase, toast]);
  return (
    <SuperbaseUserContext.Provider value={{ user, subscription }}>
      {children}
    </SuperbaseUserContext.Provider>
  );
};
