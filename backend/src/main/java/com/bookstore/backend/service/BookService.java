package com.bookstore.backend.service;

import com.bookstore.backend.dto.BookDto;
import com.bookstore.backend.model.Book;
import com.bookstore.backend.repository.BookRepository;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final ModelMapper modelMapper;

    public BookService(BookRepository bookRepository, ModelMapper modelMapper) {
        this.bookRepository = bookRepository;
        this.modelMapper = modelMapper;
    }

    public Page<BookDto> getAllBooks(int page, int size) {
        Page<Book> books = bookRepository.findAll(PageRequest.of(page, size));
        return books.map(book -> modelMapper.map(book, BookDto.class));
    }

    public Page<BookDto> getBooksByCategory(String genre, int page, int size) {
        Page<Book> books = bookRepository.findByGenre(genre, PageRequest.of(page, size));
        return books.map(book -> modelMapper.map(book, BookDto.class));
    }

    public List<String> getAllCategories() {
        return bookRepository.findDistinctGenres();
    }

    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
        return modelMapper.map(book, BookDto.class);
    }

    public BookDto createBook(BookDto dto) {
        Book book = modelMapper.map(dto, Book.class);
        return modelMapper.map(bookRepository.save(book), BookDto.class);
    }

    public BookDto updateBook(Long id, BookDto dto) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
        // Use ModelMapper to handle the update to avoid manually setting each field
        modelMapper.map(dto, book);
        book.setId(id); // Ensure the ID is not changed
        return modelMapper.map(bookRepository.save(book), BookDto.class);
    }

    public void deleteBook(Long id) {
        try {
            if (!bookRepository.existsById(id)) {
                throw new RuntimeException("Book not found with id: " + id);
            }
            bookRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            // This error is thrown when a database constraint is violated,
            // such as trying to delete a book that is part of an existing order.
            throw new RuntimeException("Cannot delete this book. It is referenced by existing orders.", e);
        }
    }
}
