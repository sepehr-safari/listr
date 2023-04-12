'use client';

import { memo, useCallback, useRef, useState } from 'react';
import { nip19 } from 'nostr-tools';
import { useRouter } from 'next/navigation';

import { usePublish } from '@/hooks';

// [TODO]: should extract the logic

const Profiles = () => {
  const router = useRouter();
  const [profileId, setProfileIdList] = useState<string[]>(['']);
  const catRef = useRef<HTMLInputElement>(null);

  const publish = usePublish();

  const handlePublish = useCallback(() => {
    if (!catRef.current?.value) return;

    const filteredProfileIdList = [...new Set(profileId)].filter(
      (profileId) => profileId !== ''
    );

    if (!filteredProfileIdList.length) return;

    let tags = [
      ['d', catRef.current.value],
      ['type', 'profiles'],
    ];

    filteredProfileIdList.forEach((profileId) => {
      const profileIdType = profileId.startsWith('npub')
        ? 'nip19'
        : profileId.length === 64
        ? 'hex'
        : 'unknown';

      if (profileIdType === 'unknown') {
        return;
      }

      if (profileIdType === 'hex') {
        tags.push(['p', profileId]);
      }

      if (profileIdType === 'nip19') {
        try {
          const decodedProfileId = nip19.decode(profileId).data.toString();

          tags.push(['p', decodedProfileId]);
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
  }, [publish, profileId, catRef.current]);

  const handleInputChange = useCallback((index: number, value: string) => {
    setProfileIdList((prevProfileIdList) => {
      const newProfileIdList = [...prevProfileIdList];
      newProfileIdList[index] = value;

      if (index === prevProfileIdList.length - 1) {
        newProfileIdList.push('');
      }

      return newProfileIdList;
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
          placeholder="Category Name (e.g. Exciting Nostr Profiles)"
          className="input input-bordered input-primary input-sm"
          ref={catRef}
        />
      </div>

      <div className="form-control gap-2">
        <label className="label py-0">
          <span className="label-text">
            {`Enter profile ids in NIP-19 format or hex:`}
          </span>
        </label>
        {profileId &&
          profileId.map((profileId, index) => (
            <input
              key={index}
              type="text"
              placeholder="Profile id (e.g. npub18c556t7n8xa3df2q82rwxejfglw5przds7sqvefylzjh8tjne28qld0we7)"
              className="input input-bordered input-primary input-sm"
              onChange={(e) => handleInputChange(index, e.target.value)}
              value={profileId}
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

export default memo(Profiles);
