#!/usr/bin/env python3
"""
inject_songs.py
Reads auto_categorized_songs.json, post-processes each entry for clean title/artist,
then:
  1) Appends new song entries to the `songs` array in script.js
  2) Adds Talwiinder artist card + Retro Classics genre card
  3) Adds Talwiinder and Retro Classics to sectionFallbackImages
  4) Adds artist/mood playlist filters for new artists
"""

import json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPT_JS = ROOT / "script.js"
DATA_JSON = pathlib.Path(__file__).parent / "auto_categorized_songs.json"

# ── channel/label noise to strip from artist field ──────────────────────────
CHANNEL_NOISE = re.compile(
    r"^(7clouds.*|.*vevo$|.*vevo.*|SonyMusicIndia.*|T-Series.*|Zee Music.*|YRF|"
    r"Tips Official|Romance Rewind|Bollywood.*|.*VEVO$|Indie India|.*Topic$|"
    r"LatinHype|.*Hype$|.*7clouds.*|Coke Studio.*|Netflix.*|Lyrics4You|"
    r"Musicgenree|Sankalp.*|Bishal.*|seventyskye|LyricsVerse|Lazy.*|"
    r"Vibe Bird|Artiste First|UR DEBUT|Dreamiyata.*|VYRLOriginals|"
    r"DRC Records|PUBLICVEVO|JAYDED|officialpsy|ChainsmokersVEVO|"
    r"PostMaloneVEVO|LadyGagaVEVO|ImagineDragonsVEVO|BillieEilishVEVO|"
    r"TheWeekndVEVO|ArianaGrandeVevo|TaylorSwiftVEVO|ChrisBrownVEVO|"
    r"StephenSanchezVEVO|AnnaOfTheNorthVEVO|OneDirectionVEVO|Maroon5VEVO|"
    r"Cakes.*Eclairs|M O O N|Creative Chaos|Dan Music|Aura Melodies|"
    r"Pizza Music|magnificent|a paradise bird|Invited Kingdom|.*Music Club.*|"
    r"ReLike Vibes|Unique Sound|Bollywood songs|Sonic Serenade.*|"
    r"Nepali Fine Tunes.*|PluginVibes|Jelly.*|Djo Music|Pink Sweats|"
    r"The Vibe Guide|Yevo|7clouds Country|7clouds Rock|Djo Music|"
    r"SonyMusicIndiaVEVO|Zee Music Company|T-Series Bollywood Classics|"
    r"wolf\.cryman - Topic|Arctic Monkeys - Topic|Carla Bruni - Topic|"
    r"The Weeknd - Topic|Unknown Artist|256|128)$",
    re.IGNORECASE,
)

