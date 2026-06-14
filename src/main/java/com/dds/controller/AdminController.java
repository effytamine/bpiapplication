package com.dds.controller;

import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dds.repository.AdminRepository;

@RestController
@RequestMapping("/bpi/admin")
public class AdminController {

    private static final Log log = LogFactory.getLog(AdminController.class);

    private final AdminRepository adminRepository;

    public AdminController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @GetMapping("/query/{id}")
    public ResponseEntity<?> runQuery(@PathVariable int id) {
        log.info("Admin query requested: #" + id);
        try {
            List<Map<String, Object>> results = switch (id) {
                case 1  -> adminRepository.getApplicantsInManilaOrCavite();
                case 2  -> adminRepository.getNonFilipinoApplicants();
                case 3  -> adminRepository.getFilteredWorkDetails();
                case 4  -> adminRepository.getDOSApplicants();
                case 5  -> adminRepository.getAvgIncomeByEducation();
                case 6  -> adminRepository.getApplicantCountByBirthplace();
                case 7  -> adminRepository.getHighIncomeMarriedApplicants();
                case 8  -> adminRepository.getMarriedNonManilaWithSiblingOrOtherSup();
                case 9  -> adminRepository.getHighIncomeCaviteLagunaByBirthplace();
                case 10 -> adminRepository.getCarOwnershipStats();
                default -> throw new IllegalArgumentException("Unknown query id: " + id);
            };
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error running admin query #" + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Query failed: " + e.getMessage());
        }
    }
}
