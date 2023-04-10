import { Event, Filter, Pub, SimplePool, Sub } from 'nostr-tools';
import { StateCreator } from 'zustand';

export interface PoolSlice {
  pool: {
    relays: string[];
    sub: (filters: Filter[]) => Sub;
    list: (filters: Filter[]) => Promise<Event[]>;
    publish: (event: Event) => Pub;
  };
}

const _pool = new SimplePool();

const createPoolSlice: StateCreator<PoolSlice> = (_, get) => ({
  pool: {
    relays: ['wss://relay.damus.io'],
    sub: (filters: Filter[]) => _pool.sub(get().pool.relays, filters),
    list: (filters: Filter[]) => _pool.list(get().pool.relays, filters),
    publish: (event: Event) => _pool.publish(get().pool.relays, event),
  },
});

export default createPoolSlice;
