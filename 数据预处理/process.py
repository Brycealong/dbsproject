with open('interaction.txt') as fi1, open('organism.txt') as fi2, open('interaction_new.txt', 'w') as fo1, open(
        'organism_new.txt', 'w') as fo2:

    for line2 in fi2:
        line = ''
        line = line + '\t'.join(line2.split('\n')) + '\n'
        fo2.write(line)