# ── Known correct artist mappings for YouTube-style filenames ────────────────
ARTIST_FIX = {
    # by fragment in file path
    "Shape of You": "Ed Sheeran",
    "Skyfall": "Adele",
    "Alone": "Alan Walker",
    "Faded": "Alan Walker",
    "Mockingbird": "Eminem",
    "Sweater Weather": "The Neighbourhood",
    "Apocalypse": "Cigarettes After Sex",
    "End Of Beginning": "Djo",
    "Heat Waves": "Glass Animals",
    "Dandelions": "Ruth B.",
    "Let Me Down Slowly": "Alec Benjamin",
    "Until I Found You": "Stephen Sanchez",
    "Ordinary": "Alex Warren",
    "Sailor Song": "Gigi Perez",
    "Darkside": "NEONI",
    "blue": "yung kai",
    "I Think They Call This Love": "Elliot James Reay",
    "Wrap Me In Plastic": "CHROMANCE",
    "Cheri Cheri Lady": "Modern Talking",
    "Lovers": "Anna of the North",
    "I See Red": "Everybody Loves An Outlaw",
    "Infinity": "Jaymes Young",
    "Criminal": "Britney Spears",
    "Harleys In Hawaii": "Katy Perry",
    "Somewhere Only We Know": "Keane",
    "Beggin": "Måneskin",
    "Hall of Fame": "The Script ft. will.i.am",
    "Let Her Go": "Passenger",
    "A Thousand Years": "Christina Perri",
    "Unstoppable": "Sia",
    "Love Me Like You Do": "Ellie Goulding",
    "Make You Mine": "PUBLIC",
    "Old Town Road": "Lil Nas X ft. Billy Ray Cyrus",
    "I Like Me Better": "Lauv",
    "Feel Good Inc": "Gorillaz",
    "Eenie Meenie": "Sean Kingston & Justin Bieber",
    "At My Worst": "Pink Sweat$",
    "Bella Ciao": "Money Heist Cast",
    "I Like You So Much": "Ysabelle",
    "You belong to me": "Carla Bruni",
    "Gat": "DALENG DALE",
    "Love Story": "Indila",
    "Co2": "Prateek Kuhad",
    "Kahaan Ho Tum": "Prateek Kuhad",
    "Darkhaast": "Arijit Singh, Sunidhi Chauhan",
    "Enna Sona": "Arijit Singh",
    "Tum Tak": "Javed Ali",
    "Mann Mera": "Gajendra Verma",
    "Zehnaseeb": "Chinmayi Sripada, Shekhar Ravjiani",
    "Humsafar": "Akhil Sachdeva",
    "Iraaday": "Abdul Hannan, Rovalio",
    "Aankhon Se Batana": "Dikshant",
    "Mere Liye Tum Kaafi Ho": "Ayushmann Khurrana",
    "Dariya": "Arko",
    "Ik Kudi": "wolf.cryman",
    "Be Intehaan": "Atif Aslam, Sunidhi Chauhan",
    "Aahista": "Arijit Singh, Jonita Gandhi",
    "Labon Ko": "K.K.",
    "Mere Bina": "Nikhil D'Souza",
    "Ishq Bulaava": "Sanam Puri, Shipra Goyal",
    "Rang Jo Lagyo": "Atif Aslam, Shreya Ghoshal",
    "Abhi Kuch Dino Se": "Mohit Chauhan",
    "O Rangrez": "Shreya Ghoshal, Javed Bashir",
    "Yeh Fitoor Mera": "Arijit Singh",
    "Sarangi": "Sushant KC",
    "Inkem Inkem": "Sid Sriram",
    "Hosanna": "Leon D'Souza, Suzanne D'Mello, Vijay Prakash",
    "Jaan Ban Gaye": "Mithoon, Vishal Mishra, Asees Kaur",
    "Saude Bazi": "Anupam Amod",
    "Khoya Khoya": "Mohit Chauhan",
    "Tere Bina": "Zaeden",
    "Mere Nishan": "Darshan Raval",
    "Bairiyaa": "Atif Aslam, Shreya Ghoshal",
    "Rukum Maikot": "SD Yogi, Shanti Shree Pariyar",
    "Timi Nacha Na": "Wangden Sherpa",
    "Bardali": "Sushant KC, Indrakala Rai",
    "Jhol": "Maanu, Annural Khalid",
    "Nadaaniyan": "Akshath",
    "Khwab": "Iqlipse Nova, Aditya A",
    "Zulfein": "Mehul Mahesh, DJ Aynik",
    "Meri Banogi Kya": "Rito Riba",
    "Savera": "Iqlipse Nova, Anubha Bajaj",
    "Dear Maahiya": "Tanishka Bahl, Saaheal",
    "Kasari": "Yabesh Thapa",
    "Jhim Jhim Aune Aakhale": "Ekdev Limbu",
    "Timro Pratiksa": "Shallum Lama",
    "Timi Sangai": "Apurva Tamang",
    "Dil Ye Bekarar Kyun Hai": "Mohit Chauhan, Shreya Ghoshal",
    "Taare Ginn": "Mohit Chauhan, Shreya Ghoshal",
    "Haareya": "Arijit Singh",
    "Sukoon Mila": "Arijit Singh",
    "Zaroor": "Aparshakti Khurana, Savi Kahlon",
    "Manchala": "Shafqat Amanat Ali, Nupur Pant",
    "Meherbaan": "Ash King, Shilpa Rao, Shekhar Ravjiani",
    "Rang Lageya": "Mohit Chauhan, Rochak Kohli",
    "Jogi": "Yasser Desai, Aakanksha Sharma",
    "Dooron Dooron": "Paresh Pahuja",
    "Ranjheya Ve": "Zain Zohaib",
    "Kaise Bataaoon": "K.K., Sonal Chauhan",
    "Is This Love": "Mohit Chauhan, Shreya Ghoshal",
    "Kyon": "Papon, Sunidhi Chauhan",
    "Tujhko Jo Paaya": "Mohit Chauhan",
    "Sachiya Mohabbatan": "Sachet Tandon",
    "Jab Tak": "Armaan Malik",
    "Sadka": "Suraj Jagan, Mahalaxmi Iyer",
    "Maine Khud Ko": "Mustafa Zahid",
    "Jugraafiya": "Udit Narayan, Shreya Ghoshal",
    "Dil Se Dil": "Shashwat Singh",
    "Ishq": "Amir Ameer, Faheem Abdullah",
    "Kaifi Khalil": "Kaifi Khalil",
    "Ve Haaniyaan": "Danny, Avvy Sra",
    "Pehli Nazar Mein": "Atif Aslam",
    "Jeene Laga Hoon": "Atif Aslam, Shreya Ghoshal",
    "Tu Chahiye": "Atif Aslam",
    "Raanjhanaa": "Jaswinder Singh, Shiraz Uppal",
    "Sajni": "Arijit Singh",
    "Chaar Kadam": "Shaan, Shreya Ghoshal",
    "Ra and Tomine Harket": "Alan Walker",
    "Under The Influence": "Chris Brown",
    "Timeless": "The Weeknd",
    "Starboy": "The Weeknd",
    "Pink Venom": "BLACKPINK",
    "Some": "BOL4",
    "Maria": "Hwa Sa",
    "Shinunoga E-Wa": "Fujii Kaze",
    "Gangnam Style": "PSY",
    "fantasize": "Ariana Grande",
    "positions": "Ariana Grande",
    "safety net": "Ariana Grande, Ty Dolla $ign",
    "Stuck with U": "Ariana Grande & Justin Bieber",
    "Love Me Harder": "Ariana Grande & The Weeknd",
}

