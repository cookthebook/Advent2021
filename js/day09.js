class day09 {
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
        let lines = this.input.trim().split('\n').map(line => {
            return line.trim();
        });

        this.map = new Array(lines[0].length);
        for (let x = 0; x < this.map.length; x++) {
            this.map[x] = new Array(lines.length);

            for (let y = 0; y < lines.length; y++) {
                this.map[x][y] = parseInt(lines[y][x]);
            }
        };
    }

    star1() {
        let ret = 0;

        for (let x = 0; x < this.map.length; x++) {
            for (let y = 0; y < this.map[x].length; y++) {
                if (
                    y > 0 &&
                    this.map[x][y-1] <= this.map[x][y]
                ) {
                    continue;
                }
                else if (
                    y < (this.map[x].length-1) &&
                    this.map[x][y+1] <= this.map[x][y]
                ) {
                    continue;
                }
                else if (
                    x > 0 &&
                    this.map[x-1][y] <= this.map[x][y]
                ) {
                    continue;
                }
                else if (
                    x < (this.map.length-1) &&
                    this.map[x+1][y] <= this.map[x][y]
                ) {
                    continue;
                }
                ret += this.map[x][y] + 1;
            }
        }

        return String(ret);
    }

    _edge_includes(edge, x, y) {
        for (let i = 0; i < edge.length; i++) {
            if (edge[i][0] === x && edge[i][1] === y) {
                return true;
            }
        }

        return false;
    }

    _collect_basin_edge(x, y, bmap, cur_edge) {
        if (
            x > 0 &&
            bmap[x-1][y].basin === null &&
            bmap[x-1][y].val < 9 &&
            !this._edge_includes(cur_edge, x-1, y)
        ) {
            cur_edge.push([x-1, y]);
        }
        if (
            x < (bmap.length - 1) &&
            bmap[x+1][y].basin === null &&
            bmap[x+1][y].val < 9 &&
            !this._edge_includes(cur_edge, x+1, y)
        ) {
            cur_edge.push([x+1, y]);
        }
        if (
            y > 0 &&
            bmap[x][y-1].basin === null &&
            bmap[x][y-1].val < 9 &&
            !this._edge_includes(cur_edge, x, y-1)
        ) {
            cur_edge.push([x, y-1]);
        }
        if (
            y < (bmap[x].length - 1) &&
            bmap[x][y+1].basin === null &&
            bmap[x][y+1].val < 9 &&
            !this._edge_includes(cur_edge, x, y+1)
        ) {
            cur_edge.push([x, y+1]);
        }
    }

    _traverse_from(x, y, basin, bmap) {
        var ret = 1;
        var edge = [];

        bmap[x][y].basin = basin;
        this._collect_basin_edge(x, y, bmap, edge);

        while (edge.length > 0) {
            var new_edge = [];

            edge.forEach(pair => {
                let [xe, ye] = pair;

                bmap[xe][ye].basin = basin;
                ret++;
                this._collect_basin_edge(xe, ye, bmap, new_edge);
            });

            edge = new_edge;
        }

        return ret;
    }

    star2() {
        let bmap = new Array(this.map.length);
        let basins = [];
        let cur_basin = 0;

        /* setup basin tracking map */
        for (let x = 0; x < bmap.length; x++) {
            bmap[x] = new Array(this.map[x].length);

            for (let y = 0; y < bmap[x].length; y++) {
                bmap[x][y] = {
                    val: this.map[x][y],
                    basin: null
                };
            }
        }

        /* do edge traversal until every point is 9 or in a basin */
        for (let x = 0; x < bmap.length; x++) {
            for (let y = 0; y < bmap[x].length; y++) {
                if (bmap[x][y].basin === null && bmap[x][y].val !== 9) {
                    basins.push(this._traverse_from(x, y, cur_basin, bmap));
                    cur_basin++;
                }
            }
        }

        basins.sort((v1, v2) => {
            return v1 - v2;
        }).reverse();
        console.debug(basins);

        return String(basins[0]*basins[1]*basins[2]);
    }
}
