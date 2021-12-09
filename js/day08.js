class day08 {
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

    _pattern_to_segment(pattern) {
        var ret = {
            a: false,
            b: false,
            c: false,
            d: false,
            e: false,
            f: false,
            g: false
        };

        for (var i = 0; i < pattern.length; i++) {
            if (pattern[i] === 'a') {
                ret.a = true;
            } else if (pattern[i] === 'b') {
                ret.b = true;
            } else if (pattern[i] === 'c') {
                ret.c = true;
            } else if (pattern[i] === 'd') {
                ret.d = true;
            } else if (pattern[i] === 'e') {
                ret.e = true;
            } else if (pattern[i] === 'f') {
                ret.f = true;
            } else if (pattern[i] === 'g') {
                ret.g = true;
            }
        }

        return ret;
    }

    parse() {
        this.patterns = [];
        this.digits = [];

        this.input.split('\n').forEach(line => {
            var patterns_str = line.split(' | ')[0];
            var digits_str = line.split(' | ')[1];

            this.patterns.push(patterns_str.split(' ').map(pattern => {
                return this._pattern_to_segment(pattern);
            }));

            this.digits.push(digits_str.split(' ').map(pattern => {
                return this._pattern_to_segment(pattern);
            }));
        });

        console.debug(this.patterns);
        console.debug(this.digits);
    }

    _segments_on(digit) {
        var ret = 0;

        Object.keys(digit).forEach(segment => {
            if (digit[segment] === true) {
                ret++;
            }
        });

        return ret;
    }

    star1() {
        var ret = 0;

        this.digits.forEach((digit, idx) => {
            digit.forEach((d, i) => {
                var cnt = this._segments_on(d);

                if (
                    cnt === 2 || /* 1 */
                    cnt === 3 || /* 7 */
                    cnt === 4 || /* 4 */
                    cnt === 7    /* 8 */
                ) {
                    console.debug(`row ${idx}, ${i}`);
                    ret++;
                }
            });
        });

        return String(ret);
    }

    star2() {
    }
}
