package com.libraLink.springbootlibrary.service;

import com.libraLink.springbootlibrary.repository.BookRepository;
import com.libraLink.springbootlibrary.repository.CheckoutRepository;
import com.libraLink.springbootlibrary.entity.Book;
import com.libraLink.springbootlibrary.entity.Checkout;
import com.libraLink.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

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

    // Return all the books that have been checkout (book info, how many days left)
    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception{
        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

        // all the books users have checked out -> returned bookId
        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
        List<Long> bookIdList = new ArrayList<>();
        for(Checkout i: checkoutList){
            bookIdList.add(i.getBookId());
        }

        // Select to extract all information about books based on book id
        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        for(Book book: books){
            // find checkout with matching book
            Optional<Checkout> checkout = checkoutList.stream().filter(x -> x.getBookId() == book.getId()).findFirst();

            if(checkout.isPresent()){
                Date date1 = sdf.parse(checkout.get().getReturnDate());
                Date date2 = sdf.parse(LocalDate.now().toString());
                // two difference in date in days
                TimeUnit time = TimeUnit.DAYS;
                long differenceInTime = time.convert(date1.getTime()-date2.getTime(), TimeUnit.MILLISECONDS);
                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int) differenceInTime));
            }
        }
        return shelfCurrentLoansResponses;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);
        // make sure we have user email and book id
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(!book.isPresent() || validateCheckout == null){
            throw new Exception("Book does not exist or not checked out by user");
        }

        // restore book count
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());
        // remove checkout history
        checkoutRepository.deleteById(validateCheckout.getId());
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception{
        // make sure we have valid checkout
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(validateCheckout == null){
            throw new Exception("Book does not exist or not checked out by user");
        }

        // Make sure it's not pass due date
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        // Make sure return date is later than today date
        if(d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0){
            validateCheckout.setCheckoutDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }
    }
}
