package com.dds.controller;

import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    // ── Read Queries 1–10 ────────────────────────────────────────────────────────
    @GetMapping("/query/{id}")
    public ResponseEntity<?> runQuery(@PathVariable int id) {
        log.info("Admin read query requested: #" + id);
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

    // ── Seed Endpoints ───────────────────────────────────────────────────────────

    @PostMapping("/seed/{id}")
    public ResponseEntity<?> seedData(@PathVariable int id) {
        log.info("Seed data requested for query #" + id);
        try {
            switch (id) {
                case 11 -> adminRepository.seedQuery11();
                case 12 -> adminRepository.seedQuery12();
                default -> throw new IllegalArgumentException("No seed data for query id: " + id);
            }
            return ResponseEntity.ok(Map.of("message", "Seed data for Query " + id + " inserted successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error seeding data for query #" + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Seed failed: " + e.getMessage());
        }
    }

    // ── Verification Endpoints (SELECT before mutating) ──────────────────────────

    @GetMapping("/query/{id}/verify")
    public ResponseEntity<?> verifyQuery(@PathVariable int id) {
        log.info("Verification query requested: #" + id);
        try {
            List<Map<String, Object>> results = switch (id) {
                case 11 -> adminRepository.verifyQuery11();
                case 12 -> adminRepository.verifyQuery12();
                default -> throw new IllegalArgumentException("No verification for query id: " + id);
            };
            return ResponseEntity.ok(results);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error running verification for query #" + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Verification failed: " + e.getMessage());
        }
    }

    // ── Execution Endpoints (actual DELETE / UPDATE) ──────────────────────────────

    @PostMapping("/query/{id}/execute")
    public ResponseEntity<?> executeQuery(@PathVariable int id) {
        log.info("Execute mutation requested: #" + id);
        try {
            int rowsAffected = switch (id) {
                case 11 -> adminRepository.executeQuery11();
                case 12 -> adminRepository.executeQuery12();
                default -> throw new IllegalArgumentException("No execution defined for query id: " + id);
            };
            String action = (id == 11) ? "deleted" : "updated";
            return ResponseEntity.ok(Map.of(
                "rowsAffected", rowsAffected,
                "message", rowsAffected + " row(s) " + action + " successfully."
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error executing mutation for query #" + id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Execution failed: " + e.getMessage());
        }
    }
}