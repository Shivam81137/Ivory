const fs = require('fs');
const path = require('path');

const sourceDirs = [
    { label: 'song', absolutePath: path.join(__dirname, '..', 'song'), filePrefix: 'song', isNewImport: false },
    { label: 'new song', absolutePath: path.join(__dirname, '..', 'new song'), filePrefix: 'new song', isNewImport: true }
];

const files = sourceDirs.flatMap(source => {
    if (!fs.existsSync(source.absolutePath)) return [];
    return fs.readdirSync(source.absolutePath)
        .filter(f => f.toLowerCase().endsWith('.mp3'))
        .map(filename => ({ source, filename }));
});

// Already-known files (from songs/Arijit, songs/karan aujla, songs/HINDI HITS, songs/english_hits)
// We detect dupes by checking if title key words overlap
// Parse filename to get title and artist
function parseSongFilename(filename) {
    // Remove extension
    let name = filename.replace(/\.mp3$/i, '').replace(/\.MP3$/i, '');
    
    // Common YouTube/upload suffixes to remove
    name = name
        .replace(/ - \d+(-\d+)?\.?MP3?$/i, '')  // e.g. "- 256" or "- 256-1"
        .replace(/\s*-\s*\d{3}(-\d+)?$/i, '')     // trailing bitrate
        .replace(/_Duplicate$/i, '')
        .trim();
    
    // Pattern: "Title - Artist - Channel" or "Title | Artist" or just "Title - Channel"
    // Try to extract from common patterns
    let title = name;
    let artist = 'Unknown Artist';
    
    // Pattern: "Song Name - FULL VIDEO Song  Movie  Actors  Singer - Channel"
    // Pattern: "Artist - Song (brackets) - channel"
    // Pattern: "Song Name - PagalNew - Artist, OtherArtist"
    
    const pagalNew = name.match(/^(.+?)\s*-\s*PagalNew\s*-\s*(.+)$/i);
    if (pagalNew) {
        title = pagalNew[1].trim();
        artist = pagalNew[2].trim();
        // Fix artist name - take only the actual artist names
        artist = artist.split(',').slice(0, 2).join(', ').trim();
        return { title, artist };
    }
    
    // Simpler: just split by " - " and use first part as title
    const parts = name.split(/\s+[-–]\s+/);
    
    if (parts.length >= 2) {
        title = parts[0].trim();
        // Try the last meaningful part as artist
        const channelWords = /VEVO|Topic|T-Series|Sony|Zee|YRF|Tips|256|128|Studio|Records|Music|Films/i;
        // Find artist - often second part or last non-channel part
        for (let i = 1; i < parts.length; i++) {
            if (!channelWords.test(parts[i]) && parts[i].length < 60) {
                artist = parts[i].trim();
                break;
            }
        }
    }
    
    // Clean up common noise from title
    title = title
        .replace(/\s*\[.*?]/g, '')
        .replace(/\s*\(.*?(?:Lyrics|Video|Audio|Official|Full|HD|MV).*?\)/gi, '')
        .replace(/^\s*['"]/, '').replace(/['"]\s*$/, '')
        .trim();
    
    if (!title) title = parts[0] || name;
    
    return { title, artist };
}

// Classify into folder/category based on filename content
function classifyFolder(filename, artist) {
    const fn = filename.toLowerCase();
    const ar = (artist || '').toLowerCase();
    
    // Karan Aujla indicators
    const karanKeywords = ['karan aujla', 'ikky', 'pagalnew - karan'];
    if (karanKeywords.some(k => fn.includes(k) || ar.includes(k))) return 'Karan Aujla';
    
    // Weekend
    if (fn.includes('weeknd') || ar.includes('weeknd')) return 'Global Hits';
    
    // Arijit
    if (fn.includes('arijit') || ar.includes('arijit')) return 'Arijit Singh';
    
    // English/global artists
    const globalArtists = ['alan walker','ed sheeran','taylor swift','billie eilish','ariana grande',
        'selena gomez','shawn mendes','charlie puth','the weeknd','one direction','harry styles',
        'imagine dragons','maroon 5','post malone','the chainsmokers','glass animals','arctic monkeys',
        'cigarettes after sex','sabrina carpenter','djo','ruth b','alec benjamin','stephen sanchez',
        'pink sweat','dhruv','jaymes young','elliot james','lauv','keane','passenger','sia',
        'eminem','gorillaz','psy','blackpink','neoni','bol4','hwa sa','fujii kaze','lady gaga',
        'bruno mars','indila','carla bruni','gigi perez','yung kai','modern talking','chromance',
        'anna of the north','everybody loves','sean kingston','justin bieber','chris brown',
        'sam smith','mileskin','lil nas','katy perry','jay sean','britney spears'];
    
    const fnLower = fn;
    if (globalArtists.some(a => fnLower.includes(a))) return 'Global Hits';
    
    // Nepali/regional
    const nepali = ['sushant kc','wangden sherpa','timi','nepali','lama','ekdev','yabesh','shallum',
                   'bardali','sarangi','rukum','apurva'];
    if (nepali.some(n => fnLower.includes(n))) return 'Hindi Hits';
    
    // Default Hindi
    return 'Hindi Hits';
}

// Output
const results = [];
const skipped = [];
const generatedSeen = new Set();

function makeGeneratedKey(title, artist) {
    const normalize = (value) => (value || '')
        .toLowerCase()
        .replace(/\(.*?\)|\[.*?]/g, ' ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return `${normalize(title)}||${normalize((artist || '').split(',')[0])}`;
}

// Known duplicates by filename keywords (already in songs array in songs/ folder)
const alreadyInSongsFolder = [
    'ae dil hai mushkil', 'agar tum saath ho', 'apna bana le', 'bulleya', 'chaleya',
    'dekha hazaro dafaa - pagalnew', 'gehra hua', 'hawayein', 'ilahi', 'kalank',
    'khairiyat', 'mast magan', 'qaafirana - pagalnew', 'raabta', 'sanam re',
    'satranga', 'shayad', 'tera yaar hoon main', 'tujhe kitna chahne lage', 'tum hi ho',
    'zaalima', '52 bars', 'admirin you', 'antidote', 'boyfriend', 'for a reason',
    'i really do', 'mf gabhru', 'on top', 'softly', 'winning speech',
    'sajni', 've haaniyaan', 'tum tak', 'pehli nazar mein', 'jeene laga hoon',
    'enna sona', 'mann mera', 'zehnaseeb', 'tera rastaa', 'humsafar', 'iraaday',
    'aankhon se batana', 'mere liye tum kaafi ho', 'dariya', 'ishq bulaava',
    'chaar kadam', 'raanjhanaa', 'ik kudi', 'be intehaan', 'aahista', 'labon ko',
    'mere bina', 'tu chahiye', 'rang jo lagyo', 'abhi kuch dino se',
    'o rangrez', 'yeh fitoor mera', 'sarangi', 'inkem inkem', 'hosanna',
    'jaan ban gaye', 'saude bazi', 'khoya khoya', 'tere bina', 'mere nishan',
    'bairiyaa', 'rukum maikot', 'timi nacha na - lyric video', 'bardali',
    'jhol', 'nadaaniyan', 'khwab', 'zulfein', 'meri banogi kya', 'savera',
    'dear maahiya', 'kasari', 'jhim jhim aune', 'timro pratiksa', 'timi sangai',
    'dil ye bekarar', 'taare ginn', 'haareya', 'sukoon mila', 'ehsaas',
    'zaroor', 'manchala', 'meherbaan', 'rang lageya', 'jogi', 'dooron dooron',
    'ranjheya ve', 'kaise bataaoon', 'is this love', 'kyon', 'tujhko jo paaya',
    'sachiya mohabbatan', 'jab tak', 'sadka', 'kahaan ho tum', 'ishq hai',
    'maine khud ko', 'jugraafiya', 'shape of you', 'starboy', 'closer',
    'lovely', 'faded', 'stay', 'believer', 'perfect', 'let her go', 'señorita',
    'night changes', 'as it was', 'die for you', 'a thousand years', 'memories',
    'attention', 'we don', 'love me like you do', 'pink venom', 'heat waves',
    'gangnam style', 'unstoppable', 'mockingbird', 'sweater weather', 'skyfall',
    'love story', 'die with a smile', 'sunflower', 'let me down slowly', 'dandelions',
    'under the influence', 'unholy', 'beggin', 'stuck with u', 'old town road',
    'i like me better', 'until i found you', 'thunder', 'positions', 'somewhere only we know',
    'i wanna be yours', '505', 'hall of fame', 'girls like you', 'alone', 'espresso',
    'animals', 'love me harder', 'double take', 'feel good inc', 'eenie meenie',
    'at my worst', 'maria', 'shinunoga e-wa', 'bella ciao', 'infinity', 'criminal',
    'ride it', 'harleys in hawaii', 'end of beginning', 'apocalypse', 'paper rings',
    'lover', 'make you mine', 'some', 'sailor song', 'darkside', 'blue', 'i think they call this love',
    'co2', 'wrap me in plastic', 'cheri cheri lady', 'lovers', 'i see red',
    'i like you so much', 'you belong to me', 'timeless', 'ordinary', 'fantasize',
    'gat', 'love story - indila', 'sapphire', 'ra and tomine',
    'ehsaas_duplicate', 'nadaaniyan_duplicate', 'tera rastaa_duplicate', 'gul - 256-1', 'gul - 256',
    'tu chahiye - full audio', 'tu chahiye - full audio - 256-1', 'rang jo lagyo - atif',
    'darkhaast', 'jaan ban gaye - lyrical', 'be intehaan - atif', 'dekha hazaro - ze',
    'timi nacha na', 'wangden sherpa'
];

function isAlreadyAdded(filename) {
    const fnLower = filename.toLowerCase();
    return alreadyInSongsFolder.some(k => fnLower.includes(k));
}

files.forEach(({ source, filename }) => {
    // Skip duplicates and known already-added files
    if (filename.includes('_Duplicate') || filename.includes('Duplicate')) {
        skipped.push(`${source.label}/${filename} [duplicate]`);
        return;
    }
    if (isAlreadyAdded(filename)) {
        skipped.push(`${source.label}/${filename} [already in songs/]`);
        return;
    }
    
    const { title, artist } = parseSongFilename(filename);
    const folder = classifyFolder(filename, artist);
    const filePath = `${source.filePrefix}/${filename}`;
    const generatedKey = makeGeneratedKey(title, artist);

    if (generatedSeen.has(generatedKey)) {
        skipped.push(`${source.label}/${filename} [same generated key]`);
        return;
    }
    generatedSeen.add(generatedKey);

    results.push({ title, artist, file: filePath, folder, filename, isNewImport: source.isNewImport, sourceLabel: source.label });
});

// Print results as JS entries
console.log(`// === GENERATED SONGS FROM song/ + new song/ (${results.length} songs) ===`);
results.forEach(s => {
    const importFlag = s.isNewImport ? ', _isNewImport: true' : '';
    console.log(`    { title: "${s.title}", artist: "${s.artist}", file: "${s.file.replace(/\\/g, '/')}", art: "IMAGES/logoo.png", folder: "${s.folder}", durationFormatted: ""${importFlag} },`);
});

console.log(`\n// SKIPPED: ${skipped.length}`);
// skipped.forEach(s => console.error('SKIP:', s));

// Save to file too
const jsLines = results.map(s => {
    const escapedPath = s.file.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const importFlag = s.isNewImport ? ', _isNewImport: true' : '';
    return `    { title: "${s.title}", artist: "${s.artist}", file: "${escapedPath}", art: "IMAGES/logoo.png", folder: "${s.folder}", durationFormatted: ""${importFlag} },`;
});
fs.writeFileSync(path.join(__dirname, 'generated_song_entries.txt'), jsLines.join('\n'), 'utf8');
console.log('\nSaved to scripts/generated_song_entries.txt');
