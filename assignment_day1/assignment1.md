---
layout: tutorial_page
permalink: /GenEpi_2017_day1_assignment
title: GenEpi Day 1 assignment
header1: Workshop Pages for Students
header2: Infectious Disease Genomic Epidemiology 2017 Assignment Day 1
image: /site_images/CBW_wshop-epidem_map-icon.png
home: https://bioinformaticsdotca.github.io/genomic_epidemiology_2017
---

# Tuberculosis Dataset

The data for this assignment is a small subset of samples taken during tuberculosis outbreaks in BC.

We will practice the SNV and MLST analysis from lab 2 and 3 on this data.

## SNV

1. The tuberculosis data is located on the folder `~/CourseData/IDGE_data/TB_data`. The fastq files are on the folder `~/CourseData/IDGE_data/TB_data/fastq/12x/` and the reference genome is `~/CourseData/IDGE_data/TB_data/reference/NC_000962.3.fa`. This data was reduced to 12x coverage, so as before, we will run snphyl with minimum coverage of 4 (the default is 10).

	Run Snvphyl with the following command, changing `<OUTPUT>` to an appropriate output directory:


	`python /usr/local/snvphyl-galaxy-cli/bin/snvphyl.py --deploy-docker --fastq-dir ~/CourseData/IDGE_data/TB_data/fastq/12x/  --reference-file ~/CourseData/IDGE_data/TB_data/reference/NC_000962.3.fa --min-coverage 4 --output-dir <OUTPUT>`


2. On the folder `~/CourseData/IDGE_data/TB_data/snphyl_25x` there are Snphyl result files for the same dataset, but with 25x coverage. Compare your results with this dataset in terms of number of SNVs found, filtering statistics, distance matrix, quality (compare files `vcf2core.tsv`, `filterStats.txt`, `snvTable.tsv`, `snvMatrix.tsv`). 

## MLST

There is a wgMLST scheme on the folder `~/CourseData/IDGE_data/TB_data/wgMLST`. This simple scheme was created with `ChewBBACA`, and it was based on only 34 genomes assembled with [Spades](http://bioinf.spbau.ru/spades). The assemblies are located at `~/CourseData/IDGE_data/TB_data/assemblies`. The command to create a wgMLST scheme with ChewBBACA is:

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

`/media/cbwdata/IDGE_data/bin/chewBBACA/allelecall/BBACA.py -i assemblies_subset2.list -g wgMLST_genes.list -o ~/workspace/wgMLST_call --cpu 8`


4. On the output folder, there will be a folder called `results_<DATE>`, with the MLST calling result files. The called alleles are in the file `results_alleles.tsv`. Each column has a different locus, and on each row there are the allele calls for each sample. You can look at some calls with the `cut` command, together with `column` to align the columns correctly:

  `cut -f 1,2-5  results_alleles.tsv | column -s  $'\t' -t`

  Try different columns other that 2-5 to look at other allele calls.
  You will notice that some of the calls are numbers, and some have some letter codes. In the case of numbers, this is the call of the corresponding allele for this locus. For the codes, the list below has a short explanation for each. This usually means that no precise call was made, and it explains why.

* INF – Novel inferred allele that is assigned a new identifier and added to the allele database for that given locus

* LNF – locus not found

* PLOT – partial match to a locus found on either end of the contig. This makes impossible the correct identification of the allele but gives the user the information that the locus is non absent.

* NIPH – Non-informative paralogous hit. Two or more BLAST matches with BSR>0.6 are found, indicating that the locus could be duplicated and should be removed from the analysis. A high number of NIPH may also indicate a poor assembled genome, with a high number of smaller contigs.

* NIPHEM – same as NIPH but with exact matches.

* ALM – allele 20% larger than locus size (match CDS length> locus mode length + locus mode length * 0.2)

* ASM – allele 20% smaller than locus size (match CDS length < locus mode length - locus mode length * 0.2)


5. Follow the instructions from the MLST tutorial to remove low quality genomes, extract the core genome,
and visualize results in PHYLOViZ. The provenance file can be obtained with:

	`wget https://raw.githubusercontent.com/bioinformaticsdotca/Genomic_Epi_2017/master/assignment_day1/tb_fake_provenance.tsv`

	Due to privacy issues, the real metadata was not available. 

	1. Is it necessary to remove any genome from the analysis in this dataset, due to low genome-wise gene presence? Why?

	2. Does the clustering obtained here agree with the one from Snphyl? 

	3. The distances between samples of the same cluster, which we assume are from the same strain, are larger than expected (compared with the very small SNV distances, or with the Haiti cgMLST dataset). Can you think of a reason why this happens? 
	
	4. You can also color the nodes by the allele types, by double-clicking on the "Multi-Locus Sequencing Typing (MLST)" tab and, similarly as with the Isolate Data, view the loci in Tree format and select one (or more) locus, and clicking the "View" button on the top right corner. 
	Choose some loci and check which ones agree with the expected clustering, and which don't (these are the ones causing the larger distances). Most of these conflicting loci actually do not represent different alleles, but most likely should be noise caused by the "quick and dirty" wgMLST scheme, based on only a few genomes and incomplete assemblies.
	
