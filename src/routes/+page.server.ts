import {loadAlbums} from '$lib/album_loader'
import type {PageServerLoad} from './$types'

export const prerender = true

export const load: PageServerLoad = async () => {
  const albums = loadAlbums()
  return {
    albums: albums.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year
      return b.month - a.month
    })
  }
}
