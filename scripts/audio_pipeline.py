#!/usr/bin/env python3
import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List, Tuple

from mutagen import File as MutagenFile

ROOT = Path(__file__).resolve().parents[1]
SCRIPT_JS = ROOT / "script.js"
SONGS_DIRS = [ROOT / "songs", ROOT / "song"]
OUT_JSON = ROOT / "scripts" / "auto_categorized_songs.json"
OUT_JS = ROOT / "scripts" / "auto_generated_entries.js"

AUDIO_EXTS = {".mp3", ".m4a", ".wav", ".flac", ".aac", ".ogg"}

GLOBAL_ARTISTS = {
    "the weeknd", "ariana grande", "charlie puth", "ed sheeran", "taylor swift",
    "billie eilish", "justin bieber", "maroon 5", "imagine dragons", "arctic monkeys",
    "shawn mendes", "camila cabello", "sia", "adele", "lady gaga", "bruno mars",
    "blackpink", "psy", "post malone", "selena gomez", "alan walker", "fujii kaze",
    "bol4", "hwa sa", "eminem", "sam smith", "chris brown", "coldplay", "lauv",
    "one direction", "harry styles", "maaneskin", "ariana grande"
}

RETRO_ARTISTS = {
    "kishore kumar", "mohammed rafi", "mukesh", "asha bhosle", "lata mangeshkar",
    "talat mahmood", "k. l. saigal", "hemant kumar"
}

@dataclass
class SongEntry:
    title: str
    artist: str
    file: str
    art: str
    folder: str
    durationFormatted: str = ""


