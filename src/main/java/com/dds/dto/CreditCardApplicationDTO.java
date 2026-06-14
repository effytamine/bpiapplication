package com.dds.dto;

import java.util.List;

import com.dds.model.Applicant;
import com.dds.model.DOSInfo;
import com.dds.model.DOSRelInfo;
import com.dds.model.Spouse;
import com.dds.model.SupplementaryCardHolder;
import com.dds.model.Work;

public class CreditCardApplicationDTO {
    private Applicant applicant;
    private Work work;
    private Spouse spouse; 
    private DOSInfo dos;
    private List<DOSRelInfo> dosrel; 
    private List<SupplementaryCardHolder> supplementarycardholder; 

    public Applicant getApplicant() { 
        return applicant; 
    }

    public void setApplicant(Applicant applicant) { 
        this.applicant = applicant; 
    }

    public Work getWork() { 
        return work; 
    }

    public void setWork(Work work) { 
        this.work = work; 
    }

    public Spouse getSpouse() { 
        return spouse; 
    }

    public void setSpouse(Spouse spouse) { 
        this.spouse = spouse; 
    }

    public DOSInfo getDos() { 
        return dos; 
    }

    public void setDos(DOSInfo dos) { 
        this.dos = dos; 
    }

    public List<DOSRelInfo> getDosrel() { 
        return dosrel; 
    }

    public void setDosrel(List<DOSRelInfo> dosrel) { 
        this.dosrel = dosrel; 
    }

    public List<SupplementaryCardHolder> getSupplementarycardholder() { 
        return supplementarycardholder; 
    }

    public void setSupplementarycardholder(List<SupplementaryCardHolder> supplementarycardholder) { 
        this.supplementarycardholder = supplementarycardholder; 
    }
}
