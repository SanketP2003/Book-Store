import { useState, useEffect } from 'react';
import { bookService } from '../services';
import { BookDto, PageResponse } from '../types/api';

/**
 * Example BookList Component
 * Demonstrates how to use the API services in a React component
 */
const BookList = () => {
  // State for books data, loading status, and errors
  const [booksPage, setBooksPage] = useState<PageResponse<BookDto> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);

  // Fetch books when component mounts or pagination changes
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call the book service to get paginated books
        const data = await bookService.getAllBooks(currentPage, pageSize);
        setBooksPage(data);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Loading state
  if (loading && !booksPage) {
    return <div className="loading">Loading books...</div>;
  }

  // Error state
  if (error) {
    return <div className="error">{error}</div>;
  }

  // No books found
  if (!booksPage || booksPage.content.length === 0) {
    return <div className="no-books">No books found.</div>;
  }

  return (
    <div className="book-list">
      <h2>Books</h2>

      {/* Book list */}
      <div className="books-grid">
        {booksPage.content.map((book) => (
          <div key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p>By {book.author}</p>
            <p>{book.description}</p>
            <div className="book-price">${typeof book.price === 'number' ? book.price.toFixed(2) : book.price}</div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>

        <span>
          Page {currentPage + 1} of {booksPage.totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= booksPage.totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;
