'use client';

import Link from 'next/link';
import { nip19 } from 'nostr-tools';
import { memo, useCallback, useState } from 'react';

import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  ArrowPathIcon,
  BoltIcon,
  BookmarkIcon,
  ChatBubbleOvalLeftIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

import {
  Avatar,
  AvatarLoader,
  BookmarkContent,
  BoxLoader,
  CardContainer,
  Nip05View,
  Spinner,
} from '@/components';

import useStore from '@/store';

import { usePublish } from '@/hooks';

import { BookmarkData, IAuthor } from '@/types';

const BookmarkCard = ({ data }: { data: BookmarkData }) => {
  const selfPubkey = useStore((state) => state.auth.user.data?.publicKey);
  const isFetching = useStore((state) => state.feed.isFetching);
  const publish = usePublish();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [sliceStart, setSliceStart] = useState<number>(0);
  const [sliceEnd, setSliceEnd] = useState<number>(5);

  const { event, metadata, reactions = [] } = data;

  const [dTag, category] = event.tags.find((tag) => tag[0] === 'd')!;
  const [headersTag, ...headers] = event.tags.find(
    (tag) => tag[0] === 'headers'
  )!;
  const dataList = event.tags.filter(
    (tag) => tag[0] !== 'd' && tag[0] !== 'headers'
  )!;

  const handleDeleteBookmark = useCallback(
    async (id: string) => {
      setIsDeleting(true);
      const event = await publish({ kind: 5, tags: [['e', id]] });
      setIsDeleting(false);
      if (event) setIsDeleted(true);
    },
    [publish]
  );

  const handleNextPage = useCallback(() => {
    setSliceStart((prev) =>
      prev + 5 > dataList.length - 5 ? dataList.length - 5 : prev + 5
    );
    setSliceEnd((prev) =>
      prev + 5 > dataList.length ? dataList.length : prev + 5
    );
  }, [dataList.length]);

  const handlePrevPage = useCallback(() => {
    setSliceStart((prev) => (prev - 5 < 0 ? 0 : prev - 5));
    setSliceEnd((prev) => (prev - 5 < 5 ? 5 : prev - 5));
  }, []);

  const profileObject: IAuthor = JSON.parse(metadata?.content || '{}');

  const displayName = profileObject.display_name || profileObject.name;

  const createdAt = new Date(event.created_at * 1000);

  const npub = nip19.npubEncode(event.pubkey);
  const naddr = nip19.naddrEncode({
    identifier: event.id,
    pubkey: event.pubkey,
    kind: 37777,
  });

  if (isDeleted) return null;

  if (isDeleting) {
    return (
      <CardContainer>
        <Spinner />
      </CardContainer>
    );
  }

  if (!dTag || !category || !headersTag || !headers || !dataList)
    return <CardContainer>{`list data corrupted`}</CardContainer>;

  return (
    <>
      <CardContainer>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/profile/${npub}`} className="flex items-center gap-4">
              {profileObject && profileObject.picture ? (
                <Avatar
                  url={profileObject.picture || '/listr.png'}
                  width="w-14"
                />
              ) : isFetching ? (
                <AvatarLoader />
              ) : (
                <Avatar url="/listr.png" width="w-14" />
              )}

              <div className="flex flex-col">
                {profileObject && displayName ? (
                  <h4 className="font-bold leading-5">
                    {displayName.length > 25
                      ? displayName.slice(0, 10) +
                        '...' +
                        displayName.slice(-15)
                      : displayName}
                  </h4>
                ) : (
                  isFetching && <BoxLoader />
                )}

                {profileObject && profileObject.nip05 ? (
                  <Nip05View text={profileObject.nip05} />
                ) : (
                  isFetching && <BoxLoader />
                )}

                {createdAt && (
                  <div className="text-xs leading-5 opacity-50">
                    {createdAt.toLocaleString()}
                  </div>
                )}
              </div>
            </Link>

            <div className="ml-auto">
              <div className="dropdown-left dropdown">
                <label tabIndex={0} className="btn-ghost btn-circle btn m-1">
                  <EllipsisHorizontalIcon width={24} />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-36 bg-base-100 p-2 shadow-lg shadow-black"
                >
                  <li>
                    <button
                      className="text-start text-xs"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${location.origin}/list/${naddr}`
                        )
                      }
                    >
                      Copy Link
                    </button>
                  </li>
                  <li>
                    <Link className="text-xs" href={`/list/${naddr}`}>
                      Open List
                    </Link>
                  </li>
                  <li>
                    <Link className="text-xs" href={`/profile/${npub}`}>
                      Open Profile
                    </Link>
                  </li>
                  {event.pubkey === selfPubkey && (
                    <li>
                      <button
                        className="text-xs text-start"
                        onClick={() => handleDeleteBookmark(event.id)}
                      >
                        Delete List
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 break-words">
            <div className="flex justify-end gap-2">
              <Link
                href={encodeURI('/category/' + category)}
                className="btn btn-sm btn-outline text-neutral gap-2 md:btn md:btn-outline md:text-neutral"
              >
                <BookmarkIcon width={24} />
                {category}
              </Link>
            </div>

            <BookmarkContent
              tags={dataList.slice(sliceStart, sliceEnd)}
              headers={headers}
            />
          </div>

          <div className="flex">
            {sliceStart > 0 && (
              <button className="btn btn-ghost gap-2" onClick={handlePrevPage}>
                <ArrowLongLeftIcon width={24} />
                Previous Page
              </button>
            )}

            {sliceEnd < dataList.length && (
              <button
                className="btn btn-ghost gap-2 ml-auto"
                onClick={handleNextPage}
              >
                Next Page
                <ArrowLongRightIcon width={24} />
              </button>
            )}
          </div>
        </div>

        <hr className="-mx-4 mt-2 opacity-10" />

        <div className="-m-4 flex flex-wrap">
          <button className="btn-ghost rounded-bl-box btn w-1/4 content-center gap-2 rounded-t-none rounded-br-none py-7 px-2">
            <BoltIcon width={24} />

            {reactions.filter((event) => event.kind === 9735).length}
          </button>

          <button className="btn-ghost btn w-1/4 content-center gap-2 rounded-none py-7 px-2">
            <ChatBubbleOvalLeftIcon width={24} />

            {reactions.filter((event) => event.kind === 1).length}
          </button>

          <button className="btn-ghost btn w-1/4 content-center gap-2 rounded-none py-7 px-2">
            <HeartIcon width={24} />

            {reactions.filter((event) => event.kind === 7).length}
          </button>

          <button className="btn-ghost rounded-br-box btn w-1/4 content-center gap-2 rounded-t-none rounded-bl-none py-7 px-2">
            <ArrowPathIcon width={24} />

            {}
          </button>
        </div>
      </CardContainer>
    </>
  );
};

export default memo(BookmarkCard);
