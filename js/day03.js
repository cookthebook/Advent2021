class day03 {
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
        this.bit_maps = this.input.split('\n').map(line => {
            var ret = [];
            line = line.trim();

            for (var i = 0; i < line.length; i++) {
                ret.push(parseInt(line[i]));
            }

            return ret;
        });
    }

    _count_bits(bitmaps) {
        var ret = Array(this.bit_maps[0].length);

        ret.fill(0);
        bitmaps.forEach(bitmap => {
            bitmap.forEach((bit, idx) => {
                ret[idx] += bit;
            });
        });

        return ret;
    }

    star1() {
        var gamma = Array(this.bit_maps[0].length);
        var gamma_ret = 0;
        var epsilon_ret = 0;

        gamma.fill(0);
        this.bit_maps.forEach(bitmap => {
            bitmap.forEach((bit, idx) => {
                gamma[idx] += bit;
            });
        });

        gamma.forEach((bit_cnt, idx) => {
            if (bit_cnt > (this.bit_maps.length/2)) {
                gamma_ret += (2**(gamma.length - idx - 1));
            } else {
                epsilon_ret += (2**(gamma.length - idx - 1));
            }
        });

        return String(gamma_ret * epsilon_ret);
    }

    star2() {
        var oxygen_bitmaps = this.bit_maps;
        var bit_idx = 0;

        while (oxygen_bitmaps.length > 1) {
            var oxygen_bitmap_cnts = this._count_bits(oxygen_bitmaps);
            var match = oxygen_bitmap_cnts[bit_idx] >= (oxygen_bitmaps.length/2) ? 1 : 0;

            oxygen_bitmaps = oxygen_bitmaps.filter(bitmap => {
                return (bitmap[bit_idx] === match);
            });

            bit_idx++;
        }

        var oxygen = 0;
        oxygen_bitmaps[0].forEach((bit, idx) => {
            oxygen += 2**(oxygen_bitmaps[0].length - idx - 1) * bit;
        });



        var co2_bitmaps = this.bit_maps;
        bit_idx = 0;
        while (co2_bitmaps.length > 1) {
            var co2_bitmap_cnts = this._count_bits(co2_bitmaps);
            var match = co2_bitmap_cnts[bit_idx] >= (co2_bitmaps.length/2) ? 0 : 1;

            co2_bitmaps = co2_bitmaps.filter(bitmap => {
                return (bitmap[bit_idx] === match);
            });

            bit_idx++;
        }

        var co2 = 0;
        co2_bitmaps[0].forEach((bit, idx) => {
            co2 += 2**(co2_bitmaps[0].length - idx - 1) * bit;
        });

        return String(oxygen * co2);
    }
}
