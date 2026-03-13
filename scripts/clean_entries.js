/**
 * clean_entries.js
 * Reads script.js, finds the AUTO-CATEGORIZED block, and replaces every entry
 * with clean title + artist + correct folder classification.
 */
const fs = require('fs');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'script.js');
let code = fs.readFileSync(SCRIPT, 'utf8');

// ── Locate the auto-categorized block ────────────────────────────────────
const START_MARKER = '    // ─── AUTO-CATEGORIZED SONGS (all folders) ───────────────────────────────────';
const END_MARKER = '\n];';

const startIdx = code.indexOf(START_MARKER);
if (startIdx === -1) { console.error('START marker not found'); process.exit(1); }
const endIdx = code.indexOf(END_MARKER, startIdx);
if (endIdx === -1) { console.error('END marker not found'); process.exit(1); }

// Extract block, parse entries
const block = code.slice(startIdx, endIdx);
const entryRe = /\{\s*title:\s*"((?:[^"\\]|\\.)*)"\s*,\s*artist:\s*"((?:[^"\\]|\\.)*)"\s*,\s*file:\s*"((?:[^"\\]|\\.)*)"\s*,\s*art:\s*"((?:[^"\\]|\\.)*)"\s*,\s*folder:\s*"((?:[^"\\]|\\.)*)"\s*,\s*durationFormatted:\s*""\s*\}/g;

const entries = [];
let m;
while ((m = entryRe.exec(block)) !== null) {
    entries.push({ title: m[1], artist: m[2], file: m[3], art: m[4], folder: m[5] });
}
console.log(`Found ${entries.length} auto-categorized entries to clean.`);

