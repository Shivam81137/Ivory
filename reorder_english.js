/**
 * reorder_english_v3.js  — deduplicates AND reorders Global Hits
 * Songs appear only once; the first occurrence is kept, subsequent duplicates are removed.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'script.js');
const src = fs.readFileSync(filePath, 'utf8');
const lines = src.split(/\r?\n/);
const lineEnding = src.includes('\r\n') ? '\r\n' : '\n';

console.log(`Total lines: ${lines.length}`);

// Collect ALL Global Hits lines with their indices
const globalHitsEntries = []; // { idx, line, title, artist, file }
lines.forEach((line, idx) => {
    if (line.includes('folder: "Global Hits"')) {
        const titleM = line.match(/title:\s*"([^"]+)"/);
        const artistM = line.match(/artist:\s*"([^"]+)"/);
        const fileM = line.match(/file:\s*"([^"]+)"/);
        globalHitsEntries.push({
            idx,
            line,
            title: titleM ? titleM[1] : '',
            artist: artistM ? artistM[1] : '',
            file: fileM ? fileM[1] : '',
        });
    }
});

console.log(`Found ${globalHitsEntries.length} total Global Hits entries (including duplicates)`);

// ─── Step 1: Deduplicate by file path (most reliable unique key) ──────────────
const seenFiles = new Set();
const uniqueGlobalHits = [];
for (const entry of globalHitsEntries) {
    const key = entry.file.trim().toLowerCase();
    if (!seenFiles.has(key)) {
        seenFiles.add(key);
        uniqueGlobalHits.push(entry);
    }
}
console.log(`After dedup: ${uniqueGlobalHits.length} unique Global Hits songs`);
uniqueGlobalHits.forEach((e, i) => console.log(`  ${i+1}. "${e.title}" by ${e.artist}`));

// ─── Step 2: Define desired order ────────────────────────────────────────────
const desiredOrder = [
    { want: '1. Blue',                         match: e => /^Blue$/.test(e.title) },
    { want: '2. I Like Me Better',             match: e => /^I Like Me Better$/.test(e.title) },
    { want: '3. Make You Mine',                match: e => /^Make You Mine$/.test(e.title) },
    { want: '4. Love Me Harder',               match: e => /^Love Me Harder$/.test(e.title) },
    { want: '5. I Like You So Much',           match: e => /^I Like You So Much/.test(e.title) },
    { want: '6. Shinunoga E-Wa',               match: e => /Shinunoga/.test(e.title) },
    { want: '7. Attention (Charlie Puth)',      match: e => /^Attention$/.test(e.title) && /Charlie Puth/.test(e.artist) },
    { want: '8. Closer (Chainsmokers)',        match: e => /^Closer$/.test(e.title) && /Chainsmokers/.test(e.artist) },
    { want: '9. Love Story (Taylor Swift)',    match: e => /^Love Story$/.test(e.title) && /Taylor Swift/.test(e.artist) },
    { want: '10. Night Changes',               match: e => /^Night Changes$/.test(e.title) },
    { want: '11. Stuck with U',               match: e => /^Stuck with U$/.test(e.title) },
    { want: '12. Paper Rings',                 match: e => /^Paper Rings$/.test(e.title) },
    { want: '13. Double Take',                 match: e => /^Double Take$/.test(e.title) },
    { want: '14. Co2',                         match: e => /^Co2$/.test(e.title) },
    { want: '15. I Wanna Be Yours',            match: e => /^I Wanna Be Yours$/.test(e.title) },
    { want: '16. Until I Found You',           match: e => /^Until I Found You$/.test(e.title) },
    { want: '17. I Think They Call This Love', match: e => /^I Think They Call This Love$/.test(e.title) },
    { want: '18. Perfect (Ed Sheeran)',        match: e => /^Perfect$/.test(e.title) && /Ed Sheeran/.test(e.artist) },
    { want: '19. You Belong To Me (Carla Bruni)', match: e => /You Belong/i.test(e.title) },
    { want: '20. Maria (Hwa Sa)',              match: e => /^Maria$/.test(e.title) && /Hwa Sa/.test(e.artist) },
    { want: '21. Positions',                   match: e => /^Positions$/.test(e.title) },
    { want: '22. Lover',                       match: e => /^Lover$/.test(e.title) },
    { want: '23. Unholy',                      match: e => /^Unholy$/.test(e.title) },
    { want: '24. Cheri Cheri Lady',            match: e => /Cheri Cheri/.test(e.title) },
    { want: '25. Die For You',                 match: e => /^Die For You$/.test(e.title) },
    { want: '26. Gat (Daleng Dale)',           match: e => /^Gat$/.test(e.title) || /DALENG DALE/i.test(e.artist) },
    { want: '27. Dandelions',                  match: e => /^Dandelions$/.test(e.title) },
    { want: '28. A Thousand Years',            match: e => /^A Thousand Years$/.test(e.title) },
    { want: '29. Who Says',                    match: e => /^Who Says$/.test(e.title) },
    { want: '30. Criminal',                    match: e => /^Criminal$/.test(e.title) },
    { want: '31. Pink Venom',                  match: e => /^Pink Venom$/.test(e.title) || /^'Pink Venom'$/.test(e.title) },
    { want: '32. Under The Influence',         match: e => /^Under The Influence$/.test(e.title) },
    { want: '33. Waka Waka',                   match: e => /Waka/i.test(e.title) },
    { want: '34. Believer',                    match: e => /^Believer$/.test(e.title) },
    { want: '35. Gangnam Style',               match: e => /Gangnam Style/.test(e.title) },
    { want: '36. Harleys In Hawaii',           match: e => /Harleys In Hawaii/.test(e.title) },
    { want: '37. Ride It',                     match: e => /^Ride It$/.test(e.title) },
    { want: '38. Love Me Like You Do',         match: e => /^Love Me Like You Do$/.test(e.title) },
    { want: '39. I See Red',                   match: e => /^I See Red$/.test(e.title) },
    { want: '40. Bella Ciao',                  match: e => /Bella Ciao/.test(e.title) },
    { want: '41. Wrap Me In Plastic',          match: e => /Wrap Me In Plastic/.test(e.title) },
    { want: '42. Shape of You',               match: e => /^Shape of You$/.test(e.title) },
    { want: '43. At My Worst',                 match: e => /^At My Worst$/.test(e.title) },
    { want: '44. Sunflower',                   match: e => /^Sunflower$/.test(e.title) },
    { want: '45. Fantasize',                   match: e => /^Fantasize$/.test(e.title) },
    { want: '46. Some',                        match: e => /^Some$/.test(e.title) },
    { want: '47. Memories',                    match: e => /^Memories$/.test(e.title) },
    { want: '48. Lovers (Anna of the North)',  match: e => /^Lovers$/.test(e.title) && /Anna/.test(e.artist) },
    { want: '49. End Of Beginning',            match: e => /^End Of Beginning$/.test(e.title) },
    { want: '50. Lovely',                      match: e => /^Lovely$/.test(e.title) },
];

// Build ordered list
const usedIndices = new Set();
const orderedEntries = [];

for (const { want, match } of desiredOrder) {
    let found = -1;
    for (let i = 0; i < uniqueGlobalHits.length; i++) {
        if (!usedIndices.has(i) && match(uniqueGlobalHits[i])) {
            found = i;
            break;
        }
    }
    if (found !== -1) {
        orderedEntries.push(uniqueGlobalHits[found]);
        usedIndices.add(found);
        console.log(`✓ ${want} -> "${uniqueGlobalHits[found].title}"`);
    } else {
        console.log(`✗ NOT FOUND: ${want}`);
    }
}

// Remaining unique Global Hits
for (let i = 0; i < uniqueGlobalHits.length; i++) {
    if (!usedIndices.has(i)) {
        orderedEntries.push(uniqueGlobalHits[i]);
    }
}

console.log(`\nFinal ordered Global Hits count: ${orderedEntries.length}`);

// ─── Step 3: Rebuild file ─────────────────────────────────────────────────────
// Mark all original Global Hits line indices for removal
const allGlobalHitsIdxSet = new Set(globalHitsEntries.map(e => e.idx));
// Find first position
const firstIdx = Math.min(...allGlobalHitsIdxSet);

const newLines = [];
let inserted = false;

for (let i = 0; i < lines.length; i++) {
    if (allGlobalHitsIdxSet.has(i)) {
        if (!inserted) {
            // Check if there's a comment line before this block we should keep
            newLines.push('    // ─── GLOBAL HITS (English Hits) — ordered by preference ─────────────');
            for (const e of orderedEntries) {
                let l = e.line.trim();
                if (!l.endsWith(',')) l += ',';
                // Remove trailing \r if any
                l = l.replace(/\r$/, '');
                newLines.push('    ' + l);
            }
            inserted = true;
        }
        // Skip duplicate/old Global Hits line
    } else {
        // Remove trailing \r for clean output
        newLines.push(lines[i].replace(/\r$/, ''));
    }
}

const newSrc = newLines.join(lineEnding);

// Backup & save
fs.writeFileSync(filePath + '.bak4', src, 'utf8');
fs.writeFileSync(filePath, newSrc, 'utf8');
console.log('\n✅ script.js updated & deduplicated successfully!');

// Verify
const v = fs.readFileSync(filePath, 'utf8');
const vLines = v.split(/\r?\n/).filter(l => l.includes('folder: "Global Hits"'));
console.log(`Verification: ${vLines.length} Global Hits songs in file`);
console.log('\nFirst 12 in new order:');
vLines.slice(0, 12).forEach((l, i) => {
    const t = (l.match(/title:\s*"([^"]+)"/) || ['','?'])[1];
    console.log(`  ${i+1}. ${t}`);
});
