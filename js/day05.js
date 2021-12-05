class day05 {
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
        var re = /([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)/g;
        var maxx = 0;
        var maxy = 0;

        this.lines = [];
        this.input.split('\n').forEach(line => {
            var matches = [...line.matchAll(re)];
            var new_line = {
                x1: parseInt(matches[0][1]),
                y1: parseInt(matches[0][2]),
                x2: parseInt(matches[0][3]),
                y2: parseInt(matches[0][4])
            };

            if (maxx < new_line.x1) {
                maxx = new_line.x1;
            }
            if (maxx < new_line.x2) {
                maxx = new_line.x2;
            }
            if (maxy < new_line.y1) {
                maxy = new_line.y1;
            }
            if (maxy < new_line.y2) {
                maxy = new_line.y2;
            }

            this.lines.push(new_line);
        });

        this.grid = new Array(maxx+1);
        for (var i = 0; i < (maxx+1); i++) {
            this.grid[i] = new Array(maxy+1).fill(0);
        }
        console.debug(this.grid);
    }

    star1() {
        var ret = 0;

        this.lines.forEach(line => {
            if (line.x1 === line.x2) {
                var y_sm = line.y1 < line.y2 ? line.y1 : line.y2;
                var y_bg = line.y1 > line.y2 ? line.y1 : line.y2;

                for (var y = y_sm; y <= y_bg; y++) {
                    this.grid[line.x1][y] = this.grid[line.x1][y] + 1;

                    if (this.grid[line.x1][y] === 2) {
                        ret++;
                    }
                }
            } else if (line.y1 === line.y2) {
                var x_sm = line.x1 < line.x2 ? line.x1 : line.x2;
                var x_bg = line.x1 > line.x2 ? line.x1 : line.x2;

                for (var x = x_sm; x <= x_bg; x++) {
                    this.grid[x][line.y1] = this.grid[x][line.y1] + 1;

                    if (this.grid[x][line.y1] === 2) {
                        ret++;
                    }
                }
            }
        });

        return String(ret);
    }

    star2() {
        var ret = 0;

        this.lines.forEach(line => {
            if (line.x1 === line.x2) {
                var y_sm = line.y1 < line.y2 ? line.y1 : line.y2;
                var y_bg = line.y1 > line.y2 ? line.y1 : line.y2;

                for (var y = y_sm; y <= y_bg; y++) {
                    this.grid[line.x1][y]++;

                    if (this.grid[line.x1][y] === 2) {
                        ret++;
                    }
                }
            } else if (line.y1 === line.y2) {
                var x_sm = line.x1 < line.x2 ? line.x1 : line.x2;
                var x_bg = line.x1 > line.x2 ? line.x1 : line.x2;

                for (var x = x_sm; x <= x_bg; x++) {
                    this.grid[x][line.y1]++;

                    if (this.grid[x][line.y1] === 2) {
                        ret++;
                    }
                }
            } else if (Math.abs(line.x1 - line.x2) === Math.abs(line.y1 - line.y2)) {
                var x = line.x1;
                var dx = line.x1 < line.x2 ? 1 : -1;
                var y = line.y1;
                var dy = line.y1 < line.y2 ? 1 : -1;

                while (1) {
                    this.grid[x][y]++;

                    if (this.grid[x][y] === 2) {
                        ret++;
                    }

                    if (x === line.x2) {
                        break;
                    }

                    x += dx;
                    y += dy;
                }
            }
        });

        return String(ret);
    }
}
