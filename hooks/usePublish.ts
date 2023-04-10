import {
  Event,
  getEventHash,
  getPublicKey,
  signEvent,
  UnsignedEvent,
} from 'nostr-tools';

import useStore from '@/store';

interface Options {
  kind: number;
  tags?: string[][];
  content?: Record<string, string>;
  pubkey?: string;
  privateKey?: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}
const usePublish = () => {
  const userData = useStore((state) => state.auth.user.data);
  const publish = useStore((state) => state.pool.publish);

  return ({
    content,
    kind,
    tags,
    privateKey = userData?.privateKey,
    onFailure,
    onSuccess,
  }: Options) => {
    if (!privateKey) {
      throw new Error('No private key provided');
    }

    const unsignedEvent: UnsignedEvent = {
      pubkey: getPublicKey(privateKey),
      created_at: Math.floor(Date.now() / 1000),
      content: JSON.stringify(content) || '',
      tags: tags || [],
      kind,
    };

    const signedEvent: Event = {
      ...unsignedEvent,
      id: getEventHash(unsignedEvent),
      sig: signEvent(unsignedEvent, privateKey),
    };

    const pub = publish(signedEvent);

    pub.on('ok', () => {
      onSuccess && onSuccess();
    });

    pub.on('failed', () => {
      onFailure && onFailure();
    });
  };
};

export default usePublish;
