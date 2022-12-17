import json

def main(ljson, output, merge = False):
    data = {}

    if merge:
        with open(output) as f:
            data = json.load(f)

    with open(ljson) as f:
        for line in f:
            j = json.loads(line)
            data[j['code']['plu']] = j['code']['ean']

    if output == '-':
        print(json.dumps(data, indent = '  ', sort_keys = True))
    else:
        with open(output, 'w') as f:
            json.dump(data, f, indent = '  ', sort_keys = True)

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(
        prog = 'merge',
        description = 'Unir / Generar json plu -> ean',
    )
    parser.add_argument('ljson', help = 'Archivo ljson obtenido de crawler')
    parser.add_argument('output', help = 'Archivo json de salida')
    parser.add_argument('-m', '--merge', action = 'store_true', help = 'Unir salida')
    args = parser.parse_args()
    main(args.ljson, args.output, args.merge)
