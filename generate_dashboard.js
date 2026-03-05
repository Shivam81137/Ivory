const fs = require('fs');
const path = require('path');
const { parseFile } = require('music-metadata');

function cleanTitle(title) {
    let cleaned = title;

    if (cleaned.includes('|')) {
        cleaned = cleaned.split('|')[0];
    }

    // Normalize ALL dash types to " - "
    cleaned = cleaned.replace(/[\u2013\u2014]/g, '-'); // En-dash, Em-dash
    cleaned = cleaned.replace(/\s+-\s+|\s*-\s+/g, ' - ');

    // 2. Remove standard junk phrases (regex) first
    // Order matters! Remove longer phrases first.
    cleaned = cleaned
        .replace(/\s*-\s*PagalNew.*$/i, '')
        .replace(/\s*\(Official[^)]*\)/gi, '')
        .replace(/\s*\[Official[^\]]*\]/gi, '')
        .replace(/\s*Official\s+(Video|Audio|Music Video|Lyric Video).*/gi, '')
        .replace(/\s*Lyrical\s+Video.*/gi, '')
        .replace(/\s*Lyrical\s*/gi, '')
        .replace(/\s*\(Lyric[^)]*\)/gi, '')
        .replace(/\s*\[Lyric[^\]]*\]/gi, '')
        .replace(/Lyrics?/gi, '')
        .replace(/\s*FULL\s+VIDEO\s+Song.*/gi, '')
        .replace(/\s*Full\s+Video.*/gi, '')
        .replace(/\s*\(from [^)]*\)/gi, '')
        .replace(/\s*\(.*MV.*\)/gi, '')
        .replace(/\s*\[.*MV.*\]/gi, '')
        .replace(/\s+ft\.?\s+.*/gi, '')
        .replace(/\s+Feat\.?\s+.*/gi, '')
        .replace(/\s+\d+\s*Kbps.*$/gi, '')
        .replace(/\s+Best\s+(Video|Audio|Lyric Video).*$/gi, '')
        .replace(/\s*\(Full Video\)/gi, '')
        .replace(/\s*\[Full Video\]/gi, '')
        .replace(/\"[^\"]*\"$/g, '') 
        .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
        .trim();
    
    // Remove empty punctuation and trailing open parens
    cleaned = cleaned
        .replace(/\(\s*\)/g, '')
        .replace(/\[\s*\]/g, '')
        .replace(/\(\s*$/g, '') // Trailing open paren
        .trim();

    // 3. Smart Split by " - " to remove Artists or remaining Junk
    if (cleaned.includes(' - ')) {
         const parts = cleaned.split(' - ').map(p => p.trim());
         const commonArtists = [
             'A.R. Rahman', 'Arijit Singh', 'Atif Aslam', 'Pritam', 'Gajendra Verma', 'Ekdev Limbu', 
             'Sushant KC', 'Wangden Sherpa', 'Yabesh thapa', 'Rahat Fateh Ali Khan', 'Badshah', 
             'Guru Randhawa', 'T-Series', 'Sony Music India', 'Zee Music Company', 'Tips Official', 
             'YRF', 'README', 'SonyMusicIndiaVEVO', 'PagalNew', 'Bollywood Dhamaka', 'UR DEBUT', 'Indie India',
             'Paresh Pahuja', 'Cinephile\'s Corner', 'seventyskye', 'wolf.cryman', 'Abdul Hannan',
             'Akshath', 'Dikshant', 'Nepali Fine Tunes','Dreamiyata Music', 'Musicgenree', 'M O O N',
             'Darshan Raval', 'Vishal Mishra', 'Armaan Malik', 'Amaal Mallik', 'Palak Muchhal', 
             'Shilpa Rao', 'Nikhita Gandhi', 'Sachet Tandon', 'Parampara', 'Iqlipse Nova', 'Aditya A',
             'Yo Yo Honey Singh', 'Mika Singh', 'Sunidhi Chauhan', 'Shreya Ghoshal', 'Udit Narayan',
             'Alka Yagnik', 'Kumar Sanu', 'Javed Ali', 'Mohit Chauhan', 'K.K.', 'KK', 'Shaan',
             'Himesh Reshammiya', 'Ankit Tiwari', 'Mithoon', 'Jeet Gannguli', 'Rochak Kohli',
             'Tanishk Bagchi', 'Meet Bros', 'Sajid Wajid', 'Vishal-Shekhar', 'Salim-Sulaiman',
             'Shankar-Ehsaan-Loy', 'Amit Trivedi', 'Ajay-Atul', 'Sachin-Jigar', 'Ram Sampath',
             'Sneha Khanwalkar', 'Nucleya', 'Ritviz', 'Divine', 'Naezy', 'Emiway Bantai', 'Raftaar',
             'Ikka', 'Dino James', 'King', 'MC Stan', 'Paradox', 'Hustle 2.0', 'Hustle', 'MTV Hustle',
             'Faheem Abdullah', 'Rovalio'
         ];
         
         const junkWords = ['Lyrical', 'Video', 'Audio', 'Official', 'Original', 'Full Song', 'Teaser', 'Lyrics', 'Visualizer', 'Full Video', 'Kismat Konnection'];

         const filteredParts = parts.filter(part => {
             const isArtist = commonArtists.some(a => part.toLowerCase().includes(a.toLowerCase()));
             const isJunk = junkWords.some(j => part.toLowerCase() === j.toLowerCase());
             return !isArtist && !isJunk;
         });

         if (filteredParts.length > 0) {
             // If multiple parts remain (e.g. "Song - Movie"), take the FIRST one as the Title
             cleaned = filteredParts[0];
         } else {
             cleaned = parts[0];
         }
    }
    
    // Final trim of punctuation
    cleaned = cleaned.replace(/^[\s-]+|[\s-]+$/g, '');

    return cleaned || title;
}

async function generateDashboard() {
    const directories = [
        { path: 'songs/Arijit', name: 'Arijit Singh', icon: '🎤' },
        { path: 'songs/HINDI HITS', name: 'Hindi Hits', icon: '🇮🇳' },
        { path: 'songs/karan aujla', name: 'Karan Aujla', icon: '🎧' },
        { path: 'songs/english_hits', name: 'Global Hits', icon: '🌍' }
    ];

    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'];
    let allSongs = [];
    let trackNumber = 1;

    for (const dir of directories) {
        const files = await fs.promises.readdir(dir.path);
        const audioFiles = files.filter(f => audioExtensions.includes(path.extname(f).toLowerCase()));

        for (const file of audioFiles) {
            const fullPath = path.join(dir.path, file);
            try {
                const metadata = await parseFile(fullPath);
                const rawTitle = metadata.common.title || path.basename(file, path.extname(file));
                const title = cleanTitle(rawTitle);
                const artist = metadata.common.artist || 'Unknown Artist';
                const duration = metadata.format.duration || 0;
                const mins = Math.floor(duration / 60);
                const secs = Math.floor(duration % 60).toString().padStart(2, '0');

                allSongs.push({
                    number: trackNumber++,
                    title,
                    artist,
                    album: dir.name,
                    duration: `${mins}:${secs}`,
                    icon: dir.icon
                });
            } catch (error) {
                // Skip files with metadata errors
            }
        }
    }

    // Generate Markdown Dashboard
    let markdown = '';

    // Generate for each category
    for (const dir of directories) {
        const categorySongs = allSongs.filter(s => s.album === dir.name);
        if (categorySongs.length === 0) continue;

        markdown += `## ${dir.icon} ${dir.name}\n\n`;
        markdown += `| # | Title | Artist | Duration |\n`;
        markdown += `|---|-------|--------|----------|\n`;

        categorySongs.forEach(song => {
            markdown += `| ${song.number} | ${song.title} | ${song.artist} | ${song.duration} |\n`;
        });

        markdown += `\n`;
    }

    await fs.promises.writeFile('MUSIC_LIBRARY.md', markdown, 'utf8');
    console.log('✅ Dashboard generated: MUSIC_LIBRARY.md');
}

generateDashboard().catch(console.error);
