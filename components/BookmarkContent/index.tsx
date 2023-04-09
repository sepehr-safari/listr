// import Link from 'next/link';
// import { nip19 } from 'nostr-tools';
import { memo } from 'react';

import { StarIcon } from '@heroicons/react/24/solid';

const BookmarkContent = ({ tags }: { tags: string[][] }) => {
  return (
    <ul className="flex flex-col gap-6">
      {tags.map((tag, index) => {
        const parsed: any = JSON.parse(tag[1]);

        return (
          <li key={index}>
            {Object.entries<string>(parsed)?.map(([key, value], index) => {
              return (
                <div
                  className={
                    index === 0 ? 'text-neutral font-bold flex gap-2' : ''
                  }
                  key={index}
                >
                  {index === 0 && <StarIcon width={24} />}
                  <div
                    className="tooltip tooltip-top tooltip-info text-start"
                    data-tip={key}
                  >
                    <span>{value}</span>
                  </div>
                </div>
              );
            })}
          </li>
        );
      })}
    </ul>
  );
};

export default memo(BookmarkContent);
