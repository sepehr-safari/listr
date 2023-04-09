import { Event } from 'nostr-tools';

export interface BookmarkData {
  event: Event;
  metadata?: Event;
  reactions?: Event[];
  mentions?: Event[];
}

export interface AuthorData {
  event?: Event;
  contacts?: Event[];
}

export interface IAuthor {
  id: string;
  picture: string;
  name: string;
  display_name: string;
  nip05: string;
  about: string;
  banner: string;
  lud06: string;
  website: string;
  following: string[];
}