def normalize_space(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def clean_filename_stem(stem: str) -> str:
    s = stem
    s = re.sub(r"^\d{10,}", "", s)
    s = s.replace("_", " ")
    s = re.sub(r"\s*\(\d+\)$", "", s)
    s = re.sub(r"\s*-\s*\d+\s*$", "", s)
    s = re.sub(r"\b140\b\s*audio\s*only\s*medium", "", s, flags=re.I)
    s = re.sub(r"\b(audio\s*only|official\s*video|lyrics?|lyrical|full\s*video|remastered|djjohal\.com|pendujatt\.com\.se|koshalworld\.com)\b", "", s, flags=re.I)
    s = re.sub(r"\s+", " ", s)
    return s.strip(" -._")


def clean_title(title: str) -> str:
    t = title
    t = re.sub(r"\[.*?\]|\(.*?(lyrics?|official|video|audio|full|remix).*?\)", "", t, flags=re.I)
    t = re.sub(r"\s*-\s*(lyrics?|official|video|audio).*", "", t, flags=re.I)
    t = normalize_space(t.strip("'\" -._"))
    return t or "Unknown Track"


def clean_artist(artist: str) -> str:
    a = artist.replace("&", ",")
    a = re.sub(r"\b(ft\.?|feat\.?)\b", ",", a, flags=re.I)
    parts = [normalize_space(p) for p in re.split(r",|/|\|", a) if normalize_space(p)]
    dedup = []
    seen = set()
    for part in parts:
        key = part.lower()
        if key not in seen:
            seen.add(key)
            dedup.append(part)
    if not dedup:
        return "Unknown Artist"
    return ", ".join(dedup[:3])


def read_tags(file_path: Path) -> Tuple[str, str]:
    title = ""
    artist = ""
    try:
        audio = MutagenFile(file_path, easy=True)
        if audio and audio.tags:
            title_vals = audio.tags.get("title") or []
            artist_vals = audio.tags.get("artist") or []
            if title_vals:
                title = str(title_vals[0]).strip()
            if artist_vals:
                artist = str(artist_vals[0]).strip()
    except Exception:
        pass
    return title, artist


def parse_from_name(file_path: Path) -> Tuple[str, str]:
    raw = clean_filename_stem(file_path.stem)
    parts = [p.strip() for p in re.split(r"\s+-\s+", raw) if p.strip()]

    if len(parts) >= 2:
        p0, p1 = parts[0], parts[1]
        if len(p0.split()) <= 4 and any(ch.isalpha() for ch in p0) and len(p1.split()) >= 1:
            if p0.lower() in GLOBAL_ARTISTS or p0.lower() in RETRO_ARTISTS:
                return clean_title(p1), clean_artist(p0)
            if any(k in p0.lower() for k in ["talwiinder", "arijit", "atif", "karan", "weeknd"]):
                return clean_title(p1), clean_artist(p0)
        return clean_title(p0), clean_artist(p1)

    compact = clean_title(raw)
    return compact, "Unknown Artist"


def classify_folder(title: str, artist: str) -> str:
    text = f"{title} {artist}".lower()

    if "talwiinder" in text:
        return "Talwiinder"
    if "karan aujla" in text:
        return "Karan Aujla"
    if "arijit" in text:
        return "Arijit Singh"

    if any(a in text for a in RETRO_ARTISTS) or any(k in text for k in [
        "old hindi", "evergreen", "remastered", "60s", "70s", "retro"
    ]):
        return "Retro Classics"

    if any(a in text for a in GLOBAL_ARTISTS) or any(k in text for k in [
        "k-pop", "kpop", "jungkook", "blackpink", "bol4", "hwa sa", "fujii", "english"
    ]):
        return "Global Hits"

    if "anuv jain" in text or "atif aslam" in text or "pritam" in text:
        return "Hindi Hits"

    return "Hindi Hits"


def load_existing_files() -> set:
    code = SCRIPT_JS.read_text(encoding="utf-8", errors="ignore")
    files = set(re.findall(r'file:\s*"([^\"]+\.(?:mp3|MP3|m4a|M4A))"', code))
    return files


def gather_audio_files() -> List[Path]:
    collected = []
    for base in SONGS_DIRS:
        if not base.exists():
            continue
        for p in base.rglob("*"):
            if p.is_file() and p.suffix.lower() in AUDIO_EXTS:
                collected.append(p)
    return sorted(collected)


def build_entries() -> List[SongEntry]:
    existing = load_existing_files()
    entries: List[SongEntry] = []

    for fpath in gather_audio_files():
        rel = fpath.relative_to(ROOT).as_posix()
        if rel in existing:
            continue

        tag_title, tag_artist = read_tags(fpath)
        parsed_title, parsed_artist = parse_from_name(fpath)

        title = clean_title(tag_title or parsed_title)
        artist = clean_artist(tag_artist or parsed_artist)

        # Fill artist from strong filename hints if tags are missing.
        low = fpath.stem.lower()
        if artist == "Unknown Artist":
            if "talwiinder" in low or "talwinder" in low:
                artist = "Talwiinder"
            elif "arijit" in low:
                artist = "Arijit Singh"
            elif "karan" in low and "aujla" in low:
                artist = "Karan Aujla"
            elif "weeknd" in low:
                artist = "The Weeknd"

        folder = classify_folder(title, artist)
        entries.append(SongEntry(
            title=title,
            artist=artist,
            file=rel,
            art="IMAGES/logoo.png",
            folder=folder,
            durationFormatted=""
        ))

    # De-duplicate by exact file path.
    unique = {}
    for e in entries:
        unique[e.file] = e
    return list(unique.values())


def save_outputs(entries: List[SongEntry]) -> None:
    serializable = [asdict(e) for e in entries]
    OUT_JSON.write_text(json.dumps(serializable, indent=2, ensure_ascii=True), encoding="utf-8")

    js_lines = ["const autoCategorizedSongs = ["]
    for e in entries:
        safe_title = e.title.replace('"', '\\"')
        safe_artist = e.artist.replace('"', '\\"')
        safe_file = e.file.replace('"', '\\"')
        safe_art = e.art.replace('"', '\\"')
        safe_folder = e.folder.replace('"', '\\"')
        js_lines.append(
            f'    {{ title: "{safe_title}", artist: "{safe_artist}", file: "{safe_file}", art: "{safe_art}", folder: "{safe_folder}", durationFormatted: "" }},'
        )
    js_lines.append("];\n")
    OUT_JS.write_text("\n".join(js_lines), encoding="utf-8")


def main() -> None:
    entries = build_entries()
    save_outputs(entries)


if __name__ == "__main__":
    main()

