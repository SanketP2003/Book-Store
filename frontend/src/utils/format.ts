export const formatCurrency = (value: number | string | null | undefined) => {
  if (value == null) return '-'
  const n = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(n)) return '-'
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
}

export const formatDate = (value: string) => new Date(value).toLocaleString()

export const imageUrl = (path: string) => {
  if (!path) return ''
  const base = (import.meta as any).env.VITE_API_URL || 'https://book-store-backend-8880.onrender.com'
  // If already absolute URL
  if (/^https?:\/\//i.test(path)) {
    try {
      const url = new URL(path)
      // If it already points to our current base, just return it
      if (url.origin === base) return path
      // If it's a legacy localhost URL (or any other origin) but path matches /api/files/<filename>, rebuild with current base
      const match = url.pathname.match(/\/api\/files\/(.+)$/)
      if (match) {
        return `${base}/api/files/${match[1]}`
      }
      return path
    } catch {
      return path
    }
  }
  // Otherwise treat as filename
  return `${base}/api/files/${path.replace(/^\/+/, '')}`
}
