---
layout: tutorial_page
permalink: /GenEpi_2017_day2_assignment
title: GenEpi Day 2 assignment
header1: Workshop Pages for Students
header2: Infectious Disease Genomic Epidemiology 2017 Assignment Day 2
image: /site_images/CBW_wshop-epidem_map-icon.png
home: https://bioinformaticsdotca.github.io/genomic_epidemiology_2017
---

<a name="tb"></a>
# Tuberculosis Dataset

The data for this assignment is a small subset of samples taken during tuberculosis outbreaks in BC.

We will practice the AMR and PA analysis from lab 4 and 5 on this data.

## Antimicrobial Resistance Genes 

To begin, we will setup our environment in our ~/workspace so we can download all of our assemblies for the assignment.

### Environment setup


```
    mkdir -p ~/workspace/inter_2
    
    cp -r ~/CourseData/IDGE_data/TB_data/assemblies ~/workspace/inter_2
    
```

### Task list

1. Submit the following assemblies to Resistance Gene Identifier (RGI) analysis tool located at https://card.mcmaster.ca/analyze/rgi 
   - 291
   - 283
   - 165
   - 272
   - 177
   - 314
   - 239
   
   You will need to download the assemblies to your local machine first before uploading to site. Navigate to http://cbwXX.dyndns.info/, where XX is your student ID. You should be able to find assembly files following directory hierarchy ~/workspace/inter_2/assemblies .
   
   
   When RGI is finished running on all of our assemblies, browser your results to answer the following questions.



### Questions


1. Based on "View by Gene" and "View by Functional Categories"  tabs, how many perfect hits were found for strain 165? Can you explain why there discrepancy between the tabs?
   
2.  For strain 165 , why do you think genes: AAC(2')-Ic , mfpA and "Mycobacterium tuberculosis intrinsic murA conferring resistance to fosfomycin" were marked as strict instead of perfect status when all had perfect matches in the CARD database?
3.  On metadata provided by the [lab](https://github.com/bioinformaticsdotca/Genomic_Epi_2017/blob/master/assignment_day1/tb_fake_provenance.tsv), we know that strains 165, 272 ,177 and 314 have some level of INH resistant where as the remaining strains 239 ,283 and 291 do not. What information can CARD provide to help support this metadata?


## Phylogeographic Analysis

Time to upload metadata from our epidemiologist and tree from SNVPhyl pipeline to see if any of the INH resistances has any correlation.

Navigate to https://microreact.org/upload and upload the following tree (.nhx) and metadata (.csv) url.

metadata_TB.csv : https://raw.githubusercontent.com/bioinformaticsdotca/Genomic_Epi_2017/master/assignment_day2/metadata_TB.csv
tree_TB.newick  : https://raw.githubusercontent.com/bioinformaticsdotca/Genomic_Epi_2017/master/assignment_day2/tree_TB.newick
