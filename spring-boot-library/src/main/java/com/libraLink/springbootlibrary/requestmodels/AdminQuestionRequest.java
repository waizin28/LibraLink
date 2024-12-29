package com.libraLink.springbootlibrary.requestmodels;

import lombok.Data;

// Going to send it to react app so we can update user's question with response from admin
@Data
public class AdminQuestionRequest {
    private Long id;
    private String response;
}
