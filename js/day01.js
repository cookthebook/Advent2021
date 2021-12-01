class Day01 {
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
        this.depths = this.input.split('\n').map(line => {
            return parseInt(line);
        });
    }

    star1() {
        var larger = 0;

        for (var i = 1; i < this.depths.length; i++) {
            if (this.depths[i] > this.depths[i-1]) {
                larger++;
            }
        }

        return String(larger);
    }

    star2() {
        var larger = 0;
        var prev = this.depths[0] + this.depths[1] + this.depths[2];

        for (var i = 1; i < this.depths.length-2; i++) {
            var cur = this.depths[i] + this.depths[i+1] + this.depths[i+2];

            if (cur > prev) {
                larger++;
            }

            prev = cur;
        }

        return String(larger);
    }
}
