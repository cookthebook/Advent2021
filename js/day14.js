class day14 {
    constructor(input, isstar2) {
        this.input = input;
        this.isstar2 = isstar2;
    }

    solve() {
        this.parse();
        if (this.isstar2) {
            return this.star2();
        } else {
            return this.star1();
        }
    }

    parse() {
        let lines = this.input.trim().split('\n');
        let insert_re = /([A-Z]{2}) -> ([A-Z])/g;

        this.polymer = lines[0];
        this.inserts = {};

        for (let i = 2; i < lines.length; i++) {
            let matches = [...lines[i].matchAll(insert_re)];

            this.inserts[matches[0][1]] = matches[0][2];
        }
    }

    _insert_pairs(polymer, inserts) {
        let ret = '';

        for (let i = 0; i < (polymer.length-1); i++) {
            let slice = polymer.slice(i, i+2);
            ret += polymer[i] + inserts[slice];
        }

        ret += polymer[polymer.length-1];

        return ret;
    }

    star1() {
        console.debug(this.polymer);
        console.debug(this.inserts);

        let counts = {};
        let least = -1;
        let most = -1;

        for (let i = 0; i < 10; i++) {
            this.polymer = this._insert_pairs(this.polymer, this.inserts);
        }

        for (let i = 0; i < this.polymer.length; i++) {
            counts[this.polymer[i]] = 0;
        }
        for (let i = 0; i < this.polymer.length; i++) {
            counts[this.polymer[i]]++;
        }
        console.debug(counts);
        Object.keys(counts).forEach(key => {
            if (least < 0 || counts[key] < least) {
                least = counts[key];
            }
            if (most < 0 || counts[key] > most) {
                most = counts[key];
            }
        });

        return String(most-least);
    }

    _insert_pairs2(counts, pair_counts, inserts) {
        /* count new chars first */
        Object.keys(pair_counts).forEach(pair => {
            counts[inserts[pair]] += pair_counts[pair];
        });

        /* update pair counts */
        let pair_counts_tmp = {};
        Object.keys(pair_counts).forEach(pair => {
            pair_counts_tmp[pair] = pair_counts[pair];
            pair_counts[pair] = 0;
        });
        Object.keys(pair_counts).forEach(pair => {
            let newp1 = pair[0] + inserts[pair];
            let newp2 = inserts[pair] + pair[1];

            pair_counts[newp1] += pair_counts_tmp[pair];
            pair_counts[newp2] += pair_counts_tmp[pair];
        });
    }

    star2() {
        let counts = {};
        let pair_counts = {};
        let least = -1;
        let most = -1;

        /* setup individual letter count */
        for (let i = 0; i < this.polymer.length; i++) {
            counts[this.polymer[i]] = 0;
        }
        Object.keys(this.inserts).forEach(insert => {
            counts[this.inserts[insert]] = 0;
        });
        for (let i = 0; i < this.polymer.length; i++) {
            counts[this.polymer[i]]++;
        }

        /* setup pair count */
        for (let i = 0; i < Object.keys(counts).length; i++) {
            for (let j = 0; j < Object.keys(counts).length; j++) {
                let key = Object.keys(counts)[i] + Object.keys(counts)[j];
                pair_counts[key] = 0;
            }
        }
        for (let i = 0; i < (this.polymer.length-1); i++) {
            pair_counts[this.polymer.slice(i, i+2)]++;
        }

        console.debug(this.polymer);
        console.debug(counts);
        console.debug(pair_counts);

        for (let i = 0; i < 40; i++) {
            this._insert_pairs2(counts, pair_counts, this.inserts);
        }

        Object.keys(counts).forEach(key => {
            if (least < 0 || counts[key] < least) {
                least = counts[key];
            }
            if (most < 0 || counts[key] > most) {
                most = counts[key];
            }
        });

        return String(most-least);
    }
}
