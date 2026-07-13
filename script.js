console.log("Script loaded successfully.");

// ── SECTION FALLBACK IMAGES ─────────────────────────────────────────────────
// Maps folder/section names → their section card image so that if a song's
// cover art fails to load, the section card image is shown instead of the generic logo.
const sectionFallbackImages = {
    'Arijit Singh':          'IMAGES/arijit.jpg',
    'Karan Aujla':           'IMAGES/karan_aujla.jpg',
    'Hindi Hits':            'IMAGES/hindi_hits.jpg',
    'Global Hits':           'IMAGES/english_hits.jpg',
    'Anuv Jain':             'IMAGES/anuv jain.jpg',
    'The Weeknd':            'IMAGES/weekend.jpg',
    'Atif Aslam':            'IMAGES/Atif Aslam .jpg',
    'Pritam':                'IMAGES/Pritam .jpg',
    'Charlie Puth':          'IMAGES/charlie puth.jpg',
    'Ariana Grande':         'IMAGES/Ariana Grande .jpg',
    'Taylor Swift':          'IMAGES/Taylor swift.jpg',
    'Mohit Chauhan':         'IMAGES/Mohit Chauhan .jpg',
    'Talwiinder':             'IMAGES/talwinder.jpg',
    'Retro Classics':         'IMAGES/retro classics.jpg',
        // Moods
    '❤️ Love Songs':         'IMAGES/love_vibes.jpg',
    '💔 Sad Vibes':           'IMAGES/sad_vibes.jpg',
    '⚡ Energetic':           'IMAGES/energetic_vibes.jpg',
    '🌿 Chill Mode':          'IMAGES/chill_vibes.jpg',
    '🌙 Night Drive':         'IMAGES/night_drive.jpg',
    '✨ Feel Good':           'IMAGES/feel_good.jpg',
    '🔥 Punjabi Vibes':       'IMAGES/punjabi_vibes.jpg',
    '🎶 Indie Soul':          'IMAGES/indie_soul.jpg',
    '🎤 Party Anthems':       'IMAGES/party_anthem.jpg',
    '🌧️ Rainy Day':          'IMAGES/rainy day.jpg',
    '💪 Workout':             'IMAGES/workout.jpg',
    '🎬 Bollywood Classics':  'IMAGES/bollywood.jpg',
    '☕ Morning Coffee':      'IMAGES/morning coffee.jpg',
    '🌌 Late Night':          'IMAGES/late night.jpg',
    '💃 Dance Floor':         'IMAGES/dance floor.jpg',
    '🎸 Rock & Alt':          'IMAGES/rock & alt.jpg',
    '🎌 K-Pop & Asian Pop':   'IMAGES/k pop & asian.jpg',
};

/**
 * Returns the section card image for a given song object,
 * falling back to the generic logo if no mapping exists.
 */
function getSectionFallback(song) {
    if (!song) return 'IMAGES/logoo.png';
    return sectionFallbackImages[song.folder] || 'IMAGES/logoo.png';
}

const RuntimePerf = (() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
    const type = conn && conn.effectiveType ? String(conn.effectiveType).toLowerCase() : '';
    const saveData = !!(conn && conn.saveData);

    const verySlow = saveData || type === 'slow-2g' || type.endsWith('2g');
    const slow = verySlow || type === '3g';

    return {
        isSlowNetwork: () => slow,
        isVerySlowNetwork: () => verySlow,
        shouldFetchRemoteArt: () => !verySlow,
        canRunHeavyVisuals: () => !slow
    };
})();

const LazyLibs = (() => {
    const cache = new Map();
    function load(src) {
        if (!src) return Promise.reject(new Error('missing src'));
        if (cache.has(src)) return cache.get(src);
        const p = new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                existing.addEventListener('load', () => resolve(true), { once: true });
                existing.addEventListener('error', () => reject(new Error('load fail')), { once: true });
                if (existing.getAttribute('data-loaded') === '1') resolve(true);
                return;
            }
            const s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.onload = () => {
                s.setAttribute('data-loaded', '1');
                resolve(true);
            };
            s.onerror = () => reject(new Error(`load fail: ${src}`));
            document.head.appendChild(s);
        });
        cache.set(src, p);
        return p;
    }
    return { load };
})();

