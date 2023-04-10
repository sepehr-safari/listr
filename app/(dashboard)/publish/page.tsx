'use client';

import Link from 'next/link';
import { memo } from 'react';

import {
  ChatBubbleLeftEllipsisIcon,
  DocumentTextIcon,
  ListBulletIcon,
  UsersIcon,
  WifiIcon,
} from '@heroicons/react/24/outline';

const Publish = () => {
  return (
    <>
      <p className="font-bold">What kind of list do you want to publish?</p>

      <div className="w-full flex gap-4 flex-wrap">
        <Link className="btn-sm btn gap-2" href="/publish/notes">
          <ChatBubbleLeftEllipsisIcon width={20} />
          Nostr Notes
        </Link>
        <Link className="btn-sm btn gap-2" href="/publish/profiles">
          <UsersIcon width={20} />
          Nostr Profiles
        </Link>
        <Link className="btn-sm btn gap-2" href="/publish/relays">
          <WifiIcon width={20} />
          Nostr Relays
        </Link>
        <Link className="btn-sm btn gap-2" href="/publish/articles">
          <DocumentTextIcon width={20} />
          Nostr Articles
        </Link>
        <Link className="btn-sm btn gap-2" href="/publish/custom">
          <ListBulletIcon width={20} />
          Custom List
        </Link>
      </div>
    </>
  );
};

export default memo(Publish);
