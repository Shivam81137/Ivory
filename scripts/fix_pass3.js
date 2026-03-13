/**
 * fix_pass3.js — Third pass: fix ALL remaining dirty titles, wrong artists, wrong classifications
 */
const fs = require('fs');
const path = require('path');

const SCRIPT = path.join(__dirname, '..', 'script.js');
let code = fs.readFileSync(SCRIPT, 'utf8');
let fixCount = 0;

function fix(oldStr, newStr) {
    if (code.includes(oldStr)) {
        code = code.split(oldStr).join(newStr);
        fixCount++;
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTO-CATEGORIZED BLOCK: Fix dirty titles (lines ~296-489)
// ═══════════════════════════════════════════════════════════════════════════

// --- Backslash junk ---
fix('title: "Harleys In Hawaii \\\\\\\\\\\\\\\\", artist: "Katy Perry"',
    'title: "Harleys In Hawaii", artist: "Katy Perry"');
fix('title: "Maine Khud Ko Ragini MMS 2\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\" Song With", artist: "Mustafa Zahid"',
    'title: "Maine Khud Ko", artist: "Mustafa Zahid"');

// --- Titles with artist/movie names still in them ---
fix('title: "Mere Nishan - Darshan Raval 🎶"', 'title: "Mere Nishan"');
fix('title: "Meri Banogi Kya - Rito Riba"', 'title: "Meri Banogi Kya"');
fix('title: "O Rangrez - Lyrcial Video"', 'title: "O Rangrez"');
fix('title: "Sadka- I Hate Luv Storys"', 'title: "Sadka Kiya"');
fix('title: "Sajni : Arijit Singh, Ram Sampath"', 'title: "Sajni"');
fix('title: "Sean Kingston, Justin Bieber - Eenie Meenie"', 'title: "Eenie Meenie"');
fix('title: "Shawn Mendes, Camila Cabello - Señorita"', 'title: "Señorita"');
fix('title: "Tera Rastaa Chhodoon Na Song Chennai Express"', 'title: "Tera Rastaa Chhodoon Na"');
fix('title: "The Kid LAROI, Justin Bieber - Stay"', 'title: "Stay"');
fix('title: "The Script - Hall Of Fame"', 'title: "Hall of Fame"');
fix('title: "Pritam - Tujhko Jo Paaya"', 'title: "Tujhko Jo Paaya"');
fix('title: "Rang lageya - Paras chhabra"', 'title: "Rang Lageya"');
fix('title: "Zaroor – Aparshakti Khurana"', 'title: "Zaroor"');
fix('title: "Zehnaseeb- Hasee Toh Phasee"', 'title: "Zehnaseeb"');
fix('title: "Taare Ginn - Dil Bechara"', 'title: "Taare Ginn"');
fix('title: "tere bina - Zaeden"', 'title: "Tere Bina"');
fix('title: "Timi Sangai - Apurva Tamang"', 'title: "Timi Sangai"');
fix('title: "Post Malone, Swae Lee - Sunflower ("', 'title: "Sunflower"');
fix('title: "GANGNAM STYLE(강남스타일)"', 'title: "Gangnam Style"');
fix('title: "Ishq OfficialI Amir Ameer"', 'title: "Ishq"');
fix('title: "Alan Walker - Darkside"', 'title: "Darkside"'); // Ra and Tomine Harket entry misattributed

// --- Wrong artist for Sunflower entry ---
fix('title: "Sunflower", artist: "Alan Walker", file: "song/Post Malone, Swae Lee - Sunflower',
    'title: "Sunflower", artist: "Post Malone, Swae Lee", file: "song/Post Malone, Swae Lee - Sunflower');

// --- Retro Classics dirty titles ---
fix('title: "Badan Pe Sitare Lapete HuyeMohammad Rafi Prince Sargam"', 'title: "Badan Pe Sitare Lapete Huye"');
fix('title: "Bheegi Bheegi Raaton MeinRajesh Khanna Ajnabee Sargam"', 'title: "Bheegi Bheegi Raaton Mein"');
fix('title: "Chala Jata Hoon Mere Jeevan Saathi (1972) Rajesh Khanna, Tanuja Kishore Kumar RD Burman"', 'title: "Chala Jata Hoon"');
fix('title: "Chura Liya Hai Tumne Jo Dil Ko Zeenat Aman Asha Bhosle Mohammed Rafi R. D. Burman"', 'title: "Chura Liya Hai Tumne Jo Dil Ko"');
fix('title: "Chura Liya Hai Tumne Jo Dil Ko Zeenat Aman Asha Bhosle"', 'title: "Chura Liya Hai Tumne Jo Dil Ko"');
fix('title: "Dekha Ye Khwab Toh Silsila"', 'title: "Dekha Yeh Khwab Toh"');
fix('title: "Itna Na Mujhse Tu Pyar Badha Chhaya Lata Mangeshkar, Talat Mahmood, Sunil Dutt, Asha Parekh"', 'title: "Itna Na Mujhse Tu Pyar Badha"');
fix('title: "Kishore Kumar Mere Sapno Ki Rani Kab Aayegi Tu Rajesh Khanna Sharmila Tagore"', 'title: "Mere Sapno Ki Rani"');
fix('title: "Kisi Ki Muskurahaton Pe Ho Nisar Raj Kapoor Anari Mukesh"', 'title: "Kisi Ki Muskurahaton Pe Ho Nisar"');
fix('title: "Kya Khoob Lagti HoMukesh and Kanchan Dharmatma Feroz Khan Sargam"', 'title: "Kya Khoob Lagti Ho"');
fix('title: "MERE MEHBOOB QAYAMAT HOGI Originalमेरे मेहबूब क़यामत Kishore Kumar Mr X In Bombay"', 'title: "Mere Mehboob Qayamat Hogi"');
fix('title: "O Mere Dil Ke Chain – Kishore Kumar"', 'title: "O Mere Dil Ke Chain"');
fix('title: "Pal Pal Dil Ke Paas 💖 Kishore Kumar"', 'title: "Pal Pal Dil Ke Paas"');
fix('title: "Yeh Ratein Yeh Mausam Kishore & Asha\'s"', 'title: "Yeh Ratein Yeh Mausam"');
fix('title: "Yeh Vaada Raha R. D. Burman Kishore Kumar Asha Bhosle Rishi Kapoor"', 'title: "Yeh Vaada Raha"');
fix('title: "Saiyaara 1980"', 'title: "Saiyaara"');

// Kya Hua Tera Wada with Hindi text
fix('title: "Kya Hua Tera Wada- क्या हुआ तेरा वादा Hum Kisise kum nahi Mohammed Rafi Rishi Kapoor"', 'title: "Kya Hua Tera Wada"');

// --- Wrong artists for "Bheegi Bheegi Raaton Mein" (should be Adnan Sami for cover, or original artists) ---
// The file says "Cover" so keep Adnan Sami

// --- Wrong folder: "Hall of Fame" by The Script should be Global Hits, not Hindi Hits ---
fix('title: "Hall of Fame", artist: "The Script ft. will.i.am", file: "song/The Script Hall Of Fame Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits"',
    'title: "Hall of Fame", artist: "The Script ft. will.i.am", file: "song/The Script Hall Of Fame Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits"');

// --- Wrong folder: "Eenie Meenie" by Sean Kingston should be Global Hits ---
fix('title: "Eenie Meenie", artist: "Sean Kingston & Justin Bieber", file: "song/Sean Kingston Justin Bieber Eenie Meenie Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits"',
    'title: "Eenie Meenie", artist: "Sean Kingston & Justin Bieber", file: "song/Sean Kingston Justin Bieber Eenie Meenie Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits"');

// --- Wrong folder: "Ishq Hai" artist should be Anuv Jain (Mismatched Season 3) ---
fix('title: "Ishq Hai", artist: "Faheem Abdullah"', 'title: "Ishq Hai", artist: "Anuv Jain"');

// --- Wrong folder: "Co2" by Prateek Kuhad should be Global Hits (English indie) ---
fix('title: "Co2", artist: "Prateek Kuhad", file: "song/Prateek Kuhad - Co2 (Official Audio) - Prateek Kuhad.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits"',
    'title: "Co2", artist: "Prateek Kuhad", file: "song/Prateek Kuhad - Co2 (Official Audio) - Prateek Kuhad.mp3", art: "IMAGES/logoo.png", folder: "Global Hits"');

// --- Fix "Ra and Tomine Harket" entry that was misnamed as "Darkside" by "NEONI" ---
fix('title: "Darkside", artist: "NEONI", file: "song/Ra and Tomine Harket.mp3"',
    'title: "Unknown Track", artist: "Ra & Tomine Harket", file: "song/Ra and Tomine Harket.mp3"');

// --- Tera Rastaa artist fix (should be Amaal Mallik, not Amitabh Bhattacharya) ---
fix('title: "Tera Rastaa Chhodoon Na", artist: "Amitabh Bhattacharya"',
    'title: "Tera Rastaa Chhodoon Na", artist: "Amaal Mallik, Shalmali Kholgade"');

// ═══════════════════════════════════════════════════════════════════════════
// Fix Hindi Hits songs from numbered files with wrong/redundant data
// ═══════════════════════════════════════════════════════════════════════════

// "The Making Of Main Yahaan Hoon" should just be "Main Yahaan Hoon"
fix('title: "The Making Of Main Yahaan Hoon"', 'title: "Main Yahaan Hoon"');

// "Tera Rastaa Chhodoon Na" under HINDI HITS with wrong artist
fix('title: "Tera Rastaa Chhodoon Na Song Chennai Express", artist: "Amitabh Bhattacharya"',
    'title: "Tera Rastaa Chhodoon Na", artist: "Amaal Mallik, Shalmali Kholgade"');

// ═══════════════════════════════════════════════════════════════════════════

fs.writeFileSync(SCRIPT, code, 'utf8');
console.log(`Third pass complete. ${fixCount} fixes applied.`);

