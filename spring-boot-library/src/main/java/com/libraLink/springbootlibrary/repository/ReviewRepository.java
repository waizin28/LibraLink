package com.libraLink.springbootlibrary.repository;

import com.libraLink.springbootlibrary.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface ReviewRepository extends JpaRepository<Review,Long> {

    // Search review by book id
    Page<Review> findByBookId(@RequestParam("book_id") Long bookId,
                              Pageable pageable);

}
