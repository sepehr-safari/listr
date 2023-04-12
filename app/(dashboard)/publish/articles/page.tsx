'use client';

import { memo, useCallback, useRef, useState } from 'react';
import { nip19 } from 'nostr-tools';
import { useRouter } from 'next/navigation';

import { usePublish } from '@/hooks';

// [TODO]: should extract the logic

const Articles = () => {
  const router = useRouter();
  const [articleIdList, setArticleIdList] = useState<string[]>(['']);
  const catRef = useRef<HTMLInputElement>(null);

  const publish = usePublish();

  const handlePublish = useCallback(() => {
    if (!catRef.current?.value) return;

    const filteredArticleIdList = [...new Set(articleIdList)].filter(
      (articleId) => articleId !== ''
    );

    if (!filteredArticleIdList.length) return;

    let tags = [
      ['d', catRef.current.value],
      ['type', 'articles'],
    ];

    filteredArticleIdList.forEach((articleId) => {
      const articleIdType = articleId.startsWith('naddr')
        ? 'nip19'
        : articleId.length === 64
        ? 'hex'
        : 'unknown';

      if (articleIdType === 'unknown' || articleIdType === 'hex') {
        return;
      }

      if (articleIdType === 'nip19') {
        try {
          const { data } = nip19.decode(articleId);
          // @ts-ignore
          const { identifier, pubkey, kind, relays } = data;

          tags.push([
            'a',
            `${kind}:${pubkey}:${identifier}`,
            'label',
            'desc',
            relays,
          ]);
        } catch (_) {
          return;
        }
      }
    });

    publish({
      kind: 33777,
      tags,
      onSuccess: (event) => {
        const naddr = nip19.naddrEncode({
          identifier: event.id,
          pubkey: event.pubkey,
          kind: event.kind,
        });

        router.push(`/list/${naddr}`);
      },
    });
  }, [publish, articleIdList, catRef.current]);

  const handleInputChange = useCallback((index: number, value: string) => {
    setArticleIdList((prevArticleIdList) => {
      const newArticleIdList = [...prevArticleIdList];
      newArticleIdList[index] = value;

      if (index === prevArticleIdList.length - 1) {
        newArticleIdList.push('');
      }

      return newArticleIdList;
    });
  }, []);

  return (
    <>
      <div className="form-control mb-2">
        <label className="label">
          <span className="label-text">
            {`Enter a category name for your list:`}
          </span>
        </label>
        <input
          type="text"
          placeholder="Category Name (e.g. Exciting Nostr Articles)"
          className="input input-bordered input-primary input-sm"
          ref={catRef}
        />
      </div>

      <div className="form-control gap-2">
        <label className="label py-0">
          <span className="label-text">
            {`Enter article ids in NIP-19 format:`}
          </span>
        </label>
        {articleIdList &&
          articleIdList.map((articleId, index) => (
            <input
              key={index}
              type="text"
              placeholder="Article id (e.g. naddr1qpqxzcfev5mkvetzxfjxycmpvdsk2ephvejxzcfsvsmkgcty8pjryvt9x93rwcm9vycr2wphve3nyvrxx8mnxvn9x93ngwf3vvuxgdf4x5pzqfmwhtuc7yx9jkmk5sq4axzxmsaylx4c8j2dqycpgce79vmt67mzqvzqqqynjysvfn8x)"
              className="input input-bordered input-primary input-sm"
              onChange={(e) => handleInputChange(index, e.target.value)}
              value={articleId}
            />
          ))}
      </div>

      <button
        className="btn btn-sm"
        onClick={() => {
          handlePublish();
        }}
      >
        Publish
      </button>
    </>
  );
};

export default memo(Articles);