CLEAN_TITLE_RULES = [
    (r"(?i)\s*-\s*PagalNew\s*$", ""),
    (r"(?i)\s*\(Bonus Track\)\s*", " "),
    (r"(?i)\s*\((?:Official|Lyrical?|Full|Audio|Video|HD|MV|HQ|Prod\.[^)]*)\s*(?:Video|Song|Music Video|Lyrics?)?\)\s*", " "),
    (r"(?i)\s*\[(?:Official|Lyrical?|Full|Audio|Video|HD|MV)\s*(?:Video|Song|Music Video|Lyrics?)?\]\s*", " "),
    (r"(?i)\s*-\s*(Lyrics?|Lyrical)\s*$", ""),
    (r"(?i)\s*\|\s*(Arijit Singh|T-Series|Zee Music.*|YRF|Tips.*|Sony.*|SonyMusic.*)\s*$", ""),
    (r"\s+", " "),
]

def clean_title(t):
    for pat, rep in CLEAN_TITLE_RULES:
        t = re.sub(pat, rep, t)
    return t.strip(" |,-")

def fix_artist(entry):
    title = entry["title"]
    artist = entry["artist"]
    # Check known fixes
    for keyword, correct in ARTIST_FIX.items():
        if keyword.lower() in title.lower():
            return correct
    # Strip channel noise
    if CHANNEL_NOISE.match(artist.strip()):
        # Try to infer from title parts
        file_lower = entry["file"].lower()
        if "talwiinder" in file_lower or "talwinder" in file_lower:
            return "Talwiinder"
        if "arijit" in file_lower:
            return "Arijit Singh"
        if "weeknd" in file_lower:
            return "The Weeknd"
        if "karan aujla" in file_lower:
            return "Karan Aujla"
        if "anuv jain" in file_lower:
            return "Anuv Jain"
        return "Unknown Artist"
    # Clean " - Topic" suffix
    artist = re.sub(r"\s*-\s*Topic$", "", artist, flags=re.I).strip()
    artist = re.sub(r"\s*\(DJJOhAL\.Com\)\s*", " ", artist, flags=re.I).strip()
    artist = re.sub(r"\s*\(DJJOhAL\.Com\s*\(1\)\)\s*", " ", artist, flags=re.I).strip()
    return artist.strip(" ,")

