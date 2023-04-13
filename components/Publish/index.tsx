'use client';

import { useCallback, useEffect, useState } from 'react';
import { nip19 } from 'nostr-tools';
import { useRouter } from 'next/navigation';

import { usePublish } from '@/hooks';

import { CardContainer, Spinner } from '@/components';
import useStore from '@/store';

const getTagType = (value: string) => {
  if (value.startsWith('http')) return 'u';
  if (value.startsWith('wss')) return 'r';
  if (value.startsWith('npub')) return 'p';
  if (value.startsWith('note')) return 'e';
  if (value.startsWith('naddr')) return 'a';
  return 'text';
};

const getTagCode = (value: string) => {
  const tagType = getTagType(value);

  switch (tagType) {
    case 'u':
    case 'r':
      return new URL(value).href.normalize();
    case 'e':
    case 'p':
      return nip19.decode(value).data.toString();
    case 'a':
      const { data } = nip19.decode(value);
      // @ts-ignore
      const { identifier, pubkey, kind } = data;

      return `${kind}:${pubkey}:${identifier}`;
    default:
      return value;
  }
};

const Publish = ({ address }: { address?: string }) => {
  const router = useRouter();
  const {
    clearFeed,
    data: feedData,
    fetchFeed,
    isFetching,
  } = useStore((state) => state.feed);
  const userData = useStore((state) => state.auth.user.data);
  const publish = usePublish();
  const [newHeaderValue, setNewHeaderValue] = useState('');
  const [headerList, setHeaderList] = useState([
    'Content',
    'Label',
    'Description',
  ]);
  const [dataList, setDataList] = useState([headerList.map(() => '')]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (!userData) {
      router.replace('/login');
    }

    if (address && address.startsWith('naddr1')) {
      // @ts-ignore
      const id = nip19.decode(address).data.identifier;

      fetchFeed({ id: id });
    } else {
      clearFeed();
    }

    return () => clearFeed();
  }, [userData, router, address]);

  useEffect(() => {
    if (!feedData || !feedData.bookmarks) return;

    const tags = feedData.bookmarks[0].event.tags;

    const dTag = tags.find((tag) => tag[0] === 'd');
    const headerTag = tags.find((tag) => tag[0] === 'headers');
    const rest = tags.filter((tag) => tag[0] !== 'd' && tag[0] !== 'headers');

    if (dTag) setCategory(dTag[1]);
    if (headerTag) setHeaderList(headerTag.slice(1));
    if (rest) setDataList(rest.map((item) => item.slice(1)));
  }, [feedData]);

  const handlePublish = useCallback(async () => {
    if (!category) return;

    if (dataList.length === 0) return;

    const initialTags = [
      ['d', category],
      ['headers', ...headerList],
    ];

    const tags = dataList.reduce((acc, data) => {
      if (!data || data.length === 0) return acc;

      const [value, ...rest] = data;

      if (value === '') return acc;

      const tagType = getTagType(value);
      const tagCode = getTagCode(value);

      return [...acc, [tagType, tagCode, ...rest]];
    }, initialTags);

    const event = await publish({ kind: 33777, tags });

    if (event) {
      const naddr = nip19.naddrEncode({
        identifier: event.id,
        pubkey: event.pubkey,
        kind: event.kind,
      });

      router.push(`/list/${naddr}`);
    }
  }, [publish, category, dataList, headerList, router, getTagCode, getTagType]);

  const handleInputChange = useCallback(
    (dataIndex: number, valueIndex: number, value: string) => {
      setDataList((prevDataList) => {
        const newDataList = [...prevDataList];
        newDataList[dataIndex][valueIndex] = value;
        if (dataIndex === newDataList.length - 1) {
          newDataList.push(headerList.map(() => ''));
        }

        return newDataList;
      });
    },
    [headerList]
  );

  const addHeader = useCallback(() => {
    if (newHeaderValue === '') return;

    if (headerList.includes(newHeaderValue)) return;

    setHeaderList((prevHeaderList) => [...prevHeaderList, newHeaderValue]);
    setDataList((prevDataList) => prevDataList.map((data) => [...data, '']));
    setNewHeaderValue('');
  }, [newHeaderValue]);

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <>
      <CardContainer>
        <div className="flex flex-col gap-2">
          <span className="text-sm">
            {`Enter a category name for your list:`}
          </span>
          <input
            type="text"
            placeholder="Category Name (e.g. Awesome Nostr Clients)"
            className="input input-bordered input-secondary input-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="collapse">
          <input type="checkbox" className="min-h-0" />
          <div className="collapse-title p-0 min-h-0 text-sm">
            {`Add a custom header to your list...`}
          </div>
          <div className="collapse-content px-2">
            <div className="flex gap-4 mt-2">
              <input
                type="text"
                placeholder="Header Name (e.g. Github Link)"
                className="input input-bordered input-secondary input-sm flex-1"
                onChange={(e) => setNewHeaderValue(e.target.value)}
                value={newHeaderValue}
              />
              <button className="btn btn-sm" onClick={addHeader}>
                Add
              </button>
            </div>
          </div>
        </div>
      </CardContainer>

      {dataList &&
        dataList.map((data, dataIndex) => (
          <CardContainer key={dataIndex}>
            <span className="text-sm pt-2">{`List item #${
              dataIndex + 1
            }:`}</span>

            <div className="flex flex-col gap-2 w-full">
              {data.map((value, valueIndex) => (
                <div className="flex items-center gap-2" key={valueIndex}>
                  <span className="text-sm md:w-1/6">
                    {`${headerList[valueIndex]}:`}
                  </span>

                  <input
                    type="text"
                    placeholder="Enter a value"
                    className="input input-bordered input-info input-sm ml-auto w-full md:w-5/6"
                    value={value}
                    onChange={(e) =>
                      handleInputChange(dataIndex, valueIndex, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            {dataIndex === 0 && (
              <div className="flex flex-col gap-2 text-xs text-warning">
                <p>{`Tip: Only Content field is required.`}</p>
                <p>
                  {`Tip: Content field can be in NIP-19 format (e.g. note..., npub..., naddr...), or a URL (e.g. https://www.nostribe.com), or just a plain text (e.g. The Godfather).`}
                </p>
                <p>
                  {`Tip: Other fields can be URLs (e.g. https://www.nostribe.com), or just plain texts (e.g. The Godfather).`}
                </p>
              </div>
            )}
          </CardContainer>
        ))}

      <CardContainer>
        <button className="btn btn-sm" onClick={handlePublish}>
          Publish
        </button>
      </CardContainer>
    </>
  );
};

export default Publish;
