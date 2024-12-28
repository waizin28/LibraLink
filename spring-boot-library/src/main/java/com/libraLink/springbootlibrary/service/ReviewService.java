package com.libraLink.springbootlibrary.service;

import com.libraLink.springbootlibrary.entity.Review;
import com.libraLink.springbootlibrary.repository.BookRepository;
import com.libraLink.springbootlibrary.repository.ReviewRepository;
import com.libraLink.springbootlibrary.requestmodels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.sql.Date;
import java.time.LocalDate;

@Service
@Transactional
public class ReviewService {

    private BookRepository bookRepository;
    private ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(BookRepository bookRepository, ReviewRepository reviewRepository) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
    }

    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception{
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
        if(validateReview != null){
            throw new Exception("Review has already created");
        }

        Review review = new Review();
        review.setBookId(reviewRequest.getBookId());
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);

        if(reviewRequest.getReviewDescription().isPresent()){
            review.setReviewDescription(reviewRequest.getReviewDescription().map(
                    Object::toString
            ).orElse(null));
        }

        review.setDate(Date.valueOf(LocalDate.now()));
        reviewRepository.save(review);
    }


}
