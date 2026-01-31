import {loadAlbums} from '$lib/album_loader'
import {error} from '@sveltejs/kit'
import type {PageServerLoad, EntryGenerator} from './$types'

export const prerender = true

export const load: PageServerLoad = async ({params}) => {
  const albums = loadAlbums()
  const album = albums.find(a => a.id === params.id)
  
  if (!album) {
    throw error(404, 'Album not found')
  }

  return {album}
}

export const entries: EntryGenerator = async () => {
  const albums = loadAlbums()
  return albums.map(album => ({id: album.id}))
}
