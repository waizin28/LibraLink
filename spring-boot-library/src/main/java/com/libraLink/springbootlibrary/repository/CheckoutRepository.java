package com.libraLink.springbootlibrary.dao;

import com.libraLink.springbootlibrary.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    //  We can find out if book checked out by userEmail and bookId
    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);

    // Get list of books, user has checked out
    List<Checkout> findBooksByUserEmail(String userEmail);
}
