class day06 {
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
        this.fish = this.input.split(',').map(val => {
            return parseInt(val);
        });
    }

    _fish_from(age, days) {
        if (age > 0) {
            return this._fish_from(0, days - age);
        } else if (days >= 0 && this.fish_from_memo[days] !== null) {
            return this.fish_from_memo[days];
        }

        var ret = 0;
        var days_left = days;
        while (days_left > 0) {
            ret += 1 + this._fish_from(8, days_left-1);
            days_left -= 7;
        }

        this.fish_from_memo[days] = ret;
        return ret;
    }

    star1() {
        this.fish_from_memo = new Array(81);
        this.fish_from_memo.fill(null);

        var ret = this.fish.length;
        this.fish.forEach(fish => {
            ret += this._fish_from(fish, 80);
        });

        return String(ret);
    }

    star2() {
        this.fish_from_memo = new Array(257);
        this.fish_from_memo.fill(null);

        var ret = this.fish.length;
        this.fish.forEach(fish => {
            ret += this._fish_from(fish, 256);
        });

        return String(ret);
    }
}