def fix_folder(entry, artist):
    f = entry.get("folder", "Hindi Hits")
    file_low = entry["file"].lower()
    title_low = entry["title"].lower()
    a_low = artist.lower()
    # Correct obvious misclassifications
    if "karan aujla" in a_low or "karan aujla" in file_low:
        return "Karan Aujla"
    if "talwiinder" in a_low or "talwinder" in a_low or "talwiinder" in file_low:
        return "Talwiinder"
    if "arijit" in a_low or "arijit" in file_low:
        return "Arijit Singh"
    # Global artists
    GLOBAL_NAMES = ["weeknd","ariana grande","charlie puth","ed sheeran","taylor swift",
        "billie eilish","maroon 5","imagine dragons","arctic monkeys","shawn mendes",
        "camila cabello","sia","adele","lady gaga","bruno mars","blackpink","psy",
        "post malone","selena gomez","alan walker","fujii kaze","bol4","hwa sa",
        "eminem","sam smith","chris brown","coldplay","lauv","one direction",
        "harry styles","måneskin","maneskin","gorillaz","the weeknd","dhruv",
        "the chainsmokers","glass animals","lil nas","katy perry","jay sean",
        "britney spears","neoni","cigarettes after sex","djo","ruth b","alec benjamin",
        "stephen sanchez","pink sweat","jaymes young","elliot james","keane","passenger",
        "christina perri","ellie goulding","public","anna of the north","chromance",
        "modern talking","everybody loves an outlaw","daleng dale","indila",
        "carla bruni","gigi perez","yung kai","wiz khalifa","the script","the neighbourhood",
        "the police","radiohead","avicii","kate bush","lizzo","dove cameron",
        "tate mcrae","conan gray","willow","nicky youre","onerepublic","laufey",
        "mitski","beach house","ariana","sabrina carpenter","the walters","lana del rey",
        "billie jean","michael jackson","new west","the marías"]
    if any(n in a_low for n in GLOBAL_NAMES):
        return "Global Hits"
    # Retro Bollywood
    RETRO_NAMES = ["kishore kumar","mohammed rafi","lata mangeshkar","mukesh","hemant kumar",
        "talat mahmood","asha bhosle","jagjit singh","manna dey","geeta dutt"]
    if any(n in a_low for n in RETRO_NAMES):
        return "Retro Classics"
    if any(k in title_low or k in file_low for k in ["60s","70s","retro","evergreen","remastered","1970","1972","1980"]):
        return "Retro Classics"
    # K-pop
    if any(n in a_low for n in ["blackpink","bol4","hwa sa","bts","jungkook","twice","exo","treasure","darari"]):
        return "Global Hits"
    return f

def should_skip(entry):
    t = entry["title"].lower()
    f = entry["file"].lower()
    # Skip pure garbage
    if t in ("youtube", "unknown track", ""):
        return True
    if "_duplicate" in f and "copy" not in f:
        return True
    # Skip duplicates already in songs array (they share the same file path as entries already added)
    return False


data = json.loads(DATA_JSON.read_text(encoding="utf-8"))

new_entries = []
seen_files = set()
for entry in data:
    if should_skip(entry):
        continue
    fpath = entry["file"]
    if fpath in seen_files:
        continue
    seen_files.add(fpath)

    title = clean_title(entry["title"])
    artist = fix_artist(entry)
    folder = fix_folder(entry, artist)

    # Further clean title of any trailing channel name
    title = re.sub(r"\s*\|\s*[\w\s&,\.]+$", "", title).strip()

    new_entries.append({
        "title": title,
        "artist": artist,
        "file": fpath,
        "art": "IMAGES/logoo.png",
        "folder": folder,
        "durationFormatted": "",
    })

# ── Build JS lines to append ─────────────────────────────────────────────────
def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')

js_block = "\n    // ─── AUTO-CATEGORIZED SONGS (all folders) ───────────────────────────────────\n"
for e in new_entries:
    js_block += (
        f'    {{ title: "{esc(e["title"])}", artist: "{esc(e["artist"])}", '
        f'file: "{esc(e["file"])}", art: "IMAGES/logoo.png", '
        f'folder: "{esc(e["folder"])}", durationFormatted: "" }},\n'
    )

# ── Inject into script.js ─────────────────────────────────────────────────────
code = SCRIPT_JS.read_text(encoding="utf-8")

# 1) Append song entries before the closing `];` of songs array
SONGS_END = "\n];\n"
idx = code.find(SONGS_END)
if idx == -1:
    raise RuntimeError("Could not find end of songs array (];)")

code = code[:idx] + js_block + code[idx:]

# 2) Add sectionFallbackImages entries for Talwiinder and Retro Classics
FALLBACK_ANCHOR = "    // Moods"
if FALLBACK_ANCHOR in code and "'Talwiinder'" not in code:
    insert = (
        "    'Talwiinder':             'IMAGES/karan_aujla.jpg',\n"
        "    'Retro Classics':         'IMAGES/bollywood.jpg',\n"
        "    "
    )
    code = code.replace(FALLBACK_ANCHOR, insert + FALLBACK_ANCHOR)

