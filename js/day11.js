class day11 {
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
        let lines = this.input.trim().split('\n')
        this.map = new Array(lines[0].length)

        for (let x = 0; x < this.map.length; x++) {
            this.map[x] = new Array(lines.length)

            for (let y = 0; y < this.map[x].length; y++) {
                this.map[x][y] = parseInt(lines[y][x]);
            }
        }
    }

    _perform_flash(coords) {
        var ret = [];

        coords.forEach(coord => {
            let [x, y] = coord;
            let incrs = [];

            /* check all around this coordinate */
            if (x > 0) {
                if (y > 0 && this.map[x-1][y-1] !== 0) {
                    incrs.push([x-1, y-1])
                }
                if (this.map[x-1][y] !== 0) {
                    incrs.push([x-1, y])
                }
                if (y < (this.map[x].length-1) && this.map[x-1][y+1] !== 0) {
                    incrs.push([x-1, y+1])
                }
            }
            if (x < (this.map.length-1)) {
                if (y > 0 && this.map[x+1][y-1] !== 0) {
                    incrs.push([x+1, y-1])
                }
                if (this.map[x+1][y] !== 0) {
                    incrs.push([x+1, y])
                }
                if (y < (this.map[x].length-1) && this.map[x+1][y+1] !== 0) {
                    incrs.push([x+1, y+1])
                }
            }
            if (y > 0 && this.map[x][y-1] !== 0) {
                incrs.push([x, y-1])
            }
            if (y < (this.map[x].length-1) && this.map[x][y+1] !== 0) {
                incrs.push([x, y+1])
            }

            /* increment all valid octopi */
            incrs.forEach(incr => {
                let [xi, yi] = incr;

                this.map[xi][yi]++;
                if (this.map[xi][yi] === 10) {
                    ret.push([xi, yi]);
                    this.map[xi][yi] = 0;
                }
            });
        });

        return ret;
    }

    _perform_step() {
        let flashers = [];
        let ret = 0;

        for (let x = 0; x < this.map.length; x++) {
            for (let y = 0; y < this.map[x].length; y++) {
                this.map[x][y]++;
                if (this.map[x][y] === 10) {
                    flashers.push([x, y])
                    this.map[x][y] = 0;
                }
            }
        }

        ret += flashers.length
        while (flashers.length > 0) {
            flashers = this._perform_flash(flashers);
            ret += flashers.length;
        }

        return ret;
    }

    star1() {
        let ans = 0;

        for (let i = 0; i < 100; i++) {
            ans += this._perform_step();
        }

        return String(ans);
    }

    star2() {
        let ans = 0;

        while (true) {
            let is_simul = true;

            ans++;
            this._perform_step();

            for (let x = 0; x < this.map.length; x++) {
                for (let y = 0; y < this.map[x].length; y++) {
                    if (this.map[x][y] !== 0) {
                        is_simul = false;
                        break;
                    }
                }

                if (!is_simul) {
                    break;
                }
            }

            if (is_simul) {
                break;
            }
        }

        return String(ans);
    }
}
