import Link from 'next/link';

import { UserIcon } from '@heroicons/react/24/outline';

import { Avatar, Searchbar } from '@/components';

export default function Header() {
  return (
    <>
      <nav className="navbar justify-center">
        <div className="w-full max-w-screen-xl">
          <div className="flex w-full items-center justify-between">
            <div className="flex w-1/4 items-center gap-2">
              <Avatar url="/listr.png" />

              <h1 className="text-lg font-bold normal-case md:text-xl">
                Listr
              </h1>
            </div>

            <div className="flex w-1/3 px-2">
              <Searchbar />
            </div>

            <div className="flex w-1/4 justify-end gap-2">
              <div className="dropdown-bottom dropdown-left dropdown">
                <label tabIndex={0} className="btn-ghost btn-circle btn">
                  <UserIcon width={24} />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-32 bg-base-100 p-2 shadow-lg shadow-black"
                >
                  <li>
                    <Link className="text-xs" href="/settings">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="text-xs" href="/logout">
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
