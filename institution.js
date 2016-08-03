const fs = require('fs');
const extend = require('lodash/fp/extend');
const json2xls = require('json2xls');

class Institution {
    constructor(data) {
        this.list = [];
    }

    add(data) {
        let opt = extend({
            OM: 0,
            name: "",
            address: ""
        }, data || {});

        this.list.push(opt);
    }

    xls() {
        let self = this;
        let xls = json2xls(self.getAll());

        fs.writeFileSync('data.xlsx', xls, 'binary');
    }

    count() {
        return this.list.length;
    }

    getAll() {
        return this.list;
    }
}

module.exports = new Institution();
