import { Event, Filter, Sub } from 'nostr-tools';
import { StateCreator } from 'zustand';

import { AuthorData, BookmarkData } from '@/types';

import { PoolSlice } from './PoolSlice';

export interface FeedData {
  bookmarks?: BookmarkData[];
  author?: AuthorData;
}

type FetchFeed = (options?: {
  author?: string;
  id?: string;
  categories?: string[];
}) => void;

type ClearFeed = () => void;

export interface FeedSlice {
  feed: {
    data: FeedData | null;
    error: null | string;
    isFetching: boolean;
    fetchFeed: FetchFeed;
    clearFeed: ClearFeed;
  };
}

const FeedSlice: StateCreator<FeedSlice & PoolSlice, [], [], FeedSlice> = (
  set,
  get
) => {
  const clearFeed: ClearFeed = () => {
    set((state) => ({
      feed: {
        ...state.feed,
        data: null,
        error: null,
      },
    }));
  };

  const fetchFeed: FetchFeed = (options) => {
    // declaring handlers
    const handleIsFetching = (isFetching: boolean) => {
      set((state) => ({
        feed: { ...state.feed, isFetching },
      }));
    };

    const handleAuthorEvent = (e: Event) => {
      set((state) => ({
        feed: {
          ...state.feed,
          data: {
            ...state.feed.data,
            author: {
              ...state.feed.data?.author,
              event: e,
            },
          },
        },
      }));
    };

    const handleAuthorContact = (e: Event) => {
      set((state) => ({
        feed: {
          ...state.feed,
          data: {
            ...state.feed.data,
            author: {
              ...state.feed.data?.author,
              contacts: [...(state.feed.data?.author?.contacts || []), e],
            },
          },
        },
      }));
    };

    const handleNewBookmark = (e: Event) => {
      set((state) => ({
        feed: {
          ...state.feed,
          data: {
            ...state.feed.data,
            bookmarks: [
              ...(state.feed.data?.bookmarks || []),
              { event: e, metadata: state.feed.data?.author?.event },
            ],
          },
        },
      }));
    };

    const mutatebookmarks = (newBookmarkList: BookmarkData[]) => {
      set((state) => ({
        feed: {
          ...state.feed,
          data: {
            ...state.feed.data,
            bookmarks: newBookmarkList,
          },
        },
      }));
    };

    const handleSubscription = (
      filters: Filter[],
      eventHandler: (e: Event) => void
    ) => {
      return new Promise<void>((resolve) => {
        const eoseHandler = (subscription: Sub) => {
          subscription.unsub();

          resolve();
        };

        const subscription = get().pool.sub(filters);
        subscription.on('event', eventHandler);
        subscription.on('eose', () => eoseHandler(subscription));
      });
    };

    const handleMainFilters = (): Filter[] => {
      return !options
        ? [{ kinds: [37777], limit: 10 }]
        : options.author
        ? [
            { authors: [options.author], kinds: [0] },
            { authors: [options.author], kinds: [37777], limit: 20 },
          ]
        : options.id
        ? [{ ids: [options.id], kinds: [37777], limit: 10 }]
        : options.categories
        ? [{ '#d': options.categories, kinds: [37777], limit: 10 }]
        : [];
    };

    const handleMainEvent = (e: Event) => {
      if (e.kind === 0) {
        handleAuthorEvent(e);
      } else if (e.kind === 3) {
        handleAuthorContact(e);
        // @ts-ignore
      } else if (e.kind === 37777) {
        handleNewBookmark(e);
      }
    };

    const handleDuplicateBookmarkIds = () => {
      const uniqueBookmarkIds = [
        ...new Set(
          (get().feed.data?.bookmarks || []).map(
            (bookmark) => bookmark.event.id
          )
        ),
      ];

      return uniqueBookmarkIds;
    };

    const handleDuplicateBookmarkAuthors = () => {
      const uniqueBookmarkAuthors = [
        ...new Set(
          (get().feed.data?.bookmarks || []).map(
            (bookmark) => bookmark.event.pubkey
          )
        ),
      ];

      return uniqueBookmarkAuthors;
    };

    const handleExtraFilters = (): Filter[] => {
      const uniqueBookmarkIds = handleDuplicateBookmarkIds();
      const uniqueBookmarkAuthors = handleDuplicateBookmarkAuthors();

      return [
        {
          '#e': uniqueBookmarkIds,
          kinds: [1, 7, 9735],
        },
        {
          authors: uniqueBookmarkAuthors,
          kinds: [0],
        },
      ];
    };

    const handleExtraEvent = (e: Event) => {
      const eventType =
        e.kind === 1 || e.kind === 7 || e.kind === 9735
          ? 'reaction'
          : 'metadata';

      const currentBookmarkList = get().feed.data?.bookmarks || [];
      const newBookmarkList = currentBookmarkList.map<BookmarkData>(
        (bookmark) => {
          if (eventType === 'reaction') {
            const hasTag = e.tags.find(
              (tag) => tag[0] === 'e' && tag[1] === bookmark.event.id
            );

            if (hasTag) {
              return {
                ...bookmark,
                reactions: [...(bookmark.reactions || []), e],
              };
            }
          } else if (
            eventType === 'metadata' &&
            e.pubkey === bookmark.event.pubkey
          ) {
            const hasMetadata = bookmark.metadata;

            if (hasMetadata) return bookmark;

            return { ...bookmark, metadata: e };
          }

          return bookmark;
        }
      );

      mutatebookmarks(newBookmarkList);
    };

    const handleError = (error: any) => {
      set((state) => ({ ...state, feed: { ...state.feed, error } }));
    };

    // executaions
    handleIsFetching(true);
    clearFeed();
    handleSubscription(handleMainFilters(), handleMainEvent)
      .then(() => handleSubscription(handleExtraFilters(), handleExtraEvent))
      .finally(() => handleIsFetching(false));
  };

  const feedSlice: FeedSlice = {
    feed: {
      data: null,
      error: null,
      isFetching: true,
      fetchFeed,
      clearFeed,
    },
  };

  return feedSlice;
};

export default FeedSlice;
