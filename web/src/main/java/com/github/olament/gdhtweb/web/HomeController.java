package com.github.olament.gdhtweb.web;

import com.github.olament.gdhtweb.model.Query;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        Query query = new Query();
        model.addAttribute("query", query);
        return "home";
    }
}
