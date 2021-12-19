class Packet {
    constructor(binary) {
        this.binary = binary;
        this.version = parseInt(binary.slice(0, 3), 2);
        this.type = parseInt(binary.slice(3, 6), 2);
        this.parsed_len = 6;

        switch (this.type) {
            case 4:
                this._parse_literal();
                break;
            default:
                this._parse_operator();
                break;
        }
    }

    _parse_literal() {
        let pos = 6;
        let value_str = '';

        while (true) {
            let stop = (this.binary[pos] === '0');
            value_str += this.binary.slice(pos+1, pos+5);
            pos += 5;

            if (stop) {
                break;
            }
        }

        this.value = parseInt(value_str, 2);
        this.parsed_len = pos;
    }

    _parse_operator() {
        /* operator packet with bit length */
        let bits_parsed = 0;
        this.length_type = parseInt(this.binary[6], 2);

        if (this.length_type === 0) {
            /* type 0 is 15 bit sub-packet length */
            this.sub_packet_len = parseInt(this.binary.slice(7, 22), 2);
            this.sub_packet_ofs = 22;

            this.sub_packets = [];
            while (bits_parsed < this.sub_packet_len) {
                this.sub_packets.push(new Packet(
                    this.binary.slice(this.sub_packet_ofs + bits_parsed)
                ));

                bits_parsed += this.sub_packets[this.sub_packets.length-1].parsed_len;
            }
        } else {
            /* type 1 is 11 bit sub-packet count */
            this.sub_packet_cnt = parseInt(this.binary.slice(7, 18), 2);
            this.sub_packet_ofs = 18;

            this.sub_packets = [];
            for (let i = 0; i < this.sub_packet_cnt; i++) {
                this.sub_packets.push(new Packet(
                    this.binary.slice(this.sub_packet_ofs + bits_parsed)
                ));

                bits_parsed += this.sub_packets[this.sub_packets.length-1].parsed_len;
            }
        }

        this.parsed_len = this.sub_packet_ofs + bits_parsed;

        /* value based on operation */
        switch (this.type) {
            case 0:
                /* sum */
                this.value = this.sub_packets.reduce((prev, cur) => {
                    return prev + cur.value;
                }, 0);
                break;
            case 1:
                /* product */
                this.value = this.sub_packets.reduce((prev, cur) => {
                    return prev * cur.value;
                }, 1);
                break;
            case 2:
                /* min */
                this.value = this.sub_packets[0].value;
                for (let i = 1; i < this.sub_packets.length; i++) {
                    if (this.sub_packets[i].value < this.value) {
                        this.value = this.sub_packets[i].value;
                    }
                }
                break;
            case 3:
                /* max */
                this.value = this.sub_packets[0].value;
                for (let i = 1; i < this.sub_packets.length; i++) {
                    if (this.sub_packets[i].value > this.value) {
                        this.value = this.sub_packets[i].value;
                    }
                }
                break;
            case 5:
                this.value = this.sub_packets[0].value > this.sub_packets[1].value ? 1 : 0;
                break;
            case 6:
                this.value = this.sub_packets[0].value < this.sub_packets[1].value ? 1 : 0;
                break;
            case 7:
                this.value = this.sub_packets[0].value === this.sub_packets[1].value ? 1 : 0;
                break;
        }
    }
}

class day16 {
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
        this.input = this.input.trim();
        this.packet_str = '';
        for (let i = 0; i < this.input.length; i++) {
            let binstr = parseInt(this.input[i], 16).toString(2);

            while (binstr.length < 4) {
                binstr = '0' + binstr;
            }

            this.packet_str += binstr;
        }

        while ((this.packet_str.length % 8) !== 0) {
            this.packet_str = '0' + this.packet_str;
        }
    }

    _sum_versions(packet) {
        let ret = packet.version;

        if (packet.sub_packets) {
            packet.sub_packets.forEach(sub_packet => {
                ret += this._sum_versions(sub_packet);
            });
        }

        return ret;
    }

    star1() {
        let packet = new Packet(this.packet_str);
        console.debug(packet);

        return String(this._sum_versions(packet));
    }

    star2() {
        let packet = new Packet(this.packet_str);
        console.debug(packet);

        return String(packet.value);
    }
}
