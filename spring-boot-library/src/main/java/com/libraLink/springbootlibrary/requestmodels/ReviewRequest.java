package com.libraLink.springbootlibrary.requestmodels;

import lombok.Data;

import java.util.Optional;

@Data
public class ReviewRequest {
    private double rating;
    private Long bookId;
    // review description is optional
    private Optional<String> reviewDescription;

}
