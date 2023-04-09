'use client';

import { memo, useEffect } from 'react';

import { BookmarkCard, Spinner } from '@/components';

import useStore from '@/store';

const Category = ({ params }: { params: { name: string } }) => {
  const { clearFeed, data, fetchFeed, isFetching } = useStore(
    (state) => state.feed
  );

  useEffect(() => {
    if (!params.name) {
      return;
    }

    fetchFeed({ categories: [decodeURI(params.name)] });

    return () => clearFeed();
  }, [params.name, fetchFeed, clearFeed]);

  if (!data || !data.bookmarks) {
    if (isFetching) {
      return <Spinner />;
    }

    return <>Category Not Found</>;
  }

  return (
    <>
      {data.bookmarks.map((bookmark, index) => (
        <BookmarkCard key={index} data={bookmark} />
      ))}
    </>
  );
};

export default memo(Category);
