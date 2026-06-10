// test_match.js - Check if the priority titles actually match Hindi Hits songs
const fs = require('fs');
const src = fs.readFileSync('script.js', 'utf8');

// Simulate: extract all song objects with folder "Hindi Hits"
const songRegex = /\{\s*title:\s*"([^"]+)"[^}]*folder:\s*"Hindi Hits"[^}]*\}/g;
const hindiSongs = [];
let m;
while ((m = songRegex.exec(src)) !== null) {
    hindiSongs.push(m[1]);
}

// Also try the reverse: folder first, then title
const songRegex2 = /\{\s*title:\s*"([^"]+)"[^}]*folder:\s*"([^"]+)"[^}]*\}/g;
const allSongs = [];
while ((m = songRegex2.exec(src)) !== null) {
    if (m[2] === 'Hindi Hits') allSongs.push(m[1]);
}

console.log(`Hindi Hits songs (regex1): ${hindiSongs.length}`);
console.log(`Hindi Hits songs (regex2): ${allSongs.length}`);

// Use a simpler approach: scan lines
const lines = src.split(/\r?\n/);
const hindiHitsTitles = [];
for (const line of lines) {
    if (line.includes('folder: "Hindi Hits"') || line.includes("folder: 'Hindi Hits'")) {
        const titleM = line.match(/title:\s*"([^"]+)"/);
        if (titleM) hindiHitsTitles.push(titleM[1]);
    }
}
console.log(`Hindi Hits by line scan: ${hindiHitsTitles.length}`);

// Priority list
const priority = [
    'Timro Pratiksa', 'Dear Maahiya', 'Bardali', 'Sadka Kiya',
    'Dooron Dooron', 'Labon Ko', 'Kaise Bataaoon', 'Pehli Nazar Mein',
    'Rang Jo Lagyo', 'Be Intehaan', 'Rang Lageya', 'Dekha Hazaro Dafaa',
    'Tum Tak', 'Raanjhanaa', 'Dil Ye Bekarar Kyun Hai', 'Is This Love',
    'Tujhko Jo Paaya', 'Mere Bina', 'Khoya Khoya', 'Tere Bina',
    'Ishq', 'Yeh Fitoor Mera', 'Ehsaas', 'Maine Khud Ko',
    'Ranjheya Ve', 'Humsafar', 'Ve Haaniyaan', 'Dariya',
    'Tu Chahiye', 'Saude Bazi', 'Darkhaast', 'Bairiyaa',
    'Meherbaan', 'Zehnaseeb', 'Ishq Bulaava', 'Sarangi',
    'Haareya', 'Manchala', 'Sachiya Mohabbatan', 'Enna Sona',
    'Sukoon Mila', 'Tera Rastaa Chhodoon Na', 'Chaar Kadam', 'Ik Kudi',
    'Dil Se Dil', 'Kyon', 'Jab Tak', 'Jaan Ban Gaye',
    'Jogi', 'Qaafirana', 'O Rangrez', 'Iraaday',
    'Meri Banogi Kya', 'Timi Nacha Na', 'Taare Ginn', 'Afeemi',
    'Zaroor', 'Kahaan Ho Tum', 'Hosanna', 'Aankhon Se Batana',
    'Khwab', 'Savera', 'Inkem Inkem', 'Mere Nishan',
    'Ishq Hai', 'Mann Mera', 'Phir Le Aaya Dil', 'Mileya Mileya',
    'Aise Kyun', 'Mere Liye Tum Kaafi Ho', 'Jhol', 'Jugraafiya',
    'Nadaaniyan', 'Sajni', 'Aahista', 'Jeene Laga Hoon',
    'Zulfein', 'Timi Sangai', 'Jhim Jhim Aune Aakhale',
    'Kasari', 'Abhi Kuch Dino Se', 'Rukum Maikot',
];

// Simulate the matching
const usedKeys = new Set();
const matched = [];
const unmatched = [];

priority.forEach(title => {
    const k = title.toLowerCase().trim();
    if (usedKeys.has(k)) return;
    const idx = hindiHitsTitles.findIndex(t => t.toLowerCase().trim() === k);
    if (idx !== -1) {
        matched.push({ want: title, found: hindiHitsTitles[idx] });
        usedKeys.add(k);
    } else {
        unmatched.push(title);
    }
});

console.log(`\nMatched: ${matched.length} / ${priority.length}`);
console.log(`Unmatched (${unmatched.length}):`);
unmatched.forEach(t => console.log(`  ✗ "${t}"`));

// Show what titles look similar to unmatched
console.log('\n--- Fuzzy matches for unmatched ---');
unmatched.forEach(t => {
    const tl = t.toLowerCase();
    const close = hindiHitsTitles.filter(h => 
        h.toLowerCase().includes(tl.substring(0, 5)) || 
        tl.includes(h.toLowerCase().substring(0, 5))
    );
    if (close.length > 0) {
        console.log(`  "${t}" might be: ${close.map(c => `"${c}"`).join(', ')}`);
    }
});

// ALSO CHECK: what does the _isNewImport block put in Hindi Hits?
// The promotedNewFolderSongs at line ~869 injects songs via unshift
// These become the FIRST songs in the array for Hindi Hits
console.log('\n--- Songs that would appear FIRST in Hindi Hits ---');
// After cleanSongsData sorts them, the Hindi Hits order depends on autoOrderSongs
// The songs with _isNewImport and same folder get priority in the sort
// But our enforceManualOrder should override that...

// Let's check: are the promoted songs also in Hindi Hits?
const promotedBlock = src.match(/const promotedNewFolderSongs = \[([\s\S]*?)\];/);
if (promotedBlock) {
    const promotedContent = promotedBlock[1];
    const promotedHindi = [];
    const ptitleRegex = /title:\s*"([^"]+)"[^}]*folder:\s*"Hindi Hits"/g;
    let pm;
    while ((pm = ptitleRegex.exec(promotedContent)) !== null) {
        promotedHindi.push(pm[1]);
    }
    console.log(`Promoted Hindi Hits songs (${promotedHindi.length}):`);
    promotedHindi.forEach(t => console.log(`  "${t}"`));
    
    // Are any of these in our priority list?
    console.log('\nPromoted songs IN our priority list:');
    promotedHindi.forEach(t => {
        const inPriority = priority.some(p => p.toLowerCase() === t.toLowerCase());
        console.log(`  "${t}": ${inPriority ? '✓ YES' : '✗ NO'}`);
    });
}
