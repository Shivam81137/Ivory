const fs = require('fs');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'script.js');
let code = fs.readFileSync(SCRIPT, 'utf8');

const log = [];

// Fix "I Like You So Much" dirty title (in auto-categorized section)
const idx = code.indexOf('Wang Junqi');
log.push('Wang Junqi index: ' + idx);

if (idx > -1) {
    const start = code.lastIndexOf('title: "', idx);
    const end = code.indexOf('"', idx + 10);
    log.push('start: ' + start + ', end: ' + end);
    const oldTitle = code.substring(start, end + 1);
    log.push('old: ' + oldTitle.substring(0, 80));
    code = code.substring(0, start) + "title: \"I Like You So Much, You'll Know It\"" + code.substring(end + 1);
    log.push('FIXED');
}

// Fix "MERE MEHBOOB QAYAMAT HOGI" dirty title
const idx2 = code.indexOf('MERE MEHBOOB QAYAMAT HOGI');
log.push('MERE MEHBOOB index: ' + idx2);

if (idx2 > -1) {
    const start2 = code.lastIndexOf('title: "', idx2);
    const titleStr = code.substring(start2);
    const endQuote = titleStr.indexOf('"', 8); // skip past 'title: "'
    const oldTitle2 = titleStr.substring(0, endQuote + 1);
    log.push('old2: ' + oldTitle2.substring(0, 60));
    code = code.substring(0, start2) + 'title: "Mere Mehboob Qayamat Hogi"' + code.substring(start2 + endQuote + 1);
    log.push('FIXED2');
}

// Fix "'Pink Venom'" → "Pink Venom"
code = code.replace(/title: "'Pink Venom'"/g, 'title: "Pink Venom"');

// Fix lowercase titles in auto-categorized: "fantasize" → "Fantasize", "positions" → "Positions", "double take" → "Double Take"
code = code.replace(/title: "fantasize"/g, 'title: "Fantasize"');
code = code.replace(/title: "positions"/g, 'title: "Positions"');
code = code.replace(/title: "double take"/g, 'title: "Double Take"');

// Fix "Ae Dil Hai Mushkil Title Track" → "Ae Dil Hai Mushkil"
code = code.replace(/title: "Ae Dil Hai Mushkil Title Track"/g, 'title: "Ae Dil Hai Mushkil"');

fs.writeFileSync(SCRIPT, code, 'utf8');
fs.writeFileSync(path.join(__dirname, 'fix_title_log.txt'), log.join('\n'), 'utf8');

