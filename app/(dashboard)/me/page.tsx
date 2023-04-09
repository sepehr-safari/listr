'use client';

import { memo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  BookmarkCard,
  CardContainer,
  ProfileCard,
  Spinner,
} from '@/components';

import useStore from '@/store';

import { usePublish } from '@/hooks';

const Me = () => {
  const router = useRouter();
  const publish = usePublish();
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

  const handleRandomString = useCallback(() => {
    return Math.random().toString(36).substring(2, 15);
  }, []);

  const handleRandomNumber = useCallback(() => {
    return Math.floor(Math.random() * 20);
  }, []);

  const handleNewItem = useCallback(() => {
    const items = Array.from({ length: handleRandomNumber() }, () => ({
      title: handleRandomString(),
      url: `https://${handleRandomString()}.com`,
    }));

    const tags = items.map((item) => ['json', JSON.stringify(item)]);

    publish({
      kind: 37777,
      tags: [['d', handleRandomString()], ...tags],
      onSuccess: () => console.log('successful publish'),
    });
  }, [publish, handleRandomNumber, handleRandomString]);

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

      <CardContainer>
        <button className="btn-sm btn" onClick={handleNewItem}>
          Publish a random list
        </button>
      </CardContainer>

      {data.bookmarks?.map((bookmark, index) => (
        <BookmarkCard key={index} data={bookmark} />
      ))}
    </>
  );
};

export default memo(Me);
