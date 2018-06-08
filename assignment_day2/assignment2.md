---
layout: tutorial_page
permalink: /GenEpi_2017_day2_assignment
title: GenEpi Day 2 assignment
header1: Workshop Pages for Students
header2: Infectious Disease Genomic Epidemiology 2017 Assignment Day 2
image: /site_images/CBW_wshop-epidem_map-icon.png
home: https://bioinformaticsdotca.github.io/genomic_epidemiology_2017
description: Antimicrobial Resistance Genes
author:
modified: May 2nd, 2017
---

<a name="tb"></a>
# Tuberculosis Dataset

The data for this assignment is a small subset of samples taken during a tuberculosis outbreak in BC.

We will practice the AMR and PA analysis from lab 4 and 5 using this data.

## Antimicrobial Resistance Genes 

To begin, we will setup our environment in our ~/workspace so we can download all of our assemblies for this assignment.

### Environment setup


```
    mkdir -p ~/workspace/inter_2
    
    cp -r ~/CourseData/IDGE_data/TB_data/assemblies ~/workspace/inter_2
    
```

### Task list

1. Submit the following assemblies to Resistance Gene Identifier (RGI) analysis tool located at [card](https://card.mcmaster.ca/analyze/rgi) 
   - 291
   - 283
   - 165
   - 272
   - 177
   - 314
   - 239
   
   You will need to download the assemblies to your local machine first before uploading it to the CARD site. Navigate to http://cbwXX.dyndns.info/, where XX is your student ID. You should be able to find assembly files following the directory hierarchy ~/workspace/inter_2/assemblies .
   
   
   When the RGI analysis has completed running on all of our assemblies, browse through your results to answer the following questions. Pre cooked results are available [here](https://card.mcmaster.ca/rgi/results/WrOmvUuGcnZwY0El1slNnUk9eTt64f9zDIZbtxk6#) if needed.



### Questions


1. Based on "View by Gene" and "View by Functional Categories"  tabs, how many perfect hits were found for strain 165? Can you explain why there is a discrepancy between tabs?
   
2.  For strain 165, why do you think genes: AAC(2')-Ic, mfpA, and "Mycobacterium tuberculosis intrinsic murA conferring resistance to fosfomycin" were marked as strict instead of perfect status when all had perfect matches in the CARD database?

3.  With the metadata provided at the following [link](https://github.com/bioinformaticsdotca/Genomic_Epi_2017/blob/master/assignment_day1/tb_fake_provenance.tsv), we know that strains 165, 272,177, and 314 have some level of INH resistance whereas the remaining strains 239, 283, and 291 do not. What information can CARD provide to help support this metadata?


## Phylogeographic Analysis

We will upload metadata provided to us from our epidemiologist and our SNVPhyl phylogenomic tree to see if INH resistance has any geographic location.

Navigate to [microreact](https://microreact.org/upload) and upload the following tree (.nhx) and metadata (.csv) url.

metadata_TB.csv : https://raw.githubusercontent.com/bioinformaticsdotca/Genomic_Epi_2017/master/assignment_day2/metadata_TB.csv
tree_TB.newick  : https://raw.githubusercontent.com/bioinformaticsdotca/Genomic_Epi_2017/master/assignment_day2/tree_TB.newick

Pre cooked results are available [here](https://microreact.org/project/H1o1FD8JZ) if needed.

### Questions

1. Do any of your INH resistant strains have any geographic pattern? If so, which location(s)?

2. What value do you think that microreact can bring to your analysis?

