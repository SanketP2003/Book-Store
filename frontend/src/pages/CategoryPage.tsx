import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { booksApi } from '@/services/api'
import Loader from '@/components/Loader'
import Alert from '@/components/Alert'
import BookCard from '@/components/BookCard'
import Pagination from '@/components/Pagination'

export default function CategoryPage() {
  const { category = '' } = useParams()
  const [page, setPage] = useState(0)
  const size = 12
  const { data, isLoading, isError } = useQuery({
    queryKey: ['booksByCat', { category, page, size }],
    queryFn: () => booksApi.byCategory(category!, page, size).then(r => r.data),
  })

  if (isLoading) return <Loader />
  if (isError) return <Alert message="Failed to load category books" />

  const items = data?.content ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Category: {decodeURIComponent(category)}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((b: any) => (<BookCard key={b.id} book={b} />))}
      </div>
      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  )
}
