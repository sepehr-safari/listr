import { getPublicKey, generatePrivateKey } from 'nostr-tools';

const generateKeys = () => {
  const privateKey = generatePrivateKey();
  const publicKey = getPublicKey(privateKey);

  return { privateKey, publicKey };
};

export default generateKeys;
