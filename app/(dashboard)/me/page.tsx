'use client';

import { memo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { BookmarkCard, ProfileCard, Spinner } from '@/components';

import useStore from '@/store';

const Me = () => {
  const router = useRouter();
  const userData = useStore((state) => state.auth.user.data);
  const { clearFeed, data, fetchFeed, isFetching } = useStore(
    (state) => state.feed
  );

  useEffect(() => {
    if (!userData || !userData.privateKey) {
      router.replace('/login');
    }

    if (userData) fetchFeed({ author: userData.publicKey });

    return () => {
      clearFeed();

      document.title = `Listr`;
    };
  }, [router, userData, clearFeed, fetchFeed]);

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

      {isFetching ? (
        <Spinner />
      ) : (
        data.bookmarks?.map((bookmark, index) => (
          <BookmarkCard key={index} data={bookmark} />
        ))
      )}
    </>
  );
};

export default memo(Me);
