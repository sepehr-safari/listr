import { getPublicKey } from 'nostr-tools';
import { StateCreator } from 'zustand';

export interface AuthSlice {
  auth: {
    user: {
      data: { publicKey: string; privateKey: string } | null;
    };
    login: (privateKey: string) => void;
    logout: () => void;
  };
}

const getLocalStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const user = window.localStorage.getItem('user');

  if (user) {
    return JSON.parse(user);
  }

  return null;
};

const setLocalStorage = (user: any) => {
  if (typeof window === 'undefined') {
    return null;
  }

  window.localStorage.setItem('user', JSON.stringify(user));
};

const clearLocalStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  window.localStorage.removeItem('user');
};

const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  auth: {
    user: {
      data: getLocalStorage(),
    },
    login: (privateKey: string) => {
      const publicKey = getPublicKey(privateKey);

      setLocalStorage({ publicKey, privateKey });

      set((state) => ({
        auth: { ...state.auth, user: { data: { publicKey, privateKey } } },
      }));
    },
    logout: () => {
      clearLocalStorage();

      set((state) => ({ auth: { ...state.auth, user: { data: null } } }));
    },
  },
});

export default createAuthSlice;
