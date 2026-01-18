import {loadAlbums} from '$lib/album_loader'
import type {PageServerLoad} from '../../.svelte-kit/types/src/routes'

export const load: PageServerLoad = async () => {
  const albums = loadAlbums()
  return {
    albums: albums.sort((a, b) => b.date.localeCompare(a.date))
  }
}
