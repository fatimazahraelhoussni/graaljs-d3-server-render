package com.example.d3demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;

@Controller
public class GraphController {

    @Autowired
    private GraphService graphService;

    @GetMapping("/graph")
    public String displayGraph(Model model) {
        try {
            String svg = graphService.generateGraph();
            model.addAttribute("svgContent", svg);
            return "graph";
        } catch (IOException e) {
            model.addAttribute("errorMessage", "Error generating the graph.");
            model.addAttribute("errorDetails", e.getMessage());
            return "error";
        }
    }
}
