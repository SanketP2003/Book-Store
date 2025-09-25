export const formatCurrency = (value: number | string | null | undefined) => {
  if (value == null) return '-'
  const n = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(n)) return '-'
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
}

export const formatDate = (value: string) => new Date(value).toLocaleString()

export const imageUrl = (path: string) => {
  if (!path) return ''
  const base = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080'
  // if already absolute URL
  if (/^https?:\/\//i.test(path)) return path
  return `${base}/api/files/${path}`
}

