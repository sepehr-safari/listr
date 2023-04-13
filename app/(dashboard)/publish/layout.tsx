'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { CardContainer } from '@/components';
import useStore from '@/store';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const userData = useStore((state) => state.auth.user.data);

  useEffect(() => {
    if (!userData) {
      router.replace('/login');
    }
  }, [router, userData]);

  return <CardContainer>{children}</CardContainer>;
};

export default Layout;
