class day13 {
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

    star2() {
        let counts = {};
        let least = -1;
        let most = -1;

        for (let i = 0; i < this.polymer.length; i++) {
            counts[this.polymer[i]] = 0;
        }
        this.inserts.forEach(insert => {
            counts[insert] = 0;
        })
        for (let i = 0; i < this.polymer.length; i++) {
            counts[this.polymer[i]]++;
        }

        for (let i = 0; i < 10; i++) {
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
}
