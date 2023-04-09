import { Event, Filter, Pub, SimplePool, Sub } from 'nostr-tools';
import { StateCreator } from 'zustand';

export interface PoolSlice {
  pool: {
    sub: (filters: Filter[]) => Sub;
    list: (filters: Filter[]) => Promise<Event[]>;
    publish: (event: Event) => Pub;
  };
  relays: string[];
}

const _pool = new SimplePool();

const createPoolSlice: StateCreator<PoolSlice> = (_, get) => ({
  pool: {
    sub: (filters: Filter[]) => _pool.sub(get().relays, filters),
    list: (filters: Filter[]) => _pool.list(get().relays, filters),
    publish: (event: Event) => _pool.publish(get().relays, event),
  },
  relays: ['wss://relay.damus.io'],
});

export default createPoolSlice;
