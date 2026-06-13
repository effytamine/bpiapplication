package com.dds.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PutMapping;

import com.dds.model.Applicant;
import com.dds.model.DOSInfo;
import com.dds.model.DOSRelInfo;
import com.dds.model.Spouse;
import com.dds.model.SupplementaryCardHolder;
import com.dds.model.Work;
import com.dds.service.BPIService;

@Controller
public class BPIController {
    
    // Correct way to initialize Apache Commons Logging
    private static final Log log = LogFactory.getLog(BPIController.class);
    
    private final BPIService bpiService;

    public BPIController(BPIService bpiService) {
        this.bpiService = bpiService;
    }
    
    @PutMapping("/bpi/create")
    public ResponseEntity<?> createBPI(Applicant a, DOSInfo d, DOSRelInfo dr, Spouse s, SupplementaryCardHolder h, Work w) {
        
        System.out.println(a);
        System.out.println(d);
        System.out.println(dr);
        System.out.println(s);
        System.out.println(h);
        System.out.println(w);
        
        // 1. Log when the request is received
        if (log.isInfoEnabled()) {
            log.info("Received request to populate BPI database.");
        }
        
        try {
            bpiService.populateDatabase(a, d, dr, s, h, w);
            
            // 2. Log on success
            if (log.isInfoEnabled()) {
                log.info("Successfully populated BPI database.");
            }
            
            return ResponseEntity
                .status(HttpStatus.OK)
                .build();
                
        } catch (Exception e) {
            // 3. Log if something breaks
            log.error("Error occurred while populating BPI database", e);
            
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }
    }
}