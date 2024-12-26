package com.libraLink.springbootlibrary.service;

import com.libraLink.springbootlibrary.repository.BookRepository;
import com.libraLink.springbootlibrary.repository.CheckoutRepository;
import com.libraLink.springbootlibrary.entity.Book;
import com.libraLink.springbootlibrary.entity.Checkout;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository){
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail,bookId);

        //  We are making sure user is checking out only 1 book at a time, make sure book exist
        if(!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0){
            throw new Exception("Book doesn't exist or already checkout by user");
        }

        // Subtracting book available cause user borrow it
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId());

        // Saving checkout book
        checkoutRepository.save(checkout);
        return book.get();
    }

    // Book checkout by user or not
    public boolean checkoutBookByUser(String userEmail, Long bookId){
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail,bookId);

        if (validateCheckout != null){
            // Book has been checked out
            return true;
        }else{
            return false;
        }
    }

    // Get number of books checked out by user
    public int currentLoanCount(String userEmail){
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }
}
