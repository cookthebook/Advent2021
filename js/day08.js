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

    _decode_pattern(patterns) {
        var ret = new Array(10);
        ret.fill(null);

        /* just fill out unique segment counts */
        patterns.forEach(pattern => {
            var on_cnt = this._segments_on(pattern);

            if (on_cnt === 2) {
                ret[1] = pattern;
            } else if (on_cnt === 3) {
                ret[7] = pattern;
            } else if (on_cnt === 4) {
                ret[4] = pattern;
            } else if (on_cnt === 7) {
                ret[8] = pattern;
            }
        });

        /* 5 segments on maps to 2, 3, or 5 */
        for (var i = 0; i < patterns.length; i++) {
            if (this._segments_on(patterns[i]) !== 5) {
                continue;
            }

            /* 3 contains 1 */
            if (ret[3] === null) {
                var contains_1 = true;

                for (var j = 0; j < Object.keys(ret[1]).length; j++) {
                    var key = Object.keys(ret[1])[j];

                    if (ret[1][key] === true && patterns[i][key] !== true) {
                        contains_1 = false;
                        break;
                    }
                }

                if (contains_1) {
                    ret[3] = patterns[i];
                    continue;
                }
            }

            /* 5 contains 1 segment of 1 and 3 segments of 4 */
            if (ret[5] === null) {
                var share_1 = 0;
                var share_4 = 0;

                for (var j = 0; j < Object.keys(ret[1]).length; j++) {
                    var key = Object.keys(ret[1])[j];

                    if (ret[1][key] === true && patterns[i][key] === true) {
                        share_1++;
                    }

                    if (ret[4][key] === true && patterns[i][key] === true) {
                        share_4++;
                    }
                }

                if (share_1 === 1 && share_4 === 3) {
                    ret[5] = patterns[i];
                    continue;
                }
            }

            /* 2 contains 1 segment of 1 and 2 segments of 4 */
            if (ret[2] === null) {
                var share_1 = 0;
                var share_4 = 0;

                for (var j = 0; j < Object.keys(ret[1]).length; j++) {
                    var key = Object.keys(ret[1])[j];

                    if (ret[1][key] === true && patterns[i][key] === true) {
                        share_1++;
                    }

                    if (ret[4][key] === true && patterns[i][key] === true) {
                        share_4++;
                    }
                }

                if (share_1 === 1 && share_4 === 2) {
                    ret[2] = patterns[i];
                    continue;
                }
            }
        }

        /* 6 segments on maps to 0, 6, or 9 */
        for (var i = 0; i < patterns.length; i++) {
            if (this._segments_on(patterns[i]) !== 6) {
                continue;
            }

            /* 0 contains 1, 9 contains 1 and 5, 6 does not contain 1 */
            var contains_1 = true;
            var contains_5 = true;

            for (var j = 0; j < Object.keys(ret[1]).length; j++) {
                var key = Object.keys(ret[1])[j];

                if (ret[1][key] === true && patterns[i][key] !== true) {
                    contains_1 = false;
                }

                if (ret[5][key] === true && patterns[i][key] !== true) {
                    contains_5 = false;
                }
            }

            if (contains_1 && contains_5) {
                ret[9] = patterns[i];
            } else if (contains_1) {
                ret[0] = patterns[i];
            } else {
                ret[6] = patterns[i];
            }
        }

        return ret;
    }

    _segs_are_equal(seg1, seg2) {
        var ret = true;

        for (var i = 0; i < Object.keys(seg1).length; i++) {
            var k = Object.keys(seg1)[i];

            if (seg1[k] !== seg2[k]) {
                ret = false;
                break;
            }
        }

        return ret;
    }

    star2() {
        var ret = 0;

        this.patterns.forEach((pattern, idx) => {
            var decode = this._decode_pattern(pattern);
            var digits = [0, 0, 0, 0];

            this.digits[idx].forEach((d, i) => {
                for (var j = 0; j < decode.length; j++) {
                    if (this._segs_are_equal(decode[j], d)) {
                        digits[i] = j;
                        break;
                    }
                }
            });

            ret += digits[0]*(10**3) + digits[1]*(10**2) + digits[2]*10 + digits[3];
        });

        return String(ret);
    }
}
