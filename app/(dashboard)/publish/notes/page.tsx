'use client';

import { memo, useCallback, useRef, useState } from 'react';
import { nip19 } from 'nostr-tools';
import { useRouter } from 'next/navigation';

import { usePublish } from '@/hooks';

// [TODO]: should extract the logic

const Notes = () => {
  const router = useRouter();
  const [noteIdList, setNoteIdList] = useState<string[]>(['', '']);
  const catRef = useRef<HTMLInputElement>(null);

  const publish = usePublish();

  const handlePublish = useCallback(() => {
    if (!catRef.current?.value) return;

    const filteredNoteIdList = [...new Set(noteIdList)].filter(
      (noteId) => noteId !== ''
    );

    if (!filteredNoteIdList.length) return;

    let tags = [
      ['d', catRef.current.value],
      ['type', 'notes'],
    ];

    filteredNoteIdList.forEach((noteId) => {
      const noteIdType = noteId.startsWith('note')
        ? 'nip19'
        : noteId.length === 64
        ? 'hex'
        : 'unknown';

      if (noteIdType === 'unknown') {
        return;
      }

      if (noteIdType === 'hex') {
        tags.push(['e', noteId]);
      }

      if (noteIdType === 'nip19') {
        try {
          const decodedNoteId = nip19.decode(noteId).data.toString();

          tags.push(['e', decodedNoteId]);
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
  }, [publish, noteIdList, catRef.current]);

  const handleInputChange = useCallback((index: number, value: string) => {
    setNoteIdList((prevNoteIdList) => {
      const newNoteIdList = [...prevNoteIdList];
      newNoteIdList[index] = value;

      if (index === prevNoteIdList.length - 1) {
        newNoteIdList.push('');
      }

      return newNoteIdList;
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
          placeholder="Category Name (e.g. Exciting Nostr Posts)"
          className="input input-bordered input-primary input-sm"
          ref={catRef}
        />
      </div>

      <div className="form-control gap-2">
        <label className="label py-0">
          <span className="label-text">
            {`Enter note ids in NIP-19 format or hex:`}
          </span>
        </label>
        {noteIdList &&
          noteIdList.map((noteId, index) => (
            <input
              key={index}
              type="text"
              placeholder="Note id (e.g. note1p25xurrm993t38hfsej32gxjqa655v9pmehpozurqd5mq9h2g3cs07pl0w)"
              className="input input-bordered input-primary input-sm"
              onChange={(e) => handleInputChange(index, e.target.value)}
              value={noteId}
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

export default memo(Notes);
