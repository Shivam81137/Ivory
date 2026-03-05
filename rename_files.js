const fs = require('fs').promises;
const path = require('path');
const { parseFile } = require('music-metadata');

const directories = [
    'songs/Arijit',
    'songs/HINDI HITS',
    'songs/karan aujla',
    'songs/english_hits'
];

const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac'];

async function renameSong(filePath) {
    try {
        const metadata = await parseFile(filePath);
        const ext = path.extname(filePath);
        const dir = path.dirname(filePath);
        
        let title = metadata.common.title || path.basename(filePath, ext);
        let artist = metadata.common.artist || 'Unknown Artist';
        
        // Clean up title and artist
        title = title.replace(/[<>:"/\\|?*]/g, '').trim();
        artist = artist.replace(/[<>:"/\\|?*]/g, '').trim();
        
        const newName = `${title} - ${artist}${ext}`;
        const newPath = path.join(dir, newName);
        
        // Check if already renamed or if file would have same name
        if (filePath === newPath) {
            console.log(`✓ Already correct: ${path.basename(filePath)}`);
            return { success: true, skipped: true };
        }
        
        // Check if target file already exists
        try {
            await fs.access(newPath);
            console.log(`⚠ Target exists: ${newName}`);
            return { success: false, error: 'Target exists' };
        } catch (e) {
            // File doesn't exist, safe to rename
        }
        
        await fs.rename(filePath, newPath);
        console.log(`✓ Renamed: ${path.basename(filePath)} → ${newName}`);
        return { success: true, oldName: path.basename(filePath), newName };
        
    } catch (error) {
        console.error(`✗ Error processing ${path.basename(filePath)}: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function processDirectory(dir) {
    console.log(`\n📁 Processing: ${dir}`);
    console.log('─'.repeat(60));
    
    const files = await fs.readdir(dir);
    const audioFiles = files.filter(f => audioExtensions.includes(path.extname(f).toLowerCase()));
    
    let renamed = 0;
    let skipped = 0;
    let failed = 0;
    
    for (const file of audioFiles) {
        const fullPath = path.join(dir, file);
        const result = await renameSong(fullPath);
        
        if (result.success) {
            if (result.skipped) {
                skipped++;
            } else {
                renamed++;
            }
        } else {
            failed++;
        }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   Renamed: ${renamed}`);
    console.log(`   Already correct: ${skipped}`);
    console.log(`   Failed: ${failed}`);
    
    return { renamed, skipped, failed };
}

async function main() {
    console.log('🎵 Audio File Renamer');
    console.log('Format: "Song Name - Artist Name"\n');
    
    let totalRenamed = 0;
    let totalSkipped = 0;
    let totalFailed = 0;
    
    for (const dir of directories) {
        try {
            const stats = await processDirectory(dir);
            totalRenamed += stats.renamed;
            totalSkipped += stats.skipped;
            totalFailed += stats.failed;
        } catch (error) {
            console.error(`Error processing directory ${dir}:`, error.message);
        }
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('🎯 TOTAL SUMMARY');
    console.log('═'.repeat(60));
    console.log(`✓ Total Renamed: ${totalRenamed}`);
    console.log(`✓ Already Correct: ${totalSkipped}`);
    console.log(`✗ Total Failed: ${totalFailed}`);
}

main().catch(console.error);
