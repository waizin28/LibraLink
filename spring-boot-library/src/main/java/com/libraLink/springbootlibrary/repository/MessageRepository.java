package com.libraLink.springbootlibrary.repository;

import com.libraLink.springbootlibrary.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Page<Message> findByUserEmail(@RequestParam("user_email") String userEmail, Pageable pageable);

    // want to only see questions that haven't be answered for admin
    Page<Message> findByClosed(@RequestParam("closed") boolean closed, Pageable pageable);
}
