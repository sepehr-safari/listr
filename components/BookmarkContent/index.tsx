import { memo } from 'react';
import { nip19 } from 'nostr-tools';

import { StarIcon } from '@heroicons/react/24/solid';

interface BookmarkContentProps {
  tags: string[][];
  headers: string[];
}

// [TODO]: should extract the logic

const BookmarkContent = ({ tags, headers }: BookmarkContentProps) => {
  return (
    <ul className="flex flex-col gap-6">
      {(tags || []).map((tag, index) => {
        const [tagType, ...data] = tag;

        return (
          <li key={index} className="flex flex-col text-sm">
            <ul>
              {(data || []).map((value, index) => {
                if (index === 0) {
                  let encodedId = '';

                  if (tagType === 'e') {
                    encodedId = nip19.noteEncode(value);
                  } else if (tagType === 'p') {
                    encodedId = nip19.npubEncode(value);
                  } else if (tagType === 'a') {
                    const [kind, pubkey, identifier] = value.split(':');
                    encodedId = nip19.naddrEncode({
                      identifier,
                      kind: +kind,
                      pubkey,
                    });
                  }

                  const view =
                    tagType === 'a' || tagType === 'e' || tagType === 'p'
                      ? `nostr:${encodedId}`
                      : value;

                  return (
                    <li key={index}>
                      {tagType === 'text' &&
                      !view.startsWith('http' || 'www.') ? (
                        <>
                          <p className="text-neutral flex gap-2 break-all">
                            <StarIcon width={20} />
                            {view}
                          </p>
                        </>
                      ) : (
                        <>
                          <a
                            className="text-neutral flex gap-2 break-all"
                            href={view}
                          >
                            <StarIcon width={20} />
                            {view}
                          </a>
                        </>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={index} className="ml-7">
                    <p className="flex gap-2 break-all items-center">
                      {index > 2 && (
                        <span className="text-xs">{headers[index]}:</span>
                      )}
                      {value.startsWith('http' || 'www.') ? (
                        <>
                          <a href={value}>{value}</a>
                        </>
                      ) : (
                        <span>{value}</span>
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
};

export default memo(BookmarkContent);
