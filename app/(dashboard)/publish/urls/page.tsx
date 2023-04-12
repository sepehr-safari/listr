'use client';

import { memo, useCallback, useRef, useState } from 'react';
import { nip19 } from 'nostr-tools';
import { useRouter } from 'next/navigation';

import { usePublish } from '@/hooks';

interface UrlSchema {
  address: string;
  label: string;
  desc: string;
}

const initialUrl = { address: '', label: '', desc: '' };

// [TODO]: should extract the logic

const Urls = () => {
  const router = useRouter();
  const [urlList, setUrlList] = useState<UrlSchema[]>([initialUrl]);
  const catRef = useRef<HTMLInputElement>(null);

  const publish = usePublish();

  const handlePublish = useCallback(() => {
    if (!catRef.current?.value) return;

    const filteredUrlList = urlList.filter((url, index, self) => {
      if (url?.address === '') return false;

      if (self.findIndex((u) => u.address === url.address) !== index) {
        return false;
      }

      return true;
    });

    if (!filteredUrlList.length) return;

    let tags = [
      ['d', catRef.current.value],
      ['type', 'urls'],
    ];

    filteredUrlList.forEach((url) => {
      if (!url?.address.startsWith('http')) return;

      tags.push(['u', url.address, url.label, url.desc]);
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
  }, [publish, urlList, catRef.current]);

  const handleInputAddressChange = useCallback(
    (index: number, value: string) => {
      setUrlList((prevUrlList) => {
        const newUrlList = [...prevUrlList];
        newUrlList[index] = {
          address: value,
          label: newUrlList[index]?.label || '',
          desc: newUrlList[index]?.desc || '',
        };

        if (index === prevUrlList.length - 1) {
          newUrlList.push(initialUrl);
        }

        return newUrlList;
      });
    },
    []
  );
  const handleInputLabelChange = useCallback((index: number, value: string) => {
    setUrlList((prevUrlList) => {
      const newUrlList = [...prevUrlList];
      newUrlList[index] = {
        label: value,
        address: newUrlList[index]?.address || '',
        desc: newUrlList[index]?.desc || '',
      };

      if (index === prevUrlList.length - 1) {
        newUrlList.push(initialUrl);
      }

      return newUrlList;
    });
  }, []);
  const handleInputDescriptionChange = useCallback(
    (index: number, value: string) => {
      setUrlList((prevUrlList) => {
        const newUrlList = [...prevUrlList];
        newUrlList[index] = {
          desc: value,
          address: newUrlList[index]?.address || '',
          label: newUrlList[index]?.label || '',
        };

        if (index === prevUrlList.length - 1) {
          newUrlList.push(initialUrl);
        }

        return newUrlList;
      });
    },
    []
  );

  return (
    <>
      <div className="flex flex-col gap-2 mb-2">
        <span className="text-sm">
          {`Enter a category name for your list:`}
        </span>
        <input
          type="text"
          placeholder="Category Name (e.g. Awesome Nostr Clients)"
          className="input input-bordered input-primary input-sm"
          ref={catRef}
        />
      </div>

      <hr className="opacity-30" />

      <div className="flex flex-col gap-2">
        <span className="text-sm">
          {`Enter URLs: (must start with http or https)`}
        </span>

        {urlList &&
          urlList.map((url, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <span className="text-sm pt-2">{`${index + 1}.`}</span>

                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Url (e.g. https://www.nostribe.com/)"
                    className="input input-bordered input-info input-sm flex-1"
                    onChange={(e) =>
                      handleInputAddressChange(index, e.target.value)
                    }
                    value={url?.address}
                  />

                  <div className="flex flex-col gap-2 md:flex-row">
                    <input
                      type="text"
                      placeholder="Optional: Label (e.g. Nostribe)"
                      className="input input-bordered input-primary input-sm flex-1"
                      onChange={(e) =>
                        handleInputLabelChange(index, e.target.value)
                      }
                      value={url?.label}
                    />
                    <input
                      type="text"
                      placeholder="Optional: Description (e.g. Nostribe is a decentralized social network)"
                      className="input input-bordered input-primary input-sm flex-1"
                      onChange={(e) =>
                        handleInputDescriptionChange(index, e.target.value)
                      }
                      value={url?.desc}
                    />
                  </div>
                </div>
              </div>
            </div>
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

export default memo(Urls);
