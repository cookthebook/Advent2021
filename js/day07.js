class day07 {
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
        this.crabs = this.input.split('\n')[0].split(',').map(val => {
            return parseInt(val);
        })
    }

    _check_val(crabs, val) {
        var ret = 0;

        crabs.forEach(crab => {
            ret += Math.abs(val - crab);
        });

        return ret;
    }

    star1() {
        var min = -1;
        this.crabs.sort();
        for (var i = this.crabs[0]; i < this.crabs[this.crabs.length - 1]; i++) {
            var val = this._check_val(this.crabs, i);
            if (min < 0 || val < min) {
                min = val;
            }
        }

        return String(min);
    }

    _check_val2(crabs, val) {
        var ret = 0;

        crabs.forEach(crab => {
            var diff =  Math.abs(val - crab);
            ret += ((diff+1)*diff)/2;
        });

        return ret;
    }

    star2() {
        var min = -1;
        this.crabs.sort();
        for (var i = this.crabs[0]; i < this.crabs[this.crabs.length - 1]; i++) {
            var val = this._check_val2(this.crabs, i);
            if (min < 0 || val < min) {
                min = val;
            }
        }

        return String(min);
    }
}
