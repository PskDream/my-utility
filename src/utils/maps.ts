export function googleMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function wikimediaFilePath(fileName: string, width = 640): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`
}

export function wikimediaFilePageUrl(fileName: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`
}
