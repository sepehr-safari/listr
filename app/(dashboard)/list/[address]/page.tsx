'use client';

import { nip19 } from 'nostr-tools';
import { memo, useEffect } from 'react';

import { BookmarkCard, Spinner } from '@/components';

import useStore from '@/store';

const List = ({ params }: { params: { address: string } }) => {
  const { clearFeed, data, fetchFeed, isFetching } = useStore(
    (state) => state.feed
  );

  useEffect(() => {
    if (!params.address) {
      return;
    }

    if (params.address.startsWith('naddr1')) {
      // @ts-ignore
      const id = nip19.decode(params.address).data.identifier;

      fetchFeed({ id: id });
    } else {
      fetchFeed({ id: params.address });
    }

    return () => clearFeed();
  }, [params.address, fetchFeed, clearFeed]);

  if (!data || !data.bookmarks) {
    if (isFetching) {
      return <Spinner />;
    }

    return <>List Not Found</>;
  }

  return (
    <>
      {data.bookmarks.map((bookmark, index) => (
        <BookmarkCard key={index} data={bookmark} />
      ))}
    </>
  );
};

export default memo(List);
