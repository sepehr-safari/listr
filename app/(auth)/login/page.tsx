'use client';

import { useRouter } from 'next/navigation';
import { generatePrivateKey } from 'nostr-tools';
import { useCallback, useEffect, useState } from 'react';

import { CardContainer, Spinner } from '@/components';

import useStore from '@/store';

import { usePublish } from '@/hooks';

const Login = () => {
  const router = useRouter();

  const { data } = useStore((state) => state.auth.user);
  const login = useStore((state) => state.auth.login);
  const publish = usePublish();

  const [privateKey, setPrivateKey] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      router.replace('/');
    }
  }, [data, router]);

  const handlePrivateKeyInput = useCallback((event: any) => {
    setPrivateKey(event.target.value);
  }, []);

  const handleDisplayNameInput = useCallback((event: any) => {
    setDisplayName(event.target.value);
  }, []);

  const handleGenerateButton = useCallback(() => {
    const privateKey = generatePrivateKey();

    setIsNewUser(true);
    setPrivateKey(privateKey);
  }, []);

  const handleLogin = useCallback(() => {
    if (!privateKey) return;

    setIsLoading(true);

    if (!isNewUser) {
      login(privateKey);

      return;
    }

    if (!publish) return;

    publish({
      kind: 0,
      privateKey,
      onSuccess: () => login(privateKey),
    });
  }, [login, privateKey, isNewUser, publish]);

  return (
    <>
      <CardContainer>
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl md:text-4xl font-bold">Listr</h1>
          <h2 className="text-xs">A Nostr Web Client for Making Lists</h2>
        </div>
      </CardContainer>

      <CardContainer>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Login with your private key:</span>
          </label>
          <input
            type="text"
            placeholder="private key"
            className="input-bordered input input-primary w-full input-sm md:input md:input-primary"
            value={privateKey}
            onChange={handlePrivateKeyInput}
          />
          {isNewUser && (
            <>
              <label className="label mt-4">
                <span className="label-text">
                  What do you want to be called on Nostr?
                </span>
              </label>
              <input
                type="text"
                placeholder="display name"
                className="input-bordered input input-primary w-full input-sm md:input md:input-primary"
                value={displayName}
                onChange={handleDisplayNameInput}
              />

              <p className="mt-6 mb-2 text-warning">
                <strong>Warning:</strong> Do not share your private key with
                anyone. It is important that you keep it safe. It is the only
                way to access your account. If you lose it, you will lose access
                to your account.
              </p>
            </>
          )}
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <button className="btn btn-sm mt-2 md:btn" onClick={handleLogin}>
            Login
          </button>
        )}
      </CardContainer>

      {!isNewUser && (
        <CardContainer>
          <p className="mb-2 text-center">Don't you have a private key?</p>

          <button className="btn btn-sm" onClick={handleGenerateButton}>
            Generate new private key
          </button>
        </CardContainer>
      )}
    </>
  );
};

export default Login;