// Songs array with durations manually added from scan
const songs = [
    { title: "Ae Dil Hai Mushkil", artist: "Pritam, Arijit Singh", file: "songs/Arijit/Ae Dil Hai Mushkil Title Track - PagalNew - Pritam, Arijit Singh.mp3", art: "https://c.saavncdn.com/257/Ae-Dil-Hai-Mushkil-Hindi-2016-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:29" },
    { title: "Agar Tum Saath Ho", artist: "Arijit Singh, Alka Yagnik", file: "songs/Arijit/Agar Tum Saath Ho - PagalNew - Alka Yagnik, Arijit Singh.mp3", art: "https://c.saavncdn.com/994/Tamasha-Hindi-2015-500x500.jpg", folder: "Arijit Singh", durationFormatted: "5:41" },
    { title: "Apna Bana Le", artist: "Arijit Singh, Sachin-Jigar", file: "songs/Arijit/Apna Bana Le - PagalNew - Arijit Singh, Sachin-Jigar.mp3", art: "https://c.saavncdn.com/815/Bhediya-Hindi-2022-20230623150824-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:21" },
    { title: "Bulleya", artist: "Pritam, Amit Mishra", file: "songs/Arijit/Bulleya - PagalNew - Pritam, Amit Mishra, Shilpa Rao.mp3", art: "https://c.saavncdn.com/257/Ae-Dil-Hai-Mushkil-Hindi-2016-500x500.jpg", folder: "Arijit Singh", durationFormatted: "5:49" },
    { title: "Chaleya", artist: "Arijit Singh, Shilpa Rao", file: "songs/Arijit/Chaleya - PagalNew - Arijit Singh, Shilpa Rao.mp3", art: "https://c.saavncdn.com/026/Chaleya-From-Jawan-Hindi-2023-20230814014337-500x500.jpg", folder: "Arijit Singh", durationFormatted: "3:20" },
    { title: "Dekha Hazaro Dafaa", artist: "Arijit Singh & Palak Muchhal", file: "songs/Arijit/Dekha Hazaro Dafaa - PagalNew - Arijit Singh, Palak Muchhal.mp3", art: "https://c.saavncdn.com/393/Rustom-Hindi-2018-20180814143431-500x500.jpg", folder: "Arijit Singh", durationFormatted: "3:30" },
    { title: "Gehra Hua", artist: "Arijit Singh", file: "songs/Arijit/Gehra Hua - PagalNew - Arijit Singh, Armaan Khan.mp3", art: "https://c.saavncdn.com/609/Dhurandhar-Hindi-2024-20241224103038-500x500.jpg", folder: "Arijit Singh", durationFormatted: "3:10" },
    { title: "Hawayein", artist: "Arijit Singh", file: "songs/Arijit/Hawayein - PagalNew - Pritam, Arijit Singh.mp3", art: "https://c.saavncdn.com/152/Jab-Harry-Met-Sejal-Hindi-2017-20170804105439-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:50" },
    { title: "Ilahi", artist: "Arijit Singh", file: "songs/Arijit/Ilahi - PagalNew - Pritam, Arijit Singh.mp3", art: "https://c.saavncdn.com/304/Yeh-Jawaani-Hai-Deewani-Hindi-2013-500x500.jpg", folder: "Arijit Singh", durationFormatted: "3:23" },
    { title: "Kalank", artist: "Arijit Singh", file: "songs/Arijit/Kalank (Bonus Track) - PagalNew - Arijit Singh, Shilpa Rao.mp3", art: "https://c.saavncdn.com/209/Kalank-Hindi-2019-20190418195805-500x500.jpg", folder: "Arijit Singh", durationFormatted: "5:11" },
    { title: "Khairiyat", artist: "Arijit Singh", file: "songs/Arijit/Khairiyat (Bonus Track) - PagalNew - Arijit Singh.mp3", art: "https://c.saavncdn.com/469/Chhichhore-Hindi-2019-20190904104023-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:40" },
    { title: "Mast Magan", artist: "Arijit Singh", file: "songs/Arijit/Mast Magan - PagalNew - Shankar-Ehsaan-Loy, Arijit Singh, Chinmayi Sripada.mp3", art: "https://c.saavncdn.com/567/2-States-Hindi-2014-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:40" },
    { title: "Qaafirana", artist: "Arijit Singh & Nikhita Gandhi", file: "songs/Arijit/Qaafirana - PagalNew - Arijit Singh, Nikhita Gandhi.mp3", art: "https://c.saavncdn.com/004/Kedarnath-Hindi-2018-20181122135930-500x500.jpg", folder: "Arijit Singh", durationFormatted: "5:42" },
    { title: "Raabta", artist: "Arijit Singh", file: "songs/Arijit/Arijit Singh - Raabta (Lyrics Video) Agent Vinod  Saif Ali Khan , Kareena Kapoor Khan. - PluginVibes.mp3", art: "https://c.saavncdn.com/624/Agent-Vinod-Hindi-2012-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:03" },
    { title: "Sanam Re", artist: "Arijit Singh", file: "songs/Arijit/Sanam Re - PagalNew - Arijit Singh, Mithoon.mp3", art: "https://c.saavncdn.com/876/Sanam-Re-Hindi-2015-500x500.jpg", folder: "Arijit Singh", durationFormatted: "5:08" },
    { title: "Satranga", artist: "Arijit Singh", file: "songs/Arijit/Satranga - PagalNew - Arijit Singh, Shreyas Puranik.mp3", art: "https://c.saavncdn.com/131/ANIMAL-Hindi-2023-20231124191036-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:31" },
    { title: "Shayad", artist: "Arijit Singh", file: "songs/Arijit/Shayad - PagalNew - Pritam, Arijit Singh.mp3", art: "https://c.saavncdn.com/712/Love-Aaj-Kal-Hindi-2020-20200214150536-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:07" },
    { title: "Tera Yaar Hoon Main", artist: "Arijit Singh", file: "songs/Arijit/Tera Yaar Hoon Main - PagalNew - Arijit Singh.mp3", art: "https://c.saavncdn.com/152/Sonu-Ke-Titu-Ki-Sweety-Hindi-2018-20180214153026-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:24" },
    { title: "Tujhe Kitna Chahne Lage", artist: "Arijit Singh", file: "songs/Arijit/Tujhe Kitna Chahne Lage - PagalNew - Arijit Singh, Mithoon.mp3", art: "https://c.saavncdn.com/973/Kabir-Singh-Hindi-2019-20190614075009-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:44" },
    { title: "Tum Hi Ho", artist: "Arijit Singh", file: "songs/Arijit/Tum Hi Ho - PagalNew - Arijit Singh.mp3", art: "https://c.saavncdn.com/166/Aashiqui-2-Hindi-2013-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:22" },
    { title: "Zaalima", artist: "Arijit Singh, Harshdeep Kaur", file: "songs/Arijit/Zaalima - PagalNew - Arijit Singh, Harshdeep Kaur.mp3", art: "https://c.saavncdn.com/132/Raees-Hindi-2016-20170104165506-500x500.jpg", folder: "Arijit Singh", durationFormatted: "4:59" },
    { title: "52 Bars", artist: "Karan Aujla", file: "songs/karan aujla/52 Bars - PagalNew - Karan Aujla, IKKY.mp3", art: "https://c.saavncdn.com/267/Four-You-Punjabi-2023-20230206124458-500x500.jpg", folder: "Karan Aujla", durationFormatted: "3:34" },
    { title: "Admirin You", artist: "Karan Aujla", file: "songs/karan aujla/Admirin You - PagalNew - Karan Aujla, IKKY.mp3", art: "https://c.saavncdn.com/136/Making-Memories-Punjabi-2023-20230818090714-500x500.jpg", folder: "Karan Aujla", durationFormatted: "3:34" },
    { title: "Antidote", artist: "Karan Aujla", file: "songs/karan aujla/Antidote - PagalNew - Karan Aujla.mp3", art: "https://c.saavncdn.com/669/Making-Memories-Punjabi-2023-20230818134714-500x500.jpg", folder: "Karan Aujla", durationFormatted: "3:07" },
    { title: "Boyfriend", artist: "Karan Aujla", file: "songs/karan aujla/Boyfriend - PagalNew - Karan Aujla.mp3", art: "https://c.saavncdn.com/267/Four-You-Punjabi-2023-20230206124458-500x500.jpg", folder: "Karan Aujla", durationFormatted: "2:40" },
    { title: "For A Reason", artist: "Karan Aujla", file: "songs/karan aujla/For A Reason - PagalNew - Karan Aujla.mp3", art: "https://c.saavncdn.com/267/Four-You-Punjabi-2023-20230206124458-500x500.jpg", folder: "Karan Aujla", durationFormatted: "3:00" },
    { title: "I Really Do", artist: "Karan Aujla", file: "songs/karan aujla/I Really Do - PagalNew - Karan Aujla.mp3", art: "https://c.saavncdn.com/267/Four-You-Punjabi-2023-20230206124458-500x500.jpg", folder: "Karan Aujla", durationFormatted: "3:13" },
    { title: "Mf Gabhru", artist: "Karan Aujla", file: "songs/karan aujla/MF Gabhru - PagalNew - Karan Aujla.mp3", art: "https://c.saavncdn.com/267/Four-You-Punjabi-2023-20230206124458-500x500.jpg", folder: "Karan Aujla", durationFormatted: "3:20" },
    { title: "On Top", artist: "Karan Aujla", file: "songs/karan aujla/On Top - PagalNew - Karan Aujla.mp3", art: "https://c.saavncdn.com/978/On-Top-Punjabi-2022-20221125032515-500x500.jpg", folder: "Karan Aujla", durationFormatted: "3:03" },
    { title: "Softly", artist: "Karan Aujla", file: "songs/karan aujla/Softly - PagalNew - Karan Aujla.mp3", art: "https://c.saavncdn.com/136/Making-Memories-Punjabi-2023-20230818090714-500x500.jpg", folder: "Karan Aujla", durationFormatted: "2:35" },
    { title: "Winning Speech", artist: "Karan Aujla", file: "songs/karan aujla/Winning Speech - PagalNew - Karan Aujla.mp3", art: "https://c.saavncdn.com/956/Winning-Speech-Punjabi-2024-20240502053646-500x500.jpg", folder: "Karan Aujla", durationFormatted: "3:47" },
    { title: "Sajni", artist: "Arijit Singh & Ram Sampath", file: "songs/HINDI HITS/Sajni (Lyrical Video) Arijit Singh, Ram Sampath  Laapataa Ladies   Aamir Khan Productions - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "3:10" },
    { title: "Ve Haaniyaan", artist: "Avvy Sra & Danny", file: "songs/HINDI HITS/Ve Haaniyaan - Official Video  Ravi Dubey & Sargun Mehta  Danny  Avvy Sra  Dreamiyata Music - Dreamiyata Music.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "3:24" },
    { title: "Tum Tak", artist: "Javed Ali", file: "songs/HINDI HITS/A.R. Rahman - Tum Tak Best Lyric VideoRaanjhanaaSonam KapoorDhanushJaved Ali - SonyMusicIndiaVEVO.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "3:40" },
    { title: "Pehli Nazar Mein", artist: "Atif Aslam", file: "songs/HINDI HITS/Pehli Nazar Mein - Full Video  Race I Akshaye , Bipasha & Saif Ali  Atif Aslam  Pritam  Tips - Tips Official.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "3:36" },
    { title: "Jeene Laga Hoon", artist: "Atif Aslam & Shreya Ghoshal", file: "songs/HINDI HITS/Jeene Laga Hoon  Ramaiya Vastavaiya  Girish Kumar, Shruti Haasan  Atif Aslam  Shreya Goshal - Tips Official.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "3:56" },
    { title: "Enna Sona", artist: "A.R. Rahman & Arijit Singh", file: "songs/HINDI HITS/A.R. Rahman - Enna Sona Best VideoOK JaanuArijit SinghShraddha KapoorAditya Roy - SonyMusicIndiaVEVO.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Mann Mera", artist: "Gajendra Verma", file: "songs/HINDI HITS/Gajendra Verma - Mann Mera (Lyrics)  Original Version - Indie India.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Zehnaseeb", artist: "Chinmayi Sripada", file: "songs/HINDI HITS/Zehnaseeb Lyric Video - Hasee Toh PhaseeParineeti, SidharthChinmayi S, Shekhar Ravjiani - SonyMusicIndiaVEVO.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "3:37" },
    { title: "Tera Rastaa Chhodoon Na", artist: "Amaal Mallik, Shalmali Kholgade", file: "songs/HINDI HITS/Tera Rastaa Chhodoon Na_Duplicate.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "2:11" },
    { title: "Humsafar", artist: "Akhil Sachdeva", file: "songs/HINDI HITS/Humsafar (Full Video)   Varun & Alia Bhatt  Akhil Sachdeva  Badrinath Ki Dulhania - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Iraaday", artist: "Abdul Hannan & Rovalio", file: "songs/HINDI HITS/Abdul Hannan & Rovalio - Iraaday (Official Music Video) - Abdul Hannan.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Aankhon Se Batana", artist: "Dikshant", file: "songs/HINDI HITS/Aankhon Se Batana – Dikshant  Viral Song 2022  Official Video - Sony Music India.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Mere Liye Tum Kaafi Ho", artist: "Ayushmann Khurrana", file: "songs/HINDI HITS/Lyrical Mere Liye Tum Kaafi Ho  Shubh Mangal Zyada Saavdhan Ayushman Khurana,Jeetu  Tanishk-Vayu - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dariya", artist: "Arko Pravo Mukherjee", file: "songs/HINDI HITS/Dariya - Lyrical Video  Baar Baar Dekho  Sidharth Malhotra & Katrina Kaif  Arko - Zee Music Company.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Chaar Kadam", artist: "Shaan & Shreya Ghoshal", file: "songs/HINDI HITS/'Chaar Kadam' FULL VIDEO Song  PK  Sushant Singh Rajput  Anushka Sharma  T-series - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Raanjhanaa", artist: "A.R. Rahman", file: "songs/HINDI HITS/Raanjhanaa - Lyrical Video  Dhanush, Sonam Kapoor  A. R. Rahman  Jaswinder Singh & Shiraz Uppal - SonyMusicIndiaVEVO.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "4:15" },
    { title: "Ik Kudi", artist: "wolf.cryman", file: "songs/HINDI HITS/Ik Kudi - wolf.cryman - Topic.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Qaafirana", artist: "Arijit Singh & Nikhita Gandhi", file: "songs/HINDI HITS/Qaafirana - Lyrical   Kedarnath  Sushant S Rajput  Sara Ali Khan  Arijit Singh & Nikhita Amit T - Zee Music Company.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "5:52" },
    { title: "Be Intehaan", artist: "Atif Aslam & Sunidhi Chauhan", file: "songs/HINDI HITS/Be Intehaan - Race 2  Saif Ali Khan & Deepika Padukone  Atif Aslam, Sunidhi chauhan  Pritam - Tips Official.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Aahista", artist: "Arijit Singh & Jonita Gandhi", file: "songs/HINDI HITS/Aahista - Lyrical  Laila Majnu  Arijit Singh & Jonita Gandhi  Avinash T & Tripti D  Imtiaz Ali - Zee Music Company.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Labon Ko", artist: "K.K.", file: "songs/HINDI HITS/Lyrical Labon Ko  Bhool Bhulaiyaa  Pritam  K.K. Akshay Kumar, Shiney Ahuja, Vidya Balan - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Mere Bina", artist: "Mohit Chauhan", file: "songs/HINDI HITS/Mere Bina Full Video - CrookEmraan Hashmi,Neha SharmaNikhil D'SouzaPritamMukesh Bhatt - SonyMusicIndiaVEVO.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "4:49" },
    { title: "Ishq Bulaava", artist: "Sanam Puri & Shipra Goyal", file: "songs/HINDI HITS/Ishq Bulaava Full Video - Hasee Toh PhaseeParineeti, SidharthSanam Puri, Shipra Goyal - SonyMusicIndiaVEVO.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tu Chahiye", artist: "Atif Aslam", file: "songs/HINDI HITS/'Tu Chahiye' FULL VIDEO Song - Atif Aslam Pritam  Bajrangi Bhaijaan  Salman Khan, Kareena Kapoor - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rang Jo Lagyo", artist: "Atif Aslam & Shreya Ghoshal", file: "songs/HINDI HITS/Rang Jo Lagyo Lyrical  Ramaiya Vastavaiya  Girish Kumar, Shruti Haasan Atif Aslam, Shreya Ghoshal - Tips Official.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "5:20" },
    { title: "Abhi Kuch Dino Se", artist: "Mohit Chauhan", file: "songs/HINDI HITS/Abhi Kuch Dino Se Lyrical Video  Dil Toh Baccha Hai Ji   Emraan hashmi, Ajay Devgn - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dekha Hazaro Dafaa", artist: "Arijit Singh & Palak Muchhal", file: "songs/HINDI HITS/Dekha Hazaro Dafaa  Rustom  Akshay Kumar & Ileana D'cruz  Arijit Singh , Palak M Jeet Gannguli - Zee Music Company.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "O Rangrez", artist: "Shreya Ghoshal & Javed Bashir", file: "songs/HINDI HITS/O Rangrez - Lyrcial Video  Bhaag Milkha Bhaag  Farhan, Sonam  Shreya Ghoshal, Javed Bashir - Sony Music India.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "6:25" },
    { title: "Yeh Fitoor Mera", artist: "Arijit Singh", file: "songs/HINDI HITS/Yeh Fitoor Mera - Full Video  Fitoor  Aditya Roy Kapur, Katrina Kaif  Arijit Singh  Amit Trivedi - Zee Music Company.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "3:31" },
    { title: "Sarangi", artist: "Sushant KC", file: "songs/HINDI HITS/Sushant KC - Sarangi (Official Music Video) - Sushant KC.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "4:59" },
    { title: "Inkem Inkem", artist: "Sid Sriram", file: "songs/HINDI HITS/Inkem Inkem -lyrics  Geetha Govindam  Sid Sriram  LYRICS🖤 #vijaydevarakonda - Cinephile's Corner.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Hosanna", artist: "A.R. Rahman", file: "songs/HINDI HITS/A.R. Rahman - Hosanna (Lyrics) ft. Leon D'souza & Suzanne D'Mello - seventyskye.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Darkhaast", artist: "Arijit Singh & Sunidhi Chauhan", file: "song/DARKHAAST Full Audio Song   SHIVAAY   Arijit Singh & Sunidhi Chauhan  Ajay Devgn  T-Series - 256.MP3", art: "https://c.saavncdn.com/617/Shivaay-Hindi-2016-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jaan Ban Gaye", artist: "Vishal Mishra & Asees Kaur", file: "songs/HINDI HITS/Jaan Ban Gaye  Khuda Haafiz  Vidyut Jammwal, Shivaleeka Oberoi  Vishal Mishra,Asees Kaur Mithoon - Romance Rewind.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Saude Bazi", artist: "Pritam", file: "songs/HINDI HITS/Lyrical Saude Bazi  Aakrosh  Ajay Devgn, Bipasha Basu  Pritam  Anupam Amod  Irshad Kamil - T-Series Bollywood Classics.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Khoya Khoya", artist: "Mohit Chauhan", file: "songs/HINDI HITS/'Khoya Khoya' FULL VIDEO Song  Sooraj Pancholi, Athiya Shetty  Hero  T-Series - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tere Bina", artist: "Zaeden", file: "songs/HINDI HITS/tere bina - Zaeden  ft. Amyra Dastur  Kunaal Vermaa  VYRLOriginals  Romantic Songs 2019 - VYRLOriginals.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "2:41" },
    { title: "Mere Nishan", artist: "Darshan Raval", file: "songs/HINDI HITS/Mere Nishan (Lyrics) - Darshan Raval 🎶  Jhuki teri palko mein mil jaye mujhe panahe✨ - Sankalp Lyrics.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "5:10" },
    { title: "Bairiyaa", artist: "Atif Aslam & Shreya Ghoshal", file: "songs/HINDI HITS/Bairiyaa  Aatif Aslam  Shreya Ghoshal   Girish Kumar  Shruti Haasan  Ramaiya Vastavaiya - Bollywood Dhamaka.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rukum Maikot", artist: "SD Yogi & Shanti Shree Pariyar", file: "songs/HINDI HITS/Rukum Maikot ( Lyrics)  Nepali Cultural New nepali song  Khusma   SD Yogi & Shanti Shree Pariyar - Sonic Serenade🎶.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "4:46" },
    { title: "Timi Nacha Na", artist: "Wangden Sherpa", file: "songs/HINDI HITS/Wangden Sherpa - Timi Nacha Na  Lyric video (Mayalu Timi Sangai Sangai) - LyricsVerse.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "3:00" },
    { title: "Bardali", artist: "Sushant KC & Indrakala Rai", file: "songs/HINDI HITS/Sushant KC - Bardali ft. Indrakala Rai (Official Music Video) - Sushant KC.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jhol", artist: "Maanu & Annural Khalid", file: "songs/HINDI HITS/Jhol  Coke Studio Pakistan  Season 15  Maanu x Annural Khalid - Coke Studio Pakistan.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Nadaaniyan", artist: "Akshath", file: "songs/HINDI HITS/Akshath - Nadaaniyan (Lyrics) - Indie India.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Khwab", artist: "Iqlipse Nova & Aditya A", file: "songs/HINDI HITS/Iqlipse Nova, Aditya A  - Khwab (Lyrics) - seventyskye.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Zulfein", artist: "Mehul Mahesh & DJ Aynik", file: "songs/HINDI HITS/Mehul Mahesh & DJ Aynik - Zulfein  (Lyrics) - Musicgenree.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Meri Banogi Kya", artist: "Rito Riba", file: "songs/HINDI HITS/Meri Banogi Kya - Rito Riba  Official Music Lyrics Video - Lyrics4You.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "3:32" },
    { title: "Savera", artist: "Iqlipse Nova & Anubha Bajaj", file: "songs/HINDI HITS/Savera -  New Instagram viral song  Official Lyric Video  Iqlipse Nova X Anubha Bajaj - Iqlipse Nova.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dear Maahiya", artist: "Tanishka Bahl & Saaheal", file: "songs/HINDI HITS/Dear Maahiya (Official Music Video)  Tanishka Bahl  Saaheal  Showkidd  UR Debut  New Hindi Song - UR DEBUT.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kasari", artist: "Yabesh Thapa", file: "songs/HINDI HITS/Yabesh thapa - Kasari [ Lyrics Video ] - Bishal Lyrics.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jhim Jhim Aune Aakhale", artist: "Ekdev Limbu", file: "songs/HINDI HITS/Ekdev Limbu 🌹- Jhim Jhim Aune Aakhale (Lyrics Video Nepali) - Nepali Fine Tunes 🎵.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Timro Pratiksa", artist: "Shallum Lama", file: "songs/HINDI HITS/Shallum Lama - Timro Pratiksa (Lyrics) - seventyskye.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Timi Sangai", artist: "Apurva Tamang", file: "songs/HINDI HITS/Timi Sangai - Apurva Tamang  Lyric video - Lazy aayu.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dil Ye Bekarar Kyun Hai", artist: "Mohit Chauhan & Shreya Ghoshal", file: "songs/HINDI HITS/Dil Ye Bekarar Kyun Hai  Players  Abhishek Bachchan  Sonam Kapoor - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Taare Ginn", artist: "Mohit Chauhan & Shreya Ghoshal", file: "songs/HINDI HITS/Taare Ginn - Dil BecharaFull SongSushant-Sanjana@A. R. RahmanMohit-Shreya - SonyMusicIndiaVEVO.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "4:02" },
    { title: "Haareya", artist: "Arijit Singh", file: "songs/HINDI HITS/Haareya Song  Meri Pyaari Bindu  Ayushmann, Parineeti  Arijit Singh  Sachin-Jigar, Priya Saraiya - YRF.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Sukoon Mila", artist: "Arijit Singh", file: "songs/HINDI HITS/Sukoon Mila Full Video  Mary Kom  Priyanka Chopra & Darshan Gandas  Arijit Singh  HD - Zee Music Company.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "3:53" },
    { title: "Ehsaas", artist: "Faheem Abdullah", file: "songs/HINDI HITS/Ehsaas_Duplicate.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Zaroor", artist: "Aparshakti Khurana", file: "songs/HINDI HITS/Zaroor – Aparshakti Khurana  Savi Kahlon  Official Music Video - Sony Music India.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "2:46" },
    { title: "Manchala", artist: "Shafqat Amanat Ali", file: "songs/HINDI HITS/Manchala Full song - Parineeti Chopra, Sidharth  Hasee Toh Phasee - Bollywood songs.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Meherbaan", artist: "Ash King & Shilpa Rao", file: "songs/HINDI HITS/Meherbaan Full Audio  Hrithik Roshan & Katrina Kaif  Vishal Shekhar - Zee Music Company.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rang Lageya", artist: "Mohit Chauhan", file: "songs/HINDI HITS/Rang lageya - Paras chhabra mahira sharma ft. Mohit chuhaan (lyrics) - Music Club.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jogi", artist: "Yasser Desai & Aakanksha Sharma", file: "songs/HINDI HITS/Jogi - Lyrical Shaadi Mein Zaroor Aana Rajkummar Rao,Kriti KArko ft Aakanksha Sharma - Zee Music Company.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dooron Dooron", artist: "Paresh Pahuja", file: "songs/HINDI HITS/Dooron Dooron (Official Video) - Paresh Pahuja Feat. Harleen Sethi  Shiv  Meghdeep  Vaibhav - Paresh Pahuja.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ranjheya Ve", artist: "Zain Zohaib", file: "songs/HINDI HITS/Ranjheya Ve  Zain Zohaib  Yratta media - Zain Zohaib.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "4:26" },
    { title: "Kaise Bataaoon", artist: "K.K.", file: "songs/HINDI HITS/Kaise Bataaoon  Full (Video) Song - 3G  Neil Nitin Mukesh & Sonal Chauhan  KK - SonyMusicIndiaVEVO.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Is This Love", artist: "Mohit Chauhan & Shreya Ghoshal", file: "songs/HINDI HITS/Is This Love Lyrical - Kismat Konnection  Shahid Kapoor, Vidya Balan  Mohit C, Shreya G  Pritam - Tips Official.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kyon", artist: "Papon & Sunidhi Chauhan", file: "songs/HINDI HITS/Kyon - BarfiPritamPaponSunidhiRanbirPriyanka - SonyMusicIndiaVEVO.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tujhko Jo Paaya", artist: "Mohit Chauhan", file: "songs/HINDI HITS/Pritam - Tujhko Jo Paaya Best Audio SongCrookEmraan HashmiNeha SharmaMohit Chauhan - SonyMusicIndiaVEVO.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Sachiya Mohabbatan", artist: "Sachet Tandon", file: "songs/HINDI HITS/LYRICAL Sachiya Mohabbatan  Arjun Patiala  Diljit Dosanjh, Kriti S  Sachet Tandon  Sachin-Jigar - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jab Tak", artist: "Armaan Malik", file: "songs/HINDI HITS/JAB TAK Video Song  M.S. DHONI -THE UNTOLD STORY  Armaan Malik, Amaal Mallik Sushant Singh Rajput - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Sadka Kiya", artist: "Suraj Jagan & Mahalaxmi Iyer", file: "songs/HINDI HITS/Sadka Best Audio Song - I Hate Luv StorysSonam KapoorImran KhanSurajMahalaxmi Iyer - SonyMusicIndiaVEVO.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "5:45" },
    { title: "Kahaan Ho Tum", artist: "Prateek Kuhad", file: "songs/HINDI HITS/Prateek Kuhad - Kahaan Ho Tum  Official Music Video  Prajakta Koli & Rohit Saraf  Mismatched - Netflix India.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ishq Hai", artist: "Anuv Jain", file: "songs/HINDI HITS/Ishq Hai Lyrics - Mismatched Season 3  Trending Hindi Song 2024 - Vibe Bird.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Maine Khud Ko", artist: "Mustafa Zahid", file: "songs/HINDI HITS/Maine Khud Ko Ragini MMS 2 Song With Lyrics  Sunny Leone  Mustafa Zahid - T-Series.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jugraafiya", artist: "Udit Narayan & Shreya Ghoshal", file: "songs/HINDI HITS/Jugraafiya  Super 30  Hrithik Roshan & Mrunal Thakur  Udit Narayan & Shreya Ghoshal  Lyrical - Romance Rewind.mp3", art: "https://c.saavncdn.com/editorial/Hindi-Hit-Songs_20241107055403_500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    // ─── GLOBAL HITS (English Hits) — ordered by preference ─────────────
    // ─── GLOBAL HITS (English Hits) — ordered by preference ─────────────
    { title: "Blue", artist: "Yung Kai", file: "songs/english_hits/yung kai - blue (Lyrics) - Creative Chaos.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I Like Me Better", artist: "Lauv", file: "songs/english_hits/Lauv - I Like Me Better [Official Audio] - Lauv.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Make You Mine", artist: "PUBLIC", file: "songs/english_hits/PUBLIC - Make You Mine (Put Your Hand in Mine) [Official Video] - PUBLICVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Love Me Harder", artist: "Ariana Grande ft. The Weeknd", file: "songs/english_hits/Ariana Grande, The Weeknd - Love Me Harder - ArianaGrandeVevo.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I Like You So Much, You'll Know It", artist: "Ysabelle Cuevas", file: "songs/english_hits/I Like You So Much, You’ll Know It (我多喜欢你，你会知道)- A Love So Beautiful OST -Wang Junqi [English Cover] - Ysabelle.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Shinunoga E-Wa", artist: "Fujii Kaze", file: "songs/english_hits/Fujii Kaze - Shinunoga E-Wa (Visual) - Fujii Kaze.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Attention", artist: "Charlie Puth", file: "songs/english_hits/Charlie Puth - Attention [Official Video] - Charlie Puth.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Closer", artist: "The Chainsmokers ft. Halsey", file: "songs/english_hits/The Chainsmokers - Closer (Official Video) ft. Halsey - ChainsmokersVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Love Story", artist: "Taylor Swift", file: "songs/english_hits/Taylor Swift - Love Story - TaylorSwiftVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Night Changes", artist: "One Direction", file: "songs/english_hits/One Direction - Night Changes - OneDirectionVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Stuck with U", artist: "Ariana Grande & Justin Bieber", file: "songs/english_hits/Ariana Grande & Justin Bieber - Stuck with U - ArianaGrandeVevo.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Paper Rings", artist: "Taylor Swift", file: "songs/english_hits/Taylor Swift - Paper Rings (Official Audio) - TaylorSwiftVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Double Take", artist: "dhruv", file: "songs/english_hits/Dhruv - double take (Official Video) - Dhruv.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Co2", artist: "Prateek Kuhad", file: "songs/english_hits/Prateek Kuhad - Co2 (Official Audio) - Prateek Kuhad.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I Wanna Be Yours", artist: "Arctic Monkeys", file: "songs/english_hits/I Wanna Be Yours - Arctic Monkeys - Topic.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Until I Found You", artist: "Stephen Sanchez", file: "songs/english_hits/Stephen Sanchez - Until I Found You (Official Video) - StephenSanchezVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I Think They Call This Love", artist: "Elliot James Reay", file: "songs/english_hits/Elliot James Reay - I Think They Call This Love (Official Video) - Elliot James Reay.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Perfect", artist: "Ed Sheeran", file: "songs/english_hits/Ed Sheeran Perfect.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "You Belong To Me", artist: "Carla Bruni", file: "songs/english_hits/You belong to me - Carla Bruni - Topic.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Maria", artist: "Hwa Sa", file: "songs/english_hits/[MV] 화사 (Hwa Sa) - 마리아 (Maria) - MAMAMOO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Positions", artist: "Ariana Grande", file: "songs/english_hits/Ariana Grande - positions (Lyrics) - 7clouds.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Lover", artist: "Taylor Swift", file: "songs/english_hits/Taylor Swift - Lover Remix Feat. Shawn Mendes (Lyric Video) - Taylor Swift.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Unholy", artist: "Sam Smith ft. Kim Petras", file: "songs/english_hits/Sam Smith - Unholy ft. Kim Petras - LatinHype.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Cheri Cheri Lady", artist: "Modern Talking", file: "songs/english_hits/Modern Talking - Cheri Cheri Lady (Lyrics) - 7clouds.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Die For You", artist: "The Weeknd", file: "songs/english_hits/The Weeknd - Die For You - TheWeekndVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Gat", artist: "DALENG DALE", file: "songs/english_hits/DALENG DALE - Gat (Lyrics) - M O O N.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Dandelions", artist: "Ruth B.", file: "songs/english_hits/Ruth B. - Dandelions (Lyrics) - 7clouds.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "A Thousand Years", artist: "Christina Perri", file: "songs/english_hits/Christina Perri - A Thousand Years - LatinHype.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Who Says", artist: "Selena Gomez", file: "song/Selena Gomez - Who Says (Lyrics) - 256.MP3", art: "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/96/9a/68/969a6851-4a2b-929c-90e4-e4b7af95d568/source/500x500bb.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "Criminal", artist: "Britney Spears", file: "songs/english_hits/Britney Spears - Criminal (Lyrics) - 7clouds.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Pink Venom", artist: "BLACKPINK", file: "songs/english_hits/BLACKPINK - ‘Pink Venom’ MV - BLACKPINK.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Under The Influence", artist: "Chris Brown", file: "songs/english_hits/Chris Brown - Under The Influence (Official Video) - ChrisBrownVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Believer", artist: "Imagine Dragons", file: "songs/english_hits/Imagine Dragons - Believer (Official Music Video) - ImagineDragonsVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Gangnam Style", artist: "PSY", file: "songs/english_hits/PSY - GANGNAM STYLE(강남스타일) MV - officialpsy.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Harleys In Hawaii", artist: "Katy Perry", file: "songs/english_hits/Katy Perry - Harleys In Hawaii (Lyrics) You and I, Ridin' Harleys in Hawaii-i-i - Unique Sound.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Ride It", artist: "Jay Sean", file: "songs/english_hits/JAY SEAN - RIDE IT - JAYDED.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Love Me Like You Do", artist: "Ellie Goulding", file: "songs/english_hits/Ellie Goulding - Love Me Like You Do (Lyrics) - The Vibe Guide.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I See Red", artist: "Everybody Loves An Outlaw", file: "songs/english_hits/Everybody Loves An Outlaw - I See Red (Lyrics) - 7clouds Country.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Bella Ciao", artist: "Il Volo (Money Heist)", file: "songs/english_hits/La Casa De Papel - Bella Ciao [Lyrics] (Money Heist) - ReLike Vibes.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Wrap Me In Plastic", artist: "CHROMANCE", file: "songs/english_hits/CHROMANCE - Wrap Me In Plastic (Lyrics) - Cakes & Eclairs.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Shape of You", artist: "Ed Sheeran", file: "songs/english_hits/Ed Sheeran - Shape of You (Official Music Video) - Ed Sheeran.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "At My Worst", artist: "Pink Sweat$", file: "songs/english_hits/Pink Sweat$ - At My Worst (Official Video) - Pink Sweats.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sunflower", artist: "Post Malone & Swae Lee", file: "songs/english_hits/Post Malone, Swae Lee - Sunflower (Spider-Man Into the Spider-Verse) - PostMaloneVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Fantasize", artist: "Ariana Grande", file: "songs/english_hits/Ariana Grande - fantasize (slightly deluxe) - DRC Records.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Some", artist: "BOL4", file: "songs/english_hits/[MV] BOL4(볼빨간사춘기) - Some(썸 탈꺼야) - SUPER SOUND Bugs!.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Memories", artist: "Maroon 5", file: "songs/english_hits/Maroon 5 - Memories (Official Video) - Maroon5VEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Lovers", artist: "Anna of the North", file: "songs/english_hits/Anna of the North - Lovers (from To All the Boys I've Loved Before) - AnnaOfTheNorthVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "End Of Beginning", artist: "Djo", file: "songs/english_hits/Djo End Of Beginning Official Audio.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Lovely", artist: "Billie Eilish & Khalid", file: "songs/english_hits/Billie Eilish, Khalid - lovely - BillieEilishVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Starboy", artist: "The Weeknd ft. Daft Punk", file: "songs/english_hits/Starboy.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Faded", artist: "Alan Walker", file: "songs/english_hits/Alan Walker Faded Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Stay", artist: "The Kid LAROI & Justin Bieber", file: "songs/english_hits/The Kid LAROI Justin Bieber Stay Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Let Her Go", artist: "Passenger", file: "songs/english_hits/Passenger Let Her Go Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Señorita", artist: "Shawn Mendes & Camila Cabello", file: "songs/english_hits/Shawn Mendes Camila Cabello Señorita Lyrics Letra.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "As It Was", artist: "Harry Styles", file: "songs/english_hits/Harry Styles As It Was Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "We Don't Talk Anymore", artist: "Charlie Puth ft. Selena Gomez", file: "songs/english_hits/Charlie Puth We Don t Talk Anymore feat.Selena Gomez Official Video.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Heat Waves", artist: "Glass Animals", file: "songs/english_hits/Glass Animals Heat Waves.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Unstoppable", artist: "Sia", file: "songs/english_hits/Sia Unstoppable Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Mockingbird", artist: "Eminem", file: "songs/english_hits/Eminem Mockingbird Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sweater Weather", artist: "The Neighbourhood", file: "songs/english_hits/The Neighbourhood Sweater Weather Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Skyfall", artist: "Adele", file: "songs/english_hits/Adele Skyfall Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Die With A Smile", artist: "Lady Gaga & Bruno Mars", file: "songs/english_hits/Lady Gaga, Bruno Mars - Die With A Smile (Official Music Video) - LadyGagaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Let Me Down Slowly", artist: "Alec Benjamin", file: "songs/english_hits/Alec Benjamin Let Me Down Slowly Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Beggin'", artist: "Måneskin", file: "songs/english_hits/Måneskin Beggin Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Old Town Road", artist: "Lil Nas X ft. Billy Ray Cyrus", file: "songs/english_hits/Lil Nas X Old Town Road feat.Billy Ray Cyrus Lyrics napisy pl.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Thunder", artist: "Imagine Dragons", file: "songs/english_hits/Imagine Dragons Thunder Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Somewhere Only We Know", artist: "Keane", file: "songs/english_hits/Keane Somewhere Only We Know Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "505", artist: "Arctic Monkeys", file: "songs/english_hits/505.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Hall of Fame", artist: "The Script ft. will.i.am", file: "songs/english_hits/The Script Hall Of Fame Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Girls Like You", artist: "Maroon 5 ft. Cardi B", file: "songs/english_hits/Maroon 5 Girls Like You Lyrics ft.Cardi B.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Alone", artist: "Alan Walker", file: "songs/english_hits/Alan Walker Alone Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Espresso", artist: "Sabrina Carpenter", file: "songs/english_hits/Sabrina Carpenter Espresso Official Audio.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Animals", artist: "Maroon 5", file: "songs/english_hits/Maroon 5 Animals Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Feel Good Inc.", artist: "Gorillaz", file: "songs/english_hits/Gorillaz Feel Good Inc.Official Video.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Eenie Meenie", artist: "Sean Kingston & Justin Bieber", file: "songs/english_hits/Sean Kingston Justin Bieber Eenie Meenie Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Infinity", artist: "Jaymes Young", file: "songs/english_hits/Jaymes Young Infinity.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Apocalypse", artist: "Cigarettes After Sex", file: "songs/english_hits/Cigarettes After Sex Apocalypse Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sailor Song", artist: "Gigi Perez", file: "songs/english_hits/Gigi Perez Sailor Song Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Darkside", artist: "NEONI", file: "songs/english_hits/NEONI Darkside Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Timeless", artist: "The Weeknd", file: "songs/english_hits/Timeless.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Ordinary", artist: "Alex Warren", file: "songs/english_hits/Alex Warren Ordinary Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Love Story", artist: "Indila", file: "songs/english_hits/Indila Love Story Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sapphire", artist: "Ed Sheeran", file: "songs/english_hits/Ed Sheeran Sapphire Official Music Video.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Ra & Tomine Harket", artist: "Ra & Tomine Harket", file: "songs/english_hits/Ra and Tomine Harket.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "A Lonely Night", artist: "The Weeknd", file: "song/A Lonely Night - 256.MP3", art: "https://c.saavncdn.com/835/Beauty-Behind-the-Madness-English-2015-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "The Hills", artist: "The Weeknd", file: "song/The Weeknd - The Hills - 128.MP3", art: "https://c.saavncdn.com/835/Beauty-Behind-the-Madness-English-2015-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "Heartless", artist: "The Weeknd", file: "song/The Weeknd - Heartless (Official Video) - 256.MP3", art: "https://c.saavncdn.com/546/After-Hours-English-2020-20200320034521-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "Call Out My Name", artist: "The Weeknd", file: "song/The Weeknd - Call Out My Name (Official Video) - 256.MP3", art: "https://c.saavncdn.com/344/My-Dear-Melancholy-English-2018-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "Save Your Tears", artist: "The Weeknd", file: "song/The Weeknd - Save Your Tears (Official Music Video) - 128.MP3", art: "https://c.saavncdn.com/546/After-Hours-English-2020-20200320034521-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "Save Your Tears (Remix)", artist: "The Weeknd & Ariana Grande", file: "song/The Weeknd & Ariana Grande - Save Your Tears (Remix) (Official Video) - 128.MP3", art: "https://c.saavncdn.com/546/After-Hours-English-2020-20200320034521-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "São Paulo", artist: "The Weeknd", file: "song/The Weeknd - São Paulo (Audio) - 256.MP3", art: "https://c.saavncdn.com/234/Dawn-FM-English-2022-20220108033503-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "Reminder", artist: "The Weeknd", file: "song/The Weeknd - Reminder (Official Video) - 256.MP3", art: "https://c.saavncdn.com/041/Starboy-English-2016-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "One Of The Girls", artist: "The Weeknd, JENNIE & Lily-Rose Depp", file: "song/The Weeknd, JENNIE, Lily-Rose Depp - One Of The Girls (Official Video) - 256.MP3", art: "https://upload.wikimedia.org/wikipedia/en/7/7e/The_Idol_Soundtrack_cover.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "Popular", artist: "The Weeknd, Madonna & Playboi Carti", file: "song/The Weeknd, Madonna, Playboi Carti - Popular (Lyrics) - 256.MP3", art: "https://upload.wikimedia.org/wikipedia/en/7/7e/The_Idol_Soundtrack_cover.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "I Feel It Coming", artist: "The Weeknd ft. Daft Punk", file: "song/I Feel It Coming - 256.MP3", art: "https://c.saavncdn.com/041/Starboy-English-2016-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "In Your Eyes (Remix)", artist: "The Weeknd", file: "song/In Your Eyes (Remix) - 256.MP3", art: "https://c.saavncdn.com/546/After-Hours-English-2020-20200320034521-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "Nothing Without You", artist: "The Weeknd", file: "song/Nothing Without You - 256.MP3", art: "https://c.saavncdn.com/835/Beauty-Behind-the-Madness-English-2015-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "Secrets", artist: "The Weeknd", file: "song/Secrets - 256.MP3", art: "https://c.saavncdn.com/835/Beauty-Behind-the-Madness-English-2015-500x500.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "Memories", artist: "Maroon 5", file: "song/Maroon 5 Memories Lyrics.mp3", art: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/c7/ef/f8/c7eff832-9c74-e95a-dc0a-cc4fff44a06e/source/500x500bb.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "Dandelions", artist: "Ruth B.", file: "song/Ruth B.Dandelions Lyrics.mp3", art: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/c3/75/25/c37525ea-b22d-a5c7-5eba-88de5e0e0c39/source/500x500bb.jpg", folder: "Global Hits", durationFormatted: "" },
    { title: "505", artist: "Arctic Monkeys", file: "song/505.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Some", artist: "BOL4", file: "song/[MV] BOL4(볼빨간사춘기) - Some(썸 탈꺼야) - SUPER SOUND Bugs!.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Maria", artist: "Hwa Sa", file: "song/[MV] 화사 (Hwa Sa) - 마리아 (Maria) - MAMAMOO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Skyfall", artist: "Adele", file: "song/Adele Skyfall Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Alone", artist: "Alan Walker", file: "song/Alan Walker Alone Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Faded", artist: "Alan Walker", file: "song/Alan Walker Faded Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Let Me Down Slowly", artist: "Alec Benjamin", file: "song/Alec Benjamin Let Me Down Slowly Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Ordinary", artist: "Alex Warren", file: "song/Alex Warren Ordinary Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Lovers", artist: "Anna of the North", file: "song/Anna of the North - Lovers (from To All the Boys I've Loved Before) - AnnaOfTheNorthVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Stuck with U", artist: "Ariana Grande & Justin Bieber", file: "song/Ariana Grande & Justin Bieber - Stuck with U - ArianaGrandeVevo.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Fantasize", artist: "Ariana Grande", file: "song/Ariana Grande - fantasize (slightly deluxe) - DRC Records.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Positions", artist: "Ariana Grande", file: "song/Ariana Grande - positions (Lyrics) - 7clouds.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Love Me Harder", artist: "Ariana Grande ft. The Weeknd", file: "song/Ariana Grande, The Weeknd - Love Me Harder - ArianaGrandeVevo.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Lovely", artist: "Billie Eilish & Khalid", file: "song/Billie Eilish, Khalid - lovely - BillieEilishVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "‘Pink Venom’", artist: "BLACKPINK", file: "song/BLACKPINK - ‘Pink Venom’ MV - BLACKPINK.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Criminal", artist: "Britney Spears", file: "song/Britney Spears - Criminal (Lyrics) - 7clouds.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Attention", artist: "Charlie Puth", file: "song/Charlie Puth - Attention [Official Video] - Charlie Puth.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "We Don't Talk Anymore", artist: "Charlie Puth", file: "song/Charlie Puth We Don t Talk Anymore feat.Selena Gomez Official Video.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Under The Influence", artist: "Chris Brown", file: "song/Chris Brown - Under The Influence (Official Video) - ChrisBrownVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "A Thousand Years", artist: "Christina Perri", file: "song/Christina Perri - A Thousand Years - LatinHype.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Wrap Me In Plastic", artist: "CHROMANCE", file: "song/CHROMANCE - Wrap Me In Plastic (Lyrics) - Cakes & Eclairs.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Apocalypse", artist: "Cigarettes After Sex", file: "song/Cigarettes After Sex Apocalypse Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Gat", artist: "DALENG DALE", file: "song/DALENG DALE - Gat (Lyrics) - M O O N.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Double Take", artist: "dhruv", file: "song/Dhruv - double take (Official Video) - Dhruv.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "End Of Beginning", artist: "Djo", file: "song/Djo End Of Beginning Official Audio.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Shape of You", artist: "Ed Sheeran", file: "song/Ed Sheeran - Shape of You (Official Music Video) - Ed Sheeran.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Perfect", artist: "Ed Sheeran", file: "song/Ed Sheeran Perfect.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sapphire", artist: "Ed Sheeran", file: "song/Ed Sheeran Sapphire Official Music Video.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Love Me Like You Do", artist: "Ellie Goulding", file: "song/Ellie Goulding - Love Me Like You Do (Lyrics) - The Vibe Guide.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I Think They Call This Love", artist: "Elliot James Reay", file: "song/Elliot James Reay - I Think They Call This Love (Official Video) - Elliot James Reay.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Mockingbird", artist: "Eminem", file: "song/Eminem Mockingbird Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I See Red", artist: "Everybody Loves An Outlaw", file: "song/Everybody Loves An Outlaw - I See Red (Lyrics) - 7clouds Country.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Shinunoga E-Wa", artist: "Fujii Kaze", file: "song/Fujii Kaze - Shinunoga E-Wa (Visual) - Fujii Kaze.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sailor Song", artist: "Gigi Perez", file: "song/Gigi Perez Sailor Song Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Heat Waves", artist: "Glass Animals", file: "song/Glass Animals Heat Waves.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Feel Good Inc.", artist: "Gorillaz", file: "song/Gorillaz Feel Good Inc.Official Video.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "As It Was", artist: "Harry Styles", file: "song/Harry Styles As It Was Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I Like You So Much, You’ll Know It (我多喜欢你，你会知道)- A Love So Beautiful OST -Wang Junqi", artist: "Ysabelle", file: "song/I Like You So Much, You’ll Know It (我多喜欢你，你会知道)- A Love So Beautiful OST -Wang Junqi [English Cover] - Ysabelle.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I Wanna Be Yours", artist: "Arctic Monkeys", file: "song/I Wanna Be Yours - Arctic Monkeys - Topic.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Believer", artist: "Imagine Dragons", file: "song/Imagine Dragons - Believer (Official Music Video) - ImagineDragonsVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Thunder", artist: "Imagine Dragons", file: "song/Imagine Dragons Thunder Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Love Story", artist: "Indila", file: "song/Indila Love Story Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Ride It", artist: "Jay Sean", file: "song/JAY SEAN - RIDE IT - JAYDED.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Infinity", artist: "Jaymes Young", file: "song/Jaymes Young Infinity.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Harleys In Hawaii", artist: "Katy Perry", file: "song/Katy Perry - Harleys In Hawaii (Lyrics) You and I, Ridin' Harleys in Hawaii-i-i - Unique Sound.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Somewhere Only We Know", artist: "Keane", file: "song/Keane Somewhere Only We Know Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Bella Ciao", artist: "Il Volo (Money Heist)", file: "song/La Casa De Papel - Bella Ciao [Lyrics] (Money Heist) - ReLike Vibes.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Die With A Smile", artist: "Lady Gaga & Bruno Mars", file: "song/Lady Gaga, Bruno Mars - Die With A Smile (Official Music Video) - LadyGagaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I Like Me Better", artist: "Lauv", file: "song/Lauv - I Like Me Better [Official Audio] - Lauv.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Old Town Road", artist: "Lil Nas X ft. Billy Ray Cyrus", file: "song/Lil Nas X Old Town Road feat.Billy Ray Cyrus Lyrics napisy pl.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Memories", artist: "Maroon 5", file: "song/Maroon 5 - Memories (Official Video) - Maroon5VEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Animals", artist: "Maroon 5", file: "song/Maroon 5 Animals Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Girls Like You", artist: "Maroon 5 ft. Cardi B", file: "song/Maroon 5 Girls Like You Lyrics ft.Cardi B.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Cheri Cheri Lady", artist: "Modern Talking", file: "song/Modern Talking - Cheri Cheri Lady (Lyrics) - 7clouds.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Beggin", artist: "Måneskin", file: "song/Måneskin Beggin Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Darkside", artist: "NEONI", file: "song/NEONI Darkside Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Night Changes", artist: "One Direction", file: "song/One Direction - Night Changes - OneDirectionVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Let Her Go", artist: "Passenger", file: "song/Passenger Let Her Go Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "At My Worst", artist: "Pink Sweat$", file: "song/Pink Sweat$ - At My Worst (Official Video) - Pink Sweats.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sunflower", artist: "Post Malone & Swae Lee", file: "song/Post Malone, Swae Lee - Sunflower (Spider-Man Into the Spider-Verse) - PostMaloneVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Co2", artist: "Prateek Kuhad", file: "song/Prateek Kuhad - Co2 (Official Audio) - Prateek Kuhad.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Gangnam Style", artist: "PSY", file: "song/PSY - GANGNAM STYLE(강남스타일) MV - officialpsy.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Make You Mine", artist: "PUBLIC", file: "song/PUBLIC - Make You Mine (Put Your Hand in Mine) [Official Video] - PUBLICVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Ra & Tomine Harket", artist: "Ra & Tomine Harket", file: "song/Ra and Tomine Harket.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Dandelions", artist: "Ruth B.", file: "song/Ruth B. - Dandelions (Lyrics) - 7clouds.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Espresso", artist: "Sabrina Carpenter", file: "song/Sabrina Carpenter Espresso Official Audio.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Unholy", artist: "Sam Smith ft. Kim Petras", file: "song/Sam Smith - Unholy ft. Kim Petras - LatinHype.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Eenie Meenie", artist: "Sean Kingston & Justin Bieber", file: "song/Sean Kingston Justin Bieber Eenie Meenie Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Señorita", artist: "Shawn Mendes & Camila Cabello", file: "song/Shawn Mendes Camila Cabello Señorita Lyrics Letra.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Unstoppable", artist: "Sia", file: "song/Sia Unstoppable Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Starboy", artist: "The Weeknd ft. Daft Punk", file: "song/Starboy.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Until I Found You", artist: "Stephen Sanchez", file: "song/Stephen Sanchez - Until I Found You (Official Video) - StephenSanchezVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Love Story", artist: "Taylor Swift", file: "song/Taylor Swift - Love Story - TaylorSwiftVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Lover", artist: "Taylor Swift", file: "song/Taylor Swift - Lover Remix Feat. Shawn Mendes (Lyric Video) - Taylor Swift.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Paper Rings", artist: "Taylor Swift", file: "song/Taylor Swift - Paper Rings (Official Audio) - TaylorSwiftVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Closer", artist: "The Chainsmokers ft. Halsey", file: "song/The Chainsmokers - Closer (Official Video) ft. Halsey - ChainsmokersVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Closer", artist: "The Chainsmokers ft. Halsey", file: "song/The Chainsmokers Closer Lyrics ft.Halsey.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Stay", artist: "The Kid LAROI & Justin Bieber", file: "song/The Kid LAROI Justin Bieber Stay Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sweater Weather", artist: "The Neighbourhood", file: "song/The Neighbourhood Sweater Weather Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Hall of Fame", artist: "The Script ft. will.i.am", file: "song/The Script Hall Of Fame Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Die For You", artist: "The Weeknd", file: "song/The Weeknd - Die For You - TheWeekndVEVO.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Timeless", artist: "The Weeknd", file: "song/Timeless.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "You Belong To Me", artist: "Carla Bruni", file: "song/You belong to me - Carla Bruni - Topic.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Blue", artist: "Yung Kai", file: "song/yung kai - blue (Lyrics) - Creative Chaos.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Maps", artist: "Maroon 5", file: "songs/100052792.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Kiss of Life", artist: "Sade", file: "songs/1030652052.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Music To Watch Boys To", artist: "Lana Del Rey", file: "songs/107394172.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Home", artist: "Michael Bublé", file: "songs/1107280572.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Mai", artist: "Videoclub", file: "songs/1169758012.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Line Without a Hook", artist: "Ricky Montgomery", file: "songs/1174664082.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Runaway", artist: "AURORA", file: "songs/120738706.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I WANNA BE YOUR SLAVE", artist: "Måneskin", file: "songs/1279728532.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Be My Baby", artist: "The Ronettes", file: "songs/12809317.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Pretty Little Baby", artist: "Connie Francis", file: "songs/130105720.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Ocean Eyes", artist: "Billie Eilish", file: "songs/136337268.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Let Down", artist: "Radiohead", file: "songs/138539979.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Alone", artist: "Alan Walker", file: "songs/141822951.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sunsetz", artist: "Cigarettes After Sex", file: "songs/144010756.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Apocalypse", artist: "Cigarettes After Sex", file: "songs/144010758.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I Love You So", artist: "The Walters", file: "songs/1526991462.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Summertime Sadness", artist: "Lana Del Rey", file: "songs/16047072.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "The Most Beautiful Thing", artist: "Thomas Headon", file: "songs/1621026332.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Wellerman", artist: "Nathan Evans", file: "songs/1655134296345227964Wellerman_Sea_Shanty_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Easy On Me", artist: "Adele", file: "songs/1655246371719072192Easy_On_Me-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "MIDDLE OF THE NIGHT", artist: "Elley Duhé", file: "songs/1655301346603389145MIDDLE_OF_THE_NIGHT_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Wait a Minute!", artist: "WILLOW", file: "songs/1655414038910510930Wait_a_Minute-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Slumber Party", artist: "Ashnikko ft. Princess Nokia", file: "songs/1655485182206428546Slumber_Party_feat_Princess_Nokia_140_audi.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Le", artist: "Charlie Puth ft. Jung Kook", file: "songs/1656154528484764979Left_and_Right_Feat_Jung_Kook_of_BTS_140_a.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Somebody That I Used To Know", artist: "Gotye ft. Kimbra", file: "songs/1656497014510117461Somebody_That_I_Used_To_Know_140_audio_only.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Dancin", artist: "Aaron Smith ft. Krono", file: "songs/1656535605468094484Dancin_Krono_Remix_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Nothing Breaks Like a Heart", artist: "Mark Ronson ft. Miley Cyrus", file: "songs/1656538116114851987Nothing_Breaks_Like_a_Heart_140_audio_only_.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Pump It", artist: "The Black Eyed Peas", file: "songs/1656720778028073865Pump_It-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "All Time Low", artist: "Jon Bellion", file: "songs/1656764861848425148All_Time_Low-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Breakfast", artist: "Dove Cameron", file: "songs/1656990053795651988Breakfast-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Under The Influence", artist: "Chris Brown", file: "songs/1656997006393665302Under_The_Influence_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sunroof", artist: "Nicky Youre & dazy", file: "songs/1657025450572243394Sunroof-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "No Guidance", artist: "Chris Brown ft. Drake", file: "songs/1657224180318489699No_Guidance-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "All Star", artist: "Smash Mouth", file: "songs/1657228325435070649All_Star-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Locked out of Heaven", artist: "Bruno Mars", file: "songs/1657271671598256152Locked_out_of_Heaven_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Space Song", artist: "Beach House", file: "songs/1657728680665509069Space_Song-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Safety Net", artist: "Ariana Grande ft. Ty Dolla $ign", file: "songs/1657829739837975571safety_net-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sweet Dreams (Are Made of This)", artist: "Eurythmics", file: "songs/1657842204688917579Sweet_Dreams_Are_Made_of_This_140_audio_onl.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Title", artist: "Meghan Trainor", file: "songs/1657881400524050564Title-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "You Broke Me First", artist: "Tate McRae", file: "songs/1657987670059417749you_broke_me_first_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "A Man Without Love", artist: "Engelbert Humperdinck", file: "songs/1657992063140487564A_Man_Without_Love_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Running Up That Hill", artist: "Kate Bush", file: "songs/1658245792863504649Running_Up_That_Hill_A_Deal_With_God_2018_Rem.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "On The Floor", artist: "Jennifer Lopez ft. Pitbull", file: "songs/1658350980216791053On_The_Floor_Radio_Edit_140_audio_only_medi.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Enemy", artist: "Imagine Dragons & JID", file: "songs/1658592927305073821Enemy_from_the_series_Arcane_League_of_Legend.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "About Damn Time", artist: "Lizzo", file: "songs/1658606311117306419About_Damn_Time-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I See Red", artist: "Everybody Loves An Outlaw", file: "songs/1658874718657704323I_See_Red-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Maniac", artist: "Conan Gray", file: "songs/1659984126354653318Maniac-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Do It To It", artist: "ACRAZE ft. Cherish", file: "songs/1660230400878139981Do_It_To_It-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "다라리 (DARARI)", artist: "TREASURE", file: "songs/1660245419412314162DARARI-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Genius", artist: "LSD ft. Sia, Diplo & Labrinth", file: "songs/1660603108643090634Genius-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I Ain’t Worried - Acoustic", artist: "OneRepublic", file: "songs/1660708416271938446I_Ain_t_Worried_Acoustic_140_audio_only_m.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Pink Venom", artist: "BLACKPINK", file: "songs/1660882659996537923Pink_Venom-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Under The Influence", artist: "Chris Brown", file: "songs/1661088518193095173Under_The_Influence_Sped_Up_140_audio_only_.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Calm Down", artist: "Rema & Selena Gomez", file: "songs/1661510429873579715Calm_Down-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "On The Floor", artist: "Jennifer Lopez ft. Pitbull", file: "songs/1661591092235467295On_The_Floor-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Gimme More", artist: "Britney Spears", file: "songs/1661591114282244725Gimme_More_Kimme_More_Remix_140_audio_only_.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Gimme More", artist: "Britney Spears", file: "songs/1661591131608943008Gimme_More_Remastered_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "That's Not My Name", artist: "The Ting Tings", file: "songs/1661591944078165218That_s_Not_My_Name_Radio_Edit_140_audio_onl.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "That's Not My Name", artist: "The Ting Tings", file: "songs/1661591948313651638That_s_Not_My_Name_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "SexyBack", artist: "Justin Timberlake ft. Timbaland", file: "songs/1661592143837512005SexyBack-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Be Around Me", artist: "Will Joseph Cook", file: "songs/1661592228976163214Be_Around_Me_feat_chloe_moriondo_140_audio.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Be Around Me", artist: "Will Joseph Cook", file: "songs/1661592238822606603Be_Around_Me-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "We Fell In Love In October", artist: "Girl In Red", file: "songs/1861248217.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Slipping Through My Fingers", artist: "ABBA", file: "songs/20535911.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Those Eyes", artist: "New West", file: "songs/2096157227.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "From The Start", artist: "Laufey", file: "songs/2238153377.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Somewhere Only We Know", artist: "Keane", file: "songs/2317363.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "My Love Mine All Mine", artist: "Mitski", file: "songs/2365569495.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Past Lives", artist: "sapientdream", file: "songs/2369102525.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Every Breath You Take", artist: "The Police", file: "songs/2525864.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Love Me Not", artist: "Ravyn Lenae", file: "songs/2755315691.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "BIRDS OF A FEATHER", artist: "Billie Eilish", file: "songs/2801558052.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "No One Noticed", artist: "The Marías", file: "songs/2816073752 (1).mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "No One Noticed", artist: "The Marías", file: "songs/2816073752.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "SNAP", artist: "Rosa Linn", file: "songs/2847559612.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Lilith", artist: "Saint Avangeline", file: "songs/2917607351.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Die With A Smile", artist: "Lady Gaga & Bruno Mars", file: "songs/2947516331.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Put Your Records On", artist: "Corinne Bailey Rae", file: "songs/3119484.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Feel Good Inc.", artist: "Gorillaz", file: "songs/3129407.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Back To Friends", artist: "Sombr", file: "songs/3151351511.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Golden Brown", artist: "The Stranglers", file: "songs/3152622.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Lover Girl", artist: "Laufey", file: "songs/3401301081.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Sofia", artist: "Clairo", file: "songs/3420418861.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Where'd All the Time Go?", artist: "Dr. Dog", file: "songs/378113071.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Billie Jean", artist: "Michael Jackson", file: "songs/4603408.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Lovely", artist: "Billie Eilish & Khalid", file: "songs/486928932.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "The Night We Met", artist: "Lord Huron", file: "songs/499988832.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Heaven Knows I'm Miserable Now", artist: "The Smiths", file: "songs/5093607.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Washing Machine Heart", artist: "Mitski", file: "songs/526540852.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Lights Are On", artist: "Tom Rosenthal", file: "songs/546767842.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Fairytale", artist: "Alexander Rybak", file: "songs/578980732.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "It's You", artist: "Ali Gatie", file: "songs/694298872.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Forever Young", artist: "Alphaville", file: "songs/698274.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "No. 1 Party Anthem", artist: "Arctic Monkeys", file: "songs/70322136.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "I Wanna Be Yours", artist: "Arctic Monkeys", file: "songs/70322142.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Runaway", artist: "AURORA", file: "songs/7667065.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Cry", artist: "Cigarettes After Sex", file: "songs/781948852.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Falling In Love", artist: "Cigarettes After Sex", file: "songs/781948862 (1).mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Falling In Love", artist: "Cigarettes After Sex", file: "songs/781948862 (2).mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Falling In Love", artist: "Cigarettes After Sex", file: "songs/781948862.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Everything I Wanted", artist: "Billie Eilish", file: "songs/803010392.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Breathe", artist: "Years & Years", file: "songs/81364090.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Skyfall", artist: "Adele", file: "songs/82715364.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Falling", artist: "Harry Styles", file: "songs/830336962.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Death Bed", artist: "Powfu ft. beabadoobee", file: "songs/871124582.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "The Nights", artist: "Avicii", file: "songs/90632837.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "See You Again", artist: "Wiz Khalifa ft. Charlie Puth", file: "songs/95813354.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Havana", artist: "Camila Cabello ft. Young Thug", file: "songs/Camila_Cabello_Havana_Audio_ft._Young_Thug_HCjNJDNzw8Y_140.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Attention", artist: "Charlie Puth", file: "songs/Charlie_Puth_Attention_Live_on_the_Honda_Stage_at_the_i_2_uJxAtiQgM.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Memories", artist: "Maroon 5", file: "songs/english_hits/Maroon 5 Memories Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Dandelions", artist: "Ruth B.", file: "songs/english_hits/Ruth B.Dandelions Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },
    { title: "Closer", artist: "The Chainsmokers ft. Halsey", file: "songs/english_hits/The Chainsmokers Closer Lyrics ft.Halsey.mp3", art: "IMAGES/logoo.png", folder: "Global Hits", durationFormatted: "" },

    // ─── NEW SONGS FROM song/ FOLDER ────────────────────────────────────────

    // Karan Aujla — new tracks
    { title: "100 Million", artist: "DIVINE, Karan Aujla", file: "song/100 Million - DIVINE, Karan Aujla  Official Music Video - 256.MP3", art: "https://c.saavncdn.com/651/100-Million-Punjabi-2023-20230614030802-500x500.jpg", folder: "Karan Aujla", durationFormatted: "" },
    { title: "48 Rhymes", artist: "Karan Aujla, Manna Music", file: "song/48 Rhymes (Music Video) Karan Aujla  Manna Music  New Punjabi Song 2025 - 256.MP3", art: "https://c.saavncdn.com/906/48-Rhymes-Punjabi-2025-20250114052742-500x500.jpg", folder: "Karan Aujla", durationFormatted: "" },
    { title: "5-7", artist: "Karan Aujla, Mxrci", file: "song/5-7 (Music Video) Karan Aujla  Mxrci  Alankriitaa Sahai  Rehaan Records  Punjabi Songs 2026 - 256.MP3", art: "https://c.saavncdn.com/558/IYKYK-Punjabi-2021-20211213110546-500x500.jpg", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Aaye Haaye", artist: "Karan Aujla, Nora Fatehi, Neha Kakkar", file: "song/Aaye Haaye (Official Video)  Karan Aujla, Nora Fatehi, Neha Kakkar, Jay Trak  Bhushan Kumar - 256.MP3", art: "https://c.saavncdn.com/989/Aaye-Haaye-Punjabi-2023-20230922085612-500x500.jpg", folder: "Karan Aujla", durationFormatted: "" },
    { title: "At Peace", artist: "Karan Aujla", file: "song/At Peace (Official Video) Karan Aujla  Latest Punjabi Songs 2025 - 256.MP3", art: "https://c.saavncdn.com/558/IYKYK-Punjabi-2021-20211213110546-500x500.jpg", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Courtside", artist: "Karan Aujla", file: "song/COURTSIDE (OFFICIAL MUSIC VIDEO) KARAN AUJLA   LATEST PUNJABI SONGS 2025 - 256.MP3", art: "https://c.saavncdn.com/558/IYKYK-Punjabi-2021-20211213110546-500x500.jpg", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Tell Me", artist: "Karan Aujla, OneRepublic, Disha Patani", file: "song/Karan Aujla, OneRepublic, Disha Patani, Ikky -  Tell Me (Official Music Video) - 256.MP3", art: "https://c.saavncdn.com/042/Tell-Me-Punjabi-2024-20240209052543-500x500.jpg", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Dominance", artist: "Ammy Gurm, Tani Sandhu", file: "song/🎧 Dominance (Official Video)  Ammy Gurm & Tani Sandhu  TR King Music  Latest Punjabi Songs 2025 - 256.MP3", art: "https://c.saavncdn.com/558/IYKYK-Punjabi-2021-20211213110546-500x500.jpg", folder: "Karan Aujla", durationFormatted: "" },

    // The Weeknd — new tracks

    // Anuv Jain
    { title: "Arz Kiya Hai", artist: "Anuv Jain & Lost Stories", file: "song/Anuv Jain X Lost Stories - Arz Kiya Hai (Official Video)  Coke Studio Bharat - 256.MP3", art: "https://c.saavncdn.com/792/Arz-Kiya-Hai-Hindi-2023-20231124044437-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Afsos", artist: "Anuv Jain", file: "song/Afsos - 256.MP3", art: "https://c.saavncdn.com/411/Afsos-Hindi-2020-20200907093229-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Alag Aasmaan", artist: "Anuv Jain", file: "song/Alag Aasmaan - 256.MP3", art: "https://c.saavncdn.com/730/Alag-Aasmaan-Hindi-2022-20221018105141-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Baarishein", artist: "Anuv Jain", file: "song/Baarishein - 256.MP3", art: "https://c.saavncdn.com/617/Baarishein-Hindi-2018-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Gul", artist: "Anuv Jain", file: "song/Gul - 256.MP3", art: "https://c.saavncdn.com/614/Gul-Hindi-2019-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Husn", artist: "Anuv Jain", file: "song/Husn - 256.MP3", art: "https://c.saavncdn.com/463/Husn-Hindi-2022-20221201092048-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jo Tum Mere Ho", artist: "Anuv Jain", file: "song/Jo Tum Mere Ho - 256.MP3", art: "https://c.saavncdn.com/264/Jo-Tum-Mere-Ho-Hindi-2022-20220110042417-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },

    // Hindi Hits — new
    { title: "Dil Se Dil", artist: "Shashwat Singh", file: "song/Dil Se Dil - Official Music Video  Sita Ramam  Vishal Chandrashekhar  Shashwat Singh  Mandar C. - Sony Music India.mp3", art: "https://c.saavncdn.com/497/Sita-Ramam-Telugu-2022-20220803081504-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dekha Hazaro Dafaa", artist: "Arijit Singh & Palak Muchhal", file: "song/Dekha Hazaro Dafaa  Rustom  Akshay Kumar & Ileana D'cruz  Arijit Singh , Palak M Jeet Gannguli - Zee Music Company.mp3", art: "https://c.saavncdn.com/984/Rustom-Hindi-2016-500x500.jpg", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Ishq", artist: "Faheem Abdullah", file: "song/Ishq Official Lyrical Video I Amir Ameer  Faheem Abdullah  Rauhan Malik I Love Song 2024 - Artiste First.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Chaar Kadam", artist: "Shaan & Shreya Ghoshal", file: "song/Chaar Kadam -lyrics  Shaan, Shreya Ghoshal  PK  @LYRICS🖤 - 256.MP3", art: "https://c.saavncdn.com/591/PK-Hindi-2014-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jaan Ban Gaye", artist: "Vishal Mishra & Asees Kaur", file: "song/Jaan Ban Gaye - Lyrical  Khuda Haafiz  Vidyut J  Shivaleeka O  Mithoon Ft. Vishal M, Asees Kaur - 256.MP3", art: "https://c.saavncdn.com/453/Khuda-Haafiz-Hindi-2020-20200814105344-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rang Jo Lagyo", artist: "Atif Aslam & Shreya Ghoshal", file: "song/Rang Jo Lagyo - Atif Aslam (Lyrics)  Lyrical Bam Hindi - 256.MP3", art: "https://c.saavncdn.com/888/Lekar-Hum-Deewana-Dil-Hindi-2014-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Be Intehaan", artist: "Atif Aslam & Sunidhi Chauhan", file: "song/Be Intehaan - Atif Aslam( lyrics video) - 256.MP3", art: "https://c.saavncdn.com/060/Race-2-Hindi-2013-500x500.jpg", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Timi Nacha Na", artist: "Wangden Sherpa", file: "song/Wangden Sherpa - Timi Nacha Na [Official Lyric Visualizer] Prod. Frwny - Wangden Sherpa.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },

    // Misc global

    // ─── AUTO-CATEGORIZED SONGS (all folders) ───────────────────────────────────
    { title: "Chaar Kadam", artist: "Shaan & Shreya Ghoshal", file: "song/'Chaar Kadam' FULL VIDEO Song  PK  Sushant Singh Rajput  Anushka Sharma  T-series - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Khoya Khoya", artist: "Mohit Chauhan", file: "song/'Khoya Khoya' FULL VIDEO Song  Sooraj Pancholi, Athiya Shetty  Hero  T-Series - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tu Chahiye", artist: "Atif Aslam", file: "song/'Tu Chahiye' Full AUDIO Song  Atif Aslam Pritam  Bajrangi Bhaijaan  Salman Khan, Kareena Kapoor - 256-1.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tu Chahiye", artist: "Atif Aslam", file: "song/'Tu Chahiye' Full AUDIO Song  Atif Aslam Pritam  Bajrangi Bhaijaan  Salman Khan, Kareena Kapoor - 256.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tu Chahiye", artist: "Atif Aslam", file: "song/'Tu Chahiye' FULL VIDEO Song - Atif Aslam Pritam  Bajrangi Bhaijaan  Salman Khan, Kareena Kapoor - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "52 Bars", artist: "Karan Aujla, IKKY", file: "song/52 Bars - PagalNew - Karan Aujla, IKKY.mp3", art: "IMAGES/logoo.png", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Enna Sona", artist: "A.R. Rahman & Arijit Singh", file: "song/A.R. Rahman - Enna Sona Best VideoOK JaanuArijit SinghShraddha KapoorAditya Roy - SonyMusicIndiaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Hosanna", artist: "A.R. Rahman", file: "song/A.R. Rahman - Hosanna (Lyrics) ft. Leon D'souza & Suzanne D'Mello - seventyskye.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tum Tak", artist: "Javed Ali", file: "song/A.R. Rahman - Tum Tak Best Lyric VideoRaanjhanaaSonam KapoorDhanushJaved Ali - SonyMusicIndiaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Aahista", artist: "Arijit Singh & Jonita Gandhi", file: "song/Aahista - Lyrical  Laila Majnu  Arijit Singh & Jonita Gandhi  Avinash T & Tripti D  Imtiaz Ali - Zee Music Company.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Aankhon Se Batana", artist: "Dikshant", file: "song/Aankhon Se Batana – Dikshant  Viral Song 2022  Official Video - Sony Music India.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Iraaday", artist: "Abdul Hannan & Rovalio", file: "song/Abdul Hannan & Rovalio - Iraaday (Official Music Video) - Abdul Hannan.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Abhi Kuch Dino Se", artist: "Mohit Chauhan", file: "song/Abhi Kuch Dino Se Lyrical Video  Dil Toh Baccha Hai Ji   Emraan hashmi, Ajay Devgn - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Admirin You", artist: "Karan Aujla, IKKY", file: "song/Admirin You - PagalNew - Karan Aujla, IKKY.mp3", art: "IMAGES/logoo.png", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Ae Dil Hai Mushkil", artist: "Pritam, Arijit Singh", file: "song/Ae Dil Hai Mushkil Title Track - PagalNew - Pritam, Arijit Singh.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Agar Tum Saath Ho", artist: "Alka Yagnik, Arijit Singh", file: "song/Agar Tum Saath Ho - PagalNew - Alka Yagnik, Arijit Singh.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Nadaaniyan", artist: "Akshath", file: "song/Akshath - Nadaaniyan (Lyrics) - Indie India.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Antidote", artist: "Karan Aujla", file: "song/Antidote - PagalNew - Karan Aujla.mp3", art: "IMAGES/logoo.png", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Apna Bana Le", artist: "Arijit Singh, Sachin-Jigar", file: "song/Apna Bana Le - PagalNew - Arijit Singh, Sachin-Jigar.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Raabta", artist: "Arijit Singh", file: "song/Arijit Singh - Raabta (Lyrics Video) Agent Vinod  Saif Ali Khan , Kareena Kapoor Khan. - PluginVibes.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Bairiyaa", artist: "Atif Aslam & Shreya Ghoshal", file: "song/Bairiyaa  Aatif Aslam  Shreya Ghoshal   Girish Kumar  Shruti Haasan  Ramaiya Vastavaiya - Bollywood Dhamaka.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Be Intehaan", artist: "Atif Aslam & Sunidhi Chauhan", file: "song/Be Intehaan - Race 2  Saif Ali Khan & Deepika Padukone  Atif Aslam, Sunidhi chauhan  Pritam - Tips Official.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Boyfriend", artist: "Karan Aujla", file: "song/Boyfriend - PagalNew - Karan Aujla.mp3", art: "IMAGES/logoo.png", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Bulleya", artist: "Pritam, Amit Mishra, Shilpa Rao", file: "song/Bulleya - PagalNew - Pritam, Amit Mishra, Shilpa Rao.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Chaleya", artist: "Arijit Singh, Shilpa Rao", file: "song/Chaleya - PagalNew - Arijit Singh, Shilpa Rao.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Dariya", artist: "Arko Pravo Mukherjee", file: "song/Dariya - Lyrical Video  Baar Baar Dekho  Sidharth Malhotra & Katrina Kaif  Arko - Zee Music Company.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dear Maahiya", artist: "Tanishka Bahl & Saaheal", file: "song/Dear Maahiya (Official Music Video)  Tanishka Bahl  Saaheal  Showkidd  UR Debut  New Hindi Song - UR DEBUT.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dekha Hazaro Dafaa", artist: "Arijit Singh & Palak Muchhal", file: "song/Dekha Hazaro Dafaa - PagalNew - Arijit Singh, Palak Muchhal.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Dil Ye Bekarar Kyun Hai", artist: "Mohit Chauhan & Shreya Ghoshal", file: "song/Dil Ye Bekarar Kyun Hai  Players  Abhishek Bachchan  Sonam Kapoor - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dooron Dooron", artist: "Paresh Pahuja", file: "song/Dooron Dooron (Official Video) - Paresh Pahuja Feat. Harleen Sethi  Shiv  Meghdeep  Vaibhav - Paresh Pahuja.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ehsaas", artist: "Faheem Abdullah", file: "song/Ehsaas (Lyric Video) Faheem Abdullah  Vaibhav Pani  Hyder Dar - VYRLOriginals.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jhim Jhim Aune Aakhale", artist: "Ekdev Limbu", file: "song/Ekdev Limbu 🌹- Jhim Jhim Aune Aakhale (Lyrics Video Nepali) - Nepali Fine Tunes 🎵.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "For A Reason", artist: "Karan Aujla", file: "song/For A Reason - PagalNew - Karan Aujla.mp3", art: "IMAGES/logoo.png", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Mann Mera", artist: "Gajendra Verma", file: "song/Gajendra Verma - Mann Mera (Lyrics)  Original Version - Indie India.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Gehra Hua", artist: "Arijit Singh, Armaan Khan", file: "song/Gehra Hua - PagalNew - Arijit Singh, Armaan Khan.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Gul", artist: "Anuv Jain", file: "song/Gul - 256-1.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Haareya", artist: "Arijit Singh", file: "song/Haareya Song  Meri Pyaari Bindu  Ayushmann, Parineeti  Arijit Singh  Sachin-Jigar, Priya Saraiya - YRF.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Hawayein", artist: "Pritam, Arijit Singh", file: "song/Hawayein - PagalNew - Pritam, Arijit Singh.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Humsafar", artist: "Akhil Sachdeva", file: "song/Humsafar (Full Video)   Varun & Alia Bhatt  Akhil Sachdeva  Badrinath Ki Dulhania - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "I Really Do", artist: "Karan Aujla", file: "song/I Really Do - PagalNew - Karan Aujla.mp3", art: "IMAGES/logoo.png", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Ik Kudi", artist: "wolf.cryman", file: "song/Ik Kudi - wolf.cryman - Topic.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ilahi", artist: "Pritam, Arijit Singh", file: "song/Ilahi - PagalNew - Pritam, Arijit Singh.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Inkem Inkem", artist: "Sid Sriram", file: "song/Inkem Inkem -lyrics  Geetha Govindam  Sid Sriram  LYRICS🖤 #vijaydevarakonda - Cinephile's Corner.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Khwab", artist: "Iqlipse Nova & Aditya A", file: "song/Iqlipse Nova, Aditya A  - Khwab (Lyrics) - seventyskye.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Is This Love", artist: "Mohit Chauhan & Shreya Ghoshal", file: "song/Is This Love Lyrical - Kismat Konnection  Shahid Kapoor, Vidya Balan  Mohit C, Shreya G  Pritam - Tips Official.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ishq Bulaava", artist: "Sanam Puri & Shipra Goyal", file: "song/Ishq Bulaava Full Video - Hasee Toh PhaseeParineeti, SidharthSanam Puri, Shipra Goyal - SonyMusicIndiaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ishq Hai", artist: "Anuv Jain", file: "song/Ishq Hai Lyrics - Mismatched Season 3  Trending Hindi Song 2024 - Vibe Bird.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jaan Ban Gaye", artist: "Vishal Mishra & Asees Kaur", file: "song/Jaan Ban Gaye  Khuda Haafiz  Vidyut Jammwal, Shivaleeka Oberoi  Vishal Mishra,Asees Kaur Mithoon - Romance Rewind.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jab Tak", artist: "Armaan Malik", file: "song/JAB TAK Video Song  M.S. DHONI -THE UNTOLD STORY  Armaan Malik, Amaal Mallik Sushant Singh Rajput - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jeene Laga Hoon", artist: "Atif Aslam & Shreya Ghoshal", file: "song/Jeene Laga Hoon  Ramaiya Vastavaiya  Girish Kumar, Shruti Haasan  Atif Aslam  Shreya Goshal - Tips Official.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jhol", artist: "Maanu & Annural Khalid", file: "song/Jhol  Coke Studio Pakistan  Season 15  Maanu x Annural Khalid - Coke Studio Pakistan.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jogi", artist: "Yasser Desai & Aakanksha Sharma", file: "song/Jogi - Lyrical Shaadi Mein Zaroor Aana Rajkummar Rao,Kriti KArko ft Aakanksha Sharma - Zee Music Company.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jugraafiya", artist: "Udit Narayan & Shreya Ghoshal", file: "song/Jugraafiya  Super 30  Hrithik Roshan & Mrunal Thakur  Udit Narayan & Shreya Ghoshal  Lyrical - Romance Rewind.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kaise Bataaoon", artist: "K.K.", file: "song/Kaise Bataaoon  Full (Video) Song - 3G  Neil Nitin Mukesh & Sonal Chauhan  KK - SonyMusicIndiaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kalank", artist: "Arijit Singh, Shilpa Rao", file: "song/Kalank (Bonus Track) - PagalNew - Arijit Singh, Shilpa Rao.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Khairiyat", artist: "Arijit Singh", file: "song/Khairiyat (Bonus Track) - PagalNew - Arijit Singh.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Kyon", artist: "Papon & Sunidhi Chauhan", file: "song/Kyon - BarfiPritamPaponSunidhiRanbirPriyanka - SonyMusicIndiaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Labon Ko", artist: "K.K.", file: "song/Lyrical Labon Ko  Bhool Bhulaiyaa  Pritam  K.K. Akshay Kumar, Shiney Ahuja, Vidya Balan - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Mere Liye Tum Kaafi Ho", artist: "Ayushmann Khurrana", file: "song/Lyrical Mere Liye Tum Kaafi Ho  Shubh Mangal Zyada Saavdhan Ayushman Khurana,Jeetu  Tanishk-Vayu - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Sachiya Mohabbatan", artist: "Sachet Tandon", file: "song/LYRICAL Sachiya Mohabbatan  Arjun Patiala  Diljit Dosanjh, Kriti S  Sachet Tandon  Sachin-Jigar - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Saude Bazi", artist: "Pritam", file: "song/Lyrical Saude Bazi  Aakrosh  Ajay Devgn, Bipasha Basu  Pritam  Anupam Amod  Irshad Kamil - T-Series Bollywood Classics.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Maine Khud Ko", artist: "Mustafa Zahid", file: "song/Maine Khud Ko Ragini MMS 2 Song With Lyrics  Sunny Leone  Mustafa Zahid - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Manchala", artist: "Shafqat Amanat Ali", file: "song/Manchala Full song - Parineeti Chopra, Sidharth  Hasee Toh Phasee - Bollywood songs.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Mast Magan", artist: "Shankar-Ehsaan-Loy, Arijit Singh, Chinmayi Sripada", file: "song/Mast Magan - PagalNew - Shankar-Ehsaan-Loy, Arijit Singh, Chinmayi Sripada.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Meherbaan", artist: "Ash King & Shilpa Rao", file: "song/Meherbaan Full Audio  Hrithik Roshan & Katrina Kaif  Vishal Shekhar - Zee Music Company.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Zulfein", artist: "Mehul Mahesh & DJ Aynik", file: "song/Mehul Mahesh & DJ Aynik - Zulfein  (Lyrics) - Musicgenree.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Mere Bina", artist: "Mohit Chauhan", file: "song/Mere Bina Full Video - CrookEmraan Hashmi,Neha SharmaNikhil D'SouzaPritamMukesh Bhatt - SonyMusicIndiaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Mere Nishan", artist: "Darshan Raval", file: "song/Mere Nishan (Lyrics) - Darshan Raval 🎶  Jhuki teri palko mein mil jaye mujhe panahe✨ - Sankalp Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Meri Banogi Kya", artist: "Rito Riba", file: "song/Meri Banogi Kya - Rito Riba  Official Music Lyrics Video - Lyrics4You.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "MF Gabhru", artist: "Karan Aujla", file: "song/MF Gabhru - PagalNew - Karan Aujla.mp3", art: "IMAGES/logoo.png", folder: "Karan Aujla", durationFormatted: "" },
    { title: "O Rangrez", artist: "Shreya Ghoshal & Javed Bashir", file: "song/O Rangrez - Lyrcial Video  Bhaag Milkha Bhaag  Farhan, Sonam  Shreya Ghoshal, Javed Bashir - Sony Music India.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "On Top", artist: "Karan Aujla", file: "song/On Top - PagalNew - Karan Aujla.mp3", art: "IMAGES/logoo.png", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Pehli Nazar Mein", artist: "Atif Aslam", file: "song/Pehli Nazar Mein - Full Video  Race I Akshaye , Bipasha & Saif Ali  Atif Aslam  Pritam  Tips - Tips Official.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kahaan Ho Tum", artist: "Prateek Kuhad", file: "song/Prateek Kuhad - Kahaan Ho Tum  Official Music Video  Prajakta Koli & Rohit Saraf  Mismatched - Netflix India.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tujhko Jo Paaya", artist: "Mohit Chauhan", file: "song/Pritam - Tujhko Jo Paaya Best Audio SongCrookEmraan HashmiNeha SharmaMohit Chauhan - SonyMusicIndiaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Qaafirana", artist: "Arijit Singh & Nikhita Gandhi", file: "song/Qaafirana - Lyrical   Kedarnath  Sushant S Rajput  Sara Ali Khan  Arijit Singh & Nikhita Amit T - Zee Music Company.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Qaafirana", artist: "Arijit Singh & Nikhita Gandhi", file: "song/Qaafirana - PagalNew - Arijit Singh, Nikhita Gandhi.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Raanjhanaa", artist: "A.R. Rahman", file: "song/Raanjhanaa - Lyrical Video  Dhanush, Sonam Kapoor  A. R. Rahman  Jaswinder Singh & Shiraz Uppal - SonyMusicIndiaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rang Jo Lagyo", artist: "Atif Aslam & Shreya Ghoshal", file: "song/Rang Jo Lagyo - Atif Aslam (Lyrics)  Lyrical Bam Hindi - 256.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rang Jo Lagyo", artist: "Atif Aslam & Shreya Ghoshal", file: "song/Rang Jo Lagyo Lyrical  Ramaiya Vastavaiya  Girish Kumar, Shruti Haasan Atif Aslam, Shreya Ghoshal - Tips Official.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rang Lageya", artist: "Mohit Chauhan", file: "song/Rang lageya - Paras chhabra mahira sharma ft. Mohit chuhaan (lyrics) - Music Club.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ranjheya Ve", artist: "Zain Zohaib", file: "song/Ranjheya Ve  Zain Zohaib  Yratta media - Zain Zohaib.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rukum Maikot", artist: "SD Yogi & Shanti Shree Pariyar", file: "song/Rukum Maikot ( Lyrics)  Nepali Cultural New nepali song  Khusma   SD Yogi & Shanti Shree Pariyar - Sonic Serenade🎶.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Sadka Kiya", artist: "Suraj Jagan & Mahalaxmi Iyer", file: "song/Sadka Best Audio Song - I Hate Luv StorysSonam KapoorImran KhanSurajMahalaxmi Iyer - SonyMusicIndiaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Sajni", artist: "Arijit Singh & Ram Sampath", file: "song/Sajni (Lyrical Video) Arijit Singh, Ram Sampath  Laapataa Ladies   Aamir Khan Productions - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Sanam Re", artist: "Arijit Singh, Mithoon", file: "song/Sanam Re - PagalNew - Arijit Singh, Mithoon.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Satranga", artist: "Arijit Singh, Shreyas Puranik", file: "song/Satranga - PagalNew - Arijit Singh, Shreyas Puranik.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Savera", artist: "Iqlipse Nova & Anubha Bajaj", file: "song/Savera -  New Instagram viral song  Official Lyric Video  Iqlipse Nova X Anubha Bajaj - Iqlipse Nova.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Timro Pratiksa", artist: "Shallum Lama", file: "song/Shallum Lama - Timro Pratiksa (Lyrics) - seventyskye.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Shayad", artist: "Pritam, Arijit Singh", file: "song/Shayad - PagalNew - Pritam, Arijit Singh.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Softly", artist: "Karan Aujla", file: "song/Softly - PagalNew - Karan Aujla.mp3", art: "IMAGES/logoo.png", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Sukoon Mila", artist: "Arijit Singh", file: "song/Sukoon Mila Full Video  Mary Kom  Priyanka Chopra & Darshan Gandas  Arijit Singh  HD - Zee Music Company.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Bardali", artist: "Sushant KC & Indrakala Rai", file: "song/Sushant KC - Bardali ft. Indrakala Rai (Official Music Video) - Sushant KC.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Sarangi", artist: "Sushant KC", file: "song/Sushant KC - Sarangi (Official Music Video) - Sushant KC.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Taare Ginn", artist: "Mohit Chauhan & Shreya Ghoshal", file: "song/Taare Ginn - Dil BecharaFull SongSushant-Sanjana@A. R. RahmanMohit-Shreya - SonyMusicIndiaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tera Rastaa Chhodoon Na", artist: "Amaal Mallik, Shalmali Kholgade", file: "song/Tera Rastaa Chhodoon Na Song Chennai Express  Shahrukh Khan, Deepika Padukone - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tera Yaar Hoon Main", artist: "Arijit Singh", file: "song/Tera Yaar Hoon Main - PagalNew - Arijit Singh.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Tere Bina", artist: "Zaeden", file: "song/tere bina - Zaeden  ft. Amyra Dastur  Kunaal Vermaa  VYRLOriginals  Romantic Songs 2019 - VYRLOriginals.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Timi Sangai", artist: "Apurva Tamang", file: "song/Timi Sangai - Apurva Tamang  Lyric video - Lazy aayu.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tujhe Kitna Chahne Lage", artist: "Arijit Singh, Mithoon", file: "song/Tujhe Kitna Chahne Lage - PagalNew - Arijit Singh, Mithoon.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Tum Hi Ho", artist: "Arijit Singh", file: "song/Tum Hi Ho - PagalNew - Arijit Singh.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Ve Haaniyaan", artist: "Avvy Sra & Danny", file: "song/Ve Haaniyaan - Official Video  Ravi Dubey & Sargun Mehta  Danny  Avvy Sra  Dreamiyata Music - Dreamiyata Music.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Timi Nacha Na", artist: "Wangden Sherpa", file: "song/Wangden Sherpa - Timi Nacha Na  Lyric video (Mayalu Timi Sangai Sangai) - LyricsVerse.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Winning Speech", artist: "Karan Aujla", file: "song/Winning Speech - PagalNew - Karan Aujla.mp3", art: "IMAGES/logoo.png", folder: "Karan Aujla", durationFormatted: "" },
    { title: "Kasari", artist: "Yabesh Thapa", file: "song/Yabesh thapa - Kasari [ Lyrics Video ] - Bishal Lyrics.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Yeh Fitoor Mera", artist: "Arijit Singh", file: "song/Yeh Fitoor Mera - Full Video  Fitoor  Aditya Roy Kapur, Katrina Kaif  Arijit Singh  Amit Trivedi - Zee Music Company.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Zaalima", artist: "Arijit Singh, Harshdeep Kaur", file: "song/Zaalima - PagalNew - Arijit Singh, Harshdeep Kaur.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Zaroor", artist: "Aparshakti Khurana", file: "song/Zaroor – Aparshakti Khurana  Savi Kahlon  Official Music Video - Sony Music India.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Zehnaseeb", artist: "Chinmayi Sripada", file: "song/Zehnaseeb Lyric Video - Hasee Toh PhaseeParineeti, SidharthChinmayi S, Shekhar Ravjiani - SonyMusicIndiaVEVO.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kal Chaudavi Ki Raat Thi", artist: "Jagjit Singh", file: "songs/1091930832.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Cold/Mess", artist: "Prateek Kuhad", file: "songs/1099128012.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rang Jo Lagyo", artist: "Atif Aslam & Shreya Ghoshal", file: "songs/1115370252.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Hoshwalon Ko Khabar Kya", artist: "Jagjit Singh", file: "songs/1147261472.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Aankhein Khuli", artist: "Lata Mangeshkar", file: "songs/1203797652.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Tune Jo Na Kaha", artist: "Mohit Chauhan", file: "songs/1203801542 (1).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tune Jo Na Kaha", artist: "Mohit Chauhan", file: "songs/1203801542.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Bol Na Halke Halke", artist: "Shankar-Ehsaan-Loy", file: "songs/1203804772.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Main Yahaan Hoon", artist: "Udit Narayan", file: "songs/1203805242.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Yeh Vada Raha", artist: "Alyssia", file: "songs/12758134.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tera Mera Pyar Amar", artist: "Lata Mangeshkar", file: "songs/14715886.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Abhi Mujh Mein Kahin", artist: "Ajay-Atul", file: "songs/15079096.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Udaarian - 2.0", artist: "Satinder Sartaaj", file: "songs/1562651502.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Main Zindagi Ka Saath Nibhata Chala Gaya", artist: "Mohammad Rafi", file: "songs/15947837.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Dooron Dooron", artist: "Paresh Pahuja", file: "songs/1611053232.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Goumi", artist: "Myriam Fares", file: "songs/1655545366479547996Goumi-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Big And Chunky", artist: "will.i.am", file: "songs/1655594239025861245Big_And_Chunky-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Paro", artist: "Nej, Nasraddine Mona, Laamri Najoua", file: "songs/1655770931947297113Paro-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Sway", artist: "Michael Bublé", file: "songs/1655806334256713835Sway-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Calypso RMX", artist: "Reggae", file: "songs/1656677981476329574Calypso_RMX-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Sauce", artist: "Naïka", file: "songs/1656704444780545315Sauce-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Habibi", artist: "Ricky Rich, Dardan", file: "songs/1656844498689009275Habibi_Albanian_Remix_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "น้ำแดงน้ำส้ม (NAM DANG NAM SOM)", artist: "Jarvis", file: "songs/1657024989987671255NAM_DANG_NAM_SOM-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Paro", artist: "Nej, Mona Nasraddine, Najoua Laamri", file: "songs/1657257786434963298Paro_Speed_Up-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "All That Glitters", artist: "Earl", file: "songs/1657261319235328836All_That_Glitters-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Снова ночь", artist: "Mull3", file: "songs/1657337547645634530_-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Love Me Back", artist: "Trinidad Cardona, Robinson", file: "songs/1657409545400738501Love_Me_Back_Fayahh_Beat_140_audio_only_med.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jiggle Jiggle", artist: "Duke, Jones, Louis Theroux", file: "songs/1657863072859983787Jiggle_Jiggle-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Habibi", artist: "Ricky Rich, Dardan, Zuna", file: "songs/1657956592735424748Habibi-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Money Rain", artist: "VTORNIK, Никитин Максим Вадимович", file: "songs/1657993295547196720Money_Rain-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Face Off", artist: "Tech N9ne, Joey Cool, King Iso", file: "songs/1658012189902683694Face_Off-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Queen of Hearts", artist: "Starla Edney, Cristian Tarcea, Silviu Oeru Teodor", file: "songs/1658338603623362010Queen_of_Hearts-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dame", artist: "Freebot, Aneth, Aneth Oliva", file: "songs/1658939931728462694Dame-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ice On My Baby", artist: "Yung Bleu, Kevin Gates", file: "songs/1659151555301450666Ice_On_My_Baby_Remix_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ara", artist: "Zeynep Bastik", file: "songs/1659187369489830910Ara-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ice On My Baby", artist: "Yung Bleu", file: "songs/1659335776640362460Ice_On_My_Baby-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Love Nwantiti", artist: "LillyC", file: "songs/1659452040505627215Love_Nwantiti-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kala Chashma", artist: "Amar Arshi, Badshah, Neha Kakkar", file: "songs/1659470760872885881Kala_Chashma-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "1, 2, 3", artist: "Sofia Reyes, Jason Derulo, De La Ghetto", file: "songs/16595422720655058231_2_3_feat_Jason_Derulo_De_La_Ghetto_140_a.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dirty Mind", artist: "3OH!3", file: "songs/1659604956002836700Dirty_Mind-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "The Way I Are", artist: "Timbaland, Keri Hilson, D.O.E.", file: "songs/1659776034255713934The_Way_I_Are_Radio_Edit_140_audio_only_med.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Eshay", artist: "Gucci Dassy", file: "songs/1660592401311029152Eshay-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kala Chashma", artist: "Amar Arshi", file: "songs/1660852926256126890Kala_Chashma_Unplugged_MTV_Unplugged_Season_6.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kala Chashma", artist: "Amar Arshi", file: "songs/1661390833514019243Kala_Chashma_Club_Mix_DJ_Notorious_140_audi.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ooh Ahh (My Life Be Like)", artist: "Grits, TobyMac, Unknown", file: "songs/1661590949862044087Ooh_Ahh_My_Life_Be_Like_feat_Tobymac_140_a.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "All That Glitters", artist: "Christine Set The Scene", file: "songs/1661591630355280042All_That_Glitters_Acoustic_Version_140_audi.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "I Love You", artist: "Young Slo-Be", file: "songs/1661592124329992095I_Love_You-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "My Bubble Gum", artist: "Rasheeda", file: "songs/1661593089259821939My_Bubble_Gum-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Genius Universalis", artist: "Enemy", file: "songs/1661593146083641788Genius_Universalis_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ba Ba Ben (Wine & Ben Pt. 2)", artist: "DJ Cheem", file: "songs/1661593399542781884Ba_Ba_Ben_Wine_Ben_Pt_2_140_audio_only_med.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Formosa", artist: "Kaio Viana, MC CJ", file: "songs/1661593421410282917Formosa-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Amor De Una Noche", artist: "Ryan Castro", file: "songs/1661593591661227064Amor_De_Una_Noche-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Hamadzayn Em", artist: "Oksy Avdalyan", file: "songs/1661594703974344673Hamadzayn_Em-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "La La La Li La La La", artist: "Stefan De La Barbulesti", file: "songs/1661594729982394865La_La_La_Li_La_La_La_140_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Edge", artist: "REZZ", file: "songs/1661594943678030262Edge-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Wanna Play?", artist: "The Prophet", file: "songs/1661595218220243274Wanna_Play-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "I Took a Nap", artist: "gunnarolla", file: "songs/1661595234132687716I_Took_a_Nap-140_-_audio_only_medium.m4a", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Bahon Main Chale Ao (Anamika)", artist: "The Bollywood Instrumental Band", file: "songs/16893024.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Lamyati Nazeero Kafi Nazarin", artist: "Waseem Ahmed", file: "songs/1811236497.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Pal Pal Dil Ke Paas", artist: "Kishore Kumar", file: "songs/1919679927.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Tere Bina", artist: "Zaeden", file: "songs/2103807.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ek Ajnabee Haseena Se", artist: "Kishore Kumar", file: "songs/2120701717.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Ek Raat", artist: "Vilen", file: "songs/2238856587.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tera Hone Laga Hoon", artist: "Pritam", file: "songs/2248463337.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Yezdi", artist: "Nanku", file: "songs/2400722565.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Choo Lo", artist: "The Local Train", file: "songs/2484339821.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tera Mera Hai Pyar", artist: "Amir Ameer, Faheem Abdullah", file: "songs/2552080062.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Yeh Vaada Raha", artist: "Kishore Kumar", file: "songs/2560247.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Aadat", artist: "Atif Aslam", file: "songs/2721180072.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Bheegey Hont", artist: "Kunal Ganjawala", file: "songs/2748347801.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ratiyaan", artist: "Hansika Pareek", file: "songs/2876268552.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tera Hi Rahun", artist: "Gajendra Verma", file: "songs/2957095951.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Chan Kithan", artist: "Ali Sethi", file: "songs/2959238271.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kanha Hum Toh Loote Hai Tere Pyaar Mai", artist: "Sakshi Choudhary", file: "songs/3065211251.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Finding Her", artist: "Kushagra", file: "songs/3149280691.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kehne Lagaa", artist: "Rushil Aswal", file: "songs/3158504791.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Chale Aana", artist: "Armaan Malik", file: "songs/3173722561 (1).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Chale Aana", artist: "Armaan Malik", file: "songs/3173722561.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kaise Hua", artist: "Vishal Mishra", file: "songs/3174262761.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Besabriyaan", artist: "Armaan Malik", file: "songs/3180271081.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ye Tune Kya Kiya", artist: "Javed Bashir", file: "songs/3180482641.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Khud Ko Tere", artist: "Mahalakshmi Iyer", file: "songs/3180578501.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jee Le Zaraa", artist: "Vishal Dadlani", file: "songs/3180585631.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Saudebazi", artist: "Javed Ali", file: "songs/3180689451.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Main Rahoon Ya Na Rahoon", artist: "Armaan Malik", file: "songs/3183390141.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Banjaara", artist: "Mohammed Irfan", file: "songs/3183420071.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Labon Ko", artist: "K.K.", file: "songs/3185245781.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dhoom Taana", artist: "Vishal-Shekhar", file: "songs/3185317651.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tum Se Hi", artist: "Pritam", file: "songs/3185543151.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Main Hoon Na", artist: "Sonu Nigam", file: "songs/3192755311.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Shree Hanuman Chalisa", artist: "Hariharan", file: "songs/3201093701.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Paa Liya Hain Pyar Tera", artist: "Udit Narayan", file: "songs/3201910541.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ranjheya Ve", artist: "Zain Zohaib", file: "songs/3216475011.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Koi Fariyaad", artist: "Jagjit Singh", file: "songs/3217186581.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Deslocado", artist: "Napa", file: "songs/3266585161.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jeene Laga Hoon", artist: "Atif Aslam & Shreya Ghoshal", file: "songs/3337176531.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Golden", artist: "HUNTR, X", file: "songs/3412534581.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Humsafar", artist: "Akhil Sachdeva", file: "songs/3424994521.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rukh Se Parda", artist: "Owais Raza Qadri", file: "songs/3526615691.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "I Thought I Saw Your Face Today", artist: "She, Him", file: "songs/3551769431.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Khat", artist: "Navjot Ahuja", file: "songs/3668549692.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rakhlo Tum Chupaake", artist: "Arpit Bala", file: "songs/3707330502.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Meherbaan", artist: "Ash King & Shilpa Rao", file: "songs/3818173721.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Jugraafiya", artist: "Udit Narayan & Shreya Ghoshal", file: "songs/3831742721.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Vaaroon", artist: "Anand Bhaskar", file: "songs/3848165591.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Phir bhi aas lagi hai 2.0", artist: "Sagar Kalra", file: "songs/3886797131.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kya Hua Tera Wada", artist: "Mohammed Rafi", file: "songs/3886850381.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Itna Na Mujhse Tu Pyar Badha", artist: "Talat Mahmood", file: "songs/426218662.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Jadu Hai Nasha Hai", artist: "Shreya Ghoshal", file: "songs/451798752.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Beqarar Karke Hamen Yun Na Jaiye", artist: "Hemant Kumar", file: "songs/451871602.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Lag Ja Gale Se Phir", artist: "Lata Mangeshkar", file: "songs/452269472.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Maula Mere Maula", artist: "Roop Kumar Rathod", file: "songs/453458762.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "O Mere Dil Ke Chain", artist: "Sanam", file: "songs/470734262.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Hungama Ho Gaya", artist: "Asha Bhosle", file: "songs/474392592.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Chand Si Mehbooba Ho Meri", artist: "Mukesh", file: "songs/482504722.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Kisi Ki Muskurahaton Se", artist: "Mukesh", file: "songs/492285862.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Ajib Dastan Hai Yeh", artist: "Lata Mangeshkar", file: "songs/492288512.mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Kalam Eneih", artist: "Sherine", file: "songs/573699462.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ishq Hua Kaise Hua", artist: "Amir Ameer, Faheem Abdullah", file: "songs/69608172.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tu Zaroori", artist: "Aparshakti Khurana, Savi Kahlon", file: "songs/89860523.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tose Naina Lage", artist: "Shilpa Rao", file: "songs/962609882.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Confidence", artist: "Kim", file: "songs/96485040.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Chalana", artist: "Sergio Reis", file: "songs/989007152.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Abhi Mujh Mein Kahin", artist: "Ajay-Atul, Sonu Nigam", file: "songs/Abhi Mujh Mein Kahin (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Abhi Na Jao Chhod Kar", artist: "Sadhana Sargam, Mohammed Salamat", file: "songs/Abhi Na Jao Chhod Kar (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Pal Pal", artist: "Afusic, Talwiinder", file: "songs/Afusic - Pal Pal (Official Music Video) Prod. @AliSoomroMusic - 128.MP3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Agg Banke", artist: "Talwiinder", file: "songs/Agg Banke - Talwiinder (DJJOhAL.Com) (1).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Ae Dil Hai Mushkil", artist: "Pritam, Arijit Singh", file: "songs/Arijit/Ae Dil Hai Mushkil Title Track - PagalNew - Pritam, Arijit Singh - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Agar Tum Saath Ho", artist: "Alka Yagnik, Arijit Singh", file: "songs/Arijit/Agar Tum Saath Ho - PagalNew - Alka Yagnik, Arijit Singh - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Apna Bana Le", artist: "Arijit Singh, Sachin-Jigar", file: "songs/Arijit/Apna Bana Le - PagalNew - Arijit Singh, Sachin-Jigar - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Raabta", artist: "Arijit Singh", file: "songs/Arijit/Arijit Singh - Raabta (Lyrics Video) Agent Vinod  Saif Ali Khan , Kareena Kapoor Khan. - PluginVibes - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Bulleya", artist: "Pritam, Amit Mishra, Shilpa Rao", file: "songs/Arijit/Bulleya - PagalNew - Pritam, Amit Mishra, Shilpa Rao - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Chaleya", artist: "Arijit Singh, Shilpa Rao", file: "songs/Arijit/Chaleya - PagalNew - Arijit Singh, Shilpa Rao - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Dekha Hazaro Dafaa", artist: "Arijit Singh & Palak Muchhal", file: "songs/Arijit/Dekha Hazaro Dafaa - PagalNew - Arijit Singh, Palak Muchhal - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Gehra Hua", artist: "Arijit Singh, Armaan Khan", file: "songs/Arijit/Gehra Hua - PagalNew - Arijit Singh, Armaan Khan - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Hawayein", artist: "Pritam, Arijit Singh", file: "songs/Arijit/Hawayein - PagalNew - Pritam, Arijit Singh - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Ilahi", artist: "Pritam, Arijit Singh", file: "songs/Arijit/Ilahi - PagalNew - Pritam, Arijit Singh - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Kalank", artist: "Arijit Singh, Shilpa Rao", file: "songs/Arijit/Kalank (Bonus Track) - PagalNew - Arijit Singh, Shilpa Rao - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Khairiyat", artist: "Arijit Singh", file: "songs/Arijit/Khairiyat (Bonus Track) - PagalNew - Arijit Singh - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Mast Magan", artist: "Shankar-Ehsaan-Loy, Arijit Singh, Chinmayi Sripada", file: "songs/Arijit/Mast Magan - PagalNew - Shankar-Ehsaan-Loy, Arijit Singh, Chinmayi Sripada - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Qaafirana", artist: "Arijit Singh & Nikhita Gandhi", file: "songs/Arijit/Qaafirana - PagalNew - Arijit Singh, Nikhita Gandhi - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Sanam Re", artist: "Arijit Singh, Mithoon", file: "songs/Arijit/Sanam Re - PagalNew - Arijit Singh, Mithoon - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Satranga", artist: "Arijit Singh, Shreyas Puranik", file: "songs/Arijit/Satranga - PagalNew - Arijit Singh, Shreyas Puranik - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Shayad", artist: "Pritam, Arijit Singh", file: "songs/Arijit/Shayad - PagalNew - Pritam, Arijit Singh - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Tera Yaar Hoon Main", artist: "Arijit Singh", file: "songs/Arijit/Tera Yaar Hoon Main - PagalNew - Arijit Singh - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Tujhe Kitna Chahne Lage", artist: "Arijit Singh, Mithoon", file: "songs/Arijit/Tujhe Kitna Chahne Lage - PagalNew - Arijit Singh, Mithoon - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Tum Hi Ho", artist: "Arijit Singh", file: "songs/Arijit/Tum Hi Ho - PagalNew - Arijit Singh - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Zaalima", artist: "Arijit Singh, Harshdeep Kaur", file: "songs/Arijit/Zaalima - PagalNew - Arijit Singh, Harshdeep Kaur - Copy.mp3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "" },
    { title: "Badan Pe Sitare Lapete Huye", artist: "Mohammad Rafi", file: "songs/Badan Pe Sitare Lapete Huye (Remastered)  Mohammad Rafi  Prince  Sargam - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Banjaare", artist: "Bairan", file: "songs/Banjaare - Bairan (Lyrics) - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Bargad", artist: "Surf, Arpit Bala", file: "songs/Bargad - Surf X Arpit Bala  Lyrics - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Bheegi Bheegi Raaton Mein", artist: "Adnan Sami", file: "songs/Bheegi Bheegi Raaton Mein (Cover)  Rajesh Khanna  Ajnabee  Sargam - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Boyfriend", artist: "Dino James, Sez on the Beat, Bluish music", file: "songs/Boyfriend (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Chala Jata Hoon", artist: "Kishore Kumar", file: "songs/Chala Jata Hoon (HD)  Mere Jeevan Saathi (1972)  Rajesh Khanna, Tanuja  Kishore Kumar  RD Burman - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Chithi Na Koi Sandesh", artist: "Hero And king Of Jhankar Studio, Jagjit Singh", file: "songs/Chithi_Na_Koi_Sandesh_Super_Jhankar_Beats_PenduJatt_Com_Se.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Chura Liya Hai Tumne", artist: "Asha Bhosle, Mohammed Rafi", file: "songs/Chura Liya Hai Tumne  Nostalgic 1970s Style Cover  Asha Bhosle & Mohammed Rafi   Surgana - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Chura Liya Hai Tumne Jo Dil Ko", artist: "Asha Bhosle, Mohammed Rafi", file: "songs/Chura Liya Hai Tumne Jo Dil Ko  Lyrical  Zeenat Aman  Asha Bhosle  Mohammed Rafi  R. D. Burman - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Chura Liya Hai Tumne Jo Dil Ko", artist: "Asha Bhosle, Mohammed Rafi", file: "songs/Chura Liya Hai Tumne Jo Dil Ko  Lyrical  Zeenat Aman  Asha Bhosle - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Dekha Yeh Khwab Toh", artist: "Lata Mangeshkar, Kishore Kumar", file: "songs/Dekha Ye Khwab Toh Silsila – Khwabon Se Bhara Old Bollywood Song - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Dhundhala", artist: "Yashraj, Talwiinder", file: "songs/Dhundhala - Yashraj & Talwiinder (DJJOhAL.Com) (1).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Dil Lena Khel", artist: "Dino James, R. D. Burman, Bluish music", file: "songs/Dil Lena Khel (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Dil Ye Pukare", artist: "Lata Mangeshkar", file: "songs/Dil Ye Pukare  Old Hindi Romantic Song  Heart Touching 60s-70s Vibe Love Song - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Ek Ajnabee Haseena Se", artist: "Kishore Kumar", file: "songs/Ek Ajnabee Haseena Se – Lofi Rap Rework  Adhoori Mulakaat  Rajesh Khanna Retro Vibes - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Gaani", artist: "Talwiinder", file: "songs/Gaani - Talwiinder (DJJOhAL.Com) (1).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Gallan 4", artist: "Talwiinder", file: "songs/Gallan 4 - Talwiinder (DJJOhAL.Com) (1).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Haseen", artist: "Talwiinder", file: "songs/Haseen - Talwiinder (DJJOhAL.Com) (1).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Haseen", artist: "Talwiinder", file: "songs/HASEEN - TALWIINDER, .mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Heer", artist: "Talwiinder", file: "songs/Heer (Afro Radio Edit) - Talwiinder (DJJOhAL.Com) (1).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Dil Se Dil", artist: "Shashwat Singh", file: "songs/HINDI HITS/Dil Se Dil - Official Music Video  Sita Ramam  Vishal Chandrashekhar  Shashwat Singh  Mandar C. - Sony Music India.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ehsaas", artist: "Faheem Abdullah", file: "songs/HINDI HITS/Ehsaas (Lyric Video) Faheem Abdullah  Vaibhav Pani  Hyder Dar - VYRLOriginals.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Ishq", artist: "Faheem Abdullah", file: "songs/HINDI HITS/Ishq Official Lyrical Video I Amir Ameer  Faheem Abdullah  Rauhan Malik I Love Song 2024 - Artiste First.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tera Rastaa Chhodoon Na", artist: "Amaal Mallik, Shalmali Kholgade", file: "songs/HINDI HITS/Tera Rastaa Chhodoon Na Song Chennai Express  Shahrukh Khan, Deepika Padukone - T-Series.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Timi Nacha Na", artist: "Wangden Sherpa", file: "songs/HINDI HITS/Wangden Sherpa - Timi Nacha Na [Official Lyric Visualizer] Prod. Frwny - Wangden Sherpa.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Hum Bhool Gaye Har Baat", artist: "Lata Mangeshkar", file: "songs/Hum Bhool Gaye Har Baat (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Itna Na Mujhse Tu Pyar Badha", artist: "Lata Mangeshkar, Talat Mahmood", file: "songs/Itna Na Mujhse Tu Pyar Badha  Chhaya  Lata Mangeshkar, Talat Mahmood, Sunil Dutt, Asha Parekh - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Jo Tu Nahi", artist: "K.K.", file: "songs/Jo Tu Nahi To Aisa Main Chehra Maand Slowed and Reverb - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kahani Suno 2.0", artist: "Kaifi Khalil", file: "songs/Kaifi Khalil - Kahani Suno 2.0 [Official Music Video] - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kanha", artist: "Rekha Bhardwaj, Shaarib Sabri, Toshi Sabri", file: "songs/Kanha (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Khayaal", artist: "Talwiinder", file: "songs/Khayaal - Talwiinder (DJJOhAL.Com) (1).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Mere Sapno Ki Rani", artist: "Kishore Kumar", file: "songs/Kishore Kumar  Mere Sapno Ki Rani Kab Aayegi Tu  Rajesh Khanna  Sharmila Tagore - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Kisi Ki Muskurahaton Pe Ho Nisar", artist: "Mukesh", file: "songs/Kisi Ki Muskurahaton Pe Ho Nisar  Raj Kapoor  Anari  Mukesh  Evergreen Hindi Songs HD - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Kun Faya Kun", artist: "A.R. Rahman, Javed Ali, Mohit Chauhan", file: "songs/Kun Faya Kun (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Kya Hua Tera Wada", artist: "Mohammed Rafi", file: "songs/Kya Hua Tera Wada-Lyrical  क्या हुआ तेरा वादा  Hum Kisise kum nahi  Mohammed Rafi  Rishi Kapoor - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Kya Khoob Lagti Ho", artist: "Mukesh, Kanchan", file: "songs/Kya Khoob Lagti Ho (Cover)  Mukesh and Kanchan  Dharmatma  Feroz Khan  Sargam - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "La La Li La La La", artist: "Aca Xoca", file: "songs/lala_li_lala_song_aca_xoca_la_la_la_li_la_la_la_song_ne_TcjB0sWhvxg.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Likhe Jo Khat Tujhe", artist: "Mohammed Rafi", file: "songs/Likhe Jo Khat Tujhe  Old is Gold Romantic Hindi Song  60s–70s Melodious Bollywood Classic - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Maai Teri Yaad", artist: "Swanand Kirkire", file: "songs/Maai Teri Yaad (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "MERE MEHBOOB QAYAMAT HOGI Originalमेरे मेहबूब क़यामत Kishore Kumar Mr X In Bombay", artist: "Kishore Kumar", file: "songs/MERE MEHBOOB QAYAMAT HOGI Original Full Song 4K  मेरे मेहबूब क़यामत  Kishore Kumar  Mr X In Bombay - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Mere Samne Wali Khidki Mein", artist: "Kishore Kumar", file: "songs/Mere Samne Wali Khidki Mein - Padosan - Saira Banu, Sunil Dutt & Kishore Kumar - Old Hindi Songs - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Meri Meheboob", artist: "Mohammed Rafi", file: "songs/Meri Meheboob  Timeless Disco  Reimagined - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Nakhre", artist: "Talwiinder", file: "songs/Nakhre - Talwiinder (DJJOhAL.Com) (1).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "O Mere Dil Ke Chain", artist: "Kishore Kumar", file: "songs/O Mere Dil Ke Chain – Kishore Kumar  Evergreen Romantic Classic - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "O Mere Saajan", artist: "Ajay-Atul, Shweta Mohan, Javed Ali", file: "songs/O Mere Saajan  [From Ranabaali] (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Paheli", artist: "Anurag Saikia, Raghav Chaitanya", file: "songs/Paheli (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Pal Pal", artist: "Afusic, Talwiinder", file: "songs/Pal Pal - Talwiinder  .mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Pal Pal Dil Ke Paas", artist: "Kishore Kumar", file: "songs/Pal Pal Dil Ke Paas 💖  Kishore Kumar  Evergreen Hindi Love Song  Full Lyrics - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Pal Pal", artist: "Afusic, Talwiinder", file: "songs/Pal Pal(KoshalWorld.Com).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Panchii", artist: "Talwiinder", file: "songs/Panchii - Talwiinder (DJJOhAL.Com) (1).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Panchii", artist: "Talwiinder", file: "songs/Panchii - Talwiinder (DJJOhAL.Com).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Pyari Amaanat", artist: "Arpit Bala", file: "songs/PYARI AMAANAT - Arpit Bala, @aodgotit  ,  @angadsvirk  (Official Music Video) - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rai Rai Raa Raa - Hindi", artist: "Raqueeb Alam, A.R. Rahman, Nakash Aziz", file: "songs/Rai Rai Raa Raa  - Hindi (PenduJatt.Com.Se) (1).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rai Rai Raa Raa - Hindi", artist: "Raqueeb Alam, A.R. Rahman, Nakash Aziz", file: "songs/Rai Rai Raa Raa  - Hindi (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rakhlo Tum Chupaake", artist: "Arpit Bala", file: "songs/Rakhlo Tum Chupaake - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Rani", artist: "Dino James", file: "songs/Rani (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Saiyaara", artist: "Kishore Kumar", file: "songs/Saiyaara 1980 Ft  Kishore Kumar full song Old version Old is Gold with a New Voice! - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Sajde", artist: "Faheem Abdullah", file: "songs/Sajde - Official Music Video  Faheem Abdullah  Huzaif Nazar - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Sufr", artist: "Arpit Bala, Toorjo Dey", file: "songs/Sufr - Bargad (Lyrics) ft. Arpit Bala, toorjo dey - 256.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Sunhari Kirne", artist: "Talwiinder", file: "songs/Sunhari Kirne (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Sunn", artist: "Dino James, Sanah Moidutty", file: "songs/Sunn (PenduJatt.Com.Se).mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Nasha", artist: "Talwiinder", file: "songs/Talwiinder - NASHA .mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Wishes", artist: "Talwiinder", file: "songs/Talwinder - Wishes (Remake) - 128.MP3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Feeling", artist: "Tamanna Afros", file: "songs/Tamanna Afros - Feeling.mp3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Tere Khayalon Mein Dil Kho Gya", artist: "Lata Mangeshkar", file: "songs/Tere Khayalon Mein Dil Kho Gya   Old Hindi Romantic Song  Video 60s-70s Vibe Love Song - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Tu Hai Kahan", artist: "AUR", file: "songs/Tu Hai Kahan by AUR  تو ہے کہاں (Official Music Video) - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "" },
    { title: "Wishes", artist: "Talwiinder", file: "songs/wishes - Talwiinder .mp3", art: "IMAGES/logoo.png", folder: "Talwiinder", durationFormatted: "" },
    { title: "Yeh Ratein Yeh Mausam", artist: "Kishore Kumar, Asha Bhosle", file: "songs/Yeh Ratein Yeh Mausam  Kishore & Asha's EVERGREEN ROMANCE  Old Hindi Song 🎶 - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },
    { title: "Yeh Vaada Raha", artist: "Kishore Kumar, Asha Bhosle", file: "songs/Yeh Vaada Raha (Lyrical Video)  R. D. Burman  Kishore Kumar  Asha Bhosle  Rishi Kapoor - 128.MP3", art: "IMAGES/logoo.png", folder: "Retro Classics", durationFormatted: "" },

];

// Promote curated imports from `new song/` so they appear higher in each relevant list.
const promotedNewFolderSongs = [
    { title: "Aankhon Mein Doob Jaane Ko", artist: "Alka Yagnik, Sonu Nigam", file: "new song/Aankhon Mein Doob Jaane Ko  THE 9TEEN  K3G  Deewani Hai Dekho - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Ambarsariya", artist: "Sona Mohapatra", file: "new song/Ambarsariya Fukrey Song By Sona Mohapatra  Pulkit Samrat, Priya Anand - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Chahun Main Ya Naa", artist: "Arijit Singh, Palak Muchhal", file: "new song/Arijit Singh, Palak Muchhal - Chahun Main Ya Naa (Lyrics) Aashiqui 2 - 128.MP3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "", _isNewImport: true },
    { title: "Bairan", artist: "Banjaare", file: "new song/Bairan – Animated Love Story  Banjaare (Official Video) - 128-3.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Bawara Mann", artist: "Jubin Nautiyal, Neeti Mohan", file: "new song/Bawara Mann Full Video  Jolly LL.B 2  Akshay Kumar, Huma Qureshi  Jubin Nautiyal & Neeti Mohan - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Ek Ladki Ko Dekha Toh Aisa Laga", artist: "Darshan Raval, Rochak Kohli", file: "new song/Ek Ladki Ko Dekha Toh Aisa Laga  Title Song  Anil  Sonam  Rajkummar Rao  Juhi  Darshan Rochak - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Ez-Ez", artist: "Dhurandhar", file: "new song/Ez-Ez (From Dhurandhar) - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Gehra Hua", artist: "Arijit Singh", file: "new song/Gehra Hua (From Dhurandhar) - 128.MP3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "", _isNewImport: true },
    { title: "Ilahi", artist: "Arijit Singh", file: "new song/Ilahi Full Video Song  Yeh Jawaani Hai Deewani  Ranbir Kapoor, Deepika Padukone  Pritam - 128.MP3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "", _isNewImport: true },
    { title: "Kaun Tujhe", artist: "Palak Muchhal", file: "new song/KAUN TUJHE  Lyrical  M.S. DHONI -THE UNTOLD STORY  Amaal Mallik Palak  Sushant Singh Disha Patani - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Lutt Le Gaya", artist: "Dhurandhar", file: "new song/Lutt Le Gaya (From Dhurandhar) - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Naal Nachna", artist: "Dhurandhar", file: "new song/Naal Nachna (From Dhurandhar) - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Pink Lips", artist: "Meet Bros, Khushboo Grewal", file: "new song/Pink Lips Full Audio Song  Hate Story 2  Sunny Leone  Meet Bros Anjjan Ft. Khushboo Grewal - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Ramba Ho", artist: "Dhurandhar", file: "new song/Ramba Ho (From Dhurandhar) - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Run Down The City - Monica", artist: "Dhurandhar", file: "new song/Run Down The City - Monica (From Dhurandhar) - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Sawaar Loon", artist: "Monali Thakur", file: "new song/SAWAAR LOON LOOTERA VIDEO SONG (Official)  RANVEER SINGH, SONAKSHI SINHA - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Tujh Mein Rab Dikhta Hai", artist: "Roop Kumar Rathod", file: "new song/Tujh Mein Rab Dikhta Hai Song  Rab Ne Bana Di Jodi  Shah Rukh Khan, Anushka Sharma  Roop Kumar - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
    { title: "Tum Hi Ho", artist: "Arijit Singh", file: "new song/Tum Hi Ho (Lyrics)Arijit SinghAashiqui 2@tseries - 128.MP3", art: "IMAGES/logoo.png", folder: "Arijit Singh", durationFormatted: "", _isNewImport: true },
    { title: "Vaaste", artist: "Dhvani Bhanushali, Nikhil D'Souza", file: "new song/Vaaste Song Dhvani Bhanushali, Tanishk Bagchi  Nikhil D'Souza  Bhushan Kumar  Radhika R, Vinay S - 128.MP3", art: "IMAGES/logoo.png", folder: "Hindi Hits", durationFormatted: "", _isNewImport: true },
];

function makeSongKey(song) {
    const normalize = (value) => (value || "")
        .toLowerCase()
        .replace(/\(.*?\)|\[.*?\]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return `${normalize(song.title)}||${normalize((song.artist || "").split(",")[0])}`;
}

(function injectAndPromoteNewFolderSongs() {
    const promoted = [];
    const promotedSeen = new Set();

    promotedNewFolderSongs.forEach((entry) => {
        const key = makeSongKey(entry);
        if (promotedSeen.has(key)) return;
        promotedSeen.add(key);

        const existingIndex = songs.findIndex((s) => makeSongKey(s) === key);
        if (existingIndex >= 0) {
            const [existing] = songs.splice(existingIndex, 1);
            existing._isNewImport = true;
            promoted.push(existing);
        } else {
            promoted.push(entry);
        }
    });

    for (let i = promoted.length - 1; i >= 0; i--) {
        songs.unshift(promoted[i]);
    }
})();

function normalizeSongToken(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/\(.*?\)|\[.*?\]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function getPrimaryArtist(artist) {
    if (!artist) return '';
    return String(artist).split(',')[0].trim();
}

function buildDedupeKey(song) {
    if (!song) return '';
    if (song._isOnline && song._onlineId) {
        return `online||${song._source || 'src'}||${song._onlineId}`;
    }
    const titleKey = normalizeSongToken(song.title);
    if (!titleKey) return '';
    const artistKey = normalizeSongToken(getPrimaryArtist(song.artist));
    const folderKey = normalizeSongToken(song.folder);
    const fileName = String(song.file || '').split('/').pop();
    const fileKey = normalizeSongToken(fileName);
    const locationKey = [folderKey, fileKey].filter(Boolean).join('||');
    return `${titleKey}||${artistKey}||${locationKey || 'unknown'}`;
}

function scoreSong(song) {
    if (!song) return -1;
    let score = 0;
    if (!song._isOnline) score += 2;
    if (song.title) score += 4;
    if (song.artist) score += 2;
    if (song.file) score += 3;
    if (song.durationFormatted) score += 1;
    const art = String(song.art || '');
    if (art && !/logoo\.png/i.test(art)) score += 1;
    return score;
}

function autoOrderSongs(list) {
    const folderCounts = new Map();
    list.forEach((song) => {
        const key = normalizeSongToken(song.folder) || 'unknown';
        folderCounts.set(key, (folderCounts.get(key) || 0) + 1);
    });

    const preferredFolders = [
        'arijit singh',
        'karan aujla',
        'hindi hits',
        'global hits',
        'retro classics',
        'talwiinder'
    ];
    const preferredIndex = new Map(preferredFolders.map((name, idx) => [name, idx]));

    const rankFolder = (song) => {
        const key = normalizeSongToken(song.folder);
        const index = preferredIndex.has(key) ? preferredIndex.get(key) : 999;
        const count = folderCounts.get(key || 'unknown') || 0;
        return { index, count, key };
    };

    return list.slice().sort((a, b) => {
        const aOnline = a._isOnline ? 1 : 0;
        const bOnline = b._isOnline ? 1 : 0;
        if (aOnline !== bOnline) return aOnline - bOnline;

        const aFolder = rankFolder(a);
        const bFolder = rankFolder(b);
        if (aFolder.index !== bFolder.index) return aFolder.index - bFolder.index;
        if (aFolder.count !== bFolder.count) return bFolder.count - aFolder.count;
        if (aFolder.key === bFolder.key) {
            // ── Custom order ALWAYS wins within the same folder ────────────
            const aOrder = (typeof a._customOrder === 'number') ? a._customOrder : Infinity;
            const bOrder = (typeof b._customOrder === 'number') ? b._customOrder : Infinity;
            if (aOrder !== bOrder) return aOrder - bOrder;

            // Fall back to new-import promotion only when no custom order differs
            const aNew = a._isNewImport ? 0 : 1;
            const bNew = b._isNewImport ? 0 : 1;
            if (aNew !== bNew) return aNew - bNew;
        }

        const aArtist = normalizeSongToken(getPrimaryArtist(a.artist));
        const bArtist = normalizeSongToken(getPrimaryArtist(b.artist));
        if (aArtist !== bArtist) return aArtist.localeCompare(bArtist);

        const aTitle = normalizeSongToken(a.title);
        const bTitle = normalizeSongToken(b.title);
        if (aTitle !== bTitle) return aTitle.localeCompare(bTitle);

        const aFile = normalizeSongToken(a.file);
        const bFile = normalizeSongToken(b.file);
        return aFile.localeCompare(bFile);
    });
}

function cleanSongsData() {
    const cleaned = [];
    const seen = new Map();

    songs.forEach((song) => {
        if (!song || !song.title || !song.file) return;
        const key = buildDedupeKey(song);
        if (!key) return;

        const existingIndex = seen.get(key);
        if (existingIndex === undefined) {
            cleaned.push(song);
            seen.set(key, cleaned.length - 1);
            return;
        }

        const current = cleaned[existingIndex];
        if (scoreSong(song) > scoreSong(current)) {
            cleaned[existingIndex] = song;
        }
    });

    const ordered = autoOrderSongs(cleaned);
    songs.splice(0, songs.length, ...ordered);
}

// ── Assign custom order indices to Global Hits so autoOrderSongs respects them ──
(function assignGlobalHitsOrder() {
    // These titles in this EXACT sequence should appear first in Global Hits
    const priorityOrder = [
        'Blue',
        'I Like Me Better',
        'Make You Mine',
        'Love Me Harder',
        'I Like You So Much, You\'ll Know It',
        'Shinunoga E-Wa',
        'Attention',
        'Closer',
        'Love Story',
        'Night Changes',
        'Stuck with U',
        'Paper Rings',
        'Double Take',
        'Co2',
        'I Wanna Be Yours',
        'Until I Found You',
        'I Think They Call This Love',
        'Perfect',
        'You Belong To Me',
        'Maria',
        'Positions',
        'Lover',
        'Unholy',
        'Cheri Cheri Lady',
        'Die For You',
        'Gat',
        'Dandelions',
        'A Thousand Years',
        'Who Says',
        'Criminal',
        'Pink Venom',
        'Under The Influence',
        'Believer',
        'Gangnam Style',
        'Harleys In Hawaii',
        'Ride It',
        'Love Me Like You Do',
        'I See Red',
        'Bella Ciao',
        'Wrap Me In Plastic',
        'Shape of You',
        'At My Worst',
        'Sunflower',
        'Fantasize',
        'Some',
        'Memories',
        'Lovers',
        'End Of Beginning',
        'Lovely',
    ];
    const orderMap = new Map(priorityOrder.map((title, i) => [title.toLowerCase().trim(), i]));
    const assignedTitles = new Set();

    songs.forEach(song => {
        if (song.folder !== 'Global Hits') return;
        const key = (song.title || '').toLowerCase().trim();
        if (orderMap.has(key) && !assignedTitles.has(key)) {
            song._customOrder = orderMap.get(key);
            assignedTitles.add(key);
        } else if (!song._customOrder) {
            // Non-priority songs get a high order number (appear after priority)
            song._customOrder = 10000;
        }
    });
})();

// ── Assign custom order indices to Hindi Hits so autoOrderSongs respects them ──
(function assignHindiHitsOrder() {
    const priorityOrder = [
        'Timro Pratiksa',           // 1
        'Dear Maahiya',             // 2
        'Bardali',                  // 3
        'Sadka Kiya',               // 4  (stored as "Sadka Kiya")
        'Dooron Dooron',            // 5
        'Labon Ko',                 // 6
        'Kaise Bataaoon',           // 7
        'Pehli Nazar Mein',         // 8
        'Rang Jo Lagyo',            // 9
        'Be Intehaan',              // 10
        'Rang Lageya',              // 11
        'Dekha Hazaro Dafaa',       // 12
        'Tum Tak',                  // 13
        'Raanjhanaa',               // 14
        'Dil Ye Bekarar Kyun Hai',  // 15
        'Is This Love',             // 16
        'Tujhko Jo Paaya',          // 17
        'Mere Bina',                // 18
        'Khoya Khoya',              // 19
        'Tere Bina',                // 20
        'Ishq',                     // 21
        'Yeh Fitoor Mera',          // 22
        'Ehsaas',                   // 23
        'Maine Khud Ko',            // 24
        'Ranjheya Ve',              // 25
        'Humsafar',                 // 26
        'Ve Haaniyaan',             // 27
        'Dariya',                   // 28
        'Tu Chahiye',               // 29
        'Saude Bazi',               // 30
        'Darkhaast',                // 31
        'Bairiyaa',                 // 32
        'Meherbaan',                // 33
        'Zehnaseeb',                // 34
        'Ishq Bulaava',             // 35
        'Sarangi',                  // 36
        'Haareya',                  // 37
        'Manchala',                 // 38
        'Sachiya Mohabbatan',       // 39
        'Enna Sona',                // 40
        'Sukoon Mila',              // 41
        'Tera Rastaa Chhodoon Na',  // 42
        'Chaar Kadam',              // 43
        'Ik Kudi',                  // 44
        'Dil Se Dil',               // 45
        'Kyon',                     // 46
        'Jab Tak',                  // 47
        'Jaan Ban Gaye',            // 48
        'Jogi',                     // 49
        'Qaafirana',                // 50
        'O Rangrez',                // 51
        'Iraaday',                  // 52
        'Meri Banogi Kya',          // 53
        'Timi Nacha Na',            // 54
        'Taare Ginn',               // 55
        'Afeemi',                   // 56  (may not exist — skip)
        'Zaroor',                   // 57
        'Kahaan Ho Tum',            // 58
        'Hosanna',                  // 59
        'Aankhon Se Batana',        // 60
        'Khwab',                    // 61
        'Savera',                   // 62
        'Inkem Inkem',              // 63
        'Mere Nishan',              // 64
        'Ishq Hai',                 // 65
        'Mann Mera',                // 66
        'Phir Le Aaya Dil',         // 67  (may not exist — skip)
        'Mileya Mileya',            // 68  (may not exist — skip)
        'Aise Kyun',                // 69  (may not exist — skip)
        'Mere Liye Tum Kaafi Ho',   // 70
        'Jhol',                     // 71
        'Jugraafiya',               // 72
        'Nadaaniyan',               // 73
        'Sajni',                    // 74
        'Aahista',                  // 75
        'Jeene Laga Hoon',          // 76
        'Zulfein',                  // 77
        'Timi Sangai',              // 78
        'Jhim Jhim Aune Aakhale',   // 79
        'Timro Pratiksa',           // 80 (same as #1, skip duplicate)
        'Kasari',                   // 81
        'Abhi Kuch Dino Se',        // 82
        'Rukum Maikot',             // 83
    ];

    const orderMap = new Map();
    let idx = 0;
    for (const title of priorityOrder) {
        const key = title.toLowerCase().trim();
        if (!orderMap.has(key)) {          // skip duplicates in the list
            orderMap.set(key, idx++);
        }
    }

    const assignedTitles = new Set();
    songs.forEach(song => {
        if (song.folder !== 'Hindi Hits') return;
        const key = (song.title || '').toLowerCase().trim();
        if (orderMap.has(key) && !assignedTitles.has(key)) {
            song._customOrder = orderMap.get(key);
            assignedTitles.add(key);
        } else if (typeof song._customOrder !== 'number') {
            song._customOrder = 10000;
        }
    });
})();

// ── Catch-all: ensure EVERY Global Hits & Hindi Hits song has a _customOrder ─
// This prevents _isNewImport songs (which run before our assignment) from
// sneaking to the top by having no _customOrder (Infinity) vs 10000.
(function sealCustomOrders() {
    songs.forEach(song => {
        if ((song.folder === 'Global Hits' || song.folder === 'Hindi Hits') &&
            typeof song._customOrder !== 'number') {
            song._customOrder = 10000;
        }
    });
})();

// ── Catch-all: ensure EVERY Global Hits & Hindi Hits song has a _customOrder ─
(function sealCustomOrders() {
    songs.forEach(song => {
        if ((song.folder === 'Global Hits' || song.folder === 'Hindi Hits') &&
            typeof song._customOrder !== 'number') {
            song._customOrder = 10000;
        }
    });
})();

cleanSongsData();

// ═══════════════════════════════════════════════════════════════════════════
// ENFORCE MANUAL ORDER — runs after cleanSongsData, directly rearranges
// the songs[] array so priority songs appear first in their section.
// This is guaranteed to work regardless of the sort infrastructure.
// ═══════════════════════════════════════════════════════════════════════════
(function enforceManualOrder() {
    function applyOrder(folderName, priorityTitles) {
        // Build a lowercase→index map for priorities
        const priorityMap = new Map();
        priorityTitles.forEach((t, i) => {
            const k = t.toLowerCase().trim();
            if (!priorityMap.has(k)) priorityMap.set(k, i); // no dupes
        });

        // Pull all songs of this folder OUT of the main array
        const folderSongs = [];
        const otherSongs = [];
        songs.forEach(s => {
            if ((s.folder || '') === folderName) folderSongs.push(s);
            else otherSongs.push(s);
        });

        // Sort the folder songs: priority first (0..N), then rest (stable)
        const priority = [];
        const rest = [];
        const usedKeys = new Set();

        // Place priority songs in exact order
        priorityTitles.forEach(title => {
            const k = title.toLowerCase().trim();
            if (usedKeys.has(k)) return; // skip dupes in list
            const idx = folderSongs.findIndex(
                s => (s.title || '').toLowerCase().trim() === k
            );
            if (idx !== -1) {
                priority.push(folderSongs[idx]);
                usedKeys.add(k);
            }
        });

        // Remaining folder songs (not in priority list)
        folderSongs.forEach(s => {
            const k = (s.title || '').toLowerCase().trim();
            if (!usedKeys.has(k)) rest.push(s);
            else {
                // Check if this specific song object was already added
                if (!priority.includes(s)) rest.push(s);
            }
        });

        const reordered = [...priority, ...rest];


        // Find where this folder starts in otherSongs relative to original
        // Insert reordered folder songs at the position of the first folder song
        const firstFolderIdx = songs.findIndex(s => (s.folder || '') === folderName);

        // Rebuild: other songs before folder, reordered folder, other songs after folder
        const before = songs.slice(0, firstFolderIdx).filter(s => (s.folder || '') !== folderName);
        const after  = songs.slice(firstFolderIdx).filter(s => (s.folder || '') !== folderName);

        songs.splice(0, songs.length, ...before, ...reordered, ...after);
    }

    // ── Global Hits order ──────────────────────────────────────────────────
    applyOrder('Global Hits', [
        'Blue', 'I Like Me Better', 'Make You Mine', 'Love Me Harder',
        "I Like You So Much, You'll Know It", 'Shinunoga E-Wa', 'Attention',
        'Closer', 'Love Story', 'Night Changes', 'Stuck with U', 'Paper Rings',
        'Double Take', 'Co2', 'I Wanna Be Yours', 'Until I Found You',
        'I Think They Call This Love', 'Perfect', 'You Belong To Me', 'Maria',
        'Positions', 'Lover', 'Unholy', 'Cheri Cheri Lady', 'Die For You',
        'Gat', 'Dandelions', 'A Thousand Years', 'Who Says', 'Criminal',
        'Pink Venom', 'Under The Influence', 'Believer', 'Gangnam Style',
        'Harleys In Hawaii', 'Ride It', 'Love Me Like You Do', 'I See Red',
        'Bella Ciao', 'Wrap Me In Plastic', 'Shape of You', 'At My Worst',
        'Sunflower', 'Fantasize', 'Some', 'Memories', 'Lovers',
        'End Of Beginning', 'Lovely',
    ]);

    // ── Hindi Hits order ───────────────────────────────────────────────────
    applyOrder('Hindi Hits', [
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
    ]);
})();

// ═══════════════════════════════════════════════════════════════════════════
// ─── STRICT DATA-DRIVEN APPROACH: SANITIZATION + PERSISTENCE ───────────────
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_LOGO_PATH = 'IMAGES/logoo.png';
const URL_REGEX = /^https?:\/\/.+\..+/i;

// ─── 1. DATA SANITIZATION: Run BEFORE any rendering ───────────────────────
function sanitizeSongsArt() {
    const startTime = performance.now();
    let sanitizedCount = 0;

    songs.forEach((song, index) => {
        if (
            !song.art ||
            song.art === null ||
            song.art === undefined ||
            (typeof song.art === 'string' && song.art.trim() === '') ||
            !URL_REGEX.test(song.art)
        ) {
            song.art = DEFAULT_LOGO_PATH;
            sanitizedCount++;
        }
    });
    
    const endTime = performance.now();
    console.log(`✅ Sanitization: ${sanitizedCount} of ${songs.length} songs fixed in ${(endTime - startTime).toFixed(2)}ms`);
}

// ─── 2. localStorage PERSISTENCE Functions ────────────────────────────────
const SAVED_SONG_KEY = 'ivory_current_song';
// Clear any previously saved song so page always starts fresh
try { localStorage.removeItem(SAVED_SONG_KEY); } catch(e) {}

function saveSongToLocalStorage(songIndex) {
    try {
        if (songIndex < 0 || songIndex >= songs.length) return;
        
        const song = songs[songIndex];
        const songData = {
            index: songIndex,
            title: song.title,
            artist: song.artist,
            art: song.art,
            file: song.file,
            folder: song.folder,
            timestamp: Date.now()
        };
        
        localStorage.setItem(SAVED_SONG_KEY, JSON.stringify(songData));
        console.log(`💾 Saved to localStorage: "${song.title}"`);
    } catch (e) {
        console.warn("⚠️ localStorage save failed:", e.message);
    }
}

function loadSavedSongFromLocalStorage() {
    try {
        const saved = localStorage.getItem(SAVED_SONG_KEY);
        if (!saved) return null;
        
        const songData = JSON.parse(saved);
        return songData;
    } catch (e) {
        console.warn("⚠️ localStorage load failed:", e.message);
        return null;
    }
}

function restoreSavedSong() {
    const saved = loadSavedSongFromLocalStorage();
    if (!saved) return;
    
    try {
        const isMatch = (idx) => {
            if (idx < 0 || idx >= songs.length) return false;
            const song = songs[idx];
            if (!song) return false;
            if (saved.file && song.file === saved.file) return true;
            const titleKey = normalizeSongToken(song.title);
            const artistKey = normalizeSongToken(getPrimaryArtist(song.artist));
            const savedTitle = normalizeSongToken(saved.title);
            const savedArtist = normalizeSongToken(getPrimaryArtist(saved.artist));
            return titleKey && titleKey === savedTitle && artistKey === savedArtist;
        };

        let targetIndex = Number.isInteger(saved.index) ? saved.index : -1;
        if (!isMatch(targetIndex)) {
            if (saved.file) {
                const byFile = songs.findIndex(s => s.file === saved.file);
                if (isMatch(byFile)) targetIndex = byFile;
            }
        }
        if (!isMatch(targetIndex)) {
            const savedTitle = normalizeSongToken(saved.title);
            const savedArtist = normalizeSongToken(getPrimaryArtist(saved.artist));
            const byTitleArtist = songs.findIndex(s =>
                normalizeSongToken(s.title) === savedTitle &&
                normalizeSongToken(getPrimaryArtist(s.artist)) === savedArtist
            );
            if (isMatch(byTitleArtist)) targetIndex = byTitleArtist;
        }

        if (isMatch(targetIndex)) {
            console.log(`🔄 Restoring saved song: "${saved.title}" (ready to play, not auto-showing player)`);
            currentIndex = targetIndex;
            // Only load metadata — do NOT remove intro-mode or show the player bar.
            // The app always starts full-screen on refresh; player slides up only when
            // the user explicitly plays a song.
            loadSong(currentIndex);
            updateSongbarUI();
        }
    } catch (e) {
        console.warn("⚠️ Failed to restore saved song:", e.message);
    }
}

// ─── 3. SAFE RENDER WRAPPERS with try-catch ───────────────────────────────
function safeRenderPlaylist(playlistSongs = songs) {
    try {
        renderPlaylist(playlistSongs);
    } catch (e) {
        console.error("❌ Render playlist error:", e);
        document.body.innerHTML = '<div style="color: white; padding: 20px; background: #000;">Error rendering playlist. Refreshing...</div>';
        setTimeout(() => location.reload(), 2000);
    }
}

function safeRenderSongList(playlistSongs, titleOverride) {
    try {
        renderSongList(playlistSongs, titleOverride);
    } catch (e) {
        console.error("❌ Render song list error:", e);
        const container = getContainer();
        if (container) {
            container.innerHTML = '<div style="padding: 20px; color: #aaa;">Error rendering songs. Please refresh.</div>';
        }
    }
}

function safeRenderHome() {
    try {
        renderHome();
    } catch (e) {
        console.error("❌ Render home error:", e);
        const container = getContainer();
        if (container) {
            container.innerHTML = '<div style="padding: 20px; color: #aaa;">Error rendering home. Please refresh.</div>';
        }
    }
}

// ─── Persistent Art Cache (survives page refresh) ──────────────────────────
const ART_CACHE_KEY = 'ivory_art_cache';

const artCache = (() => {
    try { return JSON.parse(localStorage.getItem(ART_CACHE_KEY)) || {}; }
    catch (e) { return {}; }
})();

function saveArtCache() {
    try { localStorage.setItem(ART_CACHE_KEY, JSON.stringify(artCache)); }
    catch (e) { /* Storage full — ignore */ }
}

function getCachedArt(song) {
    const key = `${song.title}||${song.artist}`;
    return artCache[key] || null;
}

function setCachedArt(song, url) {
    if (!url) return;
    const key = `${song.title}||${song.artist}`;
    artCache[key] = url;
    saveArtCache();
}

// Pre-populate songs[] from localStorage cache before any render
songs.forEach(song => {
    const cached = getCachedArt(song);
    if (cached) {
        song.art = cached;
        song.fetchedArt = true;
    }
});
// ───────────────────────────────────────────────────────────────────────────

const talwiinderSongs = songs.filter(s => s.folder === 'Talwiinder' || (s.artist && s.artist.toLowerCase().includes('talwiinder')));
const retroClassicsSongs = songs.filter(s => s.folder === 'Retro Classics');

const arijitSongs = songs.filter(song => song.folder === 'Arijit Singh');
const karanSongs = songs.filter(song => song.folder === 'Karan Aujla');
const globalHits = songs.filter(song => song.folder === 'Global Hits');
const hindiHits = songs.filter(song => song.folder === 'Hindi Hits');
const anuvJainSongs = songs.filter(song => song.artist && song.artist.toLowerCase().includes('anuv jain'));
const weekndSongs = songs.filter(song => song.artist && (song.artist.toLowerCase().includes('weeknd') || song.artist.toLowerCase().includes('weekend')));

// ─── EMOTION / MOOD PLAYLISTS ─────────────────────────────────────────────
const sadSongTitles = ['Tum Hi Ho','Agar Tum Saath Ho','Kalank','Khairiyat','Shayad','Tujhe Kitna Chahne Lage','Haareya','Sanam Re','Lovely','Let Her Go','Let Me Down Slowly','Dandelions','Memories','Somewhere Only We Know','Blue','Apocalypse','End Of Beginning','Ordinary','Infinity','Heat Waves','Mockingbird','A Thousand Years','Night Changes','Aahista','Jhol','Kahaan Ho Tum','Co2','Labon Ko','Abhi Kuch Dino Se','Mere Bina','Dooron Dooron','Khoya Khoya','Savera','Nadaaniyan','Baarishein','Jhim Jhim Aune Aakhale','Timro Pratiksa','Kasari','Call Out My Name','Afsos','Heartless','Nothing Without You','Save Your Tears','A Lonely Night','Sunsetz','Past Lives','you broke me first','death bed','The Night We Met','Space Song','My Love Mine All Mine','ocean eyes','everything i wanted','BIRDS OF A FEATHER','Falling In Love','Cold/mess','Haseen','Panchii','Khayaal','Gallan 4'];
const sadSongs = songs.filter(s => sadSongTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const loveSongTitles = ['Hawayein','Tum Hi Ho','Dekha Hazaro Dafaa','Enna Sona','Raabta','Zaalima','Humsafar','Ishq Bulaava','A Thousand Years','Perfect','Love Story','Lover','Señorita','Stuck with U','Love Me Like You Do','Love Me Harder','Until I Found You','At My Worst','I Like Me Better','Make You Mine','I Think They Call This Love','Double Take','Dandelions','Pehli Nazar Mein','Jeene Laga Hoon','Rang Jo Lagyo','Be Intehaan','Tu Chahiye','Jaan Ban Gaye','Chaar Kadam','Dil Se Dil','Meri Banogi Kya','Ranjheya Ve','Tere Bina','Ve Haaniyaan','Zehnaseeb','Manchala','Dariya','Iraaday','Girls Like You','Cheri Cheri Lady','I Like You So Much','You Belong To Me','Ehsaas','Jo Tum Mere Ho','Arz Kiya Hai','Aaye Haaye','Save Your Tears','Die With A Smile','Easy On Me','From The Start','It\'s You','Aadat','Kaise Hua','Besabriyaan','Chan Kithan','Heer','Pal Pal','wishes','Gaani','Nakhre','Dhundhala'];
const loveSongs = songs.filter(s => loveSongTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const energeticSongTitles = ['Satranga','Chaleya','Believer','Thunder','Shape of You','Gangnam Style','Unstoppable','Pink Venom','Animals','Beggin','Hall of Fame','Ride It','Espresso','Old Town Road','Attention','Under The Influence','Unholy','52 Bars','Antidote','Winning Speech','MF Gabhru','On Top','I Really Do','Starboy','Feel Good Inc.','Maria','Paper Rings','Darkside','Bella Ciao','I See Red','Harleys In Hawaii','Criminal','100 Million','48 Rhymes','5-7','Courtside','Heartless','Popular','Dominance','Tell Me','Aaye Haaye','Enemy','About Damn Time','Do It To It','Pump It','Running Up That Hill','SNAP','Face Off','Locked out of Heaven'];
const energeticSongs = songs.filter(s => energeticSongTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const chillSongTitles = ['Faded','Alone','Heat Waves','Sweater Weather','505','I Wanna Be Yours','Blue','Apocalypse','Co2','Infinity','Wrap Me In Plastic','Gat','Sailor Song','Shinunoga E-Wa','End Of Beginning','Timeless','Ordinary','A Lonely Night','Alag Aasmaan','Husn','Afsos','Savera','Khwab','Timi Sangai','Timi Nacha Na','Bardali','Sarangi','Gul','Baarishein','Secrets','Reminder','São Paulo','Jo Tum Mere Ho','Space Song','Past Lives','Sunroof','Sofia','Lover Girl','Line Without a Hook','Haseen','Khayaal','NASHA','Pal Pal'];
const chillSongs = songs.filter(s => chillSongTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const punjabiSongTitles = ['52 Bars','Admirin You','Antidote','Boyfriend','For A Reason','I Really Do','Mf Gabhru','On Top','Softly','Winning Speech','Ik Kudi','Sachiya Mohabbatan','Ve Haaniyaan','Rang Lageya','Jogi','100 Million','48 Rhymes','5-7','Aaye Haaye','At Peace','Courtside','Tell Me','Dominance','Agg Banke','Gaani','Gallan 4','Haseen','Heer','Khayaal','Nakhre','Panchii','Pal Pal','NASHA','wishes','Dhundhala','HASEEN','Kanha'];
const punjabiSongs = songs.filter(s => punjabiSongTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const nightDriveSongTitles = ['Starboy','The Hills','Heartless','Call Out My Name','Die For You','Timeless','São Paulo','Save Your Tears','Save Your Tears (Remix)','Closer','Sweater Weather','505','I Wanna Be Yours','Apocalypse','Heat Waves','Alone','Faded','Darkside','Night Changes','Unholy','Under The Influence','Reminder','One Of The Girls','Popular','I Feel It Coming','In Your Eyes','Nothing Without You','Secrets','A Lonely Night','Summertime Sadness','The Night We Met','Space Song','Past Lives','Sofia','No. 1 Party Anthem','Maniac','Edge','NASHA'];
const nightDriveSongs = songs.filter(s => nightDriveSongTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const feelGoodSongTitles = ['Shape of You','Espresso','Señorita','Sunflower','Stuck with U','As It Was','Stay','Girls Like You','Eenie Meenie','Harleys In Hawaii','Ride It','Positions','Attention','Make You Mine','Some','I Like Me Better','Sapphire','Chaleya','Apna Bana Le','Tera Yaar Hoon Main','Jeene Laga Hoon','Rang Jo Lagyo','Haareya','Die With A Smile','Feel Good Inc.','Hall of Fame','Unstoppable','Sunroof','Put Your Records On','From The Start','Lover Girl','Dancin','Running Up That Hill','Locked out of Heaven','Left and Right'];
const feelGoodSongs = songs.filter(s => feelGoodSongTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const indieSoulTitles = ['Co2','Kahaan Ho Tum','Dandelions','Until I Found You','Double Take','I Think They Call This Love','At My Worst','Lovers','Blue','Ordinary','Sailor Song','Make You Mine','Somewhere Only We Know','Infinity','Afsos','Alag Aasmaan','Husn','Gul','Nadaaniyan','Khwab','Savera','Jhol','Timi Sangai','Bardali','Sarangi','Meri Banogi Kya','Kasari','Timi Nacha Na','Jo Tum Mere Ho','Baarishein','Arz Kiya Hai','Choo Lo','cold/mess','Ek Raat','Past Lives','Line Without a Hook','The Night We Met','My Love Mine All Mine','Sofia','Lights Are On'];
const indieSoulSongs = songs.filter(s => indieSoulTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

// ─── NEW MOOD PLAYLISTS ───────────────────────────────────────────────────

const partyAnthemTitles = ['Shape of You','Starboy','Gangnam Style','Old Town Road','Espresso','Beggin','Animals','Pink Venom','Believer','Thunder','Unstoppable','Ride It','Under The Influence','Unholy','Girls Like You','Bella Ciao','Hall of Fame','I See Red','Harleys In Hawaii','Eenie Meenie','52 Bars','MF Gabhru','On Top','100 Million','48 Rhymes','Courtside','Dominance','Aaye Haaye','Attention','Positions','Criminal','Paper Rings','Feel Good Inc.','Maria','Do It To It','About Damn Time','Enemy','Pump It','Locked out of Heaven','Kala Chashma','SexyBack','On The Floor'];
const partyAnthemSongs = songs.filter(s => partyAnthemTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const rainyDayTitles = ['Tum Hi Ho','Agar Tum Saath Ho','Baarishein','Hawayein','Khairiyat','Shayad','Tujhe Kitna Chahne Lage','Enna Sona','Sanam Re','Qaafirana','Mast Magan','Haareya','Sukoon Mila','Humsafar','Zehnaseeb','Manchala','Let Her Go','A Thousand Years','Blue','End Of Beginning','Somewhere Only We Know','Afsos','Gul','Husn','Kasari','Jhim Jhim Aune Aakhale','Timro Pratiksa','Timi Sangai','Darkhaast','Mere Bina','Dooron Dooron','Mere Nishan','Jaan Ban Gaye','Easy On Me','Space Song','death bed','Past Lives','Sunsetz','Haseen','Khayaal','Panchii'];
const rainyDaySongs = songs.filter(s => rainyDayTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const workoutTitles = ['Believer','Thunder','Unstoppable','Animals','Beggin','Hall of Fame','Old Town Road','Gangnam Style','Pink Venom','Shape of You','Darkside','I See Red','Bella Ciao','52 Bars','Antidote','MF Gabhru','On Top','Winning Speech','100 Million','48 Rhymes','5-7','Courtside','Dominance','Heartless','Popular','Espresso','Starboy','Mockingbird','Attention','Under The Influence','Enemy','Face Off','Do It To It','About Damn Time','Pump It','Running Up That Hill','Locked out of Heaven'];
const workoutSongs = songs.filter(s => workoutTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const bollywoodClassicTitles = ['Tum Hi Ho','Hawayein','Chaleya','Satranga','Pehli Nazar Mein','Jeene Laga Hoon','Enna Sona','Tum Tak','Chaar Kadam','Tu Chahiye','Be Intehaan','Rang Jo Lagyo','Labon Ko','Raanjhanaa','Zehnaseeb','Manchala','Ishq Bulaava','Humsafar','Zaalima','Bulleya','Ilahi','Sanam Re','Dekha Hazaro Dafaa','Kalank','Qaafirana','Mast Magan','Haareya','Sukoon Mila','Darkhaast','Jaan Ban Gaye','Yeh Fitoor Mera','Meherbaan','Sachiya Mohabbatan','Jab Tak','Maine Khud Ko','Jugraafiya','Sadka Kiya','Tujhko Jo Paaya','Abhi Kuch Dino Se','O Rangrez','Dil Ye Bekarar Kyun Hai','Taare Ginn','Kyon','Jogi','Kaise Hua','Chale Aana','Main Rahoon','Besabriyaan','Aadat','Bheegi Bheegi','Kanha','Maula Mere Maula','Abhi Mujh Mein','Tum Se Hi','Labon Ko','Koi Fariyaad','Kal Chaudavi Ki Raat'];
const bollywoodClassicSongs = songs.filter(s => bollywoodClassicTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const morningCoffeeTitles = ['Perfect','Sapphire','Dandelions','Until I Found You','Make You Mine','I Like Me Better','Double Take','I Think They Call This Love','Espresso','At My Worst','Some','Sailor Song','Blue','Ordinary','Lovers','Jeene Laga Hoon','Tera Yaar Hoon Main','Apna Bana Le','Co2','Savera','Meri Banogi Kya','Tere Bina','Ve Haaniyaan','Rang Lageya','Husn','Gul','Jo Tum Mere Ho','Alag Aasmaan','Timi Nacha Na','Bardali','Sarangi','As It Was','Girls Like You','Stuck with U','Die With A Smile','Put Your Records On','Sunroof','From The Start','Lover Girl','Left and Right'];
const morningCoffeeSongs = songs.filter(s => morningCoffeeTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const lateNightTitles = ['505','I Wanna Be Yours','Apocalypse','Sweater Weather','A Lonely Night','Heat Waves','Call Out My Name','The Hills','Heartless','Die For You','Timeless','São Paulo','Secrets','Reminder','One Of The Girls','Nothing Without You','Faded','Alone','Wrap Me In Plastic','Gat','Shinunoga E-Wa','End Of Beginning','Darkside','Closer','Save Your Tears','In Your Eyes','I Feel It Coming','Under The Influence','Unholy','Infinity','Love Me Harder','Fantasize','Skyfall','Summertime Sadness','The Night We Met','Space Song','Past Lives','NASHA','Maniac','Golden Brown','Edge'];
const lateNightSongs = songs.filter(s => lateNightTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const danceFloorTitles = ['Shape of You','Señorita','Stay','Closer','Espresso','Positions','Harleys In Hawaii','Eenie Meenie','Girls Like You','Ride It','Old Town Road','Attention','Sunflower','Pink Venom','Animals','Gangnam Style','Beggin','Maria','Bella Ciao','Paper Rings','Criminal','Under The Influence','Unholy','Chaleya','Satranga','As It Was','Stuck with U','Feel Good Inc.','Some','100 Million','Aaye Haaye','Dominance','5-7','Courtside','Die With A Smile','Dancin','Do It To It','On The Floor','Kala Chashma','SexyBack','Pump It','Locked out of Heaven'];
const danceFloorSongs = songs.filter(s => danceFloorTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

const rockAltTitles = ['Believer','Thunder','505','I Wanna Be Yours','Sweater Weather','Heat Waves','Mockingbird','Hall of Fame','Darkside','I See Red','Feel Good Inc.','End Of Beginning','Apocalypse','Unstoppable','Faded','Alone','Skyfall','Bella Ciao','Starboy','Heartless','Popular','Enemy','Running Up That Hill','No. 1 Party Anthem','Let Down','Heaven Knows','Golden Brown','Every Breath You Take','Runaway'];
const rockAltSongs = songs.filter(s => rockAltTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

// ─── NEW GENRE PLAYLISTS ──────────────────────────────────────────────────

const kpopAsianTitles = ['Pink Venom','Maria','Some','Gangnam Style','Shinunoga E-Wa','One Of The Girls','I Like You So Much','Gat','Left and Right','DARARI','NAM DANG NAM SOM'];
const kpopAsianSongs = songs.filter(s => kpopAsianTitles.some(t => s.title.toLowerCase().includes(t.toLowerCase())));

// ─── NEW ARTIST PLAYLISTS ─────────────────────────────────────────────────

const atifAslamSongs = songs.filter(s => s.artist && s.artist.toLowerCase().includes('atif aslam'));
const pritamSongs = songs.filter(s => s.artist && s.artist.toLowerCase().includes('pritam'));
const charliePuthSongs = songs.filter(s => s.artist && s.artist.toLowerCase().includes('charlie puth'));
const arianaGrandeSongs = songs.filter(s => s.artist && s.artist.toLowerCase().includes('ariana grande'));
const taylorSwiftSongs = songs.filter(s => s.artist && s.artist.toLowerCase().includes('taylor swift'));
const mohitChauhanSongs = songs.filter(s => s.artist && s.artist.toLowerCase().includes('mohit chauhan'));

// ─── PLAY FUNCTIONS ───────────────────────────────────────────────────────

function playArijitSongs(autoPlay = false) {
    renderSongList(arijitSongs, 'Arijit Singh');
    if (autoPlay && arijitSongs.length > 0) playSongAtIndex(songs.indexOf(arijitSongs[0]));
}

function playKaranSongs(autoPlay = false) {
    renderSongList(karanSongs, 'Karan Aujla');
    if (autoPlay && karanSongs.length > 0) playSongAtIndex(songs.indexOf(karanSongs[0]));
}

function playGlobalHits(autoPlay = false) {
    renderSongList(globalHits, 'Global Hits');
    if (autoPlay && globalHits.length > 0) playSongAtIndex(songs.indexOf(globalHits[0]));
}

function playHindiHits(autoPlay = false) {
    renderSongList(hindiHits, 'Hindi Hits');
    if (autoPlay && hindiHits.length > 0) playSongAtIndex(songs.indexOf(hindiHits[0]));
}

function playAnuvJainSongs(autoPlay = false) {
    renderSongList(anuvJainSongs, 'Anuv Jain');
    if (autoPlay && anuvJainSongs.length > 0) playSongAtIndex(songs.indexOf(anuvJainSongs[0]));
}

function playWeekndSongs(autoPlay = false) {
    renderSongList(weekndSongs, 'The Weeknd');
    if (autoPlay && weekndSongs.length > 0) playSongAtIndex(songs.indexOf(weekndSongs[0]));
}

function playAtifAslamSongs(autoPlay = false) {
    renderSongList(atifAslamSongs, 'Atif Aslam');
    if (autoPlay && atifAslamSongs.length > 0) playSongAtIndex(songs.indexOf(atifAslamSongs[0]));
}

function playPritamSongs(autoPlay = false) {
    renderSongList(pritamSongs, 'Pritam');
    if (autoPlay && pritamSongs.length > 0) playSongAtIndex(songs.indexOf(pritamSongs[0]));
}

function playCharliePuthSongs(autoPlay = false) {
    renderSongList(charliePuthSongs, 'Charlie Puth');
    if (autoPlay && charliePuthSongs.length > 0) playSongAtIndex(songs.indexOf(charliePuthSongs[0]));
}

function playArianaGrandeSongs(autoPlay = false) {
    renderSongList(arianaGrandeSongs, 'Ariana Grande');
    if (autoPlay && arianaGrandeSongs.length > 0) playSongAtIndex(songs.indexOf(arianaGrandeSongs[0]));
}

function playTaylorSwiftSongs(autoPlay = false) {
    renderSongList(taylorSwiftSongs, 'Taylor Swift');
    if (autoPlay && taylorSwiftSongs.length > 0) playSongAtIndex(songs.indexOf(taylorSwiftSongs[0]));
}

function playMohitChauhanSongs(autoPlay = false) {
    renderSongList(mohitChauhanSongs, 'Mohit Chauhan');
    if (autoPlay && mohitChauhanSongs.length > 0) playSongAtIndex(songs.indexOf(mohitChauhanSongs[0]));
}

function playKpopAsian(autoPlay = false) {
    renderSongList(kpopAsianSongs, '🎌 K-Pop & Asian Pop');
    if (autoPlay && kpopAsianSongs.length > 0) playSongAtIndex(songs.indexOf(kpopAsianSongs[0]));
}

function playTalwiinderSongs(autoPlay = false) {
    renderSongList(talwiinderSongs, 'Talwiinder');
    if (autoPlay && talwiinderSongs.length > 0) playSongAtIndex(songs.indexOf(talwiinderSongs[0]));
}

function playRetroClassics(autoPlay = false) {
    renderSongList(retroClassicsSongs, '🎙️ Retro Classics');
    if (autoPlay && retroClassicsSongs.length > 0) playSongAtIndex(songs.indexOf(retroClassicsSongs[0]));
}

function playMood(mood, autoPlay = false) {
    const moodMap = {
        sad: { list: sadSongs, name: '💔 Sad Vibes' },
        love: { list: loveSongs, name: '❤️ Love Songs' },
        energetic: { list: energeticSongs, name: '⚡ Energetic' },
        chill: { list: chillSongs, name: '🌿 Chill Mode' },
        punjabi: { list: punjabiSongs, name: '🔥 Punjabi Vibes' },
        nightdrive: { list: nightDriveSongs, name: '🌙 Night Drive' },
        feelgood: { list: feelGoodSongs, name: '✨ Feel Good' },
        indie: { list: indieSoulSongs, name: '🎶 Indie Soul' },
        party: { list: partyAnthemSongs, name: '🎤 Party Anthems' },
        rainy: { list: rainyDaySongs, name: '🌧️ Rainy Day' },
        workout: { list: workoutSongs, name: '💪 Workout' },
        bollywood: { list: bollywoodClassicSongs, name: '🎬 Bollywood Classics' },
        morning: { list: morningCoffeeSongs, name: '☕ Morning Coffee' },
        latenight: { list: lateNightSongs, name: '🌌 Late Night' },
        dancefloor: { list: danceFloorSongs, name: '💃 Dance Floor' },
        rockalt: { list: rockAltSongs, name: '🎸 Rock & Alt' },
    };
    const m = moodMap[mood];
    if (!m) return;
    renderSongList(m.list, m.name);
    if (autoPlay && m.list.length > 0) playSongAtIndex(songs.indexOf(m.list[0]));
}

function getContainer() {
    // First try existing song-list or card-grid views
    const existing = document.querySelector('.song-list-container') || document.querySelector('.card-grid:not(.home-card-grid)');
    if (existing) return existing;
    // For home view with multiple home-sections, find/create a primary container
    const contentBody = document.querySelector('.content-body');
    if (!contentBody) return null;
    // Remove home sections so the list/grid can take over
    contentBody.querySelectorAll('.home-section').forEach(s => s.remove());
    const div = document.createElement('div');
    div.className = 'card-grid';
    contentBody.appendChild(div);
    return div;
}

function renderPlaylist(playlistSongs = songs) {
    try {
        const container = getContainer();
        if (!container) return;
        
        // Switch back to grid view
        container.className = 'card-grid';
        container.innerHTML = '';

        playlistSongs.forEach((song) => {
            const globalIndex = songs.indexOf(song);
            const card = document.createElement('div');
            card.className = 'music-card';
            card.setAttribute('data-index', globalIndex);
            
            const artUrl = song.art || getSectionFallback(song);
            const sectionFallback = getSectionFallback(song);

            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${artUrl}" alt="${song.title}" loading="lazy" onerror="this.onerror=null;this.src='${sectionFallback}'">
                    <button class="play-fab" onclick="playSongAtIndex(${globalIndex}, event)">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                </div>
                <div class="card-details">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            `;
            
            // Specific click handler for Arijit Singh card to load list view
            if (song.folder === 'Arijit Singh' && playlistSongs === songs) {
                 card.setAttribute('onclick', "window.music.loadCategory('Arijit Singh')");
                 // Remvoe default click listener logic for this specific card if needed, 
                 // but the onclick attribute takes precedence or runs. 
                 // Actually, the card.addEventListener below overlaps. 
                 // We should handle this cleaner.
            }

            card.addEventListener('click', (e) => {
                 if (e.target.closest('.play-fab')) return;
                 
                 // If it's the Arijit card and we are in main view, load category
                 if (song.folder === 'Arijit Singh' && playlistSongs === songs) {
                     loadCategory('Arijit Singh');
                 } else {
                     playSongAtIndex(globalIndex, e);
                 }
            });

            container.appendChild(card);
        });

        initTiltEffect();
        
        // Add onerror to all card images for fallback fetch
        container.querySelectorAll('.card-img-wrapper img').forEach(img => {
            const card = img.closest('.music-card');
            if (!card) return;
            const index = parseInt(card.getAttribute('data-index'));
            if (isNaN(index)) return;
            img.setAttribute('data-index', index);

            img.onerror = function() {
                this.onerror = null;
                const song = songs[index];
                this.src = getSectionFallback(song);
                if (song && !song.fetchedArt) {
                    song.fetchedArt = true;
                    fetchAlbumArt(song.title, song.artist).then(url => {
                        if (url) {
                            song.art = url;
                            this.src = url;
                            setCachedArt(song, url);
                        }
                    });
                }
            };
        });

        // Lazy load art via IntersectionObserver
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const index = parseInt(img.getAttribute('data-index'));
                    const song = songs[index];
                    
                    if (song && !song.fetchedArt) {
                        const currentArt = song.art || 'IMAGES/logoo.png';
                        const isGeneric = currentArt === 'IMAGES/logoo.png'
                            || !currentArt.startsWith('http')
                            || currentArt.includes('Hindi-Hit-Songs')
                            || currentArt.includes('logoo.png');
                        
                        if (isGeneric) {
                            song.fetchedArt = true;
                            fetchAlbumArt(song.title, song.artist).then(url => {
                                if (url) {
                                    song.art = url;
                                    img.src = url;
                                    setCachedArt(song, url);
                                }
                            });
                        }
                    }
                    obs.unobserve(img);
                }
            });
        });

        container.querySelectorAll('.card-img-wrapper img').forEach(img => {
            observer.observe(img);
        });
    } catch (e) {
        console.error("❌ Error rendering playlist:", e);
        const container = getContainer();
        if (container) {
            container.innerHTML = '<div style="padding: 20px; color: #aaa; text-align: center;">Error rendering playlist. Try refreshing.</div>';
        }
    }
}

function showAll(btn) {
    if(btn) {
        document.querySelectorAll('.filter-bar .pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
    } else {
        const pillAll = document.getElementById('pill-all');
        if (pillAll) {
            document.querySelectorAll('.filter-bar .pill').forEach(p => p.classList.remove('active'));
            pillAll.classList.add('active');
        }
    }
    renderHome();
}

function showArtists(btn) {
    if(btn) {
        document.querySelectorAll('.filter-bar .pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
    } else {
        const pillArtists = document.getElementById('pill-artists');
        if (pillArtists) {
            document.querySelectorAll('.filter-bar .pill').forEach(p => p.classList.remove('active'));
            pillArtists.classList.add('active');
        }
    }
    renderArtists();
}

function renderArtists() {
    try {
        const container = getContainer();
        if (!container) return;
        
        container.className = 'card-grid fade-in-up';
        container.innerHTML = `
            ${makeArtistCard('playArijitSongs','IMAGES/arijit.jpg','Arijit Singh','Pure melody.')}
            ${makeArtistCard('playKaranSongs','IMAGES/karan_aujla.jpg','Karan Aujla','The Hit Maker.')}
            ${makeArtistCard('playAnuvJainSongs','IMAGES/anuv%20jain.jpg','Anuv Jain','Soulful indie poetry.')}
            ${makeArtistCard('playWeekndSongs','IMAGES/weekend.jpg','The Weeknd','Dark R&B excellence.')}
            ${makeArtistCard('playAtifAslamSongs','IMAGES/Atif%20Aslam%20.jpg','Atif Aslam','The romantic voice.')}
            ${makeArtistCard('playPritamSongs','IMAGES/Pritam%20.jpg','Pritam','Bollywood\'s hitmaker.')}
            ${makeArtistCard('playCharliePuthSongs','IMAGES/charlie%20puth.jpg','Charlie Puth','Perfect pitch pop.')}
            ${makeArtistCard('playArianaGrandeSongs','IMAGES/Ariana%20Grande%20.jpg','Ariana Grande','Pop queen.')}
            ${makeArtistCard('playTaylorSwiftSongs','IMAGES/Taylor%20swift.jpg','Taylor Swift','The Eras icon.')}
            ${makeArtistCard('playMohitChauhanSongs','IMAGES/Mohit%20Chauhan%20.jpg','Mohit Chauhan','Soulful storyteller.')}
            ${makeArtistCard('playTalwiinderSongs','IMAGES/talwinder.jpg','Talwiinder','Soulful Punjabi poetry.')}
        `;
        if(typeof initTiltEffect === 'function') initTiltEffect();
    } catch (e) {
        console.error("❌ Error rendering artists:", e);
        const container = getContainer();
        if (container) {
            container.innerHTML = '<div style="padding: 20px; color: #aaa; text-align: center;">Error rendering artists. Please refresh.</div>';
        }
    }
}

function makeMoodCard(mood, img, title, subtitle) {
    return `
        <div class="music-card" onclick="playMood('${mood}')">
            <div class="card-img-wrapper">
                <img src="${img}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src='IMAGES/logoo.png';">
                <button class="play-fab" aria-label="Play" onclick="event.stopPropagation(); playMood('${mood}', true);">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </button>
            </div>
            <div class="card-details">
                <h3>${title}</h3>
                <p>${subtitle}</p>
            </div>
        </div>`;
}

function makeGenreCard(fn, img, title, subtitle) {
    return `
        <div class="music-card" onclick="${fn}()">
            <div class="card-img-wrapper">
                <img src="${img}" alt="${title}" loading="lazy" onerror="this.onerror=null;this.src='IMAGES/logoo.png';">
                <button class="play-fab" aria-label="Play" onclick="event.stopPropagation(); ${fn}(true);">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </button>
            </div>
            <div class="card-details">
                <h3>${title}</h3>
                <p>${subtitle}</p>
            </div>
        </div>`;
}

function makeArtistCard(fn, img, name, sub) {
    return `
        <div class="music-card" onclick="${fn}()">
            <div class="card-img-wrapper">
                <img src="${img}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='IMAGES/logoo.png';">
                <button class="play-fab" aria-label="Play" onclick="event.stopPropagation(); ${fn}(true);">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </button>
            </div>
            <div class="card-details">
                <h3>${name}</h3>
                <p>${sub}</p>
            </div>
        </div>`;
}

function renderHome() {
    try {
        const mainView = document.querySelector('.content-body');
        if (!mainView) return;

        // Clear existing dynamic sections, keep filter-bar
        mainView.querySelectorAll('.home-section').forEach(s => s.remove());
        // Also remove any song-list or loose card-grid views
        mainView.querySelectorAll('.song-list-container, .card-grid:not(.home-card-grid)').forEach(s => s.remove());

        // ── GENRES SECTION ──────────────────────────────────
        const genreSection = document.createElement('div');
        genreSection.className = 'home-section';
        genreSection.innerHTML = `
            <h2 class="section-title">🎵 Browse by Genre</h2>
            <div class="card-grid home-card-grid" id="genre-grid">
                ${makeGenreCard('playGlobalHits','IMAGES/english_hits.jpg','English Hits','Global language of emotion.')}
                ${makeGenreCard('playHindiHits','IMAGES/hindi_hits.jpg','Hindi Hits','Latest & Greatest.')}
                ${makeGenreCard('playKpopAsian','IMAGES/k%20pop%20%26%20asian.jpg','🎌 K-Pop & Asian','From Seoul to Tokyo.')}
                ${makeGenreCard('playRetroClassics','IMAGES/retro%20classics.jpg','🎙️ Retro Classics','Golden era Bollywood.')}
            </div>`;
        mainView.appendChild(genreSection);

        // ── MOODS SECTION ────────────────────────────────────
        const moodSection = document.createElement('div');
        moodSection.className = 'home-section';
        moodSection.innerHTML = `
            <h2 class="section-title">🎭 Music by Mood</h2>
            <div class="card-grid home-card-grid" id="mood-grid">
                ${makeMoodCard('love','IMAGES/love_vibes.jpg','❤️ Love Songs','Feel every heartbeat.')}
                ${makeMoodCard('sad','IMAGES/sad_vibes.jpg','💔 Sad Vibes','Let it all out.')}
                ${makeMoodCard('energetic','IMAGES/energetic_vibes.jpg','⚡ Energetic','Pump up the volume.')}
                ${makeMoodCard('chill','IMAGES/chill_vibes.jpg','🌿 Chill Mode','Relax and unwind.')}
                ${makeMoodCard('nightdrive','IMAGES/night_drive.jpg','🌙 Night Drive','Dark roads & deep thoughts.')}
                ${makeMoodCard('feelgood','IMAGES/feel_good.jpg','✨ Feel Good','Good vibes only.')}
                ${makeMoodCard('punjabi','IMAGES/punjabi_vibes.jpg','🔥 Punjabi Vibes','High energy desi beats.')}
                ${makeMoodCard('indie','IMAGES/indie_soul.jpg','🎶 Indie Soul','Acoustic & indie poetry.')}
                ${makeMoodCard('party','IMAGES/party_anthem.jpg','🎤 Party Anthems','Turn up the bass.')}
                ${makeMoodCard('rainy','IMAGES/rainy%20day.jpg','🌧️ Rainy Day','Monsoon melancholy.')}
                ${makeMoodCard('workout','IMAGES/workout.jpg','💪 Workout','Push your limits.')}
                ${makeMoodCard('bollywood','IMAGES/bollywood.jpg','🎬 Bollywood Classics','Timeless Bollywood.')}
                ${makeMoodCard('morning','IMAGES/morning%20coffee.jpg','☕ Morning Coffee','Start slow, sip easy.')}
                ${makeMoodCard('latenight','IMAGES/late%20night.jpg','🌌 Late Night','Midnight solitude.')}
                ${makeMoodCard('dancefloor','IMAGES/dance%20floor.jpg','💃 Dance Floor','Move your body.')}
                ${makeMoodCard('rockalt','IMAGES/rock%20%26%20alt.jpg','🎸 Rock & Alt','Raw energy & guitars.')}
            </div>`;
        mainView.appendChild(moodSection);

        // ── ARTISTS SECTION ──────────────────────────────────
        const artistSection = document.createElement('div');
        artistSection.className = 'home-section';
        artistSection.innerHTML = `
            <h2 class="section-title">🎤 Top Artists</h2>
            <div class="card-grid home-card-grid" id="artist-grid">
                ${makeArtistCard('playArijitSongs','IMAGES/arijit.jpg','Arijit Singh','The voice of a generation.')}
                ${makeArtistCard('playKaranSongs','IMAGES/karan_aujla.jpg','Karan Aujla','The hit maker.')}
                ${makeArtistCard('playAnuvJainSongs','IMAGES/anuv%20jain.jpg','Anuv Jain','Soulful indie poetry.')}
                ${makeArtistCard('playWeekndSongs','IMAGES/weekend.jpg','The Weeknd','Dark R&B excellence.')}
                ${makeArtistCard('playAtifAslamSongs','IMAGES/Atif%20Aslam%20.jpg','Atif Aslam','The romantic voice.')}
                ${makeArtistCard('playPritamSongs','IMAGES/Pritam%20.jpg','Pritam','Bollywood\'s hitmaker.')}
                ${makeArtistCard('playCharliePuthSongs','IMAGES/charlie%20puth.jpg','Charlie Puth','Perfect pitch pop.')}
                ${makeArtistCard('playArianaGrandeSongs','IMAGES/Ariana%20Grande%20.jpg','Ariana Grande','Pop queen.')}
                ${makeArtistCard('playTaylorSwiftSongs','IMAGES/Taylor%20swift.jpg','Taylor Swift','The Eras icon.')}
                ${makeArtistCard('playMohitChauhanSongs','IMAGES/Mohit%20Chauhan%20.jpg','Mohit Chauhan','Soulful storyteller.')}
                ${makeArtistCard('playTalwiinderSongs','IMAGES/talwinder.jpg','Talwiinder','Soulful Punjabi poetry.')}
            </div>`;
        mainView.appendChild(artistSection);

        if(typeof initTiltEffect === 'function') initTiltEffect();
    } catch (e) {
        console.error('❌ Error rendering home:', e);
    }
}

function renderSongList(playlistSongs, titleOverride) {
    try {
        const container = getContainer();
        if (!container) return;

        // Switch to list view
        container.className = 'song-list-container fade-in-up';
        container.innerHTML = `
            <div class="song-list-header">

                <h2>${titleOverride || playlistSongs[0]?.folder || 'Songs'}</h2>
            </div>
        `;

        if (playlistSongs.length === 0) {
            container.innerHTML += `<div style="padding: 20px; color: #aaa;">No songs found.</div>`;
            return;
        }

        playlistSongs.forEach((song, i) => {
            const globalIndex = songs.indexOf(song);
            const row = document.createElement('div');
            row.className = 'song-list-row';
            row.id = `song-row-${globalIndex}`; // Add ID for easy access
            if (globalIndex === currentIndex) {
                row.classList.add('active-song'); // Highlight if currently playing
            }
            row.onclick = (e) => playSongAtIndex(globalIndex, e);
            
            const immediateArt = song.art || song.thumb || getSectionFallback(song);

            row.innerHTML = `
                <span class="song-num">${i + 1}</span>
                <img src="${immediateArt}" class="song-list-art" id="list-art-${globalIndex}" alt="art" loading="lazy" />
                <span class="song-list-title">${song.title}</span>
                <span class="song-list-artist">${song.artist}</span>
                <span class="song-duration" id="duration-${globalIndex}">${song.durationFormatted || "--:--"}</span>
                <button class="icon-btn song-list-play">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </button>
            `;
            container.appendChild(row);

            // Lazy fetch duration if not present
            if (!song.durationFormatted) {
                fetchSongDuration(song, globalIndex);
            }

            // Set up error handler instantly
            const artEl = document.getElementById(`list-art-${globalIndex}`);
            if (artEl) {
                artEl.onerror = function() {
                    this.onerror = null;
                    this.src = getSectionFallback(song); // show section card image while fetching
                    if (!song.fetchedArt) {
                        song.fetchedArt = true;
                        fetchAlbumArt(song.title, song.artist).then(fetchedArt => {
                            if (fetchedArt) {
                                song.art = fetchedArt;
                                this.src = fetchedArt;
                                setCachedArt(song, fetchedArt);
                            }
                        });
                    }
                };
            }
        });

        // Use IntersectionObserver for lazy loading album arts
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const indexStr = img.id.split('-')[2];
                    const index = parseInt(indexStr);
                    const song = songs[index];
                    
                    if (song && !song.fetchedArt) {
                        const currentArt = song.art || "IMAGES/logoo.png";
                        const isGeneric = currentArt === "IMAGES/logoo.png" || !currentArt.startsWith('http') || currentArt.includes('Hindi-Hit-Songs');
                        
                        if (isGeneric) {
                            song.fetchedArt = true;
                            fetchAlbumArt(song.title, song.artist).then(fetchedArt => {
                                if (fetchedArt) {
                                    song.art = fetchedArt;
                                    img.src = fetchedArt;
                                    setCachedArt(song, fetchedArt);
                                }
                            });
                        }
                    }
                    obs.unobserve(img);
                }
            });
        }, { rootMargin: '100px' }); // Load slightly before it scrolls into view

        playlistSongs.forEach(song => {
            const globalIndex = songs.indexOf(song);
            const artEl = document.getElementById(`list-art-${globalIndex}`);
            if (artEl) {
                observer.observe(artEl);
            }
        });
    } catch (e) {
        console.error("❌ Error rendering song list:", e);
        const container = getContainer();
        if (container) {
            container.innerHTML = '<div style="padding: 20px; color: #aaa; text-align: center;">Error rendering songs. Try refreshing.</div>';
        }
    }
}

let _durationFetchQueue = [];
let _durationFetchActive = 0;
const MAX_CONCURRENT_DURATION_FETCHES = RuntimePerf.isSlowNetwork() ? 1 : 3;

function fetchSongDuration(song, index) {
    _durationFetchQueue.push({ song, index });
    _processDurationQueue();
}

function _processDurationQueue() {
    while (_durationFetchActive < MAX_CONCURRENT_DURATION_FETCHES && _durationFetchQueue.length > 0) {
        const { song, index } = _durationFetchQueue.shift();
        _durationFetchActive++;
        const audioObj = new Audio();
        audioObj.preload = 'metadata';
        audioObj.src = song.file;
        audioObj.onloadedmetadata = () => {
            const duration = audioObj.duration;
            const formatted = formatTime(duration);
            song.durationFormatted = formatted;
            const durationEl = document.getElementById(`duration-${index}`);
            if (durationEl) durationEl.textContent = formatted;
            // Clean up to release network connection and memory
            audioObj.onloadedmetadata = null;
            audioObj.onerror = null;
            audioObj.src = '';
            audioObj.removeAttribute('src');
            _durationFetchActive--;
            _processDurationQueue();
        };
        audioObj.onerror = () => {
            console.warn("Could not load metadata for", song.title);
            audioObj.onloadedmetadata = null;
            audioObj.onerror = null;
            audioObj.src = '';
            audioObj.removeAttribute('src');
            _durationFetchActive--;
            _processDurationQueue();
        };
    }
}


function playSongAtIndex(index, event) {
    if (event) event.stopPropagation();
    loadSong(index);
    playSong();
    updateSongbarUI();
}

function loadCategory(folderName) {
    const filteredSongs = songs.filter(song => song.folder === folderName);
    if (folderName === 'Arijit Singh') {
        renderSongList(filteredSongs);
    } else {
        renderPlaylist(filteredSongs);
    }
}

// Disable old refreshSongs logic effectively
async function refreshSongs() {
    console.log("Using static song list.");
    renderPlaylist();
}

let currentIndex = -1;
const audio = new Audio();
const supportsMediaSession = typeof navigator !== 'undefined' && 'mediaSession' in navigator;
const MEDIA_ARTWORK_SIZES = [96, 128, 192, 256, 384, 512];

function resolveMediaArtworkUrl(src) {
    const fallback = DEFAULT_LOGO_PATH;
    const value = src || fallback;
    try {
        return new URL(value, window.location.href).href;
    } catch (e) {
        return value;
    }
}

function inferArtworkMime(src) {
    const value = (src || '').toLowerCase();
    if (value.endsWith('.png')) return 'image/png';
    if (value.endsWith('.webp')) return 'image/webp';
    if (value.endsWith('.gif')) return 'image/gif';
    return 'image/jpeg';
}

function buildMediaSessionArtwork(song) {
    const cover = resolveMediaArtworkUrl(song?.art || song?.thumb || getSectionFallback(song) || DEFAULT_LOGO_PATH);
    const type = inferArtworkMime(cover);
    return MEDIA_ARTWORK_SIZES.map((size) => ({
        src: cover,
        sizes: `${size}x${size}`,
        type
    }));
}

function updateMediaSessionPositionState() {
    if (!supportsMediaSession || typeof navigator.mediaSession.setPositionState !== 'function') return;
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    try {
        navigator.mediaSession.setPositionState({
            duration: audio.duration,
            playbackRate: audio.playbackRate || 1,
            position: Math.min(audio.currentTime || 0, audio.duration)
        });
    } catch (e) {
        // Some browsers expose the API but reject unsupported values.
    }
}

function syncMediaSession() {
    if (!supportsMediaSession) return;
    const song = songs?.[currentIndex];
    if (!song) return;

    try {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title || 'Unknown title',
            artist: song.artist || 'Unknown artist',
            album: song.folder || 'Ivory',
            artwork: buildMediaSessionArtwork(song)
        });
    } catch (e) {
        try {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title || 'Unknown title',
                artist: song.artist || 'Unknown artist',
                album: song.folder || 'Ivory'
            });
        } catch (err) {
            // Ignore unsupported metadata construction.
        }
    }

    try {
        navigator.mediaSession.playbackState = audio.src ? (audio.paused ? 'paused' : 'playing') : 'none';
    } catch (e) {
        // Ignore playbackState issues on partial implementations.
    }

    updateMediaSessionPositionState();

    document.body.classList.add('media-session-ready');
    document.querySelector('.music-player')?.classList.add('media-session-ready');
    document.title = `${song.title || 'Ivory'} • ${song.artist || 'Premium Music'}`;
}

function registerMediaSessionHandlers() {
    if (!supportsMediaSession) return;

    const safeHandler = (action, handler) => {
        try {
            navigator.mediaSession.setActionHandler(action, handler);
        } catch (e) {
            // Unsupported action on this browser.
        }
    };

    safeHandler('play', async () => {
        playSong();
        syncMediaSession();
    });
    safeHandler('pause', () => {
        pauseSong();
        syncMediaSession();
    });
    safeHandler('previoustrack', () => {
        prevSong();
        syncMediaSession();
    });
    safeHandler('nexttrack', () => {
        nextSong();
        syncMediaSession();
    });
    safeHandler('seekbackward', (details) => {
        const offset = details?.seekOffset || 10;
        audio.currentTime = Math.max((audio.currentTime || 0) - offset, 0);
        updateMediaSessionPositionState();
    });
    safeHandler('seekforward', (details) => {
        const offset = details?.seekOffset || 10;
        const duration = Number.isFinite(audio.duration) ? audio.duration : Number.MAX_SAFE_INTEGER;
        audio.currentTime = Math.min((audio.currentTime || 0) + offset, duration);
        updateMediaSessionPositionState();
    });
    safeHandler('seekto', (details) => {
        if (!details || typeof details.seekTime !== 'number') return;
        if (details.fastSeek && typeof audio.fastSeek === 'function') {
            audio.fastSeek(details.seekTime);
        } else {
            audio.currentTime = details.seekTime;
        }
        updateMediaSessionPositionState();
    });
    safeHandler('stop', () => {
        pauseSong();
        audio.currentTime = 0;
        updateMediaSessionPositionState();
        syncMediaSession();
    });
}

function loadSong(index) {
	if (!songs.length) return;
	currentIndex = ((index % songs.length) + songs.length) % songs.length;
	const song = songs[currentIndex];
	
	let sourceUrl = song.file;
	
	// ── Handle online streams ──────────────────
	if (song._isOnline) {
		console.log(`🌐 Online: ${song._source} - ${song.title}`);
		
		// YouTube: open in browser ONLY - don't try to load as audio
		if (song._source === 'youtube') {
			console.log('📺 Opening YouTube - skipping audio load');
			window.open(sourceUrl, '_blank');
			audio.src = ''; // Clear audio
			updateSongbarUI(); // Update UI
			return; // EXIT - don't try audio.load()
		}
		
		// iTunes: try CORS proxy for playback
		if (song._source === 'itunes' && sourceUrl.startsWith('http')) {
			sourceUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(sourceUrl)}`;
			console.log('Using CORS proxy');
		}
	}
	
	audio.src = sourceUrl;
	audio.crossOrigin = 'anonymous';
	
	try {
		audio.load();
	} catch (e) {
		console.error('Load error:', e);
		nextSong();
		return;
	}
	
	console.log(`Loaded: ${song.title} — ${song.artist} ${song._isOnline ? '(🌐)' : ''}`);

	// Show the player bar immediately when a song is loaded (mobile + desktop)
	const playerEl = document.querySelector('.music-player');
	if (playerEl && !playerEl.classList.contains('active')) {
		playerEl.classList.add('active');
	}
	// Remove intro-mode so player is visible
	if (document.body.classList.contains('intro-mode')) {
		document.body.classList.remove('intro-mode');
	}


    // Fetch lyrics and canvas
    audio.onloadedmetadata = () => {
        LyricsManager.fetchLyrics(song.artist, song.title, audio.duration);
        
        const primaryArtist = song.artist.split(',')[0].trim(); 
        fetchYouTubeVideoId(primaryArtist, song.title);

        // Preload next track's metadata for smooth transitions
        _preloadNextTrack();
    };
	
	// ── Error handler ──────────────────
	audio.onerror = function(e) {
		console.warn(`Stream error: ${song.title}`, e);
		
		if (song._isOnline) {
			console.log('Opening stream in browser');
			if (song._source === 'youtube') {
				window.open(song.file, '_blank');
			} else if (song.fullStreamUrl) {
				window.open(song.fullStreamUrl, '_blank');
			}
		}
		nextSong();
	};
}

// ── Next-track preloading for smooth transitions ──
let _preloadAudio = null;
function _preloadNextTrack() {
    if (RuntimePerf.isSlowNetwork()) return;

    // Clean up previous preload
    if (_preloadAudio) {
        _preloadAudio.onloadedmetadata = null;
        _preloadAudio.onerror = null;
        _preloadAudio.src = '';
        _preloadAudio.removeAttribute('src');
        _preloadAudio = null;
    }
    const nextIdx = (currentIndex + 1) % songs.length;
    const nextSongObj = songs[nextIdx];
    if (!nextSongObj || nextSongObj._isOnline) return; // Don't preload online streams

    _preloadAudio = new Audio();
    _preloadAudio.preload = 'metadata';
    _preloadAudio.src = nextSongObj.file;
    _preloadAudio.onloadedmetadata = () => {
        // Cache duration if not already cached
        if (!nextSongObj.durationFormatted && _preloadAudio.duration) {
            nextSongObj.durationFormatted = formatTime(_preloadAudio.duration);
        }
        // Clean up after metadata loaded
        if (_preloadAudio) {
            _preloadAudio.onloadedmetadata = null;
            _preloadAudio.onerror = null;
        }
    };
    _preloadAudio.onerror = () => {
        if (_preloadAudio) {
            _preloadAudio.onloadedmetadata = null;
            _preloadAudio.onerror = null;
        }
    };
}

// --- Songbar integration ---
const sb = {
	art:       document.getElementById("sb-art"),
	title:     document.getElementById("sb-title"),
	artist:    document.getElementById("sb-artist"),
	play:      document.getElementById("sb-play"),
	prev:      document.getElementById("sb-prev"),
	next:      document.getElementById("sb-next"),
	// Desktop progress bar (inside .player-controls)
	progress:  document.getElementById("sb-progress-d"),
	current:   document.getElementById("sb-current-d"),
	duration:  document.getElementById("sb-duration-d"),
	// Mobile progress strip (inside .mobile-progress-strip)
	progressM: document.getElementById("sb-progress"),
	currentM:  document.getElementById("sb-current"),
	durationM: document.getElementById("sb-duration"),
	volume:    document.getElementById("sb-volume"),
	shuffle:   document.getElementById("sb-shuffle"),
	repeat:    document.getElementById("sb-repeat"),
	brandLogo: document.querySelector('.brand-logo')
};

// Helper to format seconds -> M:SS
function formatTime(sec = 0) {
	const s = Math.floor(sec % 60).toString().padStart(2, "0");
	const m = Math.floor(sec / 60);
	return `${m}:${s}`;
}

// ── JSONP helper — works from file:// (no CORS) ──────────────────────
function jsonpFetch(url, callbackParam) {
    return new Promise((resolve, reject) => {
        const cbName = '__ivoryJSONP_' + Math.random().toString(36).slice(2);
        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error('JSONP timeout'));
        }, 8000);
        function cleanup() {
            clearTimeout(timeout);
            delete window[cbName];
            if (script.parentNode) script.parentNode.removeChild(script);
        }
        window[cbName] = function(data) {
            cleanup();
            resolve(data);
        };
        const sep = url.includes('?') ? '&' : '?';
        const script = document.createElement('script');
        script.src = url + sep + (callbackParam || 'callback') + '=' + cbName;
        script.onerror = () => { cleanup(); reject(new Error('JSONP load error')); };
        document.head.appendChild(script);
    });
}

// Fetch album artwork — JSONP to iTunes with Deezer fallback (works from file://) ──────────
const _artFetchPending = new Map(); // Deduplication: prevent concurrent fetches for same song

async function fetchAlbumArt(title, artist) {
    if (!RuntimePerf.shouldFetchRemoteArt()) return null;

    const cacheKey = `${title}||${artist}`;

    // Check in-memory cache first (from localStorage)
    if (artCache[cacheKey]) return artCache[cacheKey];

    // Deduplicate concurrent requests for same song
    if (_artFetchPending.has(cacheKey)) return _artFetchPending.get(cacheKey);

    const fetchPromise = _fetchAlbumArtImpl(title, artist);
    _artFetchPending.set(cacheKey, fetchPromise);
    try {
        const result = await fetchPromise;
        return result;
    } finally {
        _artFetchPending.delete(cacheKey);
    }
}

async function _fetchAlbumArtImpl(title, artist) {
    let cleanTitle = title.replace(/\[.*?\]|\(.*?\)/g, '').trim(); // Clean title for better matching
    let query = encodeURIComponent(`${cleanTitle} ${artist}`);

    // Try iTunes first
    try {
        const url = `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`;
        const data = await jsonpFetch(url, 'callback');
        if (data && data.results && data.results.length > 0) {
            return data.results[0].artworkUrl100.replace('100x100', '600x600');
        }
    } catch (e) {
        console.warn('iTunes art fetch failed, falling back...', e.message);
    }

    // Fallback 1: Deezer API
    try {
        const url = `https://api.deezer.com/search?q=${query}&output=jsonp`;
        const data = await jsonpFetch(url, 'callback');
        if (data && data.data && data.data.length > 0) {
            return data.data[0].album.cover_xl;
        }
    } catch (e) {
        console.warn('Deezer art fetch failed:', e.message);
    }

    // Fallback 2: General title search without artist
    try {
        const plainQuery = encodeURIComponent(cleanTitle);
        const fallbackUrl = `https://itunes.apple.com/search?term=${plainQuery}&entity=song&limit=1`;
        const data = await jsonpFetch(fallbackUrl, 'callback');
        if (data && data.results && data.results.length > 0) {
             return data.results[0].artworkUrl100.replace('100x100', '600x600');
        }
    } catch (e) {
        console.warn('Final iTunes fallback failed:', e.message);
    }

    return null;
}

// ═══════════════════════════════════════════════════════════════════════
// ── DYNAMIC AMBIENT BACKGROUND ENGINE ──────────────────────────────────
// Extracts dominant, secondary & vibrant colors from album art using
// the Canvas API.  Applied as a heavily-blurred, low-opacity glow layer
// that crossfades smoothly (~1 s) whenever the track changes.
//
// CORS strategy: the display <img> (sb.art) loads WITHOUT crossOrigin
// so CDN images always render. For color extraction we load a SEPARATE
// hidden Image() WITH crossOrigin="anonymous". If the CDN supports CORS
// (saavncdn, mzstatic, etc. all do), we read pixels. If not, we retry
// through a lightweight CORS proxy as a fallback.
// ═══════════════════════════════════════════════════════════════════════

const AmbientEngine = (() => {
    // ── Reusable off-screen canvas (created once, reused forever) ──
    const _canvas = document.createElement('canvas');
    const _ctx    = _canvas.getContext('2d', { willReadFrequently: true });
    _canvas.width  = 64;
    _canvas.height = 64;

    // ── Cache to skip re-extraction for the same image URL ──
    const _cache = new Map();
    let   _lastSrc = '';

    // ── Default navy palette (used on first load / logo) ──
    const DEFAULT = {
        dominant:  [5, 11, 20],
        secondary: [13, 27, 62],
        tertiary:  [26, 47, 85],
    };

    /* ---------------------------------------------------------------
       extractPalette(img) → palette | null
       Draws img onto the offscreen canvas and reads pixel data.
       Returns null if canvas is tainted (CORS block).
       --------------------------------------------------------------- */
    function extractPalette(img) {
        const W = _canvas.width, H = _canvas.height;

        try {
            _ctx.clearRect(0, 0, W, H);
            _ctx.drawImage(img, 0, 0, W, H);
        } catch (e) {
            console.warn('🎨 Ambient: drawImage failed:', e.message);
            return null;
        }

        let pixels;
        try {
            pixels = _ctx.getImageData(0, 0, W, H).data;
        } catch (e) {
            // Canvas is tainted — CORS blocked pixel reading
            console.warn('🎨 Ambient: tainted canvas, CORS blocked pixel read');
            return null;
        }

        // ── Collect qualifying pixels ──
        const buckets = [];
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i], g = pixels[i+1], b = pixels[i+2], a = pixels[i+3];
            if (a < 128) continue;
            const brightness = r * 0.299 + g * 0.587 + b * 0.114;
            if (brightness < 15 || brightness > 240) continue;
            buckets.push([r, g, b]);
        }

        if (buckets.length < 10) return null;

        // ── Simple median-cut (3 passes → up to 8 clusters) ──
        const sorted = (arr, ch) => arr.slice().sort((a, b) => a[ch] - b[ch]);

        function medianCut(list, depth) {
            if (depth === 0 || list.length < 2) return [average(list)];
            let maxRange = 0, splitCh = 0;
            for (let ch = 0; ch < 3; ch++) {
                const vals = list.map(p => p[ch]);
                const range = Math.max(...vals) - Math.min(...vals);
                if (range > maxRange) { maxRange = range; splitCh = ch; }
            }
            const s = sorted(list, splitCh);
            const mid = Math.floor(s.length / 2);
            return [
                ...medianCut(s.slice(0, mid), depth - 1),
                ...medianCut(s.slice(mid),    depth - 1),
            ];
        }

        function average(list) {
            let r = 0, g = 0, b = 0;
            for (const p of list) { r += p[0]; g += p[1]; b += p[2]; }
            const n = list.length || 1;
            return [Math.round(r/n), Math.round(g/n), Math.round(b/n)];
        }

        const palette = medianCut(buckets, 3);

        // ── Sort by saturation (most vibrant first) ──
        function saturation([r, g, b]) {
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            return max === 0 ? 0 : (max - min) / max;
        }
        palette.sort((a, b) => saturation(b) - saturation(a));

        // ── Darken to stay within dark-theme range ──
        function darken([r, g, b], factor = 0.45) {
            return [Math.round(r * factor), Math.round(g * factor), Math.round(b * factor)];
        }

        return {
            dominant:  darken(palette[0] || DEFAULT.dominant,  0.70),
            secondary: darken(palette[1] || palette[0] || DEFAULT.secondary, 0.55),
            tertiary:  darken(palette[2] || palette[1] || DEFAULT.tertiary,  0.45),
        };
    }

    /* ---------------------------------------------------------------
       loadImageForExtraction(src) → Promise<HTMLImageElement>

       Strategy for file:// compatibility:
       1. Try loading with crossOrigin="anonymous" (works on http/https)
       2. If that fails or canvas is still tainted, fetch via CORS proxy
          as a blob, convert to Object URL, and load — guarantees
          an untainted canvas even from file:// origins.
       --------------------------------------------------------------- */
    function loadImageForExtraction(src) {
        // For local/same-origin images, load directly
        if (!src.startsWith('http')) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('Local image load failed'));
                img.src = src;
            });
        }

        // For cross-origin: fetch as blob via proxy, then load as object URL
        // This guarantees an untainted canvas even from file:// protocol
        return fetchImageAsBlob(src);
    }

    async function fetchImageAsBlob(originalUrl, proxyIndex = 0) {
        const proxies = [
            (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
            (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            (url) => url,  // Direct attempt (works when served from http/https)
        ];

        for (let i = proxyIndex; i < proxies.length; i++) {
            try {
                const proxyUrl = proxies[i](originalUrl);
                const response = await fetch(proxyUrl, { mode: 'cors' });
                if (!response.ok) continue;

                const blob = await response.blob();
                // Some proxies return octet-stream instead of image/*, so accept any blob with data
                if (blob.size < 100) continue;

                const objectUrl = URL.createObjectURL(blob);

                return await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        // Don't revoke immediately — canvas needs the image data
                        // Schedule cleanup after extraction
                        img._objectUrl = objectUrl;
                        resolve(img);
                    };
                    img.onerror = () => {
                        URL.revokeObjectURL(objectUrl);
                        reject(new Error('Blob image load failed'));
                    };
                    img.src = objectUrl;
                });
            } catch (e) {
                console.warn(`🎨 Ambient: proxy ${i} failed:`, e.message);
                continue;
            }
        }

        throw new Error('All fetch methods failed for ' + originalUrl.substring(0, 60));
    }

    // Clean up object URLs after extraction
    function cleanupImage(img) {
        if (img && img._objectUrl) {
            URL.revokeObjectURL(img._objectUrl);
            img._objectUrl = null;
        }
    }

    /* ---------------------------------------------------------------
       apply(palette)  — write CSS custom properties
       --------------------------------------------------------------- */
    function apply(palette) {
        const root = document.documentElement.style;

        // Ambient glow layer
        root.setProperty('--ambient-dominant',  palette.dominant.join(', '));
        root.setProperty('--ambient-secondary', palette.secondary.join(', '));
        root.setProperty('--ambient-tertiary',  palette.tertiary.join(', '));
        root.setProperty('--ambient-opacity',   '0.6');

        // Glass-bg tint
        const [dr, dg, db] = palette.dominant;
        root.setProperty('--glass-bg', `rgba(${dr}, ${dg}, ${db}, 0.30)`);

        // Mesh gradient overlay colors
        root.setProperty('--mesh-color-1',
            `rgb(${Math.max(0, dr - 15)}, ${Math.max(0, dg - 15)}, ${Math.max(0, db - 15)})`);
        root.setProperty('--mesh-color-2',
            `rgb(${palette.secondary.join(', ')})`);
        root.setProperty('--mesh-color-3',
            `rgb(${palette.tertiary.join(', ')})`);

        console.log(`🎨 Ambient applied: dominant(${palette.dominant}) secondary(${palette.secondary}) tertiary(${palette.tertiary})`);
    }

    /* ---------------------------------------------------------------
       reset()  — restore default navy theme
       --------------------------------------------------------------- */
    function reset() {
        const root = document.documentElement.style;
        root.setProperty('--ambient-dominant',  DEFAULT.dominant.join(', '));
        root.setProperty('--ambient-secondary', DEFAULT.secondary.join(', '));
        root.setProperty('--ambient-tertiary',  DEFAULT.tertiary.join(', '));
        root.setProperty('--ambient-opacity',   '0');
        root.setProperty('--glass-bg', 'rgba(13, 27, 62, 0.4)');
        root.setProperty('--mesh-color-1', '#050b14');
        root.setProperty('--mesh-color-2', '#0d1b3e');
        root.setProperty('--mesh-color-3', '#1a2f55');
    }

    /* ---------------------------------------------------------------
       PUBLIC:  updateThemeFromArt(imgElement)
       Called from sb.art.onload. Uses the image's src to load a
       separate CORS-enabled copy for pixel extraction.
       --------------------------------------------------------------- */
    function updateThemeFromArt(imageElement) {
        if (!imageElement || !imageElement.src) return;

        // Default theme when nothing has played or image is the logo
        if (!hasPlayed || imageElement.src.includes('logoo.png')) {
            reset();
            _lastSrc = '';
            return;
        }

        const src = imageElement.src;

        // Skip if same URL as last extraction
        if (src === _lastSrc) return;
        _lastSrc = src;

        // Check cache first
        if (_cache.has(src)) {
            apply(_cache.get(src));
            return;
        }

        // For local images (same-origin), extract directly from the displayed element
        if (!src.startsWith('http') || src.startsWith(location.origin)) {
            const palette = extractPalette(imageElement);
            if (palette) {
                _cache.set(src, palette);
                apply(palette);
            }
            return;
        }

        // For cross-origin images: fetch as blob for untainted canvas access
        console.log('🎨 Ambient: fetching image for color extraction...');

        loadImageForExtraction(src)
            .then(corsImg => {
                const palette = extractPalette(corsImg);
                cleanupImage(corsImg); // free the blob object URL

                if (palette) {
                    _cache.set(src, palette);
                    // Keep cache bounded
                    if (_cache.size > 80) {
                        const first = _cache.keys().next().value;
                        _cache.delete(first);
                    }
                    // Only apply if still on the same song
                    if (_lastSrc === src) {
                        apply(palette);
                    }
                } else {
                    console.warn('🎨 Ambient: extraction returned null');
                }
            })
            .catch(err => {
                console.warn('🎨 Ambient: image fetch failed:', err.message);
            });
    }

    return { updateThemeFromArt, reset };
})();

// ── Global alias so existing `sb.art.onload = () => updateThemeFromArt(sb.art)` keeps working ──
function updateThemeFromArt(imageElement) {
    AmbientEngine.updateThemeFromArt(imageElement);
}

// ── Cached SVG icon strings (avoid re-parsing DOM on every update) ──
const PLAY_ICON_SM = `<svg class="play-icon-svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
const PAUSE_ICON_SM = `<svg class="pause-icon-svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
const PLAY_ICON_LG = `<svg class="play-icon-svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
const PAUSE_ICON_LG = `<svg class="pause-icon-svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
let _lastPlayState = null; // Track last play/pause state to avoid redundant innerHTML

// When a song loads, update songbar
function updateSongbarUI() {
	if (!songs || !songs.length || currentIndex < 0 || currentIndex >= songs.length) {
		if (sb.title) sb.title.textContent = "Ivory";
		if (sb.artist) sb.artist.textContent = "Select a song to play";
		if (sb.art) sb.art.src = "IMAGES/logoo.png";
		document.title = 'Ivory | Premium Music';
		return;
	}
	const s = songs[currentIndex];
	if (sb.title) sb.title.textContent = s.title || "Unknown title";
	if (sb.artist) {
		const sourceIndicator = s._isOnline ? ` · 🌐 ${s._source.toUpperCase()}` : '';
		sb.artist.textContent = (s.artist || "Unknown artist") + sourceIndicator;
	}
	// if song has art property use it, otherwise keep default
    if (sb.art) {
        // Show art immediately from the song object (CDN URLs already present)
        const immediateArt = s.art || s.thumb || getSectionFallback(s);

        // Remove strict CORS crossOrigin tag to prevent the browser from outright blocking CDN images without headers!
        sb.art.removeAttribute('crossOrigin');

        sb.art.src = immediateArt;
        sb.art.onload = () => updateThemeFromArt(sb.art);
        sb.art.onerror = function() {
            this.onerror = null;
            const fallback = getSectionFallback(s);
            this.src = fallback;
            if (sb.brandLogo && hasPlayed) sb.brandLogo.src = fallback;

            // Try to fetch since it failed
            fetchAlbumArt(s.title, s.artist).then(fetchedArt => {
                if (fetchedArt) {
                    s.art = fetchedArt;
                    setCachedArt(s, fetchedArt);
                    if (songs[currentIndex] === s) {
                        sb.art.src = fetchedArt;
                        if (sb.brandLogo && hasPlayed) sb.brandLogo.src = fetchedArt;
                        const fsArt = document.getElementById('fs-art');
                        const fsBg = document.getElementById('fs-bg');
                        if (fsArt) fsArt.src = fetchedArt;
                        if (fsBg) fsBg.style.backgroundImage = `url('${fetchedArt}')`;
                    }
                }
            });
        };
        if (sb.brandLogo && hasPlayed) sb.brandLogo.src = immediateArt;

        // Dynamically fetch album cover if missing (only if not already fetching via onerror)
        if (!s.fetchedArt && (immediateArt === "IMAGES/logoo.png" || !immediateArt.startsWith('http') || immediateArt.includes('Hindi-Hit-Songs'))) {
             s.fetchedArt = true;
             fetchAlbumArt(s.title, s.artist).then(fetchedArt => {
                  if (fetchedArt) {
                       s.art = fetchedArt; // Cache it in the original array
                       setCachedArt(s, fetchedArt);
                       // Only update DOM if the song hasn't changed while fetching
                       if (songs[currentIndex] === s) {
                            sb.art.src = fetchedArt;
                            if (sb.brandLogo && hasPlayed) sb.brandLogo.src = fetchedArt;
                            // Also update fullscreen view instantly
                            const fsArt = document.getElementById('fs-art');
                            const fsBg = document.getElementById('fs-bg');
                            if (fsArt) fsArt.src = fetchedArt;
                            if (fsBg) fsBg.style.backgroundImage = `url('${fetchedArt}')`;
                       }
                  }
             });
        }
    }
	// update play button symbol (only when state changes)
	if (sb.play) {
		const newState = audio.paused ? 'paused' : 'playing';
		if (_lastPlayState !== newState) {
			_lastPlayState = newState;
			sb.play.innerHTML = audio.paused ? PLAY_ICON_SM : PAUSE_ICON_SM;
		}
	}

    // Update Brand Logo with Album Art
    if (sb.brandLogo) {
        if (hasPlayed) {
            if (sb.art && sb.art.src && !sb.art.src.includes('logoo.png')) {
                 sb.brandLogo.src = sb.art.src;
            } else if (s.art) {
                 sb.brandLogo.src = s.art;
            } else {
                 sb.brandLogo.src = 'IMAGES/logoo.png';
            }
        } else {
             // Initial state: keep default logo
             sb.brandLogo.src = 'IMAGES/logoo.png';
        }
    }

    // --- Full Screen Overlay Sync ---
    const fs = {
        art: document.getElementById('fs-art'),
        title: document.getElementById('fs-title'),
        artist: document.getElementById('fs-artist'),
        play: document.getElementById('fs-play'),
        bg: document.getElementById('fs-bg')
    };

    if (fs.title) fs.title.textContent = s.title || "Unknown title";
    if (fs.artist) {
    	const sourceIndicator = s._isOnline ? ` · 🌐 ${s._source.toUpperCase()}` : '';
    	fs.artist.textContent = (s.artist || "Unknown artist") + sourceIndicator;
    }

    // Update FS Art and Background
    const updateFsArt = (src) => {
        if (fs.art) fs.art.src = src;
        if (fs.bg) fs.bg.style.backgroundImage = `url('${src}')`;
    };

    if (fs.art) {
         // ── INSTANT: same art that's already shown in the playbar ──
         updateFsArt(s.art || s.thumb || getSectionFallback(s));
         // The background fetch above (for sb.art) will update s.art when done;
         // we hook into sb.art's onload to keep fullscreen in sync.
         const _origOnload = sb.art ? sb.art.onload : null;
         if (sb.art) {
             sb.art.onload = function() {
                 if (_origOnload) _origOnload.call(this);
                 if (songs[currentIndex] === s) updateFsArt(this.src);
             };
         }
    }

    if (fs.play) {
		fs.play.innerHTML = audio.paused ? PLAY_ICON_LG : PAUSE_ICON_LG;
    }

    const mini = {
        art: document.getElementById('mobile-mini-art'),
        title: document.getElementById('mobile-mini-title'),
        artist: document.getElementById('mobile-mini-artist'),
        play: document.getElementById('mobile-mini-play')
    };
    if (mini.art) mini.art.src = s.art || s.thumb || getSectionFallback(s);
    if (mini.title) mini.title.textContent = s.title || 'Unknown title';
    if (mini.artist) mini.artist.textContent = s.artist || 'Unknown artist';
    if (mini.play) mini.play.innerHTML = audio.paused ? PLAY_ICON_SM : PAUSE_ICON_SM;

    // Update active song highlight in list
    document.querySelector('.active-song')?.classList.remove('active-song');
    const activeRow = document.getElementById(`song-row-${currentIndex}`);
    if (activeRow) {
        activeRow.classList.add('active-song');
    }
}

// Ensure loadSong updates the bar (keeps same function signature)
const _loadSong = loadSong;
function loadSongWrap(index) { _loadSong(index); updateSongbarUI(); }
loadSong = loadSongWrap; // replace global reference

// Hook up controls (if elements exist)
if (sb.play) sb.play.addEventListener("click", () => {
	if (audio.paused) {
		playSong();
	} else {
		pauseSong();
	}
	updateSongbarUI();

    // Init Visualizer on first user interaction (Play)
    if (!VisualizerManager.isInitialized) {
        VisualizerManager.init();
    } else {
        VisualizerManager.resumeContext();
    }
});

if (sb.prev) sb.prev.addEventListener("click", () => { prevSong(); updateSongbarUI(); });
if (sb.next) sb.next.addEventListener("click", () => { nextSong(); updateSongbarUI(); });

// ── Helper: set both desktop + mobile progress elements ──
function _setProgress(pct, timeStr) {
	const valStr = pct + '%';
	if (sb.progress) {
		sb.progress.value = pct;
		sb.progress.style.setProperty('--val', valStr);
	}
	if (sb.current)  sb.current.textContent  = timeStr;
	if (sb.progressM) {
		sb.progressM.value = pct;
		sb.progressM.style.setProperty('--val', valStr);
	}
	if (sb.currentM) sb.currentM.textContent = timeStr;
}
function _setDuration(timeStr) {
	if (sb.duration)  sb.duration.textContent      = timeStr;
	if (sb.durationM) sb.durationM.textContent     = timeStr;
}

// ── Seeking — wire both desktop and mobile inputs ──
let isSeeking = false;
var _isFsSeekingGlobal = false;

function _wireSeek(input) {
	if (!input) return;
	input.addEventListener("input", (e) => {
		isSeeking = true;
		const pct = parseFloat(e.target.value);
		if (!isNaN(pct) && audio.duration) {
			const t = (pct / 100) * audio.duration;
			_setProgress(pct, formatTime(t));
		}
	});
	input.addEventListener("change", (e) => {
		const pct = parseFloat(e.target.value);
		if (!isNaN(pct) && audio.duration) {
			audio.currentTime = (pct / 100) * audio.duration;
		}
		isSeeking = false;
	});
	// Also update fill during seeking on this specific input
	input.addEventListener("input", () => {
		input.style.setProperty('--val', input.value + '%');
	});
}
_wireSeek(sb.progress);   // desktop
_wireSeek(sb.progressM);  // mobile

// ── Smooth progress via rAF ──
let _progressRafId = null;
let _lastProgressTime = -1;

function _updateProgressLoop() {
	if (!audio.paused && !audio.ended && audio.duration) {
		const ct = audio.currentTime;
		if (!isSeeking && Math.abs(ct - _lastProgressTime) > 0.05) {
			_lastProgressTime = ct;
			const pct = (ct / audio.duration) * 100;
			_setProgress(pct, formatTime(ct));

			// Fullscreen
			const fsOverlay = document.getElementById('fullscreen-overlay');
			if (fsOverlay && fsOverlay.classList.contains('active')) {
				const fsP = document.getElementById('fs-progress');
				const fsC = document.getElementById('fs-current-time');
				if (fsP && !_isFsSeekingGlobal) {
					fsP.value = pct;
					fsP.style.setProperty('--fs-progress-pct', pct.toFixed(2) + '%');
				}
				if (fsC && !_isFsSeekingGlobal) fsC.textContent = formatTime(ct);
			}
		}
	}
	_progressRafId = requestAnimationFrame(_updateProgressLoop);
}

audio.addEventListener("play",  () => { if (!_progressRafId) _updateProgressLoop(); });
audio.addEventListener("pause", () => { if (_progressRafId) { cancelAnimationFrame(_progressRafId); _progressRafId = null; } });
audio.addEventListener("ended", () => { if (_progressRafId) { cancelAnimationFrame(_progressRafId); _progressRafId = null; } });

audio.addEventListener("durationchange", () => {
	const fmt = audio.duration ? formatTime(audio.duration) : '0:00';
	_setDuration(fmt);
	const fsDur = document.getElementById('fs-duration');
	if (fsDur) fsDur.textContent = fmt;
});

// play/pause sync
audio.addEventListener("play", updateSongbarUI);
audio.addEventListener("pause", updateSongbarUI);
audio.addEventListener("ended", handleSongEnd);
audio.addEventListener('timeupdate', updateMediaSessionPositionState);
audio.addEventListener('durationchange', updateMediaSessionPositionState);
audio.addEventListener('ratechange', updateMediaSessionPositionState);
audio.addEventListener('seeked', updateMediaSessionPositionState);

// volume control
if (sb.volume) {
	sb.volume.value = audio.volume != null ? audio.volume : 0.8;
	sb.volume.addEventListener("input", (e) => {
		const v = parseFloat(e.target.value);
		if (!isNaN(v)) {
            audio.volume = v;
            updateVolumeUI(); // Update the gradient bar if needed
        }
	});
}

// --- Lyrics Manager ---
const LyricsManager = {
    container: document.getElementById('sidebar-lyrics'),
    fsContainer: document.getElementById('fullscreen-lyrics'), // New container
    currentLyrics: [], // Array of {time: float, text: string}
    isSynced: false,
    activeLineIndex: -1,

    async fetchLyrics(artist, title, duration) {
        this.renderLoading(); // Helper to show loading state in both
        this.currentLyrics = [];
        this.isSynced = false;
        this.activeLineIndex = -1;

        try {
            // Use search API to get candidates
            const query = `${title} ${artist}`;
            const url = `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Lyrics search failed');

            const results = await response.json();
            if (!results || results.length === 0) throw new Error('Lyrics not found');

            // Filter and Sort Candidates
            const validCandidates = results.filter(candidate => {
                // strict duration check (within 5 seconds) to avoid wrong versions
                if (duration && Math.abs(candidate.duration - duration) > 5) return false;
                return true;
            });

            if (validCandidates.length === 0) throw new Error('No matching lyrics found');

            // Helper to determine script type
            const getScriptType = (text) => {
                if (!text) return 'unknown';
                if (/[\u0900-\u097F]/.test(text)) return 'devanagari'; // Hindi
                if (/[\u0980-\u0DFF\u0E00-\u0E7F]/.test(text)) return 'other';
                return 'latin';
            };

            // Score candidates
            const scored = validCandidates.map(c => {
                const text = c.syncedLyrics || c.plainLyrics || "";
                const script = getScriptType(text);
                let score = 0;

                if (script === 'other') score = -1; // Reject
                else {
                    if (c.syncedLyrics) score += 10;
                    if (script === 'latin') score += 15; // High preference to Latin (English/Hinglish)
                    if (script === 'devanagari') score += 2; // Fallback to Devanagari
                }
                return { candidate: c, score };
            }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);

            if (scored.length === 0) throw new Error('No lyrics in supported language');

            const bestMatch = scored[0].candidate;

            if (bestMatch.syncedLyrics) {
                this.currentLyrics = this.parseLRC(bestMatch.syncedLyrics);
                this.isSynced = true;
                this.renderLyrics();
            } else if (bestMatch.plainLyrics) {
                this.renderPlain(bestMatch.plainLyrics);
            } else {
                throw new Error('No lyrics content');
            }
        } catch (e) {
            console.log("Lyrics fetch error:", e);
            this.renderError('Lyrics not available for this track.');
        }
    },

    parseLRC(lrc) {
        const lines = [];
        const regex = /^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

        lrc.split('\n').forEach(line => {
            const match = line.match(regex);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const milliseconds = parseInt(match[3].padEnd(3, '0'));
                const time = minutes * 60 + seconds + milliseconds / 1000;
                const text = match[4].trim();
                // if (text) lines.push({ time, text }); // Allow empty lines for spacing if needed
                lines.push({ time, text });
            }
        });
        return lines;
    },

    renderLoading() {
        const html = '<p class="lyrics-placeholder">Loading lyrics...</p>';
        if (this.container) this.container.innerHTML = html;
        if (this.fsContainer) this.fsContainer.innerHTML = html;
    },

    renderError(msg) {
        const html = `<p class="lyrics-placeholder">${msg}</p>`;
        if (this.container) this.container.innerHTML = html;
        if (this.fsContainer) this.fsContainer.innerHTML = html;
    },

    renderPlain(text) {
        const html = `<p class="lyrics-text">${text.replace(/\n/g, '<br>')}</p>`;
        if (this.container) this.container.innerHTML = html;
        if (this.fsContainer) this.fsContainer.innerHTML = html;
        this.isSynced = false;
    },

    renderLyrics() {
        if (!this.currentLyrics.length) return;

        // Generate HTML with onclick handlers
        // We use a global helper or attach listeners after interaction.
        // Best approach: simple onClick attribute calling a global helper or inline logic.
        // But cleaner to attach listeners if possible. Since we recreate string, simpler to use onclick attribute.
        // Let's create a global helper `seekToLyrics(time)` to keep it clean.

        const html = this.currentLyrics.map((line, index) =>
            `<p class="lyric-line"
                data-index="${index}"
                data-time="${line.time}"
                onclick="LyricsManager.seekTo(${line.time})">
                ${line.text || "&nbsp;"}
             </p>`
        ).join('');

        if (this.container) this.container.innerHTML = html;
        if (this.fsContainer) this.fsContainer.innerHTML = html;

        // Attach scroll listeners after rendering
        this.attachScrollListeners();
    },

    attachScrollListeners() {
        const containers = [this.container, this.fsContainer];

        containers.forEach(container => {
            if (!container) return;

            // Remove old listener if exists
            if (container._scrollListener) {
                container.removeEventListener('scroll', container._scrollListener);
            }

            // Create new listener
            const scrollListener = () => {
                container.classList.add('is-scrolling');

                // Clear old timeout
                if (container._scrollTimeout) clearTimeout(container._scrollTimeout);

                // Hide scrollbar after 1.5 seconds of no scrolling
                container._scrollTimeout = setTimeout(() => {
                    container.classList.remove('is-scrolling');
                }, 1500);
            };

            container._scrollListener = scrollListener;
            container.addEventListener('scroll', scrollListener, false);
        });
    },

    seekTo(time) {
        if (!audio) return;
        audio.currentTime = time;
        if (audio.paused) playSong();
        this.sync(time); // Immediate sync update
    },

    sync(currentTime) {
        if (!this.isSynced || !this.currentLyrics.length) return;

        // Find the line that matches current time
        let activeIndex = -1;
        for (let i = 0; i < this.currentLyrics.length; i++) {
            if (this.currentLyrics[i].time <= currentTime) {
                activeIndex = i;
            } else {
                break;
            }
        }

        if (activeIndex !== this.activeLineIndex) {
            this.updateActiveLine(activeIndex);
        }
    },

    startSyncLoop() {
        this.stopSyncLoop(); // Clear any existing loop
        const loop = () => {
            if (audio.paused || audio.ended) {
                this.stopSyncLoop();
                return;
            }
            this.sync(audio.currentTime);
            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    },

    stopSyncLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    },

    updateActiveLine(index) {
        this.activeLineIndex = index;
        this.highlightLine(this.container, index);
        this.highlightLine(this.fsContainer, index);
    },

    highlightLine(container, index) {
        if (!container) return;

        // Remove active class from all
        const allLines = container.querySelectorAll('.lyric-line');
        allLines.forEach(line => line.classList.remove('active-lyric', 'active'));

        if (index >= 0 && index < allLines.length) {
            const activeLine = allLines[index];
            activeLine.classList.add('active-lyric', 'active');

            // Only show scrollbar indicator on sidebar, not fullscreen (scrollbar is hidden there)
            const isFullscreen = container === this.fsContainer;
            if (!isFullscreen) {
                container.classList.add('is-scrolling');
            }

            // Scroll the container itself (not the page) to center the active line
            const containerHeight = container.clientHeight;
            const lineTop = activeLine.offsetTop;
            const lineHeight = activeLine.offsetHeight;

            // Better centering: position active line in middle of visible area
            const targetScrollTop = Math.max(0, lineTop - (containerHeight / 2) + (lineHeight / 2));

            // Use requestAnimationFrame for smoother scrolling
            requestAnimationFrame(() => {
                container.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
            });

            // Ensure scrollbar stays visible while actively syncing (sidebar only)
            if (!isFullscreen) {
                if (container._scrollTimeout) {
                    clearTimeout(container._scrollTimeout);
                }
                container._scrollTimeout = setTimeout(() => {
                    container.classList.remove('is-scrolling');
                }, 2000);
            }
        }
    }
};

// Hook into Audio Events
audio.addEventListener('play', () => {
    hasPlayed = true;
    LyricsManager.startSyncLoop();
    updateSongbarUI(); // Trigger UI update to refresh logo
});

audio.addEventListener('pause', () => {
    LyricsManager.stopSyncLoop();
    updateSongbarUI(); // update play/pause icons in both bars
});

audio.addEventListener('ended', () => {
    LyricsManager.stopSyncLoop();
});

// Seeking needs a manual update to start the loop if it was paused, or just update once
audio.addEventListener('seeked', () => {
    LyricsManager.sync(audio.currentTime);
});


// --- Player State ---
let isShuffle = false;
let isRepeat = false; // false = Loop Playlist (default behavior in nextSong), true = Repeat One Song
let hasPlayed = false;

// --- Shuffle & Repeat Handlers ---
if (sb.shuffle) {
    sb.shuffle.addEventListener("click", () => {
        isShuffle = !isShuffle;
        sb.shuffle.classList.toggle("active", isShuffle);
        // Optional: Reset shuffle order history if implemented
    });
}

if (sb.repeat) {
    sb.repeat.addEventListener("click", () => {
        isRepeat = !isRepeat;
        sb.repeat.classList.toggle("active", isRepeat);
        
        // Update Icon to show "1" if needed, or just glow for now
        // Currently just toggling active state for "Repeat One" vs "Repeat All" logic
        // If we want 3 states (Off, All, One), we need an integer state. 
        // For now: Inactive = Loop All (default), Active = Loop One.
    });
}

function handleSongEnd() {
    if (isRepeat) {
        // Repeat One
        audio.currentTime = 0;
        playSong();
    } else {
        // Normal Next (Shuffle checked inside nextSong)
        nextSong();
    }
}

function updateVolumeUI() {
    // Optional: Visual update for volume slider if customization is deeper
}

// initialize UI on load and when playlist renders
document.addEventListener("DOMContentLoaded", () => {
	updateSongbarUI();

    // --- Visualizer Manager ---
const VisualizerManager = window.VisualizerManager = {
    audioContext: null,
    source: null,
    visualizer: null,
    animationFrameRequest: null,
    presets: {},
    presetKeys: [],
    cycleInterval: null,
    isInitialized: false,

    init() {
        if (this.isInitialized) return;

        const hasButterchurn = typeof window.butterchurn !== 'undefined' && typeof window.butterchurnPresets !== 'undefined';
        const container = document.getElementById('canvas-container');
        if (!hasButterchurn || !container) {
            console.warn('Visualizer skipped: dependencies or container missing.');
            return;
        }

        // Initialize AudioContext
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();

        // Connect Audio Source
        // Note: connect only once to avoid errors
        if (!this.source) {
            this.source = this.audioContext.createMediaElementSource(audio);
            this.source.connect(this.audioContext.destination);
        }

        // Setup Canvas
        container.innerHTML = '<canvas id="viz-canvas"></canvas>';
        const canvas = document.getElementById('viz-canvas');
        
        // Resize canvas to fullscreen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Init Butterchurn
        this.visualizer = butterchurn.default.createVisualizer(this.audioContext, canvas, {
            width: canvas.width,
            height: canvas.height,
            pixelRatio: window.devicePixelRatio || 1,
            textureRatio: 1,
        });

        // Load Presets
        this.presets = butterchurnPresets.getPresets();
        this.presetKeys = Object.keys(this.presets);
        
        // Connect Source to Visualizer
        this.visualizer.connectAudio(this.source);

        // Load random initial preset
        this.loadRandomPreset();

        // Start Rendering
        this.startRenderLoop();
        this.startCycle();

        // Handle Resize (debounced)
        let _vizResizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(_vizResizeTimer);
            _vizResizeTimer = setTimeout(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                this.visualizer.setRendererSize(canvas.width, canvas.height);
            }, 200);
        });

        this.isInitialized = true;
        console.log("Visualizer initialized.");
    },

    loadRandomPreset() {
        const randomKey = this.presetKeys[Math.floor(Math.random() * this.presetKeys.length)];
        const preset = this.presets[randomKey];
        this.visualizer.loadPreset(preset, 2.7); // 2.7s blend time
    },

    startCycle() {
        if (this.cycleInterval) clearInterval(this.cycleInterval);
        this.cycleInterval = setInterval(() => {
            this.loadRandomPreset();
        }, 15000); // Cycle every 15 seconds
    },

    startRenderLoop() {
        const render = () => {
             if (document.hidden) {
                 // Tab hidden — pause the render loop, resume on visibility change
                 const onVisible = () => {
                     if (!document.hidden) {
                         document.removeEventListener('visibilitychange', onVisible);
                         this.startRenderLoop(); // Restart
                     }
                 };
                 document.addEventListener('visibilitychange', onVisible);
                 return;
             }
             this.animationFrameRequest = requestAnimationFrame(render);
             this.visualizer.render();
        };
        render();
    },

    resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
};

// --- Mobile Mobile Toggle Logic ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const navItems = document.querySelectorAll('.nav-item');

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Close when clicking a nav item
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                }
            });
        });
    }

    const globalBackBtn = document.getElementById('global-back-btn');
    // globalBackBtn listener is attached separately below (line ~2074)

	// If you render playlist elsewhere, call renderPlaylist(); but existing code exposes that.
});

// Also update UI when playlist or songs array changes (if refreshSongs used)
const origRefresh = window.music && window.music.refreshSongs;
if (origRefresh) {
	window.music.refreshSongs = async function (...args) {
		const res = await origRefresh(...args);
		updateSongbarUI();
		return res;
	};
}

// Auto-load songs from local /songs/ index on script load
// Initial render
// renderPlaylist(); // Commented out to show Category Cards initially

// Expose the fetch helpers on the API
// Expose the fetch helpers on the API
// Small helper to return a shallow copy of songs (safe external access)
function getSongs() {
    return songs.slice();
}

// Expose the fetch helpers on the API
window.music = { songs, getSongs, refreshSongs, loadSong, playSong, pauseSong, nextSong, prevSong, renderPlaylist, loadCategory, renderHome, playHindiHits };

// --- Missing Player Functions ---
// --- Missing Player Functions ---
function playSong() {
    // Exit intro mode on first play — reveal sidebar & player bar
    if (document.body.classList.contains('intro-mode')) {
        document.body.classList.remove('intro-mode');
    }

    const player = document.querySelector('.music-player');
    if (player) {
        if (!player.classList.contains('active')) {
            player.classList.add('active');
        }
        player.classList.add('is-playing');
    }
    audio.play().catch(e => console.error("Play error:", e));

}

function pauseSong() {
    audio.pause();
    const player = document.querySelector('.music-player');
    if (player) player.classList.remove('is-playing');
}

function prevSong() {
    if (audio.currentTime > 3) {
        // If playing for more than 3 sec, restart song
        audio.currentTime = 0;
        return;
    }
    
    if (isShuffle) {
        // Pure random for now
        currentIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    }
    loadSong(currentIndex);
    playSong();
}

function nextSong() {
    if (isShuffle) {
         // Simple random implementation
         // Improved: prevent picking same song if possible
         let newIndex = Math.floor(Math.random() * songs.length);
         if (songs.length > 1 && newIndex === currentIndex) {
             newIndex = (newIndex + 1) % songs.length;
         }
         currentIndex = newIndex;
    } else {
        currentIndex = (currentIndex + 1) % songs.length;
    }
    loadSong(currentIndex);
    playSong();
}

registerMediaSessionHandlers();

const _baseLoadSongForMediaSession = loadSong;
loadSong = function(index) {
    const result = _baseLoadSongForMediaSession(index);
    syncMediaSession();
    queueMicrotask(() => syncMediaSession());
    return result;
};

const _baseUpdateSongbarUIForMediaSession = updateSongbarUI;
updateSongbarUI = function() {
    const result = _baseUpdateSongbarUIForMediaSession();
    syncMediaSession();
    return result;
};

const _basePlaySongForMediaSession = playSong;
playSong = function() {
    const result = _basePlaySongForMediaSession();
    document.querySelector('.music-player')?.classList.add('media-session-ready');
    syncMediaSession();
    return result;
};

const _basePauseSongForMediaSession = pauseSong;
pauseSong = function() {
    const result = _basePauseSongForMediaSession();
    syncMediaSession();
    return result;
};





// --- Search Functionality ---
// NOTE: Search is handled by the global IIFE at the bottom of this file (initSearch)
// which provides debounced local + online search with proper deduplication.
const searchInput = document.getElementById('song-search');
const searchResultsContainer = document.getElementById('search-results');


function renderSearchResults(results) {
    // Ensure container exists before adding to it
    if (!searchResultsContainer) return;

    if (results.length === 0) {
        searchResultsContainer.innerHTML = `<div style="padding: 15px; color: #aaa; text-align: center;">No result match</div>`;
        searchResultsContainer.classList.add('active');
        return;
    }

    searchResultsContainer.innerHTML = '';
    results.forEach(song => {
        const globalIndex = songs.indexOf(song);
        const item = document.createElement('div');
        item.className = 'search-result-item';

        // Create image element
        const imgElement = document.createElement('img');
        imgElement.className = 'search-img';
        imgElement.alt = song.title;
        imgElement.src = 'IMAGES/logoo.png'; // Default initially
        imgElement.onerror = function() {
            this.onerror = null;
            this.src = 'IMAGES/logoo.png';
        };

        // Fetch album art from iTunes API
        fetchAlbumArt(song.title, song.artist).then(artworkUrl => {
            if (artworkUrl) {
                // Use smaller version for search results (200x200)
                imgElement.src = artworkUrl.replace('600x600', '200x200');
            } else if (song.art) {
                imgElement.src = song.art;
            }
        }).catch(() => {
            if (song.art) {
                imgElement.src = song.art;
            }
        });

        item.innerHTML = `
            <div class="search-info">
                <div class="search-title">${song.title}</div>
                <div class="search-artist">${song.artist}</div>
            </div>
        `;

        // Insert image at the beginning
        item.insertBefore(imgElement, item.firstChild);

        item.addEventListener('click', () => {
             playSongAtIndex(globalIndex);
             searchResultsContainer.classList.remove('active');
             searchInput.value = ''; // Optional: clear search after selection
        });

        searchResultsContainer.appendChild(item);
    });

    searchResultsContainer.classList.add('active');
}

// Global Back Button Logic
const globalBackBtn = document.getElementById('global-back-btn');
if (globalBackBtn) {
    globalBackBtn.addEventListener('click', () => {
        // If we are in a song list view (title exists in header), go home
        const songListHeader = document.querySelector('.song-list-header h2');
        if (songListHeader) {
            renderHome();
        }
    });
}

// --- LYRICS FUNCTIONALITY ---
async function fetchLyrics(artist, title) {
    const lyricsContainer = document.getElementById('sidebar-lyrics');
    if (!lyricsContainer) return;

    lyricsContainer.innerHTML = '<p class="lyrics-placeholder">Searching lyrics for<br>' + title + '...</p>';

    // Clean up strings for better API matching
    // Remove "ft.", "feat", text in brackets, etc to get raw artist/title
    // Also remove everything after " - " if present (often used for subtitles in filenames)
    let cleanArtist = artist.split(',')[0].split('&')[0].replace(/\(.*\)/g, "").trim();
    let cleanTitle = title.replace(/\(.*\)/g, "").replace(/ft\..*/i, "").replace(/feat\..*/i, "").split('-')[0].trim();

    console.log(`Fetching lyrics for: ${cleanArtist} - ${cleanTitle}`);

    // LOCAL FALLBACK FOR TESTING (Since API might miss these)
    const LOCAL_LYRICS = {
        "love story": "We were both young when I first saw you\nI close my eyes and the flashback starts\nI'm standing there\nOn a balcony in summer air...",
        "tum hi ho": "Hum tere bin ab reh nahi sakte\nTere bina kya wajood mera\nTujhse juda gar ho jaayenge\nToh khud se hi ho jaayenge juda...",
        "apna bana le": "Tu mera koi na hoke bhi kuch laage\nTu mera koi na hoke bhi kuch laage\nKiya re jo bhi toone kaise kiya re\nJiya ko mere baandh aise liya re...",
        "peaches": "I got my peaches out in Georgia (oh, yeah, shit)\nI get my weed from California (that's that shit)\nI took my chick up to the North, yeah (badass bitch)\nI get my light right from the source, yeah (yeah, that's it)...",
        "stay": "I do the same thing I told you that I never would\nI told you I'd change, even when I knew I never could\nI know that I can't find nobody else as good as you\nI need you to stay, need you to stay, hey...",
        "ae dil hai mushkil": "Tu safar mera\nHai tu hi meri manzil\nTere bina guzara\nAe dil hai mushkil...",
        "agar tum saath ho": "Pal bhar theher jaao\nDil ye sambhal jaaye\nKaise tumhe roka karun\nMeri taraf aata har gham phisal jaaye\nAankhon mein tum ko bharun...",
        "bulleya": "Meri rooh ka parinda phadphadaye\nLekin sukoon ka jazeera mil na paaye\nVe ki karaan ve ki karaan...",
        "chaleya": "Ishq mein dil bana hai\nIshq mein dil fanaa hai\nMita de ya bana de\nMaine tujhko chuna hai...",
        "khairiyat": "Khairiyat pucho, kabhi to kaifiyat pucho\nTumhare bin deewane ka kya haal hai\nDil mera dekho, na meri haisiyat pucho\nTere bin ek din jaise sau saal hai...",
        "mast magan": "Ishq khudara\nHai tu hi sahara\nTere bina guzara\nAe dil hai mushkil...",
        "qaafirana": "In waadiyon mein takra chuke hain\nHumse musafir yun to kayi\nDil na lagaya humne kisi se\nQisse sune hain yun to kayi...",
        "raabta": "Kehte hain khuda ne iss jahan mein\nSabhi ke liye kisi na kisi ko hai banaya\nHar kisi ke liye...",
        "sanam re": "O ho...\nBheegi bheegi sadkon pe main\nTera intezaar karun\nDheere dheere dil ki zameen ko\nTere hi naam karun...",
        "satranga": "Aadha tera, aadha mera\nEk dil poora ho gaya\nTu bhi aadha, main bhi aadha\nEk dil poora ho gaya...",
        "shayad": "Shayad kabhi na keh sakoon main tumko\nKahe bina samajh lo tum shayad\nShayad mere khayal mein tum ek din\nMilo mujhe kahin pe gum shayad...",
        "tera yaar hoon main": "Tu jo rootha toh kaun hansega\nTu jo choota toh kaun rahega\nTu chup hai toh ye darr lagta hai\nApna mujhko ab kaun kahega...",
        "tujhe kitna chahne lage": "Dil ka dariya beh hi gaya\nIshq ibadat ban hi gaya\nKhud ko mujhe tu sonp de\nMeri zaroorat tu ban gaya...",
        "zaalima": "Jo teri khatir tadpe pehle se hi\nKya usse tadpana o zaalima, o zaalima\nJo tere ishq mein behka pehle se hi\nKya usse behkana o zaalima, o zaalima...",
        "52 bars": "Yeah! Karan Aujla!\nIkky!\nCheck correct!\nStart countin' 52 bars...",
        "admirin you": "You got me admirin' you\nAdmirin' you\nLook at how you walkin'...",
        "softly": "Softly softly\nKehndi touch me softly\nHale nava nava\nMamla tu handle kar softly...",
        "winning speech": "Winning speech!\nKaran Aujla!\nGeetan di machine!\nYeah yeah..."
    };

    const lowerTitle = cleanTitle.toLowerCase();
    if (LOCAL_LYRICS[lowerTitle]) {
        console.log("Using local lyrics for: " + cleanTitle);
        lyricsContainer.innerHTML = `<div class="lyrics-text"><h3>${title}</h3><br>${LOCAL_LYRICS[lowerTitle].replace(/\n/g, '<br>')}</div>`;
        return;
    }

    try {
        // Try with strict matching first
        let response = await fetch(`https://api.lyrics.ovh/v1/${cleanArtist}/${cleanTitle}`);
        let data = await response.json();

        if (data.lyrics) {
            lyricsContainer.innerHTML = `<div class="lyrics-text"><h3>${title}</h3><br>${data.lyrics.replace(/\n/g, '<br>')}</div>`;
        } else {
             lyricsContainer.innerHTML = `<p class="lyrics-placeholder">Lyrics not found for<br>"${cleanTitle}"<br><br><small>Try playing a popular English song.</small></p>`;
        }
    } catch (error) {
        console.error("Lyrics fetch error:", error);
         lyricsContainer.innerHTML = '<p class="lyrics-error">Network error: Could not load lyrics.</p>';
    }
}

// --- 3D BIO-TECH BACKGROUND ---
document.addEventListener("DOMContentLoaded", initThreeJS);

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return; // Wait for element + lib

    const scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2(0x050b14, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- LIGHTING ---
    const ambLight = new THREE.AmbientLight(0x000000); // Dark ambient
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0x00ffff, 1.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x0088ff, 2, 50);
    blueLight.position.set(-20, 0, 10);
    scene.add(blueLight);

    // --- MOUSE TRACKING ---
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.01;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.01;
    });

    const group = new THREE.Group();
    scene.add(group);


    // --- ANIMATION ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Parallax Interaction
        const targetX = (mouseX * 50); // Amplify mouse range
        const targetY = (mouseY * 30);
        group.position.x += (targetX - group.position.x) * 0.02;
        group.position.y += (-targetY - group.position.y) * 0.02;

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    initTiltEffect(); // Ensure tilt exists
}

// (3D Background removed by user request)


// --- 3D Card Tilt Effect ---
function initTiltEffect() {
    const cards = document.querySelectorAll('.music-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', handleHover);
        card.addEventListener('mouseleave', resetCard);
        card.addEventListener('mouseenter', enterCard);
    });

    function enterCard() {
        this.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
    }

    function handleHover(e) {
        const card = this;
        const width = card.offsetWidth;
        const height = card.offsetHeight;
        const rect = card.getBoundingClientRect();

        const xVal = e.clientX - rect.left;
        const yVal = e.clientY - rect.top;

        // Max rotation = 15deg
        const yRotation = 15 * ((xVal - width / 2) / width);
        const xRotation = -15 * ((yVal - height / 2) / height);

        const str = `perspective(1000px) scale(1.05) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        card.style.transform = str;
    }

    function resetCard() {
        this.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease';
        this.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
    }
}

// --- 3D Realistic Earth Background ---
function init3DEarth() {
    if (typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();

    // Camera close to earth to see horizon curvature
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Append securely beneath UI
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '-9';
    document.body.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const textureLoader = new THREE.TextureLoader();

    // 1. Earth Sphere
    const r = 20;
    const earthGeo = new THREE.SphereGeometry(r, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'),
        bumpMap: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png'),
        bumpScale: 0.15,
        specularMap: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-water.png'),
        specular: new THREE.Color('grey'),
        shininess: 15,
        emissiveMap: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg'),
        emissive: new THREE.Color(0xFFFFFF),
        emissiveIntensity: 0.2 // Night lights glow subtly
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // 2. Clouds Sphere
    const cloudGeo = new THREE.SphereGeometry(r + 0.15, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
        map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
        depthWrite: false
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // 3. Atmospheric Glow
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * 1.5;
      }
    `;

    const atmosGeo = new THREE.SphereGeometry(r + 1.2, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmosMesh);

    // 4. Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5); // Bright sun
    sunLight.position.set(-40, 20, -20); // Sun coming from the top left
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x0c0c0c); // Even darker shadowed side for dramatic contrast
    scene.add(ambientLight);

    // Sun Sprite (Lens Flare / Glow)
    const sunCanvas = document.createElement('canvas');
    sunCanvas.width = 128; sunCanvas.height = 128;
    const sunCtx = sunCanvas.getContext('2d');
    const sunGradient = sunCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    sunGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sunGradient.addColorStop(0.2, 'rgba(255, 210, 130, 0.9)');
    sunGradient.addColorStop(1, 'rgba(255, 210, 130, 0)');
    sunCtx.fillStyle = sunGradient;
    sunCtx.fillRect(0, 0, 128, 128);

    const sunMat = new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(sunCanvas),
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    const sunSprite = new THREE.Sprite(sunMat);
    sunSprite.scale.set(60, 60, 1);
    sunSprite.position.set(-50, 25, -25); // Set the sun burst behind the left side
    scene.add(sunSprite);

    // 5. Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 3000; // Increased star density for deeper space feel
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount*3; i++) {
        starPos[i] = (Math.random() - 0.5) * 600;
        starPos[i+1] = (Math.random() - 0.5) * 600;
        starPos[i+2] = -Math.random() * 500 - 150; // Push stars further back
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({color: 0xffffff, size: 0.6, transparent: true, opacity: 0.7});
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 6. Positioning - Shifted Earth to the right side of the screen
    earthGroup.position.set(18, -2, -32); // Positioned to dominate the right periphery
    earthMesh.rotation.y = 1.0; // Start with America / Atlantic view
    earthMesh.rotation.x = 0.3; // Slight tilt
    cloudMesh.rotation.y = 1.0;

    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, -32); // Looking relatively straight ahead

    // Mouse Tracking for Parallax
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);

        // Rotate Earth slowly for that monolithic feel
        earthMesh.rotation.y += 0.0003;
        cloudMesh.rotation.y += 0.0004;

        // Dynamic camera parallax (sweeping view)
        camera.position.x += (mouseX * 8 - camera.position.x) * 0.03;
        camera.position.y += (-mouseY * 4 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, -32);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        // STEP 1: SANITIZE all image URLs BEFORE rendering anything
        sanitizeSongsArt();

        // STEP 2: (Disabled) — Always start fresh on page load
        // restoreSavedSong();

        // STEP 3: Safely render UI
        safeRenderHome();
        updateSongbarUI();
        init3DEarth();
    } catch (e) {
        console.error("❌ Initialization error:", e);
        document.body.innerHTML = '<div style="color: white; padding: 20px; background: #000; text-align: center;">Error loading player. Please refresh the page.</div>';
    }
});



// --- Full Screen Overlay Logic ---
const fsOverlay = document.getElementById('fullscreen-overlay');
const expandBtn = document.getElementById('expand-btn');
const fsCloseBtn = document.getElementById('fs-close');
const mobileMiniExpandBtn = document.getElementById('mobile-mini-expand');
const mobileMiniPlayBtn = document.getElementById('mobile-mini-play');

function setFullscreenState(isOpen) {
    if (!fsOverlay) return;
    fsOverlay.classList.toggle('active', !!isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
        // Re-sync lyrics position in fullscreen after it becomes visible
        requestAnimationFrame(() => {
            LyricsManager.sync(audio.currentTime || 0);
            if (LyricsManager.fsContainer && LyricsManager.activeLineIndex >= 0) {
                LyricsManager.highlightLine(LyricsManager.fsContainer, LyricsManager.activeLineIndex);
            }
        });
    }
}

function bindPressAction(element, key, handler) {
    if (!element || element.dataset[key]) return;
    element.dataset[key] = '1';

    let lastTouchLikePress = 0;

    // Mobile reliability: handle direct touch/pointer release and bypass delayed click quirks.
    element.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'mouse') return;
        event.preventDefault();
        lastTouchLikePress = Date.now();
        handler(event);
    }, { passive: false });

    element.addEventListener('click', (event) => {
        if (Date.now() - lastTouchLikePress < 350) return;
        handler(event);
    });

    // iOS fallback where click/pointer synthesis can be inconsistent in overlays.
    element.addEventListener('touchend', (event) => {
        if (Date.now() - lastTouchLikePress < 350) return;
        event.preventDefault();
        lastTouchLikePress = Date.now();
        handler(event);
    }, { passive: false });
}

// Toggle Overlay
if (expandBtn && fsOverlay) {
    bindPressAction(expandBtn, 'fsOpenBound', () => {
        setFullscreenState(true);
    });
}

if (fsCloseBtn && fsOverlay) {
    bindPressAction(fsCloseBtn, 'fsCloseBound', () => {
        setFullscreenState(false);
    });
}

if (mobileMiniExpandBtn && fsOverlay) {
    bindPressAction(mobileMiniExpandBtn, 'mobileFsOpenBound', () => {
        setFullscreenState(true);
    });
}

if (mobileMiniPlayBtn) {
    bindPressAction(mobileMiniPlayBtn, 'mobileMiniPlayBound', () => {
        if (audio.paused) {
            playSong();
        } else {
            pauseSong();
        }
        if (typeof updateSongbarUI === 'function') updateSongbarUI();
    });
}

// Controls
const fsControls = {
    play: document.getElementById('fs-play'),
    prev: document.getElementById('fs-prev'),
    next: document.getElementById('fs-next'),
    progress: document.getElementById('fs-progress'),
    current: document.getElementById('fs-current-time'),
    duration: document.getElementById('fs-duration')
};

if (fsControls.play) {
    bindPressAction(fsControls.play, 'fsPlayBound', () => {
        if (audio.paused) {
            playSong();
            // icon updates via audio 'play' event
        } else {
            pauseSong();
            // icon updates via audio 'pause' event
        }
        updateSongbarUI();
    });
}

if (fsControls.prev) {
    bindPressAction(fsControls.prev, 'fsPrevBound', () => {
        prevSong();
        updateSongbarUI();
    });
}

if (fsControls.next) {
    bindPressAction(fsControls.next, 'fsNextBound', () => {
        nextSong();
        updateSongbarUI();
    });
}

// Progress Bar Sync
if (fsControls.progress) {

    const updateFsProgressFill = (pct) => {
        fsControls.progress.style.setProperty('--fs-progress-pct', pct.toFixed(2) + '%');
    };

    fsControls.progress.addEventListener('mousedown', () => {
        _isFsSeekingGlobal = true;
    });
    fsControls.progress.addEventListener('touchstart', () => {
        _isFsSeekingGlobal = true;
    }, { passive: true });

    fsControls.progress.addEventListener('input', (e) => {
        _isFsSeekingGlobal = true;
        const percent = parseFloat(e.target.value);
        if (!isNaN(percent)) {
            updateFsProgressFill(percent);
            if (audio.duration) {
                const time = (percent / 100) * audio.duration;
                if (fsControls.current) fsControls.current.textContent = formatTime(time);
            }
        }
    });

    fsControls.progress.addEventListener('change', (e) => {
        const percent = parseFloat(e.target.value);
        if (!isNaN(percent) && audio.duration) {
            audio.currentTime = (percent / 100) * audio.duration;
            updateFsProgressFill(percent);
        }
        _isFsSeekingGlobal = false;
    });

    fsControls.progress.addEventListener('mouseup', (e) => {
        const percent = parseFloat(e.target.value);
        if (!isNaN(percent) && audio.duration) {
            audio.currentTime = (percent / 100) * audio.duration;
            updateFsProgressFill(percent);
        }
        _isFsSeekingGlobal = false;
    });

    // Sync updates from audio to FS progress
    audio.addEventListener('timeupdate', () => {
        if (!audio.duration || _isFsSeekingGlobal) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        fsControls.progress.value = pct;
        updateFsProgressFill(pct);
        if (fsControls.current) fsControls.current.textContent = formatTime(audio.currentTime);
    });

    // Sync duration
    audio.addEventListener('durationchange', () => {
         if (audio.duration && fsControls.duration) {
             fsControls.duration.textContent = formatTime(audio.duration);
         }
    });
}

// Global Scrollbar Visibility Logic
document.addEventListener('scroll', function (e) {
    if (e.target && e.target.classList) {
        e.target.classList.add('is-scrolling');

        // Clear previous timeout for this element
        if (e.target.scrollTimeout) clearTimeout(e.target.scrollTimeout);

        // Hide scrollbar after 1 second of no scrolling
        e.target.scrollTimeout = setTimeout(() => {
            e.target.classList.remove('is-scrolling');
        }, 1000);
    }
}, true); // Use capture phase to catch scroll events on any element


// --- 3D Music Card Class Component ---
class MusicCard {
    constructor(element) {
        this.element = element;
        this.bindEvents();
    }

    bindEvents() {
        this.element.addEventListener('mousemove', (e) => this.handleTilt(e));
        this.element.addEventListener('mouseleave', () => this.resetTilt());
    }

    handleTilt(e) {
        // Enqueue inside requestAnimationFrame for smooth execution
        requestAnimationFrame(() => {
            const rect = this.element.getBoundingClientRect();
            const xVal = e.clientX - rect.left;
            const yVal = e.clientY - rect.top;

            const width = rect.width;
            const height = rect.height;

            // Limit degrees for tasteful tilt
            const yRotation = 15 * ((xVal - width / 2) / width);
            const xRotation = -15 * ((yVal - height / 2) / height);

            this.element.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.02, 1.02, 1.02)`;
        });
    }

    resetTilt() {
        this.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
}

// --- State-Preserving SPA Navigation (History API) ---
const IvoryRouter = {
    init() {
        // Handle back/forward buttons
        window.addEventListener('popstate', () => this.handleRoute(location.pathname));

        // Attach to all local links
        document.querySelectorAll('a[data-link]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.currentTarget.getAttribute('href');
                history.pushState(null, '', route);
                this.handleRoute(route);
            });
        });
    },

    async handleRoute(route) {
        // The '#main-content' div updates, while the '#player-bar' stays untouched and keeps playing music.
        const mainContent = document.querySelector('.content-body');
        if (!mainContent) return;

        // CSS Fade Out
        mainContent.style.transition = 'opacity 0.2s ease';
        mainContent.style.opacity = 0;

        setTimeout(() => {
            // Mock View Replacement - this is where you'd fetch components or HTML snippets
            if (route === '/lyrics') {
                mainContent.innerHTML = '<h2>Synced Lyrics Engine</h2><p>Coming soon...</p>';
            } else if (route === '/artist') {
                mainContent.innerHTML = '<h2>Artist Profile</h2><p>Coming soon...</p>';
            } else if (route === '/') {
                // Should technically reload the home view
            }

            // CSS Fade In
            mainContent.style.opacity = 1;
        }, 200);
    }
};



// --- Web Audio Visualizer Data Loop ---
class AudioVisualizer {
    constructor(audioElement, canvasId) {
        this.audio = audioElement;
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();

        // Connect source only once
        if (!window.audioSourceNode) {
            window.audioSourceNode = this.audioCtx.createMediaElementSource(this.audio);
        }
        window.audioSourceNode.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.draw = this.draw.bind(this);
    }

    start() {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        this.draw();
    }

    draw() {
        requestAnimationFrame(this.draw); // Maintains 60fps link

        this.analyser.getByteFrequencyData(this.dataArray);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const barWidth = (this.canvas.width / this.bufferLength) * 2.5;
        let x = 0;

        // Fetch current UI accent variable dynamically
        const computedStyle = getComputedStyle(document.documentElement);
        const neonAccent = computedStyle.getPropertyValue('--neon-accent').trim() || '#32e0ff';

        for(let i = 0; i < this.bufferLength; i++) {
            const barHeight = this.dataArray[i] / 2;
            this.ctx.fillStyle = neonAccent;
            this.ctx.globalAlpha = 0.4; // Soft background glow

            this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
}

// Global visualizer instance
let ivoryVisualizer = null;

// Initialize systems securely on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.music-card').forEach(card => new MusicCard(card));
    IvoryRouter.init();

    // Auto-attach visualizer to existing global audio tag (assuming id='audio' implicitly or global variable 'audio')
    // Fallback ID selector if your layout assigns it
    const playerAudio = window.audio || document.querySelector('audio');

    // Create a background overlay canvas dynamically if missing
    let bgCanvas = document.getElementById('audio-visualizer');
    if (!bgCanvas) {
        bgCanvas = document.createElement('canvas');
        bgCanvas.id = 'audio-visualizer';
        bgCanvas.style.position = 'fixed';
        bgCanvas.style.bottom = '90px'; // Rest above playbar
        bgCanvas.style.left = '0';
        bgCanvas.style.width = '100%';
        bgCanvas.style.height = '150px';
        bgCanvas.style.zIndex = '50';
        bgCanvas.style.pointerEvents = 'none'; // Click through
        bgCanvas.style.opacity = '0.5';
        document.body.appendChild(bgCanvas);
    }

    // Fix DPI
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = 150;

    if (playerAudio) {
       ivoryVisualizer = new AudioVisualizer(playerAudio, 'audio-visualizer');
       // Auto-starts drawing loop on first play
       playerAudio.addEventListener('play', () => {
           if (ivoryVisualizer) ivoryVisualizer.start();
       });
    }
});

/* --- YOUTUBE CANVAS BACKGROUND --- */
const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY";
let ytPlayer = null;
let ytPlayerReady = false;

// Global callback for YouTube IFrame API
function onYouTubeIframeAPIReady() {
    ytPlayerReady = true;
    console.log("YouTube IFrame API Ready");
}

async function fetchYouTubeVideoId(artist, title) {
    if (YOUTUBE_API_KEY === "YOUR_YOUTUBE_API_KEY") {
        console.warn("Please enter YOUR_YOUTUBE_API_KEY to use the Spotify Canvas feature.");
        return;
    }

    const fsContainer = document.getElementById('fullscreen-overlay');
    const videoContainer = document.getElementById('fs-video-bg-container');

    try {
        const query = encodeURIComponent(`${title} ${artist} official music video 4k`);
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&type=video&key=${YOUTUBE_API_KEY}`);

        if (!res.ok) throw new Error("YouTube API Error.");

        const data = await res.json();

        if (data.items && data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            embedYouTubeVideo(videoId, videoContainer, fsContainer);
        } else {
            fallbackToBg(videoContainer, fsContainer);
        }
    } catch (error) {
        console.error("YouTube Canvas Fetch Error:", error);
        fallbackToBg(videoContainer, fsContainer);
    }
}

function embedYouTubeVideo(videoId, container, fsContainer) {
    if (!ytPlayerReady) {
        // Retry later if API isn't ready
        setTimeout(() => embedYouTubeVideo(videoId, container, fsContainer), 500);
        return;
    }

    if (ytPlayer) {
        // Player already exists, just load new video
        ytPlayer.loadVideoById(videoId);
        ytPlayer.mute();
        container.style.opacity = "1";
        fsContainer.classList.add('video-active');
        return;
    }

    // Initialize player
    container.innerHTML = `<div id="yt-player-placeholder"></div>`;
    ytPlayer = new YT.Player('yt-player-placeholder', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'modestbranding': 1,
            'loop': 1,
            'playlist': videoId, // Needed for looping in AS3/HTML5
            'mute': 1
        },
        events: {
            'onReady': (event) => {
                event.target.mute();
                event.target.playVideo();
                container.style.opacity = "1";
                fsContainer.classList.add('video-active');
            },
            'onStateChange': (event) => {
                // Keep it muted and playing if it tries to stop or loop
                if (event.data === YT.PlayerState.ENDED) {
                    event.target.playVideo();
                }
            },
            'onError': () => {
                fallbackToBg(container, fsContainer);
            }
        }
    });
}

function fallbackToBg(container, fsContainer) {
    container.style.opacity = "0";
    if (ytPlayer && ytPlayer.stopVideo) {
        ytPlayer.stopVideo();
    }
    fsContainer.classList.remove('video-active');
}

// ═══════════════════════════════════════════════════════════════════════════
//  IVORY SEARCH ENGINE — Local + Online (Multi-Language, Multi-API)
// ═══════════════════════════════════════════════════════════════════════════
const OnlineMusicEngine = {
    // Demo results for testing
    getDemoResults(q) {
        const demos = [
            {
                source: 'demo',
                trackName: 'Yellow',
                artistName: 'Coldplay',
                collectionName: 'Parachutes',
                streamUrl: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA=',
                fullStreamUrl: 'https://www.youtube.com/results?search_query=yellow+coldplay',
                artworkUrl: 'IMAGES/logoo.png',
                trackId: 'demo_1',
                duration: 240,
                quality: 'preview'
            },
            {
                source: 'demo',
                trackName: 'Shape of You',
                artistName: 'Ed Sheeran',
                collectionName: 'Divide',
                streamUrl: 'https://www.youtube.com/results?search_query=shape+of+you',
                fullStreamUrl: 'https://www.youtube.com/results?search_query=shape+of+you',
                artworkUrl: 'IMAGES/logoo.png',
                trackId: 'demo_2',
                duration: 233,
                quality: 'normal'
            }
        ];
        return demos.filter(d => d.trackName.toLowerCase().includes(q.toLowerCase()) || d.artistName.toLowerCase().includes(q.toLowerCase()));
    },

    // Fallback: YouTube search links (always works)
    async searchYoutube(q) {
        console.log('📺 YouTube fallback search:', q);
        return [{
            source: 'youtube',
            trackName: `🔍 Search YouTube: ${q}`,
            artistName: 'Public Search',
            collectionName: 'Click to find on YouTube',
            streamUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' audio')}`,
            fullStreamUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' audio')}`,
            artworkUrl: 'IMAGES/logoo.png',
            trackId: 'yt_' + Date.now(),
            duration: 180,
            quality: 'normal'
        }];
    },

    // iTunes with better error handling
    async searchiTunes(q) {
        try {
            console.log('🍎 iTunes search:', q);
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=10&media=music`;

            const response = await fetch(url);
            if (!response.ok) {
                console.log('iTunes:', response.status, 'status');
                return [];
            }

            const data = await response.json();
            if (!data?.results?.length) return [];

            const results = data.results
                .filter(t => t.trackName && t.previewUrl)
                .slice(0, 15)
                .map(t => ({
                    source: 'itunes',
                    trackName: t.trackName || 'Unknown',
                    artistName: t.artistName || 'Unknown',
                    collectionName: t.collectionName || '',
                    streamUrl: t.previewUrl,
                    fullStreamUrl: `https://music.apple.com/track/${t.trackId}`,
                    artworkUrl: (t.artworkUrl100 || '').replace('100x100', '600x600') || 'IMAGES/logoo.png',
                    trackId: 'it_' + t.trackId,
                    duration: Math.max(30, (t.trackTimeMillis || 180000) / 1000),
                    quality: 'preview'
                }));

            console.log(`✅ iTunes: ${results.length} tracks`);
            return results;
        } catch (e) {
            console.error('❌ iTunes error:', e.message);
            return [];
        }
    },

    // Master search
    async searchAll(q) {
        if (!q.trim()) return [];

        console.log('🌐 SEARCH START:', q);

        try {
            // First try iTunes
            const itunesResults = await this.searchiTunes(q);
            console.log('iTunes results:', itunesResults.length);

            if (itunesResults.length > 0) {
                console.log('✨ Found iTunes results!');
                return itunesResults;
            }

            // Then try demo
            const demoResults = this.getDemoResults(q);
            if (demoResults.length > 0) {
                console.log('📌 Using demo results for testing');
                return demoResults;
            }

            // Fallback to YouTube search
            console.log('⚠️ Falling back to YouTube search');
            return await this.searchYoutube(q);

        } catch (err) {
            console.error('❌ Search error:', err);
            return await this.searchYoutube(q);
        }
    }
};

(function initSearch() {
    const searchInput  = document.getElementById('song-search');
    const dropdown     = document.getElementById('search-results');
    if (!searchInput || !dropdown) return;

    // ── CRITICAL: Move dropdown to body so it escapes .main-view stacking context ──
    // On mobile, fixed elements that are DOM children of scroll containers
    // can have their touch events intercepted by underlying content.
    document.body.appendChild(dropdown);

    let debounceTimer  = null;
    let lastQuery      = '';
    let isLoading      = false;

    // ── Helpers ──────────────────────────────────────────
    const searchContainer = searchInput.closest('.search-container');

    function positionDropdown() {
        if (!searchContainer || !dropdown.classList.contains('active')) return;
        const rect = searchContainer.getBoundingClientRect();
        dropdown.style.top  = (rect.bottom + 8) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = Math.max(rect.width, 360) + 'px';
    }

    function showDropdown(html) {
        dropdown.innerHTML = html;
        dropdown.classList.add('active');
        positionDropdown();
    }

    function hideDropdown() {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        lastQuery = '';
    }

    // Reposition on scroll / resize so the fixed dropdown stays anchored
    const mainView = document.querySelector('.main-view');
    if (mainView) mainView.addEventListener('scroll', positionDropdown, { passive: true });
    window.addEventListener('resize', positionDropdown, { passive: true });

    function renderLoading() {
        showDropdown(`
            <div class="search-result-item" style="justify-content:center;gap:10px;pointer-events:none;color:#aaa;padding:20px">
                <div class="search-spinner"></div>
                <span style="font-size:0.85rem">Searching 200M+ songs across the internet...</span>
            </div>`);
    }

    function bindResultAction(item, handler) {
        // Simple click handler — works on both mobile and desktop.
        // Modern mobile browsers fire click on tap without 300ms delay
        // when touch-action:manipulation is set (which we have in CSS).
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handler();
        });

        // Keyboard accessibility
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
        });
    }

    function renderResults(localMatches, onlineTracks, query) {
        const hasLocal = Array.isArray(localMatches) && localMatches.length > 0;
        const hasOnline = Array.isArray(onlineTracks) && onlineTracks.length > 0;
        dropdown.innerHTML = '';

        if (hasLocal) {
            const hdr = document.createElement('div');
            hdr.innerHTML = divider('💿 Your Library');
            dropdown.appendChild(hdr);

            localMatches.forEach(({ s, i }) => {
                const { html, onClick } = buildItem({
                    imgSrc: s.art || 'IMAGES/logoo.png',
                    title:  s.title,
                    artist: s.artist,
                    sub:    s.folder,
                    source: 'local',
                    quality: 'full',
                    onClick: () => playLocalResult(i)
                });
                const el = document.createElement('div');
                el.innerHTML = html;
                const item = el.firstElementChild;
                item.style.cursor = 'pointer';
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
                bindResultAction(item, onClick);
                dropdown.appendChild(item);
            });
        }

        if (hasOnline) {
            const hdr = document.createElement('div');
            hdr.innerHTML = divider('🌐 Online Results · Stream Now');
            dropdown.appendChild(hdr);

            onlineTracks.slice(0, 20).forEach(t => {
                const { html, onClick } = buildItem({
                    imgSrc:   t.artworkUrl || 'IMAGES/logoo.png',
                    title:    t.trackName,
                    artist:   t.artistName,
                    sub:      t.collectionName,
                    source:   t.source,
                    quality:  t.quality,
                    onClick:  () => playOnlineResult(t)
                });
                const el = document.createElement('div');
                el.innerHTML = html;
                const item = el.firstElementChild;
                item.style.cursor = 'pointer';
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
                bindResultAction(item, onClick);
                dropdown.appendChild(item);
            });
        }

        if (!hasLocal && !hasOnline) {
            dropdown.innerHTML = `<div class="search-result-item" style="pointer-events:none;justify-content:center;padding:30px;color:#aaa;text-align:center">
                <div>
                    <div style="font-size:1.2em;margin-bottom:8px">🔍</div>
                    <div>No results found</div>
                    <div style="font-size:0.85rem;opacity:0.6;margin-top:4px">for "${escHtml(query)}"</div>
                </div>
            </div>`;
        }

        dropdown.classList.add('active');
        positionDropdown();
    }

    // ── Play a local song by its index in the global songs[] array ──
    function playLocalResult(globalIndex) {
        playSongAtIndex(globalIndex);
        hideDropdown();
        searchInput.blur();
    }

    // ── Inject an online track as a temporary song and play it ──
    function playOnlineResult(track) {
        console.log('🎵 Playing online track:', track.trackName);

        // Show toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        toast.innerHTML = `🎵 ${track.source === 'youtube' ? 'Opening YouTube...' : 'Opening stream...'}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);

        // For YouTube sources, just open the link - don't try to add to queue
        if (track.source === 'youtube') {
            console.log('📺 YouTube - opening link directly');
            window.open(track.streamUrl, '_blank');
            hideDropdown();
            searchInput.blur();
            return;
        }

        // For playable sources (iTunes, demo, etc.), add to queue and play
        const duration = track.duration || 180;
        const tempSong = {
            title:           track.trackName    || 'Unknown Title',
            artist:          track.artistName   || 'Unknown Artist',
            file:            track.streamUrl,
            art:             track.artworkUrl   || 'IMAGES/logoo.png',
            folder:          `🌐 ${track.source.toUpperCase()}`,
            durationFormatted: formatTime(duration),
            _isOnline:       true,
            _source:         track.source,
            _onlineId:       track.trackId,
            _fullLink:       track.fullStreamUrl || track.streamUrl
        };

        // Push to global songs array (avoid duplicates by source+ID)
        const existingIdx = songs.findIndex(s =>
            s._onlineId === tempSong._onlineId && s._source === tempSong._source
        );
        let targetIndex;
        if (existingIdx >= 0) {
            targetIndex = existingIdx;
            console.log('📌 Song already in queue, playing existing');
        } else {
            songs.push(tempSong);
            targetIndex = songs.length - 1;
            console.log('✅ Added online song to queue at index', targetIndex);
        }

        playSongAtIndex(targetIndex);
        hideDropdown();
        searchInput.blur();
    }

    // ── Build result items HTML ───────────────────────────
    function buildItem({ imgSrc, title, artist, sub, source, quality, onClick }) {
        const sourceEmoji = {
            'deezer': '🎵',
            'jiosaavn': '🇮🇳',
            'itunes': '🍎',
            'spotify': '🟢',
            'local': '💿'
        }[source] || '🌐';

        const qualityLabel = quality === 'preview' ? '30s' : quality === 'high' ? 'HQ' : 'FULL';

        const badge = `<span class="search-badge">${sourceEmoji} ${qualityLabel}</span>`;

        const playIcon = `<div class="search-play-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
            </svg>
        </div>`;

        return { html: `
            <div class="search-result-item">
                <img class="search-img" src="${imgSrc}" alt="" onerror="this.src='IMAGES/logoo.png'">
                <div class="search-info">
                    <div class="search-title">${escHtml(title)}</div>
                    <div class="search-artist">${escHtml(artist)}${sub ? ` · ${escHtml(sub)}` : ''}</div>
                </div>
                ${badge}
                ${playIcon}
            </div>`, onClick };
    }

    function escHtml(str) {
        return String(str || '').replace(/[&<>"']/g, m =>
            ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }

    // ── 1. Instant local filter ───────────────────────────
    function searchLocal(q) {
        if (!q) return [];
        const lq = q.toLowerCase();
        return songs
            .filter(s => !s._isOnline)
            .map((s, idx) => {
                const globalIdx = songs.indexOf(s);
                return { s, i: globalIdx };
            })
            .filter(({ s }) =>
                s.title?.toLowerCase().includes(lq) ||
                s.artist?.toLowerCase().includes(lq))
            .slice(0, 6);
    }

    // ── Section divider ───────────────────────────────────
    function divider(label) {
        return `<div style="
            padding:8px 15px 6px;font-size:0.75rem;font-weight:700;letter-spacing:.08em;
            text-transform:uppercase;color:rgba(255,255,255,0.5);
            border-bottom:1px solid rgba(255,255,255,.06);margin-top:4px">
            ${label}</div>`;
    }

    // ── Main search handler ───────────────────────────────
    async function doSearch(q) {
        if (!q.trim()) { hideDropdown(); return; }
        lastQuery = q;

        console.log('🔍 User search:', q);

        const localMatches = searchLocal(q);

        if (localMatches.length > 0) {
            renderResults(localMatches, [], q);
        } else {
            renderLoading();
        }

        try {
            isLoading = true;

            // Start online search in parallel
            const onlineTracks = await OnlineMusicEngine.searchAll(q);
            isLoading = false;

            // If query changed, discard
            if (q !== lastQuery) {
                console.log('Query changed, discarding old results');
                return;
            }

            console.log('📊 Search results - Local:', localMatches.length, 'Online:', onlineTracks.length);

            renderResults(localMatches, onlineTracks, q);

        } catch (err) {
            isLoading = false;
            console.error('❌ Search error:', err);

            if (localMatches.length > 0) {
                console.log('Showing local results only due to error');
                renderResults(localMatches, [], q);
            } else {
                dropdown.innerHTML = `<div class="search-result-item" style="pointer-events:none;justify-content:center;padding:20px;color:#aaa">
                    <span>⚠️ Search temporary unavailable, try again</span>
                </div>`;
                dropdown.classList.add('active');
                positionDropdown();
            }
        }
    }

    // ── Debounced input listener ──────────────────────────
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim();
        clearTimeout(debounceTimer);
        if (!q) { hideDropdown(); return; }
        debounceTimer = setTimeout(() => doSearch(q), 180);
    });

    // Focus reveals dropdown if something was typed
    searchInput.addEventListener('focus', () => {
        const q = searchInput.value.trim();
        if (q && dropdown.innerHTML) {
            dropdown.classList.add('active');
            positionDropdown();
        }
    });

    // Keyboard: Escape closes, Enter searches
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Escape') { hideDropdown(); searchInput.blur(); }
        if (e.key === 'Enter') {
            const q = searchInput.value.trim();
            if (q) {
                clearTimeout(debounceTimer);
                doSearch(q);
            }
        }
    });

    // Click outside closes — check both search container AND the dropdown itself
    document.addEventListener('click', e => {
        if (!e.target.closest('.search-container') && !e.target.closest('#search-results')) {
            hideDropdown();
        }
    });

    console.log('✅ Global search initialized - Ready to search 200M+ songs!');

})(); // end initSearch

(function initMobileProfessionalUX() {
    const MOBILE_QUERY = '(max-width: 768px)';
    let initialized = false;

    const isCoarsePointer = () => {
        try {
            return window.matchMedia('(pointer: coarse)').matches;
        } catch (e) {
            return false;
        }
    };

    const isMobileMode = () => {
        try {
            return window.matchMedia(MOBILE_QUERY).matches && (isCoarsePointer() || navigator.maxTouchPoints > 0);
        } catch (e) {
            return false;
        }
    };

    function ensureRelativePosition(target) {
        const style = window.getComputedStyle(target);
        if (style.position === 'static') {
            target.style.position = 'relative';
        }
    }

    function spawnTapRipple(target, clientX, clientY) {
        if (!target) return;
        ensureRelativePosition(target);

        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'mobile-tap-ripple';
        ripple.style.left = `${clientX - rect.left}px`;
        ripple.style.top = `${clientY - rect.top}px`;
        target.appendChild(ripple);

        window.setTimeout(() => {
            if (ripple && ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 560);
    }

    function setupHeaderScrollState() {
        const contentBody = document.querySelector('.content-body');
        const topHeader = document.querySelector('.top-header');
        if (!contentBody || !topHeader) return;

        const updateHeader = () => {
            topHeader.classList.toggle('is-scrolled', contentBody.scrollTop > 10);
        };

        contentBody.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    function setupTouchInteractions() {
        const rippleSelectors = [
            '.music-card',
            '.song-list-row',
            '.pill',
            '.icon-btn',
            '.play-btn-main',
            '.circle-btn',
            '.search-result-item'
        ].join(', ');

        document.addEventListener('pointerdown', (event) => {
            if (event.pointerType === 'mouse') return;

            const target = event.target.closest(rippleSelectors);
            if (!target) return;

            spawnTapRipple(target, event.clientX, event.clientY);

            if (target.classList.contains('music-card')) {
                target.classList.add('mobile-pressed');
                window.setTimeout(() => target.classList.remove('mobile-pressed'), 180);
            }
        }, { passive: true });
    }

    function enableMobileProfessionalMode() {
        if (initialized) return;
        if (!isMobileMode()) return;

        initialized = true;
        document.body.classList.add('mobile-pro-enhanced');
        setupHeaderScrollState();
        setupTouchInteractions();
    }

    document.addEventListener('DOMContentLoaded', enableMobileProfessionalMode, { once: true });

    window.addEventListener('resize', () => {
        if (!initialized && isMobileMode()) {
            enableMobileProfessionalMode();
        }
    }, { passive: true });
})();

(function initMobileLyricsEnhancer() {
    const MOBILE_QUERY = '(max-width: 768px)';
    const STORAGE_SCALE = 'ivory_mobile_lyrics_scale';
    const STORAGE_FOCUS = 'ivory_mobile_lyrics_focus';
    const MIN_SCALE = 0.88;
    const MAX_SCALE = 1.24;
    const STEP = 0.04;

    let scale = 1;
    let focusMode = false;

    function isMobile() {
        try {
            return window.matchMedia(MOBILE_QUERY).matches;
        } catch (e) {
            return false;
        }
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function loadPrefs() {
        try {
            const savedScale = parseFloat(localStorage.getItem(STORAGE_SCALE));
            if (!Number.isNaN(savedScale)) scale = clamp(savedScale, MIN_SCALE, MAX_SCALE);
            focusMode = localStorage.getItem(STORAGE_FOCUS) === '1';
        } catch (e) {
            scale = 1;
            focusMode = false;
        }
    }

    function savePrefs() {
        try {
            localStorage.setItem(STORAGE_SCALE, String(scale));
            localStorage.setItem(STORAGE_FOCUS, focusMode ? '1' : '0');
        } catch (e) {
            // ignore storage failures
        }
    }

    function applyPrefs(container, focusBtn) {
        if (container) container.style.setProperty('--mobile-lyrics-scale', scale.toFixed(2));
        document.body.classList.toggle('mobile-lyrics-focus', focusMode);
        if (focusBtn) focusBtn.setAttribute('aria-pressed', focusMode ? 'true' : 'false');
    }

    function centerActiveLyric() {
        if (!window.LyricsManager || !LyricsManager.container) return;
        if (LyricsManager.activeLineIndex < 0) return;
        LyricsManager.highlightLine(LyricsManager.container, LyricsManager.activeLineIndex);
    }

    function buildToolbar() {
        const wrapper = document.querySelector('.sidebar .lyrics-scroll-wrapper');
        const container = document.querySelector('.sidebar #sidebar-lyrics');
        if (!wrapper || !container) return;
        if (wrapper.querySelector('.lyrics-mobile-tools')) return;

        const tools = document.createElement('div');
        tools.className = 'lyrics-mobile-tools';
        tools.innerHTML = [
            '<button type="button" class="tool-btn" data-tool="minus" aria-label="Smaller lyrics">A-</button>',
            '<button type="button" class="tool-btn" data-tool="plus" aria-label="Larger lyrics">A+</button>',
            '<div class="tool-spacer"></div>',
            '<button type="button" class="tool-btn" data-tool="center" aria-label="Center active lyric">Center</button>',
            '<button type="button" class="tool-btn" data-tool="focus" aria-pressed="false" aria-label="Focus mode">Focus</button>'
        ].join('');

        wrapper.insertBefore(tools, wrapper.firstChild);

        const focusBtn = tools.querySelector('[data-tool="focus"]');
        applyPrefs(container, focusBtn);

        tools.addEventListener('click', (event) => {
            const btn = event.target.closest('.tool-btn');
            if (!btn) return;

            const tool = btn.getAttribute('data-tool');
            if (tool === 'minus') {
                scale = clamp(scale - STEP, MIN_SCALE, MAX_SCALE);
            } else if (tool === 'plus') {
                scale = clamp(scale + STEP, MIN_SCALE, MAX_SCALE);
            } else if (tool === 'center') {
                centerActiveLyric();
                return;
            } else if (tool === 'focus') {
                focusMode = !focusMode;
            }

            savePrefs();
            applyPrefs(container, focusBtn);
        });

        let lastTapAt = 0;
        container.addEventListener('pointerdown', (event) => {
            if (event.pointerType === 'mouse') return;
            const now = Date.now();
            if (now - lastTapAt < 320) {
                focusMode = !focusMode;
                savePrefs();
                applyPrefs(container, focusBtn);
            }
            lastTapAt = now;
        }, { passive: true });
    }

    function init() {
        if (!isMobile()) return;
        loadPrefs();
        buildToolbar();
    }

    document.addEventListener('DOMContentLoaded', init, { once: true });
})();

(function initMobileModeControls() {
    const isMobile = () => !!(window.matchMedia && window.matchMedia('(max-width: 768px)').matches);

    const syncModeClasses = () => {
        if (!isMobile()) return;
        const shuffleBtn = document.getElementById('sb-shuffle');
        const repeatBtn = document.getElementById('sb-repeat');
        const fsOverlay = document.getElementById('fullscreen-overlay');

        document.body.classList.toggle('mode-shuffle-on', !!(shuffleBtn && shuffleBtn.classList.contains('active')));
        document.body.classList.toggle('mode-repeat-on', !!(repeatBtn && repeatBtn.classList.contains('active')));
        document.body.classList.toggle('mode-fullscreen-on', !!(fsOverlay && fsOverlay.classList.contains('active')));
    };

    const addReshufflePulse = () => {
        const player = document.querySelector('.music-player');
        if (!player) return;
        player.classList.remove('reshuffle-flash');
        void player.offsetWidth;
        player.classList.add('reshuffle-flash');
        setTimeout(() => player.classList.remove('reshuffle-flash'), 540);
    };

    const bind = () => {
        const shuffleBtn = document.getElementById('sb-shuffle');
        const repeatBtn = document.getElementById('sb-repeat');
        const expandBtn = document.getElementById('expand-btn');
        const fsClose = document.getElementById('fs-close');
        const fsOverlay = document.getElementById('fullscreen-overlay');

        if (shuffleBtn && !shuffleBtn.dataset.mobileModeBound) {
            let lastTap = 0;
            shuffleBtn.dataset.mobileModeBound = '1';
            shuffleBtn.addEventListener('click', () => {
                const now = Date.now();
                const isQuickSecondTap = now - lastTap < 420;
                lastTap = now;

                if (isQuickSecondTap && shuffleBtn.classList.contains('active') && typeof nextSong === 'function') {
                    addReshufflePulse();
                    nextSong();
                    if (typeof updateSongbarUI === 'function') updateSongbarUI();
                }
                requestAnimationFrame(syncModeClasses);
            });
        }

        if (repeatBtn && !repeatBtn.dataset.mobileModeBound) {
            repeatBtn.dataset.mobileModeBound = '1';
            repeatBtn.addEventListener('click', () => requestAnimationFrame(syncModeClasses));
        }

        if (expandBtn && !expandBtn.dataset.mobileModeBound) {
            expandBtn.dataset.mobileModeBound = '1';
            expandBtn.addEventListener('click', () => {
                expandBtn.classList.add('active');
                requestAnimationFrame(syncModeClasses);
            });
        }

        if (fsClose && !fsClose.dataset.mobileModeBound) {
            fsClose.dataset.mobileModeBound = '1';
            fsClose.addEventListener('click', () => {
                const btn = document.getElementById('expand-btn');
                if (btn) btn.classList.remove('active');
                requestAnimationFrame(syncModeClasses);
            });
        }

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            if (!fsOverlay || !fsOverlay.classList.contains('active')) return;
            const btn = document.getElementById('expand-btn');
            if (btn) btn.classList.remove('active');
            requestAnimationFrame(syncModeClasses);
        });

        syncModeClasses();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind, { once: true });
    } else {
        bind();
    }
})();

// ── PWA SERVICE WORKER REGISTRATION & INSTALL BANNER ────────────────────────
(function initPWAInstallation() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('✅ ServiceWorker registered successfully with scope: ', reg.scope))
                .catch(err => console.warn('❌ ServiceWorker registration failed: ', err));
        });
    }

    let deferredPrompt = null;
    const banner = document.getElementById('pwa-install-banner');
    const installBtn = document.getElementById('pwa-install-btn');
    const closeBtn = document.getElementById('pwa-close-btn');

    if (!banner || !installBtn || !closeBtn) return;

    // Monitor when player is active to adjust banner height dynamically
    const playerEl = document.querySelector('.music-player');
    const syncBannerPosition = () => {
        if (playerEl && playerEl.classList.contains('active')) {
            banner.classList.add('player-active');
        } else {
            banner.classList.remove('player-active');
        }
    };

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Check if user previously dismissed this banner in this session
        if (sessionStorage.getItem('pwa_dismissed') === '1') return;

        // Show our custom banner
        syncBannerPosition();
        banner.classList.add('show');
    });

    // Monitor player active mutations to dynamically adjust floating height
    if (playerEl && typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    syncBannerPosition();
                }
            });
        });
        observer.observe(playerEl, { attributes: true });
    }

    installBtn.addEventListener('click', () => {
        if (!deferredPrompt) return;
        // Hide the custom banner
        banner.classList.remove('show');
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the PWA install prompt');
            } else {
                console.log('User dismissed the PWA install prompt');
            }
            deferredPrompt = null;
        });
    });

    closeBtn.addEventListener('click', () => {
        // Hide banner and save preference in sessionStorage so we don't bug them again in the same session
        banner.classList.remove('show');
        sessionStorage.setItem('pwa_dismissed', '1');
    });

    window.addEventListener('appinstalled', (evt) => {
        console.log('Ivory was installed successfully!');
        banner.classList.remove('show');
        deferredPrompt = null;
    });
})();

// ── LIVE BIRTHDAY COUNTDOWN TIMER (LOVE THEME) ────────────────────────
(function initBirthdayTimer() {
    function updateTimer() {
        const timerText = document.getElementById('bday-countdown-text');
        if (!timerText) return;
        
        const now = new Date();
        let targetYear = now.getFullYear();
        let targetDate = new Date(targetYear, 6, 23); // Month is 0-indexed: 6 = July
        
        // If birthday has already passed this year, point to next year
        if (now > targetDate) {
            targetDate = new Date(targetYear + 1, 6, 23);
        }
        
        const diff = targetDate - now;
        if (diff <= 0) {
            timerText.textContent = "Happy Birthday! ❤️";
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Beautiful live string formatting
        timerText.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    
    // Run update every second and once immediately on script load / DOM ready
    setInterval(updateTimer, 1000);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateTimer);
    } else {
        updateTimer();
    }
})();



