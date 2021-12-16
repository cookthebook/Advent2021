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
        let coord_re = /([0-9]+),([0-9]+)/g;
        let fold_re = /fold along (x|y)=([0-9]+)/g;
        let coords = [];
        let maxx = 0;
        let maxy = 0;

        this.grid = [];
        this.folds = [];

        this.input.trim().split('\n').forEach(line => {
            let coord_matches = [...line.matchAll(coord_re)];
            let fold_matches = [...line.matchAll(fold_re)];

            if (coord_matches.length > 0) {
                let x = parseInt(coord_matches[0][1]);
                let y = parseInt(coord_matches[0][2]);

                coords.push([x, y]);

                if (x > maxx) {
                    maxx = x;
                }
                if (y > maxy) {
                    maxy = y;
                }

            } else if (fold_matches.length > 0) {
                let fold_val = parseInt(fold_matches[0][2]);

                if (fold_matches[0][1] === 'x') {
                    this.folds.push({
                        x: fold_val,
                        y: null
                    });
                } else {
                    this.folds.push({
                        x: null,
                        y: fold_val
                    });
                }
            }
        });

        this.grid = new Array(maxx+1);
        for (let x = 0; x < this.grid.length; x++) {
            this.grid[x] = new Array(maxy+1);
            this.grid[x].fill(false);
        }

        coords.forEach(coord => {
            let [x, y] = coord;
            this.grid[x][y] = true;
        });
    }

    _foldy(grid, val) {
        let ret = new Array(grid.length);

        /* setup return grid */
        for (let x = 0; x < ret.length; x++) {
            ret[x] = new Array(val);

            for (let y = 0; y < ret[x].length; y++) {
                ret[x][y] = grid[x][y];
            }
        }

        /* reflect values onto grid */
        for (let x = 0; x < grid.length; x++) {
            for (let y = (val+1); y < grid[x].length; y++) {
                let rety = ret[x].length - (y - val);
                ret[x][rety] = ret[x][rety] || grid[x][y];
            }
        }

        return ret;
    }

    _foldx(grid, val) {
        let ret = new Array(val);

        /* setup return grid */
        for (let x = 0; x < ret.length; x++) {
            ret[x] = new Array(grid[x].length);

            for (let y = 0; y < ret[x].length; y++) {
                ret[x][y] = grid[x][y];
            }
        }

        /* reflect values onto grid */
        for (let x = (val+1); x < grid.length; x++) {
            let retx = ret.length - (x - val);
            for (let y = 0; y < grid[x].length; y++) {
                ret[retx][y] = ret[retx][y] || grid[x][y];
            }
        }

        return ret;
    }

    star1() {
        console.debug(this.grid);
        console.debug(this.folds);

        if (this.folds[0].x !== null) {
            this.grid = this._foldx(this.grid, this.folds[0].x);
        } else {
            this.grid = this._foldy(this.grid, this.folds[0].y);
        }


        let ret = 0;
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                if (this.grid[x][y]) {
                    ret++;
                }
            }
        }

        return String(ret);
    }

    star2() {
        this.folds.forEach(fold => {
            if (fold.x !== null) {
                this.grid = this._foldx(this.grid, fold.x);
            } else {
                this.grid = this._foldy(this.grid, fold.y);
            }
        });

        let ret = '';
        for (let y = 0; y < this.grid[0].length; y++) {
            for (let x = 0; x < this.grid.length; x++) {
                if (this.grid[x][y]) {
                    ret += '\u2588';
                } else {
                    ret += '_';
                }
            }

            ret += '\n';
        }

        return ret;
    }
}
