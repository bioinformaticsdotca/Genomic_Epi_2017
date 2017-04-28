# Haiti Cholera Dataset

he data for these labs is a set of whole genome sequencing data from a number of *V. Cholerae* strains from the [outbreak of cholera in Haiti][haiti-cholera] beginning in 2010 as well as a number of other *V. cholerae* strains included for comparison.  This data was previously published in <http://mbio.asm.org/content/4/4/e00398-13.abstract> and <http://mbio.asm.org/content/2/4/e00157-11.abstract> and is available on NCBI's [Sequence Read Archive](http://www.ncbi.nlm.nih.gov/sra/).  You can view a table of the data at [metadata.tsv][].

Please use the [SNVPhyl][] phylogenomics pipeline to construct a whole genome phylogeny of this data. You may find the input data under `~/CourseData/IDGE_data/VCholerae_SNVPhyl`. The reference file should be `reference/2010EL-1786.fasta` and the fastq files should be in `fastq/`. This data was reduced to an average coverage of 12X to speed up execution, so please use a minimum coverage of 4X.  This should take ~16 minutes to run.

[haiti-cholera]: http://en.wikipedia.org/wiki/2010%E2%80%9313_Haiti_cholera_outbreak
[metadata.tsv]: metadata.tsv
[SNVPhyl]: https://snvphyl.readthedocs.io
