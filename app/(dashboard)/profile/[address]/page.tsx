'use client';

import { memo, useEffect } from 'react';

import { BookmarkCard, ProfileCard, Spinner } from '@/components';

import { getProfileHex } from '@/utils';

import useStore from '@/store';

const Profile = ({ params }: { params: { address: string } }) => {
  const { clearFeed, data, fetchFeed, isFetching } = useStore(
    (state) => state.feed
  );

  useEffect(() => {
    getProfileHex(params.address).then((profileHex) =>
      fetchFeed({ author: profileHex })
    );

    return () => {
      clearFeed();

      document.title = `Listr`;
    };
  }, [params.address, clearFeed, fetchFeed]);

  if (!data || !data.author) {
    if (isFetching) {
      return <Spinner />;
    }

    return <>Profile Not Found!</>;
  }

  const content = data.author.event?.content || '{}';
  const { display_name, name } = JSON.parse(content);
  const displayName = display_name || name;

  document.title = `${displayName} | Listr`;

  return (
    <>
      <ProfileCard data={data.author} />

      {data.bookmarks?.map((bookmark, index) => (
        <BookmarkCard key={index} data={bookmark} />
      ))}
    </>
  );
};

export default memo(Profile);
