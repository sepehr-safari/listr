import Link from 'next/link';
import { ReactNode } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export default function NavItem({ label, href, icon }: NavItem) {
  return (
    <>
      <Link
        href={href}
        className="btn-ghost btn rounded-full p-3 md:rounded-lg"
      >
        <div className="block w-6 md:hidden">{icon}</div>
        <div className="hidden md:block">{label}</div>
      </Link>
    </>
  );
}
