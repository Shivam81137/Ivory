const fs = require('fs');

async function updateArt() {
    try {
        console.log('Reading script.js...');
        const scriptContent = fs.readFileSync('script.js', 'utf8');

        // Extract songs array using regex
        const match = scriptContent.match(/const songs = (\[[\s\S]*?\]);/);
        if (!match) {
            throw new Error('Could not find songs array in script.js');
        }

        // Evaluate the array string to get the object
        // We need to make sure the string is valid JS object literal
        // It should be, based on the file format
        const songs = eval(match[1]);
        
        console.log(`Found ${songs.length} songs.`);

        let updatedCount = 0;
        const total = songs.length;

        for (let i = 0; i < total; i++) {
            const song = songs[i];
            
            // Only update if it's Global Hits or has placeholder art
            // And doesn't already have a high-res iTunes URL (mzstatic)
            if ((song.folder === 'Global Hits' || song.art === 'IMAGES/logoo.png') && !song.art.includes('mzstatic')) {
                console.log(`[${i+1}/${total}] Fetching art for: ${song.title} - ${song.artist}`);
                
                try {
                    const query = encodeURIComponent(`${song.title} ${song.artist}`);
                    const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`;
                    
                    const response = await fetch(url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                        }
                    });
                    
                    if (!response.ok) {
                        console.warn(`   -> HTTP Error: ${response.status} ${response.statusText}`);
                        if (response.status === 429 || response.status === 403) {
                             console.warn("Rate limit hit, waiting longer...");
                             await new Promise(r => setTimeout(r, 5000));
                        }
                        continue;
                    }

                    const text = await response.text();
                    if (!text) {
                        console.warn(`   -> Empty response body`);
                        continue;
                    }

                    let data;
                    try {
                        data = JSON.parse(text);
                    } catch (e) {
                         console.warn(`   -> JSON Parse Error: ${e.message}. Body: ${text.substring(0, 50)}...`);
                         continue;
                    }
                    
                    if (data.results && data.results.length > 0) {
                        const artworkUrl = data.results[0].artworkUrl100;
                        // Upgrade to 600x600 for best quality
                        song.art = artworkUrl.replace('100x100', '600x600');
                        updatedCount++;
                        console.log(`   -> Found: ${song.art}`);
                    } else {
                        console.log(`   -> No results found.`);
                    }
                } catch (e) {
                    console.error(`   -> Error fetching art: ${e.message}`);
                }
                
                // Be nice to the API - 3 seconds delay
                await new Promise(r => setTimeout(r, 3000));
            }
        }

        console.log(`Updated artwork for ${updatedCount} songs.`);

        // Write to a JSON file first for safety
        fs.writeFileSync('updated_songs.json', JSON.stringify(songs, null, 4));
        console.log('Saved updated songs to updated_songs.json');

    } catch (err) {
        console.error('Error:', err);
    }
}

updateArt();
