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

                  try {
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
                  } catch (_) {}

                  const view =
                    tagType === 'a' || tagType === 'e' || tagType === 'p'
                      ? `nostr:${encodedId}`
                      : value;

                  return (
                    <li key={index}>
                      <p className="text-neutral flex gap-2">
                        {tagType === 'text' &&
                        !view.startsWith('http' || 'www.') ? (
                          <>
                            <StarIcon width={20} />
                            <span className="break-all">{view}</span>
                          </>
                        ) : (
                          <>
                            <a className="flex gap-2" href={view}>
                              <StarIcon width={20} />
                              <span className="break-all">{view}</span>
                            </a>
                          </>
                        )}
                      </p>
                    </li>
                  );
                }

                return (
                  <li key={index} className="ml-7">
                    <p className="flex gap-2 items-center">
                      {value.startsWith('http' || 'www.') ? (
                        <>
                          <a className="flex gap-2" href={value}>
                            {index > 2 && <span>{headers[index]}:</span>}

                            <span className="break-all">{value}</span>
                          </a>
                        </>
                      ) : (
                        <>
                          {index > 2 && <span>{headers[index]}:</span>}

                          <span className="break-all">{value}</span>
                        </>
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
