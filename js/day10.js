class day10 {
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
        this.lines = this.input.trim().split('\n');
    }

    star1() {
        let ret = 0;

        this.lines.forEach(line => {
            let queue = [];

            for (let i = 0; i < line.length; i++) {
                let found_err = false;

                switch (line[i]) {
                case '(':
                case '[':
                case '{':
                case '<':
                    queue.push(line[i]);
                    break;

                case ')':
                {
                    let open = queue.pop();
                    if (open !== '(') {
                        ret += 3;
                        found_err = true;
                        break;
                    }
                    break;
                }
                case ']':
                {
                    let open = queue.pop();
                    if (open !== '[') {
                        ret += 57;
                        found_err = true;
                        break;
                    }
                    break;
                }
                case '}':
                {
                    let open = queue.pop();
                    if (open !== '{') {
                        ret += 1197;
                        found_err = true;
                        break;
                    }
                    break;
                }
                case '>':
                {
                    let open = queue.pop();
                    if (open !== '<') {
                        ret += 25137;
                        found_err = true;
                        break;
                    }
                    break;
                }

                default:
                    break;
                }

                if (found_err) {
                    break;
                }
            }
        });

        return String(ret);
    }

    star2() {
        let counts = [];
        let ret = 0;

        this.lines.forEach(line => {
            let queue = [];
            let found_err = false;

            for (let i = 0; i < line.length; i++) {
                switch (line[i]) {
                case '(':
                case '[':
                case '{':
                case '<':
                    queue.push(line[i]);
                    break;

                case ')':
                {
                    let open = queue.pop();
                    if (open !== '(') {
                        found_err = true;
                        break;
                    }
                    break;
                }
                case ']':
                {
                    let open = queue.pop();
                    if (open !== '[') {
                        found_err = true;
                        break;
                    }
                    break;
                }
                case '}':
                {
                    let open = queue.pop();
                    if (open !== '{') {
                        found_err = true;
                        break;
                    }
                    break;
                }
                case '>':
                {
                    let open = queue.pop();
                    if (open !== '<') {
                        found_err = true;
                        break;
                    }
                    break;
                }

                default:
                    break;
                }

                if (found_err) {
                    break;
                }
            }

            if (found_err || queue.length === 0) {
                return;
            }

            let count = 0;
            for (let i = (queue.length-1); i >= 0; i--) {
                switch (queue[i]) {
                case '(':
                    count *= 5;
                    count += 1;
                    break;
                case '[':
                    count *= 5;
                    count += 2;
                    break;
                case '{':
                    count *= 5;
                    count += 3;
                    break;
                case '<':
                    count *= 5;
                    count += 4;
                    break;
                }
            }
            counts.push(count);
        });

        console.debug(counts);
        counts.sort((v1, v2) => { return v1 - v2; });
        return String(counts[Math.floor(counts.length/2)]);
    }
}
