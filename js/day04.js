class day04 {
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
        var lines = this.input.split('\n');

        /* get all the numbers drawn */
        this.draws = lines[0].split(',').map(input => {
            return parseInt(input);
        });

        /* go through each board */
        var cur_board = 0;
        this.boards = [];

        for (var i = 1; i < lines.length; i += 6) {
            this.boards.push({
                rows: []
            });

            for (var j = i+1; j < (i+6); j++) {
                var row = lines[j].split(/\s+/);

                if (row[0] === "") {
                    row = row.slice(1);
                }

                this.boards[cur_board].rows.push(row.map(val => {
                    return [parseInt(val), false];
                }));
            }

            cur_board++;
        }
    }

    _run_draw(value) {
        this.boards.forEach(board => {
            board.rows.forEach(row => {
                row.forEach(cell => {
                    if (cell[0] === value) {
                        cell[1] = true;
                    }
                });
            });
        });
    }

    _is_solve(board) {
        /* check for solved rows */
        for (var i = 0; i < board.rows.length; i++) {
            var issolved = true;

            for (var j = 0; j < board.rows[i].length; j++) {
                if (board.rows[i][j][1] === false) {
                    issolved = false;
                    break;
                }
            }

            if (issolved) {
                return true;
            }
        }

        /* check for solved columns */
        for (var i = 0; i < board.rows[0].length; i++) {
            var issolved = true;

            for (var j = 0; j < board.rows.length; j++) {
                if (board.rows[j][i][1] === false) {
                    issolved = false;
                    break;
                }
            }

            if (issolved) {
                return true;
            }
        }

        return false;
    }

    star1() {
        var solution = null;
        var draw_idx = 0;

        while (solution === null) {
            this._run_draw(this.draws[draw_idx]);

            for (var i = 0; i < this.boards.length; i++) {
                if (this._is_solve(this.boards[i])) {
                    solution = this.boards[i];
                    break;
                }
            }

            draw_idx++;
        }

        var unmarked = 0;
        solution.rows.forEach(row => {
            row.forEach(col => {
                if (col[1] === false) {
                    unmarked += col[0];
                }
            });
        });

        return String(this.draws[draw_idx-1] * unmarked);
    }

    star2() {
        var n_solved = 0;
        var last_solved = null;
        var draw_idx = 0;
        var solved = [];

        while (n_solved < this.boards.length) {
            this._run_draw(this.draws[draw_idx]);

            for (var i = 0; i < this.boards.length; i++) {
                if (!solved.includes(i) && this._is_solve(this.boards[i])) {
                    n_solved++;
                    last_solved = this.boards[i];
                    solved.push(i);
                }
            }

            draw_idx++;
        }

        var unmarked = 0;
        last_solved.rows.forEach(row => {
            row.forEach(col => {
                if (col[1] === false) {
                    unmarked += col[0];
                }
            });
        });

        return String(this.draws[draw_idx-1] * unmarked);
    }
}
