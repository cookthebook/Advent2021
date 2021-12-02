class day02 {
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
        this.instrs = this.input.split('\n').map(line => {
            if (line === "") {
                return [0, 0];
            }

            var [command, val] = line.split(' ');
            val = parseInt(val);

            if (command === 'forward') {
                return [val, 0];
            } else if (command === 'down') {
                return [0, val];
            } else {
                return [0, -1 * val];
            }
        });
    }

    star1() {
        var position = 0;
        var depth = 0;

        this.instrs.forEach(instr => {
            position += instr[0];
            depth += instr[1];

            if (depth < 0) {
                depth = 0;
            }
        });

        return String(position * depth);
    }

    star2() {
        var position = 0;
        var depth = 0;
        var aim = 0;

        this.instrs.forEach(instr => {
            position += instr[0];
            aim += instr[1];
            depth += aim * instr[0];

            if (depth < 0) {
                depth = 0;
            }
        });

        return String(position * depth);
    }
}
