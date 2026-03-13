/**
 * fix_all_titles.js — Comprehensive cleanup of ALL remaining dirty titles
 * Fixes: lowercase titles, "Title Track" suffixes, Hindi/Chinese in titles,
 *        wrong artist casing, wrong folder classifications
 */
const fs = require('fs');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'script.js');
let code = fs.readFileSync(SCRIPT, 'utf8');
const log = [];
let fixCount = 0;

// ═══════════════════════════════════════════════════════════════════════════
// 1. FIX DIRTY TITLE: "I Like You So Much..." with Chinese characters (line 373)
// ═══════════════════════════════════════════════════════════════════════════
// Use indexOf to find the exact position
let searchStr = 'Wang Junqi"';
let pos = 0;
while ((pos = code.indexOf(searchStr, pos)) !== -1) {
    // Find the start of title: " before this
    const titleStart = code.lastIndexOf('title: "', pos);
    if (titleStart === -1) { pos++; continue; }
    const titleValueStart = titleStart + 8; // skip 'title: "'
    const titleEnd = code.indexOf('"', pos + searchStr.length - 1);
    if (titleEnd === -1) { pos++; continue; }
    
    const oldTitle = code.substring(titleValueStart, titleEnd);
    // Only fix if the title contains Chinese characters or "Wang Junqi"
    if (oldTitle.includes('Wang Junqi') || oldTitle.includes('我多喜欢你')) {
        const newTitle = "I Like You So Much, You'll Know It";
        code = code.substring(0, titleValueStart) + newTitle + code.substring(titleEnd);
        log.push(`FIXED: "${oldTitle.substring(0,60)}..." → "${newTitle}"`);
        fixCount++;
    }
    pos++;
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. FIX DIRTY TITLE: "MERE MEHBOOB QAYAMAT HOGI Original..." (line 789)
// ═══════════════════════════════════════════════════════════════════════════
searchStr = 'MERE MEHBOOB QAYAMAT HOGI';
pos = code.indexOf(searchStr);
while (pos !== -1) {
    const titleStart = code.lastIndexOf('title: "', pos);
    if (titleStart !== -1) {
        const titleValueStart = titleStart + 8;
        const titleEnd = code.indexOf('"', pos + searchStr.length);
        if (titleEnd !== -1) {
            const oldTitle = code.substring(titleValueStart, titleEnd);
            code = code.substring(0, titleValueStart) + 'Mere Mehboob Qayamat Hogi' + code.substring(titleEnd);
            log.push(`FIXED: "${oldTitle.substring(0,50)}..." → "Mere Mehboob Qayamat Hogi"`);
            fixCount++;
        }
    }
    pos = code.indexOf(searchStr, pos + 30);
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. FIX ALL LOWERCASE TITLES (should be Title Case)
// ═══════════════════════════════════════════════════════════════════════════
const lowercaseFixes = {
    'title: "fantasize"': 'title: "Fantasize"',
    'title: "positions"': 'title: "Positions"',
    'title: "double take"': 'title: "Double Take"',
    'title: "blue"': 'title: "Blue"',
    'title: "lovely"': 'title: "Lovely"',
    'title: "cold/mess"': 'title: "Cold/Mess"',
    'title: "ocean eyes"': 'title: "Ocean Eyes"',
    'title: "safety net"': 'title: "Safety Net"',
    'title: "you broke me first"': 'title: "You Broke Me First"',
    'title: "we fell in love in october"': 'title: "We Fell In Love In October"',
    'title: "back to friends"': 'title: "Back To Friends"',
    'title: "everything i wanted"': 'title: "Everything I Wanted"',
    'title: "death bed"': 'title: "Death Bed"',
};

for (const [old, replacement] of Object.entries(lowercaseFixes)) {
    const count = (code.match(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (count > 0) {
        code = code.split(old).join(replacement);
        log.push(`FIXED (${count}x): ${old} → ${replacement}`);
        fixCount += count;
    }
}

// Fix lowercase artist names
const artistFixes = {
    'artist: "yung kai"': 'artist: "Yung Kai"',
    'artist: "sombr"': 'artist: "Sombr"',
    'artist: "girl in red"': 'artist: "Girl In Red"',
};

for (const [old, replacement] of Object.entries(artistFixes)) {
    const count = (code.match(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (count > 0) {
        code = code.split(old).join(replacement);
        log.push(`FIXED artist (${count}x): ${old} → ${replacement}`);
        fixCount += count;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. FIX "Ae Dil Hai Mushkil Title Track" → "Ae Dil Hai Mushkil"
// ═══════════════════════════════════════════════════════════════════════════
{
    const old = 'title: "Ae Dil Hai Mushkil Title Track"';
    const replacement = 'title: "Ae Dil Hai Mushkil"';
    const count = (code.match(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (count > 0) {
        code = code.split(old).join(replacement);
        log.push(`FIXED (${count}x): ${old} → ${replacement}`);
        fixCount += count;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. FIX "You belong to me" → "You Belong To Me"
// ═══════════════════════════════════════════════════════════════════════════
{
    const old = 'title: "You belong to me"';
    const replacement = 'title: "You Belong To Me"';
    const count = (code.match(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (count > 0) {
        code = code.split(old).join(replacement);
        log.push(`FIXED (${count}x): ${old} → ${replacement}`);
        fixCount += count;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. FIX "Beggin" → "Beggin'" (missing apostrophe)
// ═══════════════════════════════════════════════════════════════════════════
{
    const old = `title: "Beggin"`;
    const replacement = `title: "Beggin'"`;
    const count = (code.match(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (count > 0) {
        code = code.split(old).join(replacement);
        log.push(`FIXED (${count}x): Beggin → Beggin'`);
        fixCount += count;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. FIX WRONG FOLDER CLASSIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════
// Some songs incorrectly categorized. Fix specific file paths.
const folderFixes = [
    // "back to friends" by sombr is an indie English track, not Hindi Hits
    { fileMatch: 'songs/3151351511.mp3', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Goumi" by Myriam Fares is Arabic, not Hindi Hits
    { fileMatch: '1655545366479547996Goumi', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Big And Chunky" is English
    { fileMatch: '1655594239025861245Big_And_Chunky', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Sway" by Michael Bublé is Global
    { fileMatch: '1655806334256713835Sway', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Paro" is a French/Arabic song, fits Global better
    { fileMatch: '1655770931947297113Paro', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    { fileMatch: '1657257786434963298Paro', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Habibi" tracks are Arabic → Global
    { fileMatch: '1656844498689009275Habibi', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    { fileMatch: '1657956592735424748Habibi', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Calypso RMX" is reggae → Global
    { fileMatch: '1656677981476329574Calypso', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Sauce" by Naïka → Global
    { fileMatch: '1656704444780545315Sauce', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Love Me Back" is English → Global
    { fileMatch: '1657409545400738501Love_Me_Back', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Money Rain" is Russian → Global
    { fileMatch: '1657337547645634530', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Face Off" by Tech N9ne → Global
    { fileMatch: '1658012189902683694Face_Off', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Queen of Hearts" → Global
    { fileMatch: '1658338603623362010Queen_of_Hearts', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Dame" → Global
    { fileMatch: '1658939931728462694Dame', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Ice On My Baby" → Global
    { fileMatch: '1659151555301450666Ice_On_My_Baby', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    { fileMatch: '1659335776640362460Ice_On_My_Baby', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Ara" by Zeynep Bastik (Turkish) → Global
    { fileMatch: '1659187369489830910Ara', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Love Nwantiti" → Global
    { fileMatch: '1659452040505627215Love_Nwantiti', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "1, 2, 3" by Sofia Reyes → Global
    { fileMatch: '16595422720655058231_2_3', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Dirty Mind" by 3OH!3 → Global
    { fileMatch: '1659604956002836700Dirty_Mind', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "The Way I Are" by Timbaland → Global
    { fileMatch: '1659776034255713934The_Way_I_Are', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Eshay" → Global
    { fileMatch: '1660592401311029152Eshay', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Jiggle Jiggle" → Global
    { fileMatch: '1657863072859983787Jiggle_Jiggle', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "My Bubble Gum" → Global
    { fileMatch: '1661593089259821939My_Bubble_Gum', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Genius Universalis" → Global
    { fileMatch: '1661593146083641788Genius_Universalis', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Ba Ba Ben" → Global
    { fileMatch: '1661593399542781884Ba_Ba_Ben', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Formosa" → Global
    { fileMatch: '1661593421410282917Formosa', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Amor De Una Noche" → Global
    { fileMatch: '1661593591661227064Amor_De_Una_Noche', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Hamadzayn Em" → Global
    { fileMatch: '1661594703974344673Hamadzayn_Em', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "La La La Li La La La" → Global
    { fileMatch: '1661594729982394865La_La_La_Li', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Edge" by REZZ → Global
    { fileMatch: '1661594943678030262Edge', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Wanna Play?" → Global
    { fileMatch: '1661595218220243274Wanna_Play', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "I Took a Nap" → Global
    { fileMatch: '1661595234132687716I_Took_a_Nap', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "I Love You" by Young Slo-Be → Global
    { fileMatch: '1661592124329992095I_Love_You', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "All That Glitters" → Global
    { fileMatch: '1657261319235328836All_That_Glitters', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    { fileMatch: '1661591630355280042All_That_Glitters', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Ooh Ahh" → Global
    { fileMatch: '1661590949862044087Ooh_Ahh', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Le" (Left and Right) by Charlie Puth → Global
    { fileMatch: '1656154528484764979Left_and_Right', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Deslocado" by Napa (Portuguese) → Global
    { fileMatch: '3266585161.mp3', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "La La Li La La La" in songs/ folder → Global
    { fileMatch: 'lala_li_lala_song', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Golden" by HUNTR → Global
    { fileMatch: '3412534581.mp3', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "I Thought I Saw Your Face Today" → Global
    { fileMatch: '3551769431.mp3', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
    // "Breathe" by Olly Alexander → Global
    { fileMatch: '81364090.mp3', wrongFolder: 'Hindi Hits', correctFolder: 'Global Hits' },
];

for (const fix of folderFixes) {
    const fileIdx = code.indexOf(fix.fileMatch);
    if (fileIdx === -1) continue;
    
    // Find the line containing this file reference
    const lineStart = code.lastIndexOf('\n', fileIdx) + 1;
    const lineEnd = code.indexOf('\n', fileIdx);
    const line = code.substring(lineStart, lineEnd);
    
    const wrongStr = `folder: "${fix.wrongFolder}"`;
    const correctStr = `folder: "${fix.correctFolder}"`;
    
    if (line.includes(wrongStr)) {
        const newLine = line.replace(wrongStr, correctStr);
        code = code.substring(0, lineStart) + newLine + code.substring(lineEnd);
        log.push(`FOLDER FIX: ${fix.fileMatch.substring(0,40)} → ${fix.correctFolder}`);
        fixCount++;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. FIX "Le" title (should be "Left and Right")
// ═══════════════════════════════════════════════════════════════════════════
{
    // Find the specific "Le" entry with Charlie Puth
    const leMatch = 'title: "Le", artist: "Charlie Puth, Jung Kook, BTS"';
    const leIdx = code.indexOf(leMatch);
    if (leIdx !== -1) {
        code = code.replace(leMatch, 'title: "Left And Right", artist: "Charlie Puth, Jung Kook"');
        log.push('FIXED: "Le" → "Left And Right"');
        fixCount++;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. FIX "Chalana" (Brazilian song wrongly in Hindi Hits)
// ═══════════════════════════════════════════════════════════════════════════
{
    const chalanaMatch = 'songs/989007152.mp3';
    const chalanaIdx = code.indexOf(chalanaMatch);
    if (chalanaIdx !== -1) {
        const lineStart = code.lastIndexOf('\n', chalanaIdx) + 1;
        const lineEnd = code.indexOf('\n', chalanaIdx);
        const line = code.substring(lineStart, lineEnd);
        if (line.includes('folder: "Hindi Hits"')) {
            code = code.substring(0, lineStart) + line.replace('folder: "Hindi Hits"', 'folder: "Global Hits"') + code.substring(lineEnd);
            log.push('FOLDER FIX: Chalana → Global Hits');
            fixCount++;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. FIX "Confidence" by Kim wrongly in Hindi Hits
// ═══════════════════════════════════════════════════════════════════════════
{
    const confMatch = 'songs/96485040.mp3';
    const confIdx = code.indexOf(confMatch);
    if (confIdx !== -1) {
        const lineStart = code.lastIndexOf('\n', confIdx) + 1;
        const lineEnd = code.indexOf('\n', confIdx);
        const line = code.substring(lineStart, lineEnd);
        if (line.includes('folder: "Hindi Hits"')) {
            code = code.substring(0, lineStart) + line.replace('folder: "Hindi Hits"', 'folder: "Global Hits"') + code.substring(lineEnd);
            log.push('FOLDER FIX: Confidence → Global Hits');
            fixCount++;
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// WRITE RESULTS
// ═══════════════════════════════════════════════════════════════════════════
fs.writeFileSync(SCRIPT, code, 'utf8');

log.unshift(`Total fixes applied: ${fixCount}`);
log.unshift(`=== fix_all_titles.js — ${new Date().toISOString()} ===`);
const logPath = path.join(__dirname, 'fix_all_log.txt');
fs.writeFileSync(logPath, log.join('\n'), 'utf8');
