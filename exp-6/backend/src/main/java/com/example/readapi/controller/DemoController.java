package com.example.readapi.controller;

import com.example.readapi.dto.NPlusOneResult;
import com.example.readapi.service.NPlusOneDemoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo/n-plus-one")
public class DemoController {

    private final NPlusOneDemoService demoService;

    public DemoController(NPlusOneDemoService demoService) {
        this.demoService = demoService;
    }

    @GetMapping("/lazy")
    public NPlusOneResult lazy() {
        return demoService.runLazy();
    }

    @GetMapping("/join-fetch")
    public NPlusOneResult joinFetch() {
        return demoService.runJoinFetch();
    }
}
