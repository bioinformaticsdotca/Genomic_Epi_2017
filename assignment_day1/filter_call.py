#!/usr/bin/env python
import sys
import argparse

def is_int(s):
    try: 
        int(s)
        return True
    except ValueError:
        return False

if __name__ == "__main__":
	parser = argparse.ArgumentParser(description="Filter ChewBBACA MLST allele calls, removing calls that have string codes, printing the result on STDOUT.")
	parser.add_argument("file", type=str, help="File with the ChewBBACA allele calls.")
	param = parser.parse_args()

	# open file and get data:
	data = []
	with open(param.file) as f:
		header = f.readline().strip().split()
		for l in f:
			data.append(l.strip().split())

	# filter columns:
	columns = [0] # sample name is always included
	for i in range(1,len(header)):
		col_data = [d[i] for d in data]
		# filter column that only have called alleles:
		if all([is_int(s) for s in col_data]):
			columns.append(i)

	# output:
	print >> sys.stderr, "%s loci on the input, %s loci remained (%s removed)." % (len(header)-1,len(columns)-1, len(header)-len(columns))
	print "\t".join([header[i] for i in columns])
	for d in data:
		print "\t".join([d[i] for i in columns])