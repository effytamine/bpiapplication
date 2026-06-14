package com.dds.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dds.model.Applicant;
import com.dds.model.CivilStatus;
import com.dds.model.DOSInfo;
import com.dds.model.DOSRelInfo;
import com.dds.model.Spouse;
import com.dds.model.SupplementaryCardHolder;
import com.dds.model.Work;
import com.dds.repository.ApplicantRepository;
import com.dds.repository.DOSInfoRepository;
import com.dds.repository.DOSRelInfoRepository;
import com.dds.repository.SpouseRepository;
import com.dds.repository.SupplementaryCardholderRepository;
import com.dds.repository.WorkRepository;

@Service
public class BPIService {
    private final ApplicantRepository applicantRepository;
    private final DOSInfoRepository dosInfoRepository;
    private final DOSRelInfoRepository dosRelInfoRepository;
    private final SpouseRepository spouseRepository;
    private final SupplementaryCardholderRepository supplementaryCardholderRepository;
    private final WorkRepository workRepository;

    private int currentSupId = 1;
    
    public BPIService(
        ApplicantRepository applicantRepository,
        DOSInfoRepository dosInfoRepository,
        DOSRelInfoRepository dosRelInfoRepository,
        SpouseRepository spouseRepository,
        SupplementaryCardholderRepository supplementaryCardholderRepository,
        WorkRepository workRepository
    ) {
        this.applicantRepository = applicantRepository;
        this.dosInfoRepository = dosInfoRepository;
        this.dosRelInfoRepository = dosRelInfoRepository;
        this.spouseRepository = spouseRepository;
        this.supplementaryCardholderRepository = supplementaryCardholderRepository;
        this.workRepository = workRepository;
    }

    @Transactional
    public void populateDatabase(Applicant a, DOSInfo d, List<DOSRelInfo> drList, Spouse s, List<SupplementaryCardHolder> hList, Work w) {
        int generatedId = applicantRepository.createApplicant(a);

        for (SupplementaryCardHolder h : hList) {
            h.setApplicantID(generatedId);
            h.setId(currentSupId++);
        }
        
        w.setId(generatedId);

        if (a.isDosFlag()) {
            d.setId(generatedId);
            if (!dosInfoRepository.populateDOSInfoTable(d)) {
                throw new RuntimeException("Error in populating the dosdb");
            }
        }

        if (a.isRelDosFlag()) {
            for (DOSRelInfo dr : drList) {
                dr.setId(generatedId);
                if (!dosRelInfoRepository.populateDOSInfoTable(dr)) {
                    throw new RuntimeException("Error in populating the reldosdb");
                }
            }
        }

        if (a.getCivilStatus() == CivilStatus.MARRIED) {
            s.setId(generatedId);
            if (!spouseRepository.populateSpouseTable(s)) {
                throw new RuntimeException("Error in populating the spousedb");
            }
        }

        if (hList != null && !hList.isEmpty()) {
            for (SupplementaryCardHolder h : hList) {
                h.setApplicantID(generatedId);
                h.setId(currentSupId++);
                if (!supplementaryCardholderRepository.populateSupplementaryCardholderTable(h)) {
                    throw new RuntimeException("Error in populating the supplementarydb");
                }
            }
        }

        if (!workRepository.populateWorkTable(w)) {
            throw new RuntimeException("Error in populating the workdb");
        }
    }
}
