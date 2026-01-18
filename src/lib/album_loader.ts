import fs from 'fs'
import path from 'path'

export interface Album {
  id: string
  title: string
  date: string
  description: string
  thumbnail: string
  photosUrl: string
  lat?: number
  lon?: number
}

const ALBUMS_DIR = path.resolve('albums')

export function loadAlbums(): Album[] {
  const files = fs.readdirSync(ALBUMS_DIR)
  const mdFiles = files.filter(f => f.endsWith('.md'))

  return mdFiles.map(filename => {
    const id = filename.replace('.md', '')
    const content = fs.readFileSync(path.join(ALBUMS_DIR, filename), 'utf-8')
    const lines = content.split('\n')

    let title = ''
    let date = ''
    let photosUrl = ''
    let lat: number | undefined
    let lon: number | undefined
    const descriptionLines: string[] = []

    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.slice(2).trim()
      } else if (line.startsWith('## ')) {
        date = line.slice(3).trim()
      } else if (line.startsWith('.coords ')) {
        const parts = line.slice(8).trim().split(' ')
        if (parts.length >= 2) {
          lat = parseFloat(parts[0])
          lon = parseFloat(parts[1])
        }
      } else if (line.startsWith('https://photos.app.goo.gl/')) {
        photosUrl = line.trim()
      } else if (line.trim() && !line.startsWith('.') && !line.startsWith('#')) {
        descriptionLines.push(line.trim())
      }
    }

    return {
      id,
      title: title || id,
      date,
      description: descriptionLines.join(' '),
      thumbnail: `/albums/${id}.png`,
      photosUrl,
      lat,
      lon
    }
  })
}
