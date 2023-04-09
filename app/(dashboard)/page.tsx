'use client';

import { memo, useEffect } from 'react';

import { BookmarkCard, Spinner } from '@/components';

import useStore from '@/store';

const Feed = () => {
  // const userData = useStore((state) => state.auth.user.data);
  const { clearFeed, data, fetchFeed } = useStore((state) => state.feed);

  useEffect(() => {
    fetchFeed();

    return () => clearFeed();
  }, [fetchFeed, clearFeed]);

  if (!data || !data.bookmarks) {
    return <Spinner />;
  }

  return (
    <>
      {data.bookmarks.map((bookmark, index) => (
        <BookmarkCard key={index} data={bookmark} />
      ))}
    </>
  );
};

export default memo(Feed);
