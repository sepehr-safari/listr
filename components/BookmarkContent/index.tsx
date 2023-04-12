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
          const [_, data, label, desc, relays] = tag;
          const encodedNoteId = nip19.noteEncode(data);

          return (
            <li key={index} className="flex flex-col text-xs">
              <a
                className="text-neutral flex gap-2 text-sm break-all"
                href={`nostr:${encodedNoteId}`}
              >
                <StarIcon width={20} />
                {`nostr:${encodedNoteId}`}
              </a>
              <p>{label}</p>
              <p>{desc}</p>
              <p>{relays}</p>
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
          const [_, data, label, desc, relays] = tag;
          const encodedProfileId = nip19.npubEncode(data);

          return (
            <li key={index}>
              <a
                className="text-neutral flex gap-2 text-sm break-all"
                href={`nostr:${encodedProfileId}`}
              >
                <StarIcon width={20} />
                {`nostr:${encodedProfileId}`}
              </a>
              <p>{label}</p>
              <p>{desc}</p>
              <p>{relays}</p>
            </li>
          );
        })}
      </ul>
    );
  }

  if (bookmarkType === 'articles') {
    const articleTagList = tags.filter((tag) => tag[0] === 'a');

    return (
      <ul className="flex flex-col gap-6">
        {articleTagList.map((tag, index) => {
          const [_, data, label, desc, relays] = tag;
          const [kind, pubkey, identifier] = data.split(':');
          const encodedArticleId = nip19.naddrEncode({
            identifier,
            kind: +kind,
            pubkey,
          });

          return (
            <li key={index}>
              <a
                className="text-neutral flex gap-2 text-xs break-all"
                href={`nostr:${encodedArticleId}`}
              >
                <StarIcon width={20} />
                {`nostr:${encodedArticleId}`}
              </a>
              <p>{label}</p>
              <p>{desc}</p>
              <p>{relays}</p>
            </li>
          );
        })}
      </ul>
    );
  }

  if (bookmarkType === 'urls') {
    const articleTagList = tags.filter((tag) => tag[0] === 'u');

    return (
      <ul className="flex flex-col gap-6">
        {articleTagList.map((tag, index) => {
          const [_, data, label, desc, relays] = tag;

          return (
            <li key={index} className="text-sm">
              <a className="text-neutral flex gap-2 break-all" href={data}>
                <StarIcon width={20} />
                {data}
              </a>
              <p className="ml-7">{label}</p>
              <p className="ml-7">{desc}</p>
              <p>{relays}</p>
            </li>
          );
        })}
      </ul>
    );
  }

  return <></>;
};

export default memo(BookmarkContent);
