import { memo } from 'react';
import { nip19 } from 'nostr-tools';

import { StarIcon } from '@heroicons/react/24/solid';

interface BookmarkContentProps {
  tags: string[][];
  bookmarkType: string;
}

// [TODO]: should extract the logic

const BookmarkContent = ({ tags, bookmarkType }: BookmarkContentProps) => {
  if (bookmarkType === 'notes') {
    const noteTagList = tags.filter((tag) => tag[0] === 'e');

    return (
      <ul className="flex flex-col gap-6">
        {noteTagList.map((tag, index) => {
          const encodedNoteId = nip19.noteEncode(tag[1]);

          return (
            <li key={index}>
              <a
                className="text-neutral flex gap-2 text-sm break-all"
                href={`nostr:${encodedNoteId}`}
              >
                <StarIcon width={20} />
                {`nostr:${encodedNoteId}`}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  if (bookmarkType === 'profiles') {
    const profileTagList = tags.filter((tag) => tag[0] === 'p');

    return (
      <ul className="flex flex-col gap-6">
        {profileTagList.map((tag, index) => {
          const encodedProfileId = nip19.npubEncode(tag[1]);

          return (
            <li key={index}>
              <a
                className="text-neutral flex gap-2 text-sm break-all"
                href={`nostr:${encodedProfileId}`}
              >
                <StarIcon width={20} />
                {`nostr:${encodedProfileId}`}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return <></>;
};

export default memo(BookmarkContent);
