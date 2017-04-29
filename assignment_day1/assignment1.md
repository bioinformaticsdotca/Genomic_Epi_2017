---
layout: tutorial_page
permalink: /GenEpi_2017_day1_assignment
title: GenEpi Day 1 assignment
header1: Workshop Pages for Students
header2: Infectious Disease Genomic Epidemiology 2017 Assignment Day 1
image: /site_images/CBW_wshop-epidem_map-icon.png
home: https://bioinformaticsdotca.github.io/genomic_epidemiology_2017
---

<!-- ## Table of contents
1. [Introduction](#intro)
2. [Software](#software)    
2. [Environment Setup](#env)
3. [Exercise 1](#ex1)
4. [Exercise 2](#ex2)
5. [Exercise 3](#ex3)
 -->
<a name="tb"></a>
# Tuberculosis Dataset

The data for this assignment is a small subset of samples taken during tuberculosis outbreaks in BC.

We will practice the SNV and MLST analysis from lab 2 and 3 on this data.

## SNV

1. The tuberculosis data is located on the folder `~/CourseData/IDGE_data/TB_data`. The fastq files are on the folder `~/CourseData/IDGE_data/TB_data/fastq/12x/`. The original data was downsampled to 12x coverage, so as before, we will run snphyl with minimum coverage of 4 (the default is 10).

Run Snvphyl with the following command, changing `<OUTPUT>` to an appropriate output directory:


`python /usr/local/snvphyl-galaxy-cli/bin/snvphyl.py --deploy-docker --fastq-dir ~/CourseData/IDGE_data/TB_data/fastq/12x/  --reference-file ~/CourseData/IDGE_data/TB_data/reference/NC_000962.3.fa --min-coverage 4 --output-dir <OUTPUT>`


2. On the folder `~/CourseData/IDGE_data/TB_data/snphyl_25x` there is the Snphyl result for the same dataset, but with 25x coverage. Compare your results with this dataset in terms of number of SNVs found, distance matrix, quality, etc. 

## MLST

There is a wgMLST scheme on the folder `~/CourseData/IDGE_data/TB_data/wgMLST`. This simple scheme was created with `ChewBBACA`, and it was based on only 34 samples that were assembled with `spades`. The assemblies are located at `~/CourseData/IDGE_data/TB_data/assemblies`. The command to create a wgMLST scheme with ChewBBACA is:

`/media/cbwdata/IDGE_data/bin/chewBBACA/createschema/PPanGen.py -i ~/CourseData/IDGE_data/TB_data/assemblies.list -o wgMLST --cpu 6`

where `assemblies.list` is a text file with the location of all assembled genomes, and `-o wgMLST` indicates the output directory. 

You don't need to run it, as the scheme is already done and it would take a while to run. We will use ChewBBACA to call alleles for our samples on this wgMLST scheme.

1. Since the data folder is write-protected, we will first make a copies of the files necessary to run the analysis, such as the wgMLST scheme folder, in the workspace:

`cp -fr ~/CourseData/IDGE_data/TB_data/wgMLST ~/workspace`

`ln -s ~/CourseData/IDGE_data/TB_data/assemblies ~/workspace`

`ln -s ~/CourseData/IDGE_data/TB_data/assemblies_subset2.list ~/workspace`

2. ChewBBACA needs a file with all the genes in the wgMLST scheme. We can create one with:

`ls ~/workspace/wgMLST/*fasta > ~/workspace/wgMLST_genes.list`

3. Now, go to the workspace folder and run ChewBBACA:

`cd ~/workspace`

`/media/cbwdata/IDGE_data/bin/chewBBACA/allelecall/BBACA.py -i assemblies_subset2.list -g wgMLST_genes.list -o ~/workspace/wgMLST_call --cpu 6`

I have to copy stuff to workspace it would be:
