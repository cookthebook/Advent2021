class day12 {
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

    _find_node(nodes, name) {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].name === name) {
                return i;
            }
        }

        return -1;
    }

    _new_node(name) {
        return {
            name: name,
            paths: [],
            n_visited: 0
        };
    }

    parse() {
        this.nodes = [];

        this.input.trim().split('\n').forEach(line => {
            let [n1, n2] = line.split('-');
            let i1 = this._find_node(this.nodes, n1);
            let i2 = this._find_node(this.nodes, n2);

            if (i1 < 0) {
                i1 = this.nodes.length;
                this.nodes.push(this._new_node(n1));
            }
            if (i2 < 0) {
                i2 = this.nodes.length;
                this.nodes.push(this._new_node(n2));
            }

            if (!this.nodes[i1].paths.includes(i2)) {
                this.nodes[i1].paths.push(i2);
            }
            if (!this.nodes[i2].paths.includes(i1)) {
                this.nodes[i2].paths.push(i1);
            }
        });
    }

    _clone_map(nodes) {
        return nodes.map(node => {
            return {
                name: node.name,
                paths: node.paths.slice(),
                n_visited: node.n_visited
            };
        });
    }

    _is_small(node) {
        if (node.name[0] >= 'a' && node.name[0] <= 'z') {
            return true;
        } else {
            return false;
        }
    }

    _traverse(nodes, path) {
        let ret = 0;
        let cur = path[path.length - 1];

        if (nodes[cur].name === 'end') {
            // console.debug(`Path: ${path.map(idx => { return nodes[idx].name; }).join()}`);
            return 1;
        }

        nodes[cur].paths.forEach(idx => {
            if (
                nodes[idx].name !== 'start' &&
                (!this._is_small(nodes[idx]) || nodes[idx].n_visited === 0)
            ) {
                let new_path = path.slice();
                let new_nodes = this._clone_map(nodes);
                new_path.push(idx);
                new_nodes[idx].n_visited++;
                ret += this._traverse(new_nodes, new_path);
            }
        });

        return ret;
    }

    star1() {
        console.debug(this.nodes);

        let ret = this._traverse(this.nodes, [this._find_node(this.nodes, 'start')]);

        return String(ret);
    }

    _traverse2(nodes, path, visited_small_twice) {
        let ret = 0;
        let cur = path[path.length - 1];

        if (nodes[cur].name === 'end') {
            // console.debug(`Path: ${path.map(idx => { return nodes[idx].name; }).join()}`);
            return 1;
        }

        nodes[cur].paths.forEach(idx => {
            if (
                /* not the start */
                nodes[idx].name !== 'start' &&
                (
                    /* is big */
                    !this._is_small(nodes[idx]) ||
                    /* is small but traversable */
                    (nodes[idx].n_visited === 0 || (nodes[idx].n_visited === 1 && !visited_small_twice))
                )
            ) {
                let new_path = path.slice();
                let new_nodes = this._clone_map(nodes);
                let new_visited_small_twice = (
                    visited_small_twice ||
                    (this._is_small(nodes[idx]) && nodes[idx].n_visited === 1)
                );

                new_path.push(idx);
                new_nodes[idx].n_visited++;
                ret += this._traverse2(new_nodes, new_path, new_visited_small_twice);
            }
        });

        return ret;
    }

    star2() {
        console.debug(this.nodes);

        let ret = this._traverse2(this.nodes, [this._find_node(this.nodes, 'start')], false);

        return String(ret);
    }
}
