import type { Pagination } from './pagination'
import type { Playlist } from './playlist'

export interface SearchResponse {
  playlists: Pagination<Playlist | null> // Idk why there are nulls
}
