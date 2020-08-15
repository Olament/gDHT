package com.github.olament.gdhtweb.web;

import com.github.olament.gdhtweb.data.ResultRepository;
import com.github.olament.gdhtweb.model.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/search")
public class SearchController {

    private final ResultRepository resultRepository;

    @Autowired
    public SearchController(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    @PostMapping
    public String processQuery(@ModelAttribute Query query, Model model) {
        System.out.println(query.getQueryText());
        model.addAttribute("results", resultRepository.findTorrentByName(query.getQueryText()));
        return "result";
    }
}
