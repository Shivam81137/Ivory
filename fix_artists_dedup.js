/**
 * fix_artists_dedup.js
 * 1. Deduplicates ALL songs across ALL folders (by file path)
 * 2. Fixes known incorrect artist names in Global Hits
 * 3. Rewrites script.js cleanly
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'script.js');
const src = fs.readFileSync(filePath, 'utf8');
const lines = src.split(/\r?\n/);
const lineEnding = src.includes('\r\n') ? '\r\n' : '\n';

// ─── Artist corrections map: title -> correct artist ─────────────────────────
// Keyed by song title (case-sensitive as in data)
const artistFixes = {
    // Global Hits
    'Blue':                         'Yung Kai',
    'I Like Me Better':             'Lauv',
    'Make You Mine':                'PUBLIC',
    'Love Me Harder':               'Ariana Grande ft. The Weeknd',
    'Shinunoga E-Wa':               'Fujii Kaze',
    'Attention':                    'Charlie Puth',
    'Closer':                       'The Chainsmokers ft. Halsey',
    'Love Story':                   'Taylor Swift',        // Taylor Swift version
    'Night Changes':                'One Direction',
    'Stuck with U':                 'Ariana Grande & Justin Bieber',
    'Paper Rings':                  'Taylor Swift',
    'Double Take':                  'dhruv',
    'Co2':                          'Prateek Kuhad',
    'I Wanna Be Yours':             'Arctic Monkeys',
    'Until I Found You':            'Stephen Sanchez',
    'I Think They Call This Love':  'Elliot James Reay',
    'Perfect':                      'Ed Sheeran',
    'You Belong To Me':             'Carla Bruni',
    'Maria':                        'Hwa Sa',
    'Positions':                    'Ariana Grande',
    'Lover':                        'Taylor Swift',
    'Unholy':                       'Sam Smith ft. Kim Petras',
    'Cheri Cheri Lady':             'Modern Talking',
    'Die For You':                  'The Weeknd',
    'Gat':                          'DALENG DALE',
    'Dandelions':                   'Ruth B.',
    'A Thousand Years':             'Christina Perri',
    'Who Says':                     'Selena Gomez',
    'Criminal':                     'Britney Spears',
    'Pink Venom':                   'BLACKPINK',
    "Pink Venom":                   'BLACKPINK',
    "'Pink Venom'":                 'BLACKPINK',
    'Under The Influence':          'Chris Brown',
    'Believer':                     'Imagine Dragons',
    'Gangnam Style':                'PSY',
    'Harleys In Hawaii':            'Katy Perry',
    'Ride It':                      'Jay Sean',
    'Love Me Like You Do':          'Ellie Goulding',
    'I See Red':                    'Everybody Loves An Outlaw',
    'Bella Ciao':                   'Il Volo (Money Heist)',
    'Wrap Me In Plastic':           'CHROMANCE',
    'Shape of You':                 'Ed Sheeran',
    'At My Worst':                  'Pink Sweat$',
    'Sunflower':                    'Post Malone & Swae Lee',
    'Fantasize':                    'Ariana Grande',
    'Some':                         'BOL4',
    'Memories':                     'Maroon 5',
    'Lovers':                       'Anna of the North',
    'End Of Beginning':             'Djo',
    'Lovely':                       'Billie Eilish & Khalid',
    'Starboy':                      'The Weeknd ft. Daft Punk',
    'Faded':                        'Alan Walker',
    'Stay':                         'The Kid LAROI & Justin Bieber',
    'Let Her Go':                   'Passenger',
    'Señorita':                     'Shawn Mendes & Camila Cabello',
    'As It Was':                    'Harry Styles',
    'Heat Waves':                   'Glass Animals',
    'Unstoppable':                  'Sia',
    'Mockingbird':                  'Eminem',
    'Sweater Weather':              'The Neighbourhood',
    'Skyfall':                      'Adele',
    'Die With A Smile':             'Lady Gaga & Bruno Mars',
    'Let Me Down Slowly':           'Alec Benjamin',
    "Beggin'":                      'Måneskin',
    'Beggin':                       'Måneskin',
    'Old Town Road':                'Lil Nas X ft. Billy Ray Cyrus',
    'Thunder':                      'Imagine Dragons',
    'Somewhere Only We Know':       'Keane',
    '505':                          'Arctic Monkeys',
    'Hall of Fame':                 'The Script ft. will.i.am',
    'Girls Like You':               'Maroon 5 ft. Cardi B',
    'Alone':                        'Alan Walker',
    'Espresso':                     'Sabrina Carpenter',
    'Animals':                      'Maroon 5',
    'Feel Good Inc.':               'Gorillaz',
    'Eenie Meenie':                 'Sean Kingston & Justin Bieber',
    'Infinity':                     'Jaymes Young',
    'Apocalypse':                   'Cigarettes After Sex',
    'Sailor Song':                  'Gigi Perez',
    'Darkside':                     'NEONI',
    'Timeless':                     'The Weeknd',
    'Ordinary':                     'Alex Warren',
    'Sapphire':                     'Ed Sheeran',
    'A Lonely Night':               'The Weeknd',
    'The Hills':                    'The Weeknd',
    'Heartless':                    'The Weeknd',
    'Call Out My Name':             'The Weeknd',
    'Save Your Tears':              'The Weeknd',
    'Save Your Tears (Remix)':      'The Weeknd & Ariana Grande',
    'São Paulo':                    'The Weeknd',
    'Reminder':                     'The Weeknd',
    'One Of The Girls':             'The Weeknd, JENNIE & Lily-Rose Depp',
    'Popular':                      'The Weeknd, Madonna & Playboi Carti',
    'I Feel It Coming':             'The Weeknd ft. Daft Punk',
    'In Your Eyes (Remix)':         'The Weeknd',
    'Nothing Without You':          'The Weeknd',
    'Secrets':                      'The Weeknd',
    'Maps':                         'Maroon 5',
    'Kiss of Life':                 'Sade',
    'Music To Watch Boys To':       'Lana Del Rey',
    'Home':                         'Michael Bublé',
    'Line Without a Hook':          'Ricky Montgomery',
    'Runaway':                      'AURORA',
    'I WANNA BE YOUR SLAVE':        'Måneskin',
    'Be My Baby':                   'The Ronettes',
    'Pretty Little Baby':           'Connie Francis',
    'Ocean Eyes':                   'Billie Eilish',
    'Let Down':                     'Radiohead',
    'Sunsetz':                      'Cigarettes After Sex',
    'I Love You So':                'The Walters',
    'Summertime Sadness':           'Lana Del Rey',
    'The Most Beautiful Thing':     'Thomas Headon',
    'Wellerman':                    'Nathan Evans',
    'Easy On Me':                   'Adele',
    'MIDDLE OF THE NIGHT':          'Elley Duhé',
    'Wait a Minute!':               'WILLOW',
    'Slumber Party':                'Ashnikko ft. Princess Nokia',
    'Le':                           'Charlie Puth ft. Jung Kook',
    'Somebody That I Used To Know': 'Gotye ft. Kimbra',
    'Dancin':                       'Aaron Smith ft. Krono',
    'Nothing Breaks Like a Heart':  'Mark Ronson ft. Miley Cyrus',
    'Pump It':                      'The Black Eyed Peas',
    'All Time Low':                 'Jon Bellion',
    'Breakfast':                    'Dove Cameron',
    'Sunroof':                      'Nicky Youre & dazy',
    'No Guidance':                  'Chris Brown ft. Drake',
    'All Star':                     'Smash Mouth',
    'Locked out of Heaven':         'Bruno Mars',
    'Space Song':                   'Beach House',
    'Safety Net':                   'Ariana Grande ft. Ty Dolla $ign',
    'Sweet Dreams (Are Made of This)': 'Eurythmics',
    'Title':                        'Meghan Trainor',
    'You Broke Me First':           'Tate McRae',
    'A Man Without Love':           'Engelbert Humperdinck',
    'Running Up That Hill':         'Kate Bush',
    'On The Floor':                 'Jennifer Lopez ft. Pitbull',
    'Enemy':                        'Imagine Dragons & JID',
    'About Damn Time':              'Lizzo',
    'Maniac':                       'Conan Gray',
    'Do It To It':                  'ACRAZE ft. Cherish',
    '다라리 (DARARI)':              'TREASURE',
    'Genius':                       'LSD ft. Sia, Diplo & Labrinth',
    "I Ain't Worried - Acoustic":   'OneRepublic',
    'Calm Down':                    'Rema & Selena Gomez',
    'Gimme More':                   'Britney Spears',
    "That's Not My Name":           'The Ting Tings',
    'SexyBack':                     'Justin Timberlake ft. Timbaland',
    'Be Around Me':                 'Will Joseph Cook',
    'We Fell In Love In October':   'Girl In Red',
    'Slipping Through My Fingers':  'ABBA',
    'Those Eyes':                   'New West',
    'From The Start':               'Laufey',
    'My Love Mine All Mine':        'Mitski',
    'Past Lives':                   'sapientdream',
    'Every Breath You Take':        'The Police',
    'Love Me Not':                  'Ravyn Lenae',
    'BIRDS OF A FEATHER':           'Billie Eilish',
    'No One Noticed':               'The Marías',
    'SNAP':                         'Rosa Linn',
    'Lilith':                       'Saint Avangeline',
    'Put Your Records On':          'Corinne Bailey Rae',
    'Back To Friends':              'Sombr',
    'Golden Brown':                 'The Stranglers',
    'Lover Girl':                   'Laufey',
    'Sofia':                        'Clairo',
    "Where'd All the Time Go?":     'Dr. Dog',
    'Billie Jean':                  'Michael Jackson',
    'The Night We Met':             'Lord Huron',
    "Heaven Knows I'm Miserable Now": 'The Smiths',
    'Washing Machine Heart':        'Mitski',
    'Lights Are On':                'Tom Rosenthal',
    'Fairytale':                    'Alexander Rybak',
    "It's You":                     'Ali Gatie',
    'Forever Young':                'Alphaville',
    'No. 1 Party Anthem':           'Arctic Monkeys',
    'Cry':                          'Cigarettes After Sex',
    'Falling In Love':              'Cigarettes After Sex',
    'Everything I Wanted':          'Billie Eilish',
    'Breathe':                      'Years & Years',
    'Falling':                      'Harry Styles',
    'Death Bed':                    'Powfu ft. beabadoobee',
    'The Nights':                   'Avicii',
    'See You Again':                'Wiz Khalifa ft. Charlie Puth',
    'Havana':                       'Camila Cabello ft. Young Thug',
    'I Like You So Much, You\'ll Know It': 'Ysabelle Cuevas',
    "I Like You So Much, You'll Know It (我多喜欢你，你会知道)- A Love So Beautiful OST -Wang Junqi": 'Ysabelle Cuevas',

    // Hindi Hits fixes
    'Sadka Kiya':                   'Suraj Jagan & Mahalaxmi Iyer',
    'Sadka':                        'Suraj Jagan & Mahalaxmi Iyer',
    'Labon Ko':                     'K.K.',
    'Kaise Bataaoon':               'K.K.',
    'Pehli Nazar Mein':             'Atif Aslam',
    'Rang Jo Lagyo':                'Atif Aslam & Shreya Ghoshal',
    'Be Intehaan':                  'Atif Aslam & Sunidhi Chauhan',
    'Rang Lageya':                  'Mohit Chauhan',
    'Dekha Hazaro Dafaa':           'Arijit Singh & Palak Muchhal',
    'Tum Tak':                      'Javed Ali',
    'Raanjhanaa':                   'A.R. Rahman',
    'Dil Ye Bekarar Kyun Hai':      'Mohit Chauhan & Shreya Ghoshal',
    'Is This Love':                 'Mohit Chauhan & Shreya Ghoshal',
    'Tujhko Jo Paaya':              'Mohit Chauhan',
    'Mere Bina':                    'Mohit Chauhan',
    'Khoya Khoya':                  'Mohit Chauhan',
    'Yeh Fitoor Mera':              'Arijit Singh',
    'Ehsaas':                       'Faheem Abdullah',
    'Ishq':                         'Faheem Abdullah',
    'Maine Khud Ko':                'Mustafa Zahid',
    'Ranjheya Ve':                  'Zain Zohaib',
    'Humsafar':                     'Akhil Sachdeva',
    'Ve Haaniyaan':                 'Avvy Sra & Danny',
    'Dariya':                       'Arko Pravo Mukherjee',
    'Tu Chahiye':                   'Atif Aslam',
    'Saude Bazi':                   'Pritam',
    'Darkhaast':                    'Arijit Singh & Sunidhi Chauhan',
    'Meherbaan':                    'Ash King & Shilpa Rao',
    'Zehnaseeb':                    'Chinmayi Sripada',
    'Ishq Bulaava':                 'Sanam Puri & Shipra Goyal',
    'Aahista':                      'Arijit Singh & Jonita Gandhi',
    'Jaan Ban Gaye':                'Vishal Mishra & Asees Kaur',
    'O Rangrez':                    'Shreya Ghoshal & Javed Bashir',
    'Taare Ginn':                   'Mohit Chauhan & Shreya Ghoshal',
    'Haareya':                      'Arijit Singh',
    'Sukoon Mila':                  'Arijit Singh',
    'Zaroor':                       'Aparshakti Khurana',
    'Manchala':                     'Shafqat Amanat Ali',
    'Ik Kudi':                      'wolf.cryman',
    'Qaafirana':                    'Arijit Singh & Nikhita Gandhi',
    'Abhi Kuch Dino Se':            'Mohit Chauhan',
    'Jogi':                         'Yasser Desai & Aakanksha Sharma',
    'Dooron Dooron':                'Paresh Pahuja',
    'Bardali':                      'Sushant KC & Indrakala Rai',
    'Jhol':                         'Maanu & Annural Khalid',
    'Nadaaniyan':                   'Akshath',
    'Khwab':                        'Iqlipse Nova & Aditya A',
    'Zulfein':                      'Mehul Mahesh & DJ Aynik',
    'Meri Banogi Kya':              'Rito Riba',
    'Savera':                       'Iqlipse Nova & Anubha Bajaj',
    'Dear Maahiya':                 'Tanishka Bahl & Saaheal',
    'Kasari':                       'Yabesh Thapa',
    'Jhim Jhim Aune Aakhale':       'Ekdev Limbu',
    'Timro Pratiksa':               'Shallum Lama',
    'Timi Sangai':                  'Apurva Tamang',
    'Timi Nacha Na':                'Wangden Sherpa',
    'Rukum Maikot':                 'SD Yogi & Shanti Shree Pariyar',
    'Sarangi':                      'Sushant KC',
    'Inkem Inkem':                  'Sid Sriram',
    'Hosanna':                      'A.R. Rahman',
    'Dil Se Dil':                   'Shashwat Singh',
    'Mann Mera':                    'Gajendra Verma',
    'Mere Nishan':                  'Darshan Raval',
    'Mere Liye Tum Kaafi Ho':       'Ayushmann Khurrana',
    'Aankhon Se Batana':            'Dikshant',
    'Iraaday':                      'Abdul Hannan & Rovalio',
    'Kahaan Ho Tum':                'Prateek Kuhad',
    'Ishq Hai':                     'Anuv Jain',
    'Jugraafiya':                   'Udit Narayan & Shreya Ghoshal',
    'Jab Tak':                      'Armaan Malik',
    'Sachiya Mohabbatan':           'Sachet Tandon',
    'Kyon':                         'Papon & Sunidhi Chauhan',
    'Chaar Kadam':                  'Shaan & Shreya Ghoshal',
    'Enna Sona':                    'A.R. Rahman & Arijit Singh',
    'Bairiyaa':                     'Atif Aslam & Shreya Ghoshal',
    'Jeene Laga Hoon':              'Atif Aslam & Shreya Ghoshal',
    'Sajni':                        'Arijit Singh & Ram Sampath',
    'Ve Haaniyaan':                 'Avvy Sra & Danny',
    'Timro Pratiksa':               'Shallum Lama',

    // Anuv Jain
    'Arz Kiya Hai':                 'Anuv Jain & Lost Stories',
    'Afsos':                        'Anuv Jain',
    'Alag Aasmaan':                 'Anuv Jain',
    'Baarishein':                   'Anuv Jain',
    'Gul':                          'Anuv Jain',
    'Husn':                         'Anuv Jain',
    'Jo Tum Mere Ho':               'Anuv Jain',
};

// Title fix for the "I Like You So Much" song (long title in data)
const titleFixes = {
    "I Like You So Much, You'll Know It (我多喜欢你，你会知道)- A Love So Beautiful OST -Wang Junqi": 
        "I Like You So Much, You'll Know It",
    "'Pink Venom'":
        "Pink Venom",
    "Unknown Track":
        "Ra & Tomine Harket",  // leave as-is, just fix artist below
};

// ─── Process lines ────────────────────────────────────────────────────────────
let fixCount = 0;
let titleFixCount = 0;
const seenFiles = new Set();
const newLines = [];
let skippedDupes = 0;

for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, '');

    // Check if this is a song entry line
    if (!line.trim().startsWith('{ title:') && !line.trim().startsWith('{ title :')) {
        newLines.push(line);
        continue;
    }

    // Extract file path for dedup
    const fileM = line.match(/file:\s*"([^"]+)"/);
    const fileKey = fileM ? fileM[1].trim().toLowerCase() : null;

    // Dedup by file path
    if (fileKey && seenFiles.has(fileKey)) {
        skippedDupes++;
        continue; // skip duplicate
    }
    if (fileKey) seenFiles.add(fileKey);

    let fixedLine = line;

    // Fix title first
    const titleM = line.match(/title:\s*"([^"]+)"/);
    const oldTitle = titleM ? titleM[1] : null;

    if (oldTitle && titleFixes[oldTitle]) {
        const newTitle = titleFixes[oldTitle];
        if (newTitle !== oldTitle) {
            fixedLine = fixedLine.replace(`title: "${oldTitle}"`, `title: "${newTitle}"`);
            titleFixCount++;
        }
    }

    // Get effective title (after potential fix)
    const effectiveTitleM = fixedLine.match(/title:\s*"([^"]+)"/);
    const effectiveTitle = effectiveTitleM ? effectiveTitleM[1] : null;

    // Fix artist
    if (effectiveTitle) {
        // Try exact match first
        let correctArtist = artistFixes[effectiveTitle];

        // Special case: "Love Story" — only fix if Taylor Swift version
        if (effectiveTitle === 'Love Story') {
            const artistM2 = fixedLine.match(/artist:\s*"([^"]+)"/);
            const curArtist = artistM2 ? artistM2[1] : '';
            if (curArtist.includes('Indila') || curArtist.includes('indila')) {
                correctArtist = null; // Don't change Indila's Love Story
            } else {
                correctArtist = 'Taylor Swift';
            }
        }

        // Special "Attention" — only if Charlie Puth (not BTS version)
        if (effectiveTitle === 'Attention') {
            const artistM2 = fixedLine.match(/artist:\s*"([^"]+)"/);
            const curArtist = artistM2 ? artistM2[1] : '';
            if (curArtist.includes('BTS') || curArtist.includes('Jung Kook')) {
                correctArtist = 'Charlie Puth ft. Jung Kook';
            } else {
                correctArtist = 'Charlie Puth';
            }
        }

        if (correctArtist) {
            const artistM2 = fixedLine.match(/artist:\s*"([^"]+)"/);
            const oldArtist = artistM2 ? artistM2[1] : '';
            if (oldArtist !== correctArtist) {
                fixedLine = fixedLine.replace(`artist: "${oldArtist}"`, `artist: "${correctArtist}"`);
                fixCount++;
                // console.log(`  Fixed artist: "${effectiveTitle}": "${oldArtist}" -> "${correctArtist}"`);
            }
        }
    }

    newLines.push(fixedLine);
}

console.log(`\n✅ Results:`);
console.log(`  Artist fixes applied: ${fixCount}`);
console.log(`  Title fixes applied:  ${titleFixCount}`);
console.log(`  Duplicates removed:   ${skippedDupes}`);
console.log(`  Lines in new file:    ${newLines.length}`);

// Save
const newSrc = newLines.join(lineEnding);
fs.writeFileSync(filePath + '.bak5', src, 'utf8');
fs.writeFileSync(filePath, newSrc, 'utf8');
console.log('\n✅ script.js saved successfully!');

// Verify Global Hits count
const vLines = newSrc.split(/\r?\n/).filter(l => l.includes('folder: "Global Hits"'));
console.log(`Global Hits songs remaining: ${vLines.length}`);
console.log('\nFirst 12 Global Hits:');
vLines.slice(0, 12).forEach((l, i) => {
    const t = (l.match(/title:\s*"([^"]+)"/) || ['','?'])[1];
    const a = (l.match(/artist:\s*"([^"]+)"/) || ['','?'])[1];
    console.log(`  ${i+1}. "${t}" — ${a}`);
});
