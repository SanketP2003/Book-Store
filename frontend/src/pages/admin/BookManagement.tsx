import { useState, useEffect, useRef } from 'react';
import { bookService, fileService } from '../../services';
import { BookDto } from '../../types/api';
import Alert from '../../components/Alert';
import Loader from '@/components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineSearch, HiOutlinePencilAlt, HiOutlineTrash, HiX, HiCheck, HiOutlinePhotograph } from 'react-icons/hi';
import { formatCurrency } from '@/utils/format';
import Pagination from '@/components/Pagination';

export default function BookManagement() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<BookDto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<BookDto>>({
    title: '',
    author: '',
    isbn: '',
    description: '',
    genre: '',
    price: '0',
    originalPrice: '0',
    stock: 0,
    image: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await bookService.getAllBooks(currentPage, 10);
        setBooks(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (err: any) {
        setError(err.message || 'Failed to load books');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage]);

  // Filter books based on search query
  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create new book
  const handleCreateNew = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      description: '',
      genre: '',
      price: '0',
      originalPrice: '0',
      stock: 0,
      image: ''
    });
    setImagePreview(null);
    setImageFile(null);
    setShowModal(true);
  };

  // Handle edit book
  const handleEdit = (book: BookDto) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description,
      genre: book.genre,
      price: book.price,
      originalPrice: book.originalPrice,
      stock: book.stock,
      image: book.image
    });

    // Set image preview if book has image
    if (book.image) {
      const imageUrl = book.image.startsWith('http')
        ? book.image
        : `${import.meta.env.VITE_API_URL}/api/files/${book.image}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }

    setImageFile(null);
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle numeric values
    if (name === 'price' || name === 'originalPrice' || name === 'stock') {
      if (name === 'stock') {
        setFormData(prev => ({
          ...prev,
          [name]: parseInt(value) || 0
        }));
      } else {
        // Price and originalPrice should be strings
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      let updatedBook: BookDto;

      // If we're editing an existing book
      if (editingBook?.id) {
        updatedBook = await bookService.updateBook(editingBook.id, formData as BookDto);

        // If there's a new image to upload
        if (imageFile) {
          updatedBook = await bookService.uploadBookImage(editingBook.id, imageFile);
        }

        // Update books list
        setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
        setSuccessMessage(`Book "${updatedBook.title}" was updated successfully!`);
      }
      // If we're creating a new book
      else {
        updatedBook = await bookService.createBook(formData as BookDto);

        // If there's an image to upload and we have a valid book ID
        if (imageFile && updatedBook && updatedBook.id) {
          updatedBook = await bookService.uploadBookImage(updatedBook.id, imageFile);
        }

        // Add new book to list if on first page
        if (currentPage === 0) {
          setBooks([updatedBook, ...books].slice(0, 10));
        }
        setSuccessMessage(`Book "${updatedBook.title}" was created successfully!`);
      }

      // Close modal and reset state
      setShowModal(false);
      setImageFile(null);
      setError(null);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to save book');
      console.error('Error saving book:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete book
  const handleDelete = async (bookId: number) => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) return;

    try {
      setLoading(true);
      await bookService.deleteBook(bookId);

      // Remove book from list
      setBooks(books.filter(book => book.id !== bookId));
      setSuccessMessage('Book was deleted successfully!');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete book');
      console.error('Error deleting book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="section-title">Book Management</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2"
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text_secondary-light dark:text-text_secondary-dark" size={20} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center justify-center gap-2"
            onClick={handleCreateNew}
          >
            <HiOutlinePlus size={20} />
            <span>Add New Book</span>
          </motion.button>
        </div>
      </div>

      {/* Success and Error Messages */}
      {successMessage && (
        <Alert message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />
      )}

      {error && (
        <Alert message={error} type="error" onClose={() => setError(null)} />
      )}

      {/* Books Table */}
      <div className="card overflow-hidden">
        {loading && books.length === 0 ? (
          <div className="flex justify-center items-center p-12">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">ISBN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {book.image ? (
                              <img
                                src={book.image.startsWith('http') ? book.image : `${import.meta.env.VITE_API_URL}/api/files/${book.image}`}
                                alt={book.title}
                                className="h-10 w-10 rounded object-cover mr-3"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                                <HiOutlinePhotograph className="text-gray-400 dark:text-gray-500" size={20} />
                              </div>
                            )}
                            <div className="font-medium text-text_primary-light dark:text-text_primary-dark line-clamp-1 max-w-[200px]">
                              {book.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text_secondary-light dark:text-text_secondary-dark">
                          {book.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text_secondary-light dark:text-text_secondary-dark">
                          {book.isbn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="font-medium text-text_primary-light dark:text-text_primary-dark">
                            {formatCurrency(book.price)}
                          </span>
                          {book.originalPrice && book.originalPrice > book.price && (
                            <span className="text-xs text-text_secondary-light dark:text-text_secondary-dark line-through ml-2">
                              {formatCurrency(book.originalPrice)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`${book.stock > 0 ? 'text-success-light dark:text-success-dark' : 'text-error-light dark:text-error-dark'}`}>
                            {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(book)}
                              className="text-primary-light dark:text-primary-dark hover:text-primary-light/80 dark:hover:text-primary-dark/80"
                            >
                              <HiOutlinePencilAlt size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => book.id && handleDelete(book.id)}
                              className="text-error-light dark:text-error-dark hover:text-error-light/80 dark:hover:text-error-dark/80"
                            >
                              <HiOutlineTrash size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-text_secondary-light dark:text-text_secondary-dark">
                        {searchQuery ? 'No books match your search.' : 'No books found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!searchQuery && totalPages > 1 && (
              <div className="py-4 px-6 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Book Form Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-display font-bold">
                  {editingBook ? `Edit Book: ${editingBook.title}` : 'Add New Book'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-text_secondary-light dark:text-text_secondary-dark hover:text-text_primary-light dark:hover:text-text_primary-dark"
                >
                  <HiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Book Title */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                      Author *
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  {/* ISBN */}
                  <div>
                    <label htmlFor="isbn" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                      ISBN *
                    </label>
                    <input
                      type="text"
                      id="isbn"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  {/* Genre */}
                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                      Genre
                    </label>
                    <input
                      type="text"
                      id="genre"
                      name="genre"
                      value={formData.genre || ''}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label htmlFor="originalPrice" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                      Original Price
                    </label>
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      min="0"
                      step="0.01"
                      value={formData.originalPrice || ''}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      rows={4}
                      className="input-field"
                    ></textarea>
                  </div>

                  {/* Book Cover Image */}
                  <div className="md:col-span-2">
                    <label htmlFor="image" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                      Book Cover Image
                    </label>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                          />
                          <HiOutlinePhotograph className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-text_secondary-light dark:text-text_secondary-dark">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-text_secondary-light dark:text-text_secondary-dark">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>

                      {imagePreview && (
                        <div className="w-32 h-32">
                          <div className="relative h-full">
                            <img
                              src={imagePreview}
                              alt="Cover preview"
                              className="h-full w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setImageFile(null);
                                if (editingBook) {
                                  setFormData(prev => ({ ...prev, image: '' }));
                                }
                              }}
                              className="absolute -top-2 -right-2 bg-error-light dark:bg-error-dark text-white rounded-full p-1 shadow-md"
                            >
                              <HiX size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader size="sm" className="mr-2" /> Saving...
                      </>
                    ) : (
                      <>
                        <HiCheck className="mr-1" size={18} /> {editingBook ? 'Update Book' : 'Create Book'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
