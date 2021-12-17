class day15 {
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

        this.grid = new Array(lines[0].length);
        for (let x = 0; x < this.grid.length; x++) {
            this.grid[x] = new Array(lines.length);

            for (let y = 0; y < this.grid[x].length; y++) {
                this.grid[x][y] = parseInt(lines[y][x]);
            }
        }

        console.debug(this.grid);
    }

    _heuristic(x, y) {
        return Math.sqrt(x**2 + y**2);
    }

    _reconstruct_path(cameFrom, current) {
        let ret = [current];

        while (cameFrom[current[0]][current[1]] !== null) {
            current = cameFrom[current[0]][current[1]]
            ret.push(current);
        }

        ret.reverse();
        return ret;
    }

    /* https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode */
    _astar() {
        let openSet = [[0, 0]];

        let cameFrom = new Array(this.grid.length);
        let gScore = new Array(this.grid.length);
        let fScore = new Array(this.grid.length);

        for (let x = 0; x < cameFrom.length; x++) {
            cameFrom[x] = new Array(this.grid[x].length);
            cameFrom[x].fill(null);

            gScore[x] = new Array(this.grid[x].length);
            gScore[x].fill(Infinity);

            fScore[x] = new Array(this.grid[x].length);
            fScore[x].fill(Infinity);
        }

        gScore[openSet[0][0]][openSet[0][1]] = 0;
        fScore[openSet[0][0]][openSet[0][1]] = this._heuristic(openSet[0][0], openSet[0][1]);

        while (openSet.length > 0) {
            /* find the lowest fscore node in the open set */
            let current_fscore = fScore[openSet[0][0]][openSet[0][1]];
            let current = openSet[0];

            for (let i = 1; i < openSet.length; i++) {
                if (fScore[openSet[i][0]][openSet[i][1]] < current_fscore) {
                    current_fscore = fScore[openSet[i][0]][openSet[i][1]];
                    current = openSet[i];
                }
            }

            /* this is the goal */
            if (current[0] === (this.grid.length-1) && current[1] === (this.grid[0].length-1)) {
                return this._reconstruct_path(cameFrom, current);
            }

            /* check neighbors of current node */
            openSet.splice(openSet.indexOf(current), 1);

            let neighbors = [];
            if (current[0] > 0) {
                neighbors.push([current[0]-1, current[1]]);
            }
            if (current[0] < (this.grid.length - 1)) {
                neighbors.push([current[0]+1, current[1]]);
            }
            if (current[1] > 0) {
                neighbors.push([current[0], current[1]-1]);
            }
            if (current[1] < (this.grid[0].length-1)) {
                neighbors.push([current[0], current[1]+1]);
            }

            neighbors.forEach(neighbor => {
                /* the grid values are the line weights from all directions */
                let tmp_gscore = gScore[current[0]][current[1]] + this.grid[neighbor[0]][neighbor[1]]

                if (tmp_gscore < gScore[neighbor[0]][neighbor[1]]) {
                    cameFrom[neighbor[0]][neighbor[1]] = current;
                    gScore[neighbor[0]][neighbor[1]] = tmp_gscore;
                    fScore[neighbor[0]][neighbor[1]] = tmp_gscore + this._heuristic(neighbor[0], neighbor[1]);

                    let openset_includes = false;
                    for (let i = 0; i < openSet.length; i++) {
                        if (openSet[i][0] === neighbor[0] && openSet[i][1] === neighbor[1]) {
                            openset_includes = true;
                            break;
                        }
                    }

                    if (!openset_includes) {
                        openSet.push([neighbor[0], neighbor[1]]);
                    }
                }
            });
        }

        return [];
    }

    star1() {
        let path = this._astar();
        console.debug('Path', path);

        let ret = 0;
        for (let i = 1; i < path.length; i++) {
            ret += this.grid[path[i][0]][path[i][1]];
        }

        return String(ret);
    }

    star2() {
        /* expand x-dimension */
        let grid_big = new Array(this.grid.length * 5);

        for (let x = 0; x < grid_big.length; x++) {
            let smx = x % (this.grid.length);
            grid_big[x] = new Array(this.grid[smx].length * 5);

            for (let y = 0; y < grid_big[x].length; y++) {
                let smy = y % (this.grid[smx].length);
                let increase = Math.floor(x/(this.grid.length)) + Math.floor(y/(this.grid[0].length));
                grid_big[x][y] = ((this.grid[smx][smy] + increase - 1) % 9) + 1;
            }
        }

        this.grid = grid_big;
        let path = this._astar();
        console.debug('Path', path);

        let ret = 0;
        for (let i = 1; i < path.length; i++) {
            ret += this.grid[path[i][0]][path[i][1]];
        }

        return String(ret);
    }
}
