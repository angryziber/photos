import fs from 'node:fs'
import path from 'node:path'

export interface Album {
  id: string
  title: string
  date: string
  month: number
  year: number
  description: string
  fullDescription: string
  thumbnail: string
  photosUrl: string
  lat: number
  lng: number
}

const ALBUMS_DIR = path.resolve('albums')

function parseDate(dateStr: string) {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  let month = 0
  let year = 0

  const yearMatch = dateStr.match(/\b(20|19)\d{2}\b/)
  if (yearMatch) {
    year = parseInt(yearMatch[0])
  }

  for (let i = 0; i < 12; i++) {
    if (dateStr.includes(shortMonths[i])) {
      month = i + 1
      break
    }
  }

  return {month, year}
}

export function loadAlbums(): Album[] {
  const files = fs.readdirSync(ALBUMS_DIR)
  const mdFiles = files.filter((f: string) => f.endsWith('.md'))

  return mdFiles.map((filename: string) => {
    const id = filename.replace('.md', '')
    const content = fs.readFileSync(path.join(ALBUMS_DIR, filename), 'utf-8')
    const lines = content.split('\n')

    let title = ''
    let date = ''
    let photosUrl = ''
    let lat: number | undefined
    let lng: number | undefined
    const descriptionLines: string[] = []
    const bodyLines: string[] = []

    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.slice(2).trim()
        bodyLines.push(line)
      } else if (line.startsWith('## ')) {
        date = line.slice(3).trim()
        bodyLines.push(line)
      } else if (line.startsWith('.coords ')) {
        const parts = line.slice(8).trim().split(' ')
        if (parts.length >= 2) {
          lat = parseFloat(parts[0])
          lng = parseFloat(parts[1])
        }
      } else if (line.includes('goo.gl') || line.includes('photos.app.goo.gl')) {
        photosUrl = line.trim()
      } else {
        if (line.trim() && !line.startsWith('.')) {
          const trimmed = line.trim()
          if (!trimmed.includes('goo.gl') && !trimmed.includes('photos.app.goo.gl') && !trimmed.startsWith('http')) {
            descriptionLines.push(trimmed)
          }
        }
        bodyLines.push(line)
      }
    }

    const {month, year} = parseDate(date)

    return {
      id,
      title: title || id,
      date, month, year,
      description: descriptionLines.join(' '),
      fullDescription: bodyLines.join('\n').trim(),
      thumbnail: `albums/${id}.jpg`,
      photosUrl,
      lat, lng
    }
  })
}
