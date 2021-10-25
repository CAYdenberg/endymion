from Bio import SeqIO
import os
import json
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(CURRENT_DIR, '..', '..', 'temp')

file = sys.argv[1]
fullPath = os.path.join(UPLOAD_DIR, file)

record = SeqIO.read(fullPath, 'abi')
# FWO_1 contains the base order
# Usually DATA9 = G, DATA10 = A, DATA11 = T, DATA12 = C
# PBAS = Base calls (sequence)
# PLOC = Peak locations (X-axis)
data_selected = {}
for c in ['DATA9', 'DATA10', 'DATA11', 'DATA12', 'PLOC1', 'PLOC2']:
    data_selected[c] = record.annotations['abif_raw'][c]

for c in ['PBAS1', 'PBAS2']:
    data_selected[c] = record.annotations['abif_raw'][c].decode('utf-8')

print(json.dumps(data_selected))
