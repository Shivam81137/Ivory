/**
 * fix_remaining.js — Second pass to fix remaining dirty titles and wrong classifications
 */
const fs = require('fs');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'script.js');
let code = fs.readFileSync(SCRIPT, 'utf8');

// ═══════════════════════════════════════════════════════════════════════════
// TARGETED TITLE FIXES (exact replacements)
// ═══════════════════════════════════════════════════════════════════════════
const titleFixes = [
    // Titles that still have artist names, "Lyrical:", movie names, etc.
    [/title: "Aankhon Se Batana – Dikshant"/g, 'title: "Aankhon Se Batana"'],
    [/title: "Abdul Hannan & Rovalio - Iraaday"/g, 'title: "Iraaday"'],
    [/title: "Billie Eilish, Khalid - lovely"/g, 'title: "Lovely"'],
    [/title: "Ariana Grande, The Weeknd - Love Me Harder"/g, 'title: "Love Me Harder"'],
    [/title: "Dooron Dooron - Paresh Pahuja"/g, 'title: "Dooron Dooron"'],
    [/title: "Ehsaas Faheem Abdullah"/g, 'title: "Ehsaas"'],
    [/title: "Ekdev Limbu 🌹- Jhim Jhim Aune Aakhale"/g, 'title: "Jhim Jhim Aune Aakhale"'],
    [/title: "Iqlipse Nova, Aditya A - Khwab"/g, 'title: "Khwab"'],
    [/title: "Is This Love Lyrical - Kismat Konnection"/g, 'title: "Is This Love"'],
    [/title: "Ishq Bulaava- Hasee Toh Phasee"/g, 'title: "Ishq Bulaava"'],
    [/title: "Ishq Hai Lyrics - Mismatched: Season 3"/g, 'title: "Ishq Hai"'],
    [/title: "Kyon - Barfi"/g, 'title: "Kyon"'],
    [/title: "La Casa De Papel - Bella Ciao \(Money Heist\)"/g, 'title: "Bella Ciao"'],
    [/title: "Lady Gaga, Bruno Mars - Die With A Smile"/g, 'title: "Die With A Smile"'],
    [/title: "Lil Nas X - Old Town Road"/g, 'title: "Old Town Road"'],
    [/title: "Lyrical: Labon Ko"/g, 'title: "Labon Ko"'],
    [/title: "Lyrical: Mere Liye Tum Kaafi Ho"/g, 'title: "Mere Liye Tum Kaafi Ho"'],
    [/title: "LYRICAL: Sachiya Mohabbatan"/g, 'title: "Sachiya Mohabbatan"'],
    [/title: "Lyrical: Saude Bazi"/g, 'title: "Saude Bazi"'],
    [/title: "Mehul Mahesh & DJ Aynik - Zulfein"/g, 'title: "Zulfein"'],
    [/title: "Mere Bina- Crook"/g, 'title: "Mere Bina"'],
    [/title: "Be Intehaan - Race 2"/g, 'title: "Be Intehaan"'],
    [/title: "Manchala- Parineeti Chopra, Sidharth"/g, 'title: "Manchala"'],
    [/title: "Haareya Song"/g, 'title: "Haareya"'],
    [/title: "JAB TAK"/g, 'title: "Jab Tak"'],
    [/title: "RIDE IT"/g, 'title: "Ride It"'],
    [/title: "Feel Good Inc"/g, 'title: "Feel Good Inc."'],
    // Fix escaped backslashes in titles  
    [/title: "Harleys In Hawaii \\\\\\\\"/g, 'title: "Harleys In Hawaii"'],
    [/title: "Maine Khud Ko Ragini MMS 2\\\\\\\\\\\\\\\\" Song With"/g, 'title: "Maine Khud Ko"'],
    // Fix "I Like You So Much" long title
    [/title: "I Like You So Much, You'll Know It \(我多喜欢你，你会知道\)- A Love So Beautiful OST -Wang Junqi"/g, 'title: "I Like You So Much, You\'ll Know It"'],
];

for (const [regex, replacement] of titleFixes) {
    code = code.replace(regex, replacement);
}

// ═══════════════════════════════════════════════════════════════════════════
// FIX WRONG FOLDER CLASSIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════
// Ariana Grande "Stuck with U" and "Love Me Harder" should be Global Hits, not Hindi Hits
const folderFixes = [
    // Match the specific entries with wrong folders
    { match: 'file: "song/Ariana Grande & Justin Bieber - Stuck with U - ArianaGrandeVevo.mp3"', from: 'folder: "Hindi Hits"', to: 'folder: "Global Hits"' },
    { match: 'file: "song/Ariana Grande, The Weeknd - Love Me Harder - ArianaGrandeVevo.mp3"', from: 'folder: "Hindi Hits"', to: 'folder: "Global Hits"' },
    { match: 'file: "song/Lil Nas X Old Town Road feat.Billy Ray Cyrus Lyrics napisy pl.mp3"', from: 'folder: "Hindi Hits"', to: 'folder: "Global Hits"' },
    { match: 'file: "song/I Like You So Much', from: 'folder: "Hindi Hits"', to: 'folder: "Global Hits"' },
    { match: 'file: "song/DALENG DALE - Gat', from: 'folder: "Hindi Hits"', to: 'folder: "Global Hits"' },
];

for (const fix of folderFixes) {
    // Find the line containing the file match
    const lineIdx = code.indexOf(fix.match);
    if (lineIdx === -1) continue;
    // Find the folder in that same line
    const lineEnd = code.indexOf('\n', lineIdx);
    const line = code.substring(lineIdx, lineEnd);
    if (line.includes(fix.from)) {
        const newLine = line.replace(fix.from, fix.to);
        code = code.substring(0, lineIdx) + newLine + code.substring(lineEnd);
    }
}

fs.writeFileSync(SCRIPT, code, 'utf8');
console.log('✅ Second pass cleanup complete.');
