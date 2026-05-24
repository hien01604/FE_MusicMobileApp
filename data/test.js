import fs from 'fs';

const seedTerms = [
    // Genres
    'Pop', 'R&B', 'Soul', 'Hip-Hop', 'Rap', 'Electronic', 'Rock', 'Jazz',
    'Dance', 'EDM', 'Ballad', 'Indie', 'Acoustic', 'Country', 'K-Pop', 'V-Pop',

    // Vietnamese artists
    'Sơn Tùng M-TP', 'Mỹ Tâm', 'Đen', 'MONO', 'HIEUTHUHAI',
    'ERIK', 'MIN', 'Bích Phương', 'Hoàng Thuỳ Linh', 'Vũ', 'SOOBIN',

    // International artists
    'Taylor Swift', 'Ariana Grande', 'The Weeknd', 'Bruno Mars',
    'Ed Sheeran', 'Billie Eilish', 'Dua Lipa', 'BLACKPINK', 'BTS',
    'Justin Bieber', 'Rihanna', 'Lady Gaga', 'Charlie Puth'
];

const TARGET_SONGS = 400;
const MAX_SONGS_PER_ARTIST = 8;

const results = {
    artists: [],
    genres: [],
    songs: [],
    song_artists: []
};

const songKeys = new Set();
const artistMap = new Map();
const genreMap = new Map();
const artistCount = new Map();
const songArtistKeys = new Set();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const now = () => new Date().toISOString();

function splitArtists(artistName) {
    return artistName
        .split(/\s*(?:,|&|feat\.?|ft\.?| x | X | and )\s*/i)
        .map(name => name.trim())
        .filter(Boolean);
}

function getOrCreateArtist(name, avatarUrl) {
    if (artistMap.has(name)) {
        return artistMap.get(name);
    }

    const artist = {
        id: crypto.randomUUID(),
        name,
        avatar_url: avatarUrl || null,
        bio: null,
        created_at: now(),
        updated_at: now()
    };

    artistMap.set(name, artist);
    results.artists.push(artist);

    return artist;
}

function getOrCreateGenre(name) {
    if (genreMap.has(name)) {
        return genreMap.get(name);
    }

    const genre = {
        id: crypto.randomUUID(),
        name
    };

    genreMap.set(name, genre);
    results.genres.push(genre);

    return genre;
}

function addSongArtist(songId, artistId) {
    const key = `${songId}-${artistId}`;

    if (songArtistKeys.has(key)) return;

    results.song_artists.push({
        song_id: songId,
        artist_id: artistId
    });

    songArtistKeys.add(key);
}

for (const term of seedTerms) {
    if (results.songs.length >= TARGET_SONGS) break;

    const url =
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}` +
        `&entity=song&limit=200&country=vn`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            console.error(`Fetch failed: ${term} | ${res.status}`);
            continue;
        }

        const data = await res.json();

        const tracks = data.results.filter(t =>
            t.artistName &&
            t.trackName &&
            t.primaryGenreName &&
            t.trackTimeMillis &&
            t.previewUrl &&
            t.artworkUrl100 &&
            t.releaseDate
        );

        for (const t of tracks) {
            if (results.songs.length >= TARGET_SONGS) break;

            const artistNames = splitArtists(t.artistName);
            if (artistNames.length === 0) continue;

            const mainArtistName = artistNames[0];

            const songKey = `${mainArtistName}-${t.trackName}`.toLowerCase();
            if (songKeys.has(songKey)) continue;

            const currentArtistCount = artistCount.get(mainArtistName) || 0;
            if (currentArtistCount >= MAX_SONGS_PER_ARTIST) continue;

            const mainArtist = getOrCreateArtist(mainArtistName, t.artworkUrl100);
            const genre = getOrCreateGenre(t.primaryGenreName);

            const songId = crypto.randomUUID();

            results.songs.push({
                id: songId,
                title: t.trackName,
                artist_id: mainArtist.id,
                genre_id: genre.id,
                duration: Math.floor(t.trackTimeMillis / 1000),
                audio_url: t.previewUrl,
                thumbnail_url: t.artworkUrl100.replace('100x100', '600x600'),
                release_date: t.releaseDate.split('T')[0],
                created_at: now(),
                updated_at: now()
            });

            for (const name of artistNames) {
                const artist = getOrCreateArtist(name, t.artworkUrl100);
                addSongArtist(songId, artist.id);
            }

            songKeys.add(songKey);
            artistCount.set(mainArtistName, currentArtistCount + 1);
        }

        console.log(`Done: ${term} | Songs: ${results.songs.length}`);

        await sleep(500);
    } catch (error) {
        console.error(`Error: ${term}`, error.message);
    }
}

console.log(`Genres: ${results.genres.length}`);
console.log(`Artists: ${results.artists.length}`);
console.log(`Songs: ${results.songs.length}`);
console.log(`Song Artists: ${results.song_artists.length}`);

fs.writeFileSync(
    './music_seed_data.json',
    JSON.stringify(results, null, 2),
    'utf-8'
);

console.log('Saved to music_seed_data.json');