# 3) Add Talwiinder & Retro to renderArtists (if not already there)
RENDER_ARTISTS_END = "        if(typeof initTiltEffect === 'function') initTiltEffect();\n    } catch (e) {\n        console.error(\"❌ Error rendering artists"
if "playTalwiinderSongs" not in code and RENDER_ARTISTS_END in code:
    insert_artist = (
        "            ${makeArtistCard('playTalwiinderSongs','IMAGES/karan_aujla.jpg','Talwiinder','Soulful Punjabi poetry.')}\n        "
    )
    code = code.replace(
        "            ${makeArtistCard('playMohitChauhanSongs','IMAGES/Mohit%20Chauhan%20.jpg','Mohit Chauhan','Soulful storyteller.')}\n        `",
        "            ${makeArtistCard('playMohitChauhanSongs','IMAGES/Mohit%20Chauhan%20.jpg','Mohit Chauhan','Soulful storyteller.')}\n"
        + "            ${makeArtistCard('playTalwiinderSongs','IMAGES/karan_aujla.jpg','Talwiinder','Soulful Punjabi poetry.')}\n        `"
    )

# 4) Add renderHome artist grid entry for Talwiinder (if not already there)
HOME_ARTIST_ANCHOR = "                ${makeArtistCard('playMohitChauhanSongs','IMAGES/Mohit%20Chauhan%20.jpg','Mohit Chauhan','Soulful storyteller.')}\n            `"
HOME_ARTIST_REPLACEMENT = (
    "                ${makeArtistCard('playMohitChauhanSongs','IMAGES/Mohit%20Chauhan%20.jpg','Mohit Chauhan','Soulful storyteller.')}\n"
    "                ${makeArtistCard('playTalwiinderSongs','IMAGES/karan_aujla.jpg','Talwiinder','Soulful Punjabi poetry.')}\n"
    "            `"
)
if HOME_ARTIST_ANCHOR in code and "playTalwiinderSongs" not in code.split("renderHome")[1].split("renderArtists")[0]:
    code = code.replace(HOME_ARTIST_ANCHOR, HOME_ARTIST_REPLACEMENT)

# 5) Add Retro Classics genre card in renderHome (if not already there)
GENRE_ANCHOR = "                ${makeGenreCard('playKpopAsian','IMAGES/k%20pop%20%26%20asian.jpg','🎌 K-Pop & Asian','From Seoul to Tokyo.')}\n            `"
GENRE_REPLACEMENT = (
    "                ${makeGenreCard('playKpopAsian','IMAGES/k%20pop%20%26%20asian.jpg','🎌 K-Pop & Asian','From Seoul to Tokyo.')}\n"
    "                ${makeGenreCard('playRetroClassics','IMAGES/bollywood.jpg','🎙️ Retro Classics','Golden era Bollywood.')}\n"
    "            `"
)
if GENRE_ANCHOR in code and "playRetroClassics" not in code:
    code = code.replace(GENRE_ANCHOR, GENRE_REPLACEMENT)

# 6) Insert playlist constants + play functions before the line that defines arijitSongs
PLAYLIST_CONSTANTS = """
const talwiinderSongs = songs.filter(s => s.folder === 'Talwiinder' || (s.artist && s.artist.toLowerCase().includes('talwiinder')));
const retroClassicsSongs = songs.filter(s => s.folder === 'Retro Classics');
"""
PLAY_FUNCTIONS = """
function playTalwiinderSongs(autoPlay = false) {
    renderSongList(talwiinderSongs, 'Talwiinder');
    if (autoPlay && talwiinderSongs.length > 0) playSongAtIndex(songs.indexOf(talwiinderSongs[0]));
}

function playRetroClassics(autoPlay = false) {
    renderSongList(retroClassicsSongs, '🎙️ Retro Classics');
    if (autoPlay && retroClassicsSongs.length > 0) playSongAtIndex(songs.indexOf(retroClassicsSongs[0]));
}
"""

CONST_ANCHOR = "\nconst arijitSongs = songs.filter(song => song.folder === 'Arijit Singh');"
if "talwiinderSongs" not in code and CONST_ANCHOR in code:
    code = code.replace(CONST_ANCHOR, PLAYLIST_CONSTANTS + CONST_ANCHOR)

PLAY_ANCHOR = "\nfunction playArijitSongs(autoPlay = false) {"
if "playTalwiinderSongs" not in code and PLAY_ANCHOR in code:
    code = code.replace(PLAY_ANCHOR, PLAY_FUNCTIONS + PLAY_ANCHOR)

SCRIPT_JS.write_text(code, encoding="utf-8")
print(f"Done. Injected {len(new_entries)} songs + Talwiinder/Retro Classics domain cards.")

