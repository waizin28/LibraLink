package com.libraLink.springbootlibrary.repository;

import com.libraLink.springbootlibrary.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface BookRepository extends JpaRepository<Book,Long> {

    // Pageable allow for page indexing search, page, size (number of elements you want)
    Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);

    Page<Book> findByCategory(@RequestParam("category") String category, Pageable pageable);

    // Select book from books where id matches book_id
    @Query("select o from Book o where id in :book_ids")
    List<Book> findBooksByBookIds(@Param("book_ids") List<Long> bookId);
}
