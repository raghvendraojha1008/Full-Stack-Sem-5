package com.example.readapi.controller;

import com.example.readapi.dto.AuthorDto;
import com.example.readapi.repository.AuthorRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    private final AuthorRepository authorRepository;

    public AuthorController(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @GetMapping
    public List<AuthorDto> getAuthors() {
        return authorRepository.findAll(Sort.by("name")).stream()
                .map(a -> new AuthorDto(a.getId(), a.getName()))
                .toList();
    }
}
