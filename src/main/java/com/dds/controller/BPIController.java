package com.dds.controller;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.dds.dto.CreditCardApplicationDTO;
import com.dds.model.Applicant;
import com.dds.model.DOSInfo;
import com.dds.model.DOSRelInfo;
import com.dds.model.Spouse;
import com.dds.model.SupplementaryCardHolder;
import com.dds.model.Work;
import com.dds.service.BPIService;

@RestController
public class BPIController {
    
    // Correct way to initialize Apache Commons Logging
    private static final Log log = LogFactory.getLog(BPIController.class);
    
    private final BPIService bpiService;

    public BPIController(BPIService bpiService) {
        this.bpiService = bpiService;
    }
    
    @PutMapping("/bpi/create")
    public ResponseEntity<?> createBPI(@RequestBody CreditCardApplicationDTO applicationDTO) {
        
        Applicant a = applicationDTO.getApplicant();
        DOSInfo d = applicationDTO.getDos();
        List<DOSRelInfo> drList = applicationDTO.getDosrel(); 
        Spouse s = applicationDTO.getSpouse();
        List<SupplementaryCardHolder> hList = applicationDTO.getSupplementarycardholder(); 
        Work w = applicationDTO.getWork();

        System.out.println(a);
        System.out.println(d);
        System.out.println(drList);
        System.out.println(s);
        System.out.println(hList);
        System.out.println(w);
        
        // 1. Log when the request is received
        if (log.isInfoEnabled()) {
            log.info("Received request to populate BPI database via JSON RequestBody.");
        }
        
        try {
            // Note: You will need to adjust your BPIService.populateDatabase signature 
            // to accept List<DOSRelInfo> and List<SupplementaryCardHolder> instead of single objects.
            bpiService.populateDatabase(a, d, drList, s, hList, w);
            
            if (log.isInfoEnabled()) {
                log.info("Successfully populated BPI database.");
            }
            
            return ResponseEntity.status(HttpStatus.OK).build();
                
        } catch (Exception e) {
            log.error("Error occurred while populating BPI database", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}