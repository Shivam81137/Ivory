const fs = require('fs');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'script.js');
let code = fs.readFileSync(SCRIPT, 'utf8');
const log = [];
let fixCount = 0;

// ═══ Fix 1: 'Pink Venom' → Pink Venom (line ~333) ═══
// The title has curly single quotes or regular quotes around Pink Venom
const pvPatterns = [
    /title: "\u2018Pink Venom\u2019"/g,  // curly quotes
    /title: "'Pink Venom'"/g,              // regular single quotes inside double
];
for (const pat of pvPatterns) {
    if (pat.test(code)) {
        code = code.replace(pat, 'title: "Pink Venom"');
        log.push('FIXED: Pink Venom title quotes removed');
        fixCount++;
    }
}

// ═══ Fix 2: I Like You So Much... dirty title (line ~373) ═══
const ilysmDirty = `title: "I Like You So Much, You'll Know It (\u6211\u591A\u559C\u6B22\u4F60\uFF0C\u4F60\u4F1A\u77E5\u9053)- A Love So Beautiful OST -Wang Junqi"`;
const ilysmClean = `title: "I Like You So Much, You'll Know It"`;
if (code.includes(ilysmDirty)) {
    code = code.replace(ilysmDirty, ilysmClean);
    log.push('FIXED: I Like You So Much dirty title');
    fixCount++;
}

// ═══ Fix 3: MERE MEHBOOB QAYAMAT HOGI (line ~789) ═══
const mereIdx = code.indexOf('MERE MEHBOOB QAYAMAT HOGI');
if (mereIdx > -1) {
    const titleStart = code.lastIndexOf('title: "', mereIdx);
    if (titleStart > -1) {
        const valStart = titleStart + 8;
        // Find the closing quote for the title value
        let depth = 0;
        let end = mereIdx + 25; // skip past "MERE MEHBOOB QAYAMAT HOGI"
        while (end < code.length) {
            if (code[end] === '"' && code[end-1] !== '\\') break;
            end++;
        }
        const oldTitle = code.substring(valStart, end);
        code = code.substring(0, valStart) + 'Mere Mehboob Qayamat Hogi' + code.substring(end);
        log.push(`FIXED: "${oldTitle.substring(0,50)}..." → "Mere Mehboob Qayamat Hogi"`);
        fixCount++;
    }
}

// ═══ Fix 4: Beggin → Beggin' (line ~421) ═══
const begginOld = 'title: "Beggin"';
if (code.includes(begginOld)) {
    code = code.replace(begginOld, "title: \"Beggin'\"");
    log.push('FIXED: Beggin → Beggin\'');
    fixCount++;
}

// ═══ Fix 5: "Le" → "Left And Right" (line ~532) ═══
const leOld = 'title: "Le", artist: "Charlie Puth, Jung Kook, BTS"';
if (code.includes(leOld)) {
    code = code.replace(leOld, 'title: "Left And Right", artist: "Charlie Puth, Jung Kook"');
    log.push('FIXED: "Le" → "Left And Right"');
    fixCount++;
}

// ═══ Fix 6: Wrong folder classifications ═══
// Non-Hindi songs wrongly in "Hindi Hits" folder
const folderFixes = [
    // Arabic / International songs
    'Goumi-140', 'Big_And_Chunky-140', 'Paro-140', 'Sway-140',
    'Calypso_RMX-140', 'Sauce-140', 'Habibi_Albanian', 'Habibi-140',
    'Paro_Speed_Up-140', 'All_That_Glitters-140',
    '_-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits"', // Money Rain (Russian)
    'Love_Me_Back_Fayahh', 'Face_Off-140', 'Queen_of_Hearts-140',
    'Dame-140', 'Ice_On_My_Baby_Remix', 'Ara-140',
    'Ice_On_My_Baby-140', 'Love_Nwantiti-140',
    '1_2_3_feat_Jason', 'Dirty_Mind-140',
    'The_Way_I_Are_Radio', 'Eshay-140',
    'Jiggle_Jiggle-140', 'Money_Rain-140',
    'Ooh_Ahh_My_Life', 'I_Love_You-140',
    'My_Bubble_Gum-140', 'Genius_Universalis',
    'Ba_Ba_Ben_Wine', 'Formosa-140',
    'Amor_De_Una_Noche', 'Hamadzayn_Em-140',
    'La_La_La_Li_La_La_La', 'Edge-140',
    'Wanna_Play-140', 'I_Took_a_Nap-140',
    'All_That_Glitters_Acoustic',
    'NAM_DANG_NAM_SOM-140',
    'Money_Rain-140',
];

for (const match of folderFixes) {
    const idx = code.indexOf(match);
    if (idx === -1) continue;
    const lineStart = code.lastIndexOf('\n', idx) + 1;
    const lineEnd = code.indexOf('\n', idx);
    const line = code.substring(lineStart, lineEnd);
    if (line.includes('folder: "Hindi Hits"')) {
        const newLine = line.replace('folder: "Hindi Hits"', 'folder: "Global Hits"');
        code = code.substring(0, lineStart) + newLine + code.substring(lineEnd);
        log.push(`FOLDER FIX: ${match.substring(0,40)} → Global Hits`);
        fixCount++;
    }
}

// Also fix the Russian song "Снова ночь" line
{
    const russianIdx = code.indexOf('\u0421\u043D\u043E\u0432\u0430 \u043D\u043E\u0447\u044C');
    if (russianIdx > -1) {
        const lineStart = code.lastIndexOf('\n', russianIdx) + 1;
        const lineEnd = code.indexOf('\n', russianIdx);
        const line = code.substring(lineStart, lineEnd);
        if (line.includes('folder: "Hindi Hits"')) {
            const newLine = line.replace('folder: "Hindi Hits"', 'folder: "Global Hits"');
            code = code.substring(0, lineStart) + newLine + code.substring(lineEnd);
            log.push('FOLDER FIX: Russian song → Global Hits');
            fixCount++;
        }
    }
}

// ═══ WRITE ═══
fs.writeFileSync(SCRIPT, code, 'utf8');
log.unshift(`Total fixes: ${fixCount}`);
fs.writeFileSync(path.join(__dirname, 'fix_inline_log.txt'), log.join('\n'), 'utf8');

