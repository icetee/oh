const _ = require('lodash');
const cheerio = require("cheerio");
const Browser = require('zombie');
const institution = require('./institution');

let browser = new Browser();
let url = "http://www.oktatas.hu/kozneveles/intezmenykereso/koznevelesi_intezmenykereso";
let first = true;
let max = 0;

let normalize = function(){
    let html = browser.html();
    let $ = cheerio.load(html, {
        decodeEntities: false
    });
    let $datas = $('#main_content div[id^="adat"]');
    let tmp = [];

    if (first) {
        max = $('#main_content > table:nth-child(1) span.red_hl').html() - 0;
        first = !first;
    }

    $datas.each(function() {
        $(this).find('tr:nth-child(1) td:nth-child(3), tr:nth-child(2) td:nth-child(3), tr:nth-child(3) td:nth-child(3)').each(function() {
            tmp.push($(this).html());
        });
    });

    tmp = _.chunk(tmp, 3);

    for (var i = 0; i < tmp.length; i++) {
        let chunk = _.zipObject(['OM', 'name', 'address'], tmp[i]);

        institution.add(chunk);
    }

    browser.document.forms[3].submit();
    browser.wait().then((err, stat) => {
        if (institution.count() < max) {
            normalize();
        } else {
            institution.xls();
        }
    });

};

browser.waitDuration = '30s';
browser.visit(url, {
    runScripts: true,
    loadCSS: false,
    silent: true,
    headers: {
        bot: true
    }
}, () => {
    browser.check('input[value="\'020\', \'022\', \'024\'"]');
    browser.select('#maxRows', '200');

    browser.document.forms[2].submit();
    browser.wait().then(() => {
        normalize();
    });

});
