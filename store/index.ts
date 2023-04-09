import { create } from 'zustand';

import createAuthSlice, { AuthSlice } from './AuthSlice';
import createFeedSlice, { FeedSlice } from './FeedSlice';
import createPoolSlice, { PoolSlice } from './PoolSlice';

const useStore = create<AuthSlice & FeedSlice & PoolSlice>()((...a) => ({
  ...createAuthSlice(...a),
  ...createFeedSlice(...a),
  ...createPoolSlice(...a),
}));

export default useStore;
