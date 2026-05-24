package com.ignis.API.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ignis.API.entity.EmailSend;

public interface EmailSendRepository extends JpaRepository<EmailSend, Integer> {

}
