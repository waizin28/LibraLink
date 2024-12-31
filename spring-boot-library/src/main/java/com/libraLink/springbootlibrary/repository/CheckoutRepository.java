package com.libraLink.springbootlibrary.repository;

import com.libraLink.springbootlibrary.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

    //  We can find out if book checked out by userEmail and bookId
    Checkout findByUserEmailAndBookId(String userEmail, Long bookId);

    // Get list of books, user has checked out
    List<Checkout> findBooksByUserEmail(String userEmail);

    // When delete book, we want to delete book that have checked out too
    @Modifying
    @Query("delete from Checkout where book_id in :book_id")
    void deleteAllByBookId(@Param("book_id") Long bookId);
}
