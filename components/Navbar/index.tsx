import { HashtagIcon, HomeIcon, UserIcon } from '@heroicons/react/24/outline';

import NavItem from './NavItem';

export default function Navbar() {
  return (
    <>
      <nav className="navbar justify-center">
        <ul className="gap-2">
          <li>
            <NavItem label="Feed" href="/" icon={<HomeIcon />} />
          </li>
          <li>
            <NavItem label="Explore" href="/explore" icon={<HashtagIcon />} />
          </li>
          <li>
            <NavItem label="Me" href="/me" icon={<UserIcon />} />
          </li>
        </ul>
      </nav>
    </>
  );
}