// ══════════════════════════════════════════════════════════════════════════
// CLEAN TITLE: strip junk suffixes, video/lyric tags, channel names, etc.
// ══════════════════════════════════════════════════════════════════════════
function cleanTitle(t, artist) {
    let s = t;
    // Remove "Artist - " prefix if title starts with the artist name
    if (artist && artist !== 'Unknown Artist') {
        const first = artist.split(',')[0].trim();
        const re = new RegExp('^' + escRe(first) + '\\s*[-–]\\s*', 'i');
        s = s.replace(re, '');
    }
    // Strip common junk patterns
    s = s.replace(/\s*[\|]\s*.*$/g, '');                          // everything after |
    s = s.replace(/\s*-\s*PagalNew\s*$/i, '');
    s = s.replace(/\s*\(DJJOhAL\.Com\)\s*/gi, '');
    s = s.replace(/\s*\(PenduJatt\.Com\.Se\)\s*/gi, '');
    s = s.replace(/\s*\(KoshalWorld\.Com\)\s*/gi, '');
    s = s.replace(/\s*\(Bonus Track\)\s*/gi, '');
    s = s.replace(/\s*\(\s*\)\s*/g, '');                          // empty parens ()
    s = s.replace(/\s*Full Video\s*/gi, '');
    s = s.replace(/\s*Full Audio\s*/gi, '');
    s = s.replace(/\s*Full Song\s*/gi, '');
    s = s.replace(/\s*Best Video\s*/gi, '');
    s = s.replace(/\s*Best Audio Song\s*/gi, '');
    s = s.replace(/\s*Best Lyric Video\s*/gi, '');
    s = s.replace(/\s*Lyric Video\s*/gi, '');
    s = s.replace(/\s*Lyrical Video\s*/gi, '');
    s = s.replace(/\s*Lyrics?\s*$/gi, '');
    s = s.replace(/\s*Lyrical\s*$/gi, '');
    s = s.replace(/\s*\(Lyrics?\)\s*/gi, '');
    s = s.replace(/\s*\[Lyrics?\]\s*/gi, '');
    s = s.replace(/\s*Video Song\s*/gi, '');
    s = s.replace(/\s*Song With Lyrics\s*/gi, '');
    s = s.replace(/\s*Official\s*(Music\s*)?Video\s*/gi, '');
    s = s.replace(/\s*Official\s*Audio\s*/gi, '');
    s = s.replace(/\s*Official\s*Lyric\s*Visualizer\s*/gi, '');
    s = s.replace(/\s*\[Official\s*Video\]\s*/gi, '');
    s = s.replace(/\s*\[Official\s*Audio\]\s*/gi, '');
    s = s.replace(/\s*M\/V\s*/gi, '');
    s = s.replace(/\s*Letra\s*$/i, '');
    s = s.replace(/\s*napisy\s*pl\s*$/i, '');
    s = s.replace(/\s*Prod\.\s*.*$/i, '');
    s = s.replace(/\s*Lyrics\s*\+.*$/i, '');
    s = s.replace(/\s*with\s*@\w+\s*/gi, '');
    s = s.replace(/@\w+/g, '');
    s = s.replace(/\s*\(slightly deluxe\)\s*/gi, '');
    s = s.replace(/\s*\(Visual\)\s*/gi, '');
    s = s.replace(/\s*"You and I.*$/i, '');
    s = s.replace(/\s*Viral Song \d+\s*/gi, '');
    s = s.replace(/\s*New Instagram viral song\s*/gi, '');
    s = s.replace(/\s*Trending Hindi Song \d+\s*/gi, '');
    s = s.replace(/\s*New Hindi Song\s*/gi, '');
    s = s.replace(/\s*Love Song \d+\s*/gi, '');
    s = s.replace(/\s*\(Radio Edit\)\s*/gi, '');
    s = s.replace(/\s*\(Speed Up\)\s*/gi, '');
    s = s.replace(/\s*\(Sped Up\)\s*/gi, '');
    s = s.replace(/\s*\(Acoustic Version\)\s*/gi, '');
    s = s.replace(/\s*\(Remastered\)\s*/gi, '');
    s = s.replace(/\s*\(2018 Remaster\)\s*/gi, '');
    s = s.replace(/\s*\(Krono Remix\)\s*/gi, '');
    s = s.replace(/\s*\(Fayahh Beat\)\s*/gi, '');
    s = s.replace(/\s*\(Albanian Remix\)\s*/gi, '');
    s = s.replace(/\s*\(Kimme More Remix\)\s*/gi, '');
    s = s.replace(/\s*Club Mix.*$/gi, '');
    s = s.replace(/\s*Unplugged.*$/gi, '');
    s = s.replace(/\s*\(MTV.*$/gi, '');
    s = s.replace(/\s*\(Encore\)\s*/gi, '');
    s = s.replace(/\s*\(Jhankar Beats\)\s*/gi, '');
    s = s.replace(/\s*\(Cover\)\s*/gi, '');
    s = s.replace(/\s*Nostalgic.*$/gi, '');
    s = s.replace(/\s*Evergreen.*Classic\s*$/gi, '');
    s = s.replace(/\s*EVERGREEN\s*ROMANCE.*$/gi, '');
    s = s.replace(/\s*Old Hindi.*$/gi, '');
    s = s.replace(/\s*Heart Touching.*$/gi, '');
    s = s.replace(/\s*Old is Gold.*$/gi, '');
    s = s.replace(/\s*Old version.*$/gi, '');
    s = s.replace(/\s*Timeless Disco.*$/gi, '');
    s = s.replace(/\s*Lofi Rap Rework.*$/gi, '');
    s = s.replace(/\s*Khwabon Se Bhara.*$/gi, '');
    s = s.replace(/\s*Video 60s.*$/gi, '');
    s = s.replace(/\s*Original Full Song 4K\s*/gi, '');
    s = s.replace(/\s*Old Hindi Songs\s*/gi, '');
    s = s.replace(/\s*Evergreen Hindi.*$/gi, '');
    s = s.replace(/\s*Super Jhankar Beats\s*/gi, '');
    s = s.replace(/\s*4K\s*/g, '');
    s = s.replace(/\s*HD\s*$/gi, '');
    s = s.replace(/\s*\(HD\)\s*/gi, '');
    s = s.replace(/\s*Slowed and Reverb\s*/gi, '');
    s = s.replace(/\s*\(Live on the Honda Stage.*\)\s*/gi, '');
    s = s.replace(/\s*\(from the series.*\)\s*/gi, '');
    s = s.replace(/\s*\(From \".*?\"\)\s*/gi, ' ');
    s = s.replace(/\s*\(from .*?\)\s*/gi, '');
    s = s.replace(/\s*From \".*?\"\s*/gi, '');
    s = s.replace(/\s*\(feat\.\s*.*?\)\s*/gi, '');
    s = s.replace(/\s*feat\.?\s+.*$/gi, '');
    s = s.replace(/\s*ft\.?\s+.*$/gi, '');
    s = s.replace(/\s*\(Sea Shanty\)\s*/gi, '');
    s = s.replace(/\s*\(coffee for your head\)\s*/gi, '');
    s = s.replace(/\s*\(Put Your Hand in Mine\)\s*/gi, '');
    s = s.replace(/\s*\(A Deal With God\)\s*/gi, '');
    s = s.replace(/\s*Spider-Man.*$/gi, '');
    s = s.replace(/\s*Remix\s*$/gi, '');
    s = s.replace(/\s*\(Remix\)\s*/gi, '');

    // Fix leading quotes
    s = s.replace(/^'+/, '').replace(/'+$/, '');

    // Collapse whitespace
    s = s.replace(/\s+/g, ' ').trim();

    // Remove trailing hyphens, pipes, commas
    s = s.replace(/[\-–|,\s]+$/, '').trim();

    return s || t;
}

function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// ══════════════════════════════════════════════════════════════════════════
// CLEAN ARTIST: fix every wrong/noisy artist
// ══════════════════════════════════════════════════════════════════════════
const ARTIST_MAP = {
    // file path substring → correct artist
    "505.mp3": "Arctic Monkeys",
    "I Wanna Be Yours - Arctic Monkeys": "Arctic Monkeys",
    "Imagine Dragons - Believer": "Imagine Dragons",
    "Imagine Dragons Thunder": "Imagine Dragons",
    "Maroon 5 - Memories": "Maroon 5",
    "Maroon 5 Memories": "Maroon 5",
    "Maroon 5 Animals": "Maroon 5",
    "Maroon 5 Girls Like You": "Maroon 5",
    "Harry Styles As It Was": "Harry Styles",
    "One Direction - Night Changes": "One Direction",
    "Taylor Swift - Paper Rings": "Taylor Swift",
    "Taylor Swift - Love Story": "Taylor Swift",
    "Ed Sheeran Perfect": "Ed Sheeran",
    "Lady Gaga, Bruno Mars": "Lady Gaga, Bruno Mars",
    "Sam Smith - Unholy": "Sam Smith, Kim Petras",
    "The Chainsmokers - Closer": "The Chainsmokers, Halsey",
    "The Chainsmokers Closer": "The Chainsmokers, Halsey",
    "The Kid LAROI Justin Bieber Stay": "The Kid LAROI, Justin Bieber",
    "Shawn Mendes Camila Cabello": "Shawn Mendes, Camila Cabello",
    "Billie Eilish, Khalid - lovely": "Billie Eilish, Khalid",
    "JAY SEAN - RIDE IT": "Jay Sean",
    "Tera Rastaa Chhodoon Na": "Amitabh Bhattacharya",
    "Somebody_That_I_Used_To_Know": "Gotye, Kimbra",
    "Camila_Cabello_Havana": "Camila Cabello, Young Thug",
    "Charlie_Puth_Attention_Live": "Charlie Puth",
    "Ehsaas (Lyric Video) Faheem": "Faheem Abdullah",
    "Badan Pe Sitare": "Mohammad Rafi",
    "Bheegi Bheegi Raaton": "Adnan Sami",
    "Chala Jata Hoon": "Kishore Kumar",
    "Chura Liya Hai Tumne": "Asha Bhosle, Mohammed Rafi",
    "Dil Ye Pukare": "Lata Mangeshkar",
    "Ek Ajnabee Haseena Se": "Kishore Kumar",
    "Kisi Ki Muskurahaton Pe Ho Nisar": "Mukesh",
    "Kishore Kumar  Mere Sapno Ki Rani": "Kishore Kumar",
    "Kya Hua Tera Wada": "Mohammed Rafi",
    "Kya Khoob Lagti Ho": "Mukesh, Kanchan",
    "Likhe Jo Khat Tujhe": "Mohammed Rafi",
    "MERE MEHBOOB QAYAMAT HOGI": "Kishore Kumar",
    "Mere Samne Wali Khidki": "Kishore Kumar",
    "Meri Meheboob  Timeless": "Mohammed Rafi",
    "O Mere Dil Ke Chain": "Kishore Kumar",
    "Pal Pal Dil Ke Paas": "Kishore Kumar",
    "Saiyaara 1980 Ft  Kishore": "Kishore Kumar",
    "Tere Khayalon Mein": "Lata Mangeshkar",
    "Itna Na Mujhse Tu Pyar Badha  Chhaya": "Lata Mangeshkar, Talat Mahmood",
    "Yeh Ratein Yeh Mausam": "Kishore Kumar, Asha Bhosle",
    "Yeh Vaada Raha (Lyrical Video)": "Kishore Kumar, Asha Bhosle",
    "Dekha Ye Khwab Toh": "Lata Mangeshkar, Kishore Kumar",
    "Jo Tu Nahi To": "K.K.",
    "lala_li_lala_song": "Aca Xoca",
    "Sunhari Kirne": "Talwiinder",
    "Tu Hai Kahan by AUR": "AUR",
    "Afusic - Pal Pal": "Afusic, Talwiinder",
    "Pal Pal - Talwiinder": "Afusic, Talwiinder",
    "Pal Pal(KoshalWorld": "Afusic, Talwiinder",
    "Talwinder - Wishes (Remake)": "Talwiinder",
    "Tamanna Afros - Feeling": "Tamanna Afros",
    "PYARI AMAANAT": "Arpit Bala",
    "Sajde - Official Music Video  Faheem": "Faheem Abdullah",
    "Sufr - Bargad": "Arpit Bala, Toorjo Dey",
    "Rakhlo Tum Chupaake - 128": "Arpit Bala",
    "Banjaare - Bairan": "Bairan",
    "Bargad - Surf X Arpit Bala": "Surf, Arpit Bala",
    "Dekha Hazaro Dafaa  Rustom": "Arijit Singh, Palak Muchhal",
    "Ishq Hai Lyrics - Mismatched": "Faheem Abdullah",
    "Ishq Hua Kaise Hua": "Udit Narayan, Alka Yagnik",
    "Tera Mera Hai Pyar": "Ahmed Jahanzeb",
    "Kaifi Khalil - Kahani Suno": "Kaifi Khalil",
    "Humsafar (From": "Irshad Kamil",
};

function fixArtist(entry) {
    const fp = entry.file;
    // Check file-path based map first
    for (const [key, val] of Object.entries(ARTIST_MAP)) {
        if (fp.includes(key)) return val;
    }
    let a = entry.artist;
    // Strip "(DJJOhAL.Com)" noise
    a = a.replace(/\s*\(DJJOhAL\.Com\)\s*/gi, '').trim();
    // Strip "Unknown Artist"
    if (a === 'Unknown Artist' || a === '256' || a === '128') {
        // Infer from file path
        if (/talwiinder|talwinder/i.test(fp)) return 'Talwiinder';
        if (/arijit/i.test(fp)) return 'Arijit Singh';
        if (/karan.*aujla/i.test(fp)) return 'Karan Aujla';
        if (/weeknd/i.test(fp)) return 'The Weeknd';
        return 'Unknown Artist';
    }
    // Fix channel/label names used as artists
    const channels = /^(7clouds.*|.*VEVO$|SonyMusicIndiaVEVO|T-Series.*|Zee Music.*|YRF|Tips Official|Romance Rewind|Bollywood.*|LatinHype|Indie India|.*Topic$|Coke Studio.*|Netflix.*|DRC Records|PUBLICVEVO|JAYDED|officialpsy|Artiste First|UR DEBUT|Dreamiyata.*|VYRLOriginals|.*Music Club.*|Sonic Serenade.*|Nepali Fine Tunes.*|PluginVibes|Djo Music|Pink Sweats|The Vibe Guide|Yevo|Dan Music|Aura Melodies|Pizza Music|magnificent|a paradise bird|Invited Kingdom|ReLike Vibes|Unique Sound|Creative Chaos|Jelly.*|Lazy.*|Bishal.*|Sankalp.*|seventyskye|LyricsVerse|Vibe Bird|Lyrics4You|Musicgenree|Cinephile.*|RockHype|DopeMusic)$/i;
    if (channels.test(a.trim())) {
        if (/talwiinder|talwinder/i.test(fp)) return 'Talwiinder';
        return 'Unknown Artist';
    }
    return a.trim();
}

// ══════════════════════════════════════════════════════════════════════════
// FIX FOLDER CLASSIFICATION
// ══════════════════════════════════════════════════════════════════════════
const GLOBAL_ARTISTS = new Set([
    'arctic monkeys','ed sheeran','taylor swift','billie eilish','charlie puth',
    'ariana grande','the weeknd','maroon 5','imagine dragons','shawn mendes',
    'camila cabello','sia','adele','lady gaga','bruno mars','blackpink','psy',
    'post malone','selena gomez','alan walker','fujii kaze','eminem','sam smith',
    'chris brown','coldplay','lauv','one direction','harry styles','lil nas x',
    'cigarettes after sex','glass animals','keane','passenger','christina perri',
    'ellie goulding','pink sweat$','ruth b.','britney spears','katy perry',
    'modern talking','chromance','neoni','gorillaz','the neighbourhood','djo',
    'the script','jay sean','sabrina carpenter','stephen sanchez','elliot james reay',
    'jaymes young','alex warren','gigi perez','anna of the north','dhruv',
    'everybody loves an outlaw','carla bruni','yung kai','indila','sean kingston',
    'justin bieber','the chainsmokers','halsey','the kid laroi','public',
    'lana del rey','radiohead','aurora','alphaville','michael jackson','the police',
    'the smiths','kanye west','corinne bailey rae','mitski','lord huron',
    'the walters','gotye','new west','alec benjamin','tom rosenthal',
    'abba','dr. dog','tate mcrae','powfu','avicii','wiz khalifa',
    'conan gray','kate bush','lizzo','dove cameron','nicky youre',
    'onerepublic','laufey','beach house','sapientdream','girl in red',
    'clairo','ricky montgomery','mark ronson','miley cyrus','aaron smith',
    'smash mouth','jennifer lopez','pitbull','bruno mars','meghan trainor',
    'eurythmics','the ting tings','justin timberlake','the black eyed peas',
    'rema','will joseph cook','nathan evans','elley duhé','willow',
    'ashnikko','the stranglers','ali gatie','alexander rybak','rosa linn',
    'jon bellion','treasure','acraze','lsd','bob4','hwa sa',
    'måneskin','the ronettes','connie francis','engelbert humperdinck',
    'sade','edith whiskers','videoclub','thomas headon','saint avangeline',
    'ravyn lenae','the marías'
]);

const RETRO_ARTISTS = new Set([
    'kishore kumar','mohammed rafi','mohammad rafi','lata mangeshkar','mukesh',
    'hemant kumar','talat mahmood','asha bhosle','jagjit singh','manna dey',
    'geeta dutt','r. d. burman'
]);

const RETRO_KEYWORDS = ['60s','70s','retro','evergreen','1970','1972','1980','old hindi','old is gold','old bollywood'];

function fixFolder(entry, artist) {
    const al = artist.toLowerCase();
    const tl = entry.title.toLowerCase();
    const fl = entry.file.toLowerCase();
    const combined = al + ' ' + tl + ' ' + fl;

    // Artist-specific folders
    if (/talwiinder|talwinder/i.test(combined)) return 'Talwiinder';
    if (/karan aujla/i.test(al)) return 'Karan Aujla';
    if (/arijit singh/i.test(al) || (/arijit/i.test(fl) && /arijit/i.test(combined))) return 'Arijit Singh';

    // Retro
    const firstArtist = al.split(',')[0].trim();
    if (RETRO_ARTISTS.has(firstArtist)) return 'Retro Classics';
    if (RETRO_KEYWORDS.some(k => combined.includes(k))) return 'Retro Classics';

    // Global
    const artistParts = al.split(',').map(s => s.trim());
    if (artistParts.some(a => GLOBAL_ARTISTS.has(a))) return 'Global Hits';

    // Hindi default
    return 'Hindi Hits';
}

// ══════════════════════════════════════════════════════════════════════════
// SPECIFIC TITLE OVERRIDES (by file path)
// ══════════════════════════════════════════════════════════════════════════
const TITLE_OVERRIDES = {
    "song/505.mp3": "505",
    "song/Starboy.mp3": "Starboy",
    "song/Timeless.mp3": "Timeless",
    "songs/HASEEN - TALWIINDER, .mp3": "Haseen",
    "songs/Talwiinder - NASHA .mp3": "Nasha",
    "songs/wishes - Talwiinder .mp3": "Wishes",
    "songs/Pal Pal - Talwiinder  .mp3": "Pal Pal",
    "songs/Agg Banke - Talwiinder (DJJOhAL.Com) (1).mp3": "Agg Banke",
    "songs/Gaani - Talwiinder (DJJOhAL.Com) (1).mp3": "Gaani",
    "songs/Gallan 4 - Talwiinder (DJJOhAL.Com) (1).mp3": "Gallan 4",
    "songs/Haseen - Talwiinder (DJJOhAL.Com) (1).mp3": "Haseen",
    "songs/Heer (Afro Radio Edit) - Talwiinder (DJJOhAL.Com) (1).mp3": "Heer",
    "songs/Khayaal - Talwiinder (DJJOhAL.Com) (1).mp3": "Khayaal",
    "songs/Nakhre - Talwiinder (DJJOhAL.Com) (1).mp3": "Nakhre",
    "songs/Panchii - Talwiinder (DJJOhAL.Com) (1).mp3": "Panchii",
    "songs/Panchii - Talwiinder (DJJOhAL.Com).mp3": "Panchii",
    "songs/Dhundhala - Yashraj & Talwiinder (DJJOhAL.Com) (1).mp3": "Dhundhala",
    "songs/Pal Pal(KoshalWorld.Com).mp3": "Pal Pal",
    "songs/Talwinder - Wishes (Remake) - 128.MP3": "Wishes",
    "songs/Tamanna Afros - Feeling.mp3": "Feeling",
    "songs/Sunhari Kirne (PenduJatt.Com.Se).mp3": "Sunhari Kirne",
    "songs/lala_li_lala_song_aca_xoca_la_la_la_li_la_la_la_song_ne_TcjB0sWhvxg.mp3": "La La Li La La La",
    "songs/Afusic - Pal Pal (Official Music Video) Prod. @AliSoomroMusic - 128.MP3": "Pal Pal",
    "songs/Sajde - Official Music Video  Faheem Abdullah  Huzaif Nazar - 128.MP3": "Sajde",
    "songs/Sufr - Bargad (Lyrics) ft. Arpit Bala, toorjo dey - 256.MP3": "Sufr",
    "songs/Rakhlo Tum Chupaake - 128.MP3": "Rakhlo Tum Chupaake",
    "songs/PYARI AMAANAT - Arpit Bala, @aodgotit  ,  @angadsvirk  (Official\u00a0Music\u00a0Video) - 128.MP3": "Pyari Amaanat",
    "songs/Banjaare - Bairan (Lyrics) - 128.MP3": "Banjaare",
    "songs/Bargad - Surf X Arpit Bala  Lyrics - 128.MP3": "Bargad",
    "songs/Kaifi Khalil - Kahani Suno 2.0 [Official Music Video] - 128.MP3": "Kahani Suno 2.0",
    "songs/Tu Hai Kahan by AUR  \u062a\u0648 \u06c1\u06d2 \u06a9\u06c1\u0627\u06ba (Official Music Video) - 128.MP3": "Tu Hai Kahan",
    "songs/Jo Tu Nahi To Aisa Main Chehra Maand Slowed and Reverb - 128.MP3": "Jo Tu Nahi",
    "songs/Mere Samne Wali Khidki Mein - Padosan - Saira Banu, Sunil Dutt & Kishore Kumar - Old Hindi Songs - 128.MP3": "Mere Samne Wali Khidki Mein",
};

// ══════════════════════════════════════════════════════════════════════════
// ARTIST OVERRIDES (by file path)
// ══════════════════════════════════════════════════════════════════════════
const ARTIST_OVERRIDES = {
    "songs/Tamanna Afros - Feeling.mp3": "Tamanna Afros",
    "songs/HASEEN - TALWIINDER, .mp3": "Talwiinder",
    "songs/Talwiinder - NASHA .mp3": "Talwiinder",
    "songs/wishes - Talwiinder .mp3": "Talwiinder",
    "songs/Pal Pal - Talwiinder  .mp3": "Afusic, Talwiinder",
    "songs/Agg Banke - Talwiinder (DJJOhAL.Com) (1).mp3": "Talwiinder",
    "songs/Gaani - Talwiinder (DJJOhAL.Com) (1).mp3": "Talwiinder",
    "songs/Gallan 4 - Talwiinder (DJJOhAL.Com) (1).mp3": "Talwiinder",
    "songs/Haseen - Talwiinder (DJJOhAL.Com) (1).mp3": "Talwiinder",
    "songs/Heer (Afro Radio Edit) - Talwiinder (DJJOhAL.Com) (1).mp3": "Talwiinder",
    "songs/Khayaal - Talwiinder (DJJOhAL.Com) (1).mp3": "Talwiinder",
    "songs/Nakhre - Talwiinder (DJJOhAL.Com) (1).mp3": "Talwiinder",
    "songs/Panchii - Talwiinder (DJJOhAL.Com) (1).mp3": "Talwiinder",
    "songs/Panchii - Talwiinder (DJJOhAL.Com).mp3": "Talwiinder",
    "songs/Dhundhala - Yashraj & Talwiinder (DJJOhAL.Com) (1).mp3": "Yashraj, Talwiinder",
    "songs/Pal Pal(KoshalWorld.Com).mp3": "Afusic, Talwiinder",
    "songs/Talwinder - Wishes (Remake) - 128.MP3": "Talwiinder",
    "songs/Sunhari Kirne (PenduJatt.Com.Se).mp3": "Talwiinder",
    "songs/Afusic - Pal Pal (Official Music Video) Prod. @AliSoomroMusic - 128.MP3": "Afusic, Talwiinder",
    "song/Gul - 256-1.MP3": "Anuv Jain",
    "songs/Meri Meheboob  Timeless Disco  Reimagined - 128.MP3": "Mohammed Rafi",
    "songs/1919679927.mp3": "Kishore Kumar",
    "songs/3886850381.mp3": "Mohammed Rafi",
};

// ══════════════════════════════════════════════════════════════════════════
// FOLDER OVERRIDES
// ══════════════════════════════════════════════════════════════════════════
const FOLDER_OVERRIDES = {
    "song/Gul - 256-1.MP3": "Hindi Hits",
    "song/La Casa De Papel": "Global Hits",
    "songs/Meri Meheboob  Timeless Disco  Reimagined - 128.MP3": "Retro Classics",
    "songs/Mere Samne Wali Khidki Mein": "Retro Classics",
    "songs/1919679927.mp3": "Retro Classics",
    "songs/3886850381.mp3": "Retro Classics",
};

// Misclassified entries that should NOT be Retro Classics
const NOT_RETRO = [
    "Kaise Bataaoon",  // K.K. is modern
    "Mere Bina Full Video - Crook",  // Nikhil D'Souza is modern
    "Gimme More (Remastered)",  // Britney Spears
];

// ══════════════════════════════════════════════════════════════════════════
// PROCESS ALL ENTRIES
// ══════════════════════════════════════════════════════════════════════════
const cleaned = [];
for (const e of entries) {
    // 1. Fix artist
    let artist = ARTIST_OVERRIDES[e.file] || fixArtist(e);

    // 2. Fix title
    let title = TITLE_OVERRIDES[e.file] || cleanTitle(e.title, artist);

    // 3. Fix folder
    let folder;
    // Check folder overrides by file path substring
    let folderOverridden = false;
    for (const [key, val] of Object.entries(FOLDER_OVERRIDES)) {
        if (e.file.includes(key)) { folder = val; folderOverridden = true; break; }
    }
    if (!folderOverridden) {
        folder = fixFolder({ ...e, title }, artist);
    }

    // Fix NOT_RETRO misclassifications
    if (folder === 'Retro Classics' && NOT_RETRO.some(k => title.includes(k))) {
        folder = 'Hindi Hits';
    }

    cleaned.push({ title, artist, file: e.file, art: e.art, folder });
}

// ══════════════════════════════════════════════════════════════════════════
// BUILD NEW BLOCK
// ══════════════════════════════════════════════════════════════════════════
function esc(s) { return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

let newBlock = '    // ─── AUTO-CATEGORIZED SONGS (all folders) ───────────────────────────────────\n';
for (const e of cleaned) {
    newBlock += `    { title: "${esc(e.title)}", artist: "${esc(e.artist)}", file: "${esc(e.file)}", art: "${esc(e.art)}", folder: "${esc(e.folder)}", durationFormatted: "" },\n`;
}

// Replace
code = code.slice(0, startIdx) + newBlock + code.slice(endIdx);

fs.writeFileSync(SCRIPT, code, 'utf8');
console.log(`✅ Cleaned ${cleaned.length} entries. Wrote updated script.js`);

// Print summary stats
const folders = {};
for (const e of cleaned) {
    folders[e.folder] = (folders[e.folder] || 0) + 1;
}
console.log('\nFolder distribution:');
for (const [f, c] of Object.entries(folders).sort((a,b) => b[1]-a[1])) {
    console.log(`  ${f}: ${c}`);
}

// Print entries with Unknown Artist for review
const unknowns = cleaned.filter(e => e.artist === 'Unknown Artist');
if (unknowns.length) {
    console.log(`\n⚠️ ${unknowns.length} entries still have "Unknown Artist":`);
    unknowns.forEach(e => console.log(`  - "${e.title}" (${e.file})`));
}

