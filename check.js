var fs = require('fs');
var code = fs.readFileSync('script.js', 'utf8');
try {
    new Function(code);
    console.log('SYNTAX OK - no errors');
} catch(e) {
    console.log('SYNTAX ERROR: ' + e.message);
}
console.log('Total lines: ' + code.split('\n').length);
console.log('Songs array entries: ' + (code.match(/\{ title: "/g)||[]).length);
console.log('logoo.png art fields: ' + (code.match(/art: "IMAGES\/logoo\.png"/g)||[]).length);

