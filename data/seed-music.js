import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'OK' : 'MISSING');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MISSING');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const AUDIO_BUCKET = process.env.SUPABASE_AUDIO_BUCKET || 'song-audios';
const IMAGE_BUCKET = process.env.SUPABASE_IMAGE_BUCKET || 'song-images';
const AVATAR_BUCKET = process.env.SUPABASE_AVT_BUCKET || 'artist-avatars';
const AUTH_SCHEMA = process.env.AUTH_SCHEMA || 'auth';
const SKIP_STORAGE_UPLOAD = process.env.SKIP_STORAGE_UPLOAD !== 'false';

console.log('AUDIO_BUCKET:', AUDIO_BUCKET);
console.log('IMAGE_BUCKET:', IMAGE_BUCKET);
console.log('AVATAR_BUCKET:', AVATAR_BUCKET);
console.log('AUTH_SCHEMA:', AUTH_SCHEMA);
console.log('SKIP_STORAGE_UPLOAD:', SKIP_STORAGE_UPLOAD ? 'true' : 'false');

const existingFileCache = new Map();

const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'music_seed_data.json'), 'utf-8')
);

function safeFileName(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function quoteIdentifier(identifier) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
        throw new Error(`Invalid SQL identifier: ${identifier}`);
    }

    return `"${identifier}"`;
}

const schemaSql = quoteIdentifier(AUTH_SCHEMA);

function getExtensionFromUrl(url, fallback) {
    try {
        const pathname = new URL(url).pathname;
        const ext = path.extname(pathname);
        return ext || fallback;
    } catch {
        return fallback;
    }
}

function getImageContentType(ext) {
    switch (ext.toLowerCase()) {
        case '.png':
            return 'image/png';
        case '.webp':
            return 'image/webp';
        default:
            return 'image/jpeg';
    }
}

async function downloadFile(url) {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Download failed: ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

function splitStoragePath(filePath) {
    const lastSlashIndex = filePath.lastIndexOf('/');

    if (lastSlashIndex === -1) {
        return {
            folder: '',
            fileName: filePath,
        };
    }

    return {
        folder: filePath.slice(0, lastSlashIndex),
        fileName: filePath.slice(lastSlashIndex + 1),
    };
}

async function hasSupabaseFile(bucket, filePath) {
    const { folder, fileName } = splitStoragePath(filePath);
    const cacheKey = `${bucket}:${folder}`;

    if (!existingFileCache.has(cacheKey)) {
        const { data: files, error } = await supabase.storage
            .from(bucket)
            .list(folder);

        if (error) {
            existingFileCache.set(cacheKey, null);
            return false;
        }

        existingFileCache.set(
            cacheKey,
            new Set((files || []).map((file) => file.name))
        );
    }

    const fileNames = existingFileCache.get(cacheKey);
    return fileNames instanceof Set && fileNames.has(fileName);
}

function getSupabasePublicUrl(bucket, filePath) {
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

async function uploadToSupabase(bucket, filePath, buffer, contentType) {
    const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
            contentType,
            upsert: false,
        });

    if (error) {
        if (error.message?.toLowerCase().includes('already exists')) {
            return getSupabasePublicUrl(bucket, filePath);
        }

        throw error;
    }

    const { folder, fileName } = splitStoragePath(filePath);
    const cacheKey = `${bucket}:${folder}`;
    const fileNames = existingFileCache.get(cacheKey);

    if (fileNames instanceof Set) {
        fileNames.add(fileName);
    }

    console.log(`Uploaded new: ${filePath}`);

    return getSupabasePublicUrl(bucket, filePath);
}

async function processSongFile(song) {
    const safeTitle = safeFileName(song.title);

    const audioPath = `previews/${song.id}-${safeTitle}.m4a`;

    const imageExt = getExtensionFromUrl(song.thumbnail_url, '.jpg');
    const imagePath = `thumbnails/${song.id}-${safeTitle}${imageExt}`;

    if (SKIP_STORAGE_UPLOAD) {
        return {
            ...song,
            audio_url: getSupabasePublicUrl(AUDIO_BUCKET, audioPath),
            thumbnail_url: getSupabasePublicUrl(IMAGE_BUCKET, imagePath),
        };
    }

    const [hasAudio, hasImage] = await Promise.all([
        hasSupabaseFile(AUDIO_BUCKET, audioPath),
        hasSupabaseFile(IMAGE_BUCKET, imagePath),
    ]);

    const [supabaseAudioUrl, supabaseImageUrl] = await Promise.all([
        hasAudio
            ? getSupabasePublicUrl(AUDIO_BUCKET, audioPath)
            : downloadFile(song.audio_url).then((audioBuffer) =>
                uploadToSupabase(
                    AUDIO_BUCKET,
                    audioPath,
                    audioBuffer,
                    'audio/mp4'
                )
            ),
        hasImage
            ? getSupabasePublicUrl(IMAGE_BUCKET, imagePath)
            : downloadFile(song.thumbnail_url).then((imageBuffer) =>
                uploadToSupabase(
                    IMAGE_BUCKET,
                    imagePath,
                    imageBuffer,
                    getImageContentType(imageExt)
                )
            ),
    ]);

    return {
        ...song,
        audio_url: supabaseAudioUrl,
        thumbnail_url: supabaseImageUrl,
    };
}

async function processArtistFile(artist) {
    if (!artist.avatar_url) {
        return artist;
    }

    const safeName = safeFileName(artist.name);

    const avatarExt = getExtensionFromUrl(artist.avatar_url, '.jpg');
    const avatarPath = `avatars/${artist.id}-${safeName}${avatarExt}`;

    if (SKIP_STORAGE_UPLOAD) {
        return {
            ...artist,
            avatar_url: getSupabasePublicUrl(AVATAR_BUCKET, avatarPath),
        };
    }

    if (await hasSupabaseFile(AVATAR_BUCKET, avatarPath)) {
        return {
            ...artist,
            avatar_url: getSupabasePublicUrl(AVATAR_BUCKET, avatarPath),
        };
    }

    const avatarBuffer = await downloadFile(artist.avatar_url);

    const supabaseAvatarUrl = await uploadToSupabase(
        AVATAR_BUCKET,
        avatarPath,
        avatarBuffer,
        getImageContentType(avatarExt)
    );

    return {
        ...artist,
        avatar_url: supabaseAvatarUrl,
    };
}

async function createSchema(client) {
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaSql};`);

    await client.query(`
    CREATE TABLE IF NOT EXISTS ${schemaSql}.artists (
      id UUID PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      avatar_url TEXT,
      bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

    await client.query(`
    CREATE TABLE IF NOT EXISTS ${schemaSql}.genres (
      id UUID PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
    );
  `);

    await client.query(`
    CREATE TABLE IF NOT EXISTS ${schemaSql}.songs (
      id UUID PRIMARY KEY,
      title VARCHAR(255) NOT NULL,

      artist_id UUID REFERENCES ${schemaSql}.artists(id),
      genre_id UUID REFERENCES ${schemaSql}.genres(id),

      duration INT NOT NULL,
      audio_url TEXT NOT NULL,
      thumbnail_url TEXT,
      release_date DATE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(title, artist_id)
    );
  `);

    await client.query(`
    CREATE TABLE IF NOT EXISTS ${schemaSql}.song_artists (
      song_id UUID REFERENCES ${schemaSql}.songs(id) ON DELETE CASCADE,
      artist_id UUID REFERENCES ${schemaSql}.artists(id) ON DELETE CASCADE,
      PRIMARY KEY (song_id, artist_id)
    );
  `);

    await client.query(`
    CREATE INDEX IF NOT EXISTS idx_songs_artist_id
    ON ${schemaSql}.songs(artist_id);
  `);

    await client.query(`
    CREATE INDEX IF NOT EXISTS idx_songs_genre_id
    ON ${schemaSql}.songs(genre_id);
  `);

    await client.query(`
    CREATE INDEX IF NOT EXISTS idx_song_artists_song_id
    ON ${schemaSql}.song_artists(song_id);
  `);

    await client.query(`
    CREATE INDEX IF NOT EXISTS idx_song_artists_artist_id
    ON ${schemaSql}.song_artists(artist_id);
  `);

    console.log('Schema ready');
}

async function seed() {
    const processedSongs = [];

    for (const song of data.songs) {
        try {
            const processedSong = await processSongFile(song);
            processedSongs.push(processedSong);

            console.log(`Prepared song: ${song.title}`);
        } catch (error) {
            console.error(`Skip song: ${song.title} | ${error.message}`);
        }
    }

    const client = await pool.connect();

    try {
        await createSchema(client);
        await client.query('BEGIN');

        const usedArtistIds = new Set();
        const usedGenreIds = new Set();

        for (const song of processedSongs) {
            usedArtistIds.add(song.artist_id);
            usedGenreIds.add(song.genre_id);
        }

        if (data.song_artists) {
            for (const row of data.song_artists) {
                usedArtistIds.add(row.artist_id);
            }
        }

        const genres = data.genres.filter(g => usedGenreIds.has(g.id));
        const artists = [];

        for (const artist of data.artists.filter(a => usedArtistIds.has(a.id))) {
            try {
                const processedArtist = await processArtistFile(artist);
                artists.push(processedArtist);

                console.log(`Prepared artist: ${artist.name}`);
            } catch (error) {
                console.error(`Keep original avatar: ${artist.name} | ${error.message}`);
                artists.push(artist);
            }
        }

        for (const genre of genres) {
            await client.query(
                `
        INSERT INTO ${schemaSql}.genres (id, name)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        `,
                [genre.id, genre.name]
            );
        }

        for (const artist of artists) {
            await client.query(
                `
        INSERT INTO ${schemaSql}.artists (
          id, name, avatar_url, bio, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (name)
        DO UPDATE SET
          avatar_url = EXCLUDED.avatar_url,
          bio = EXCLUDED.bio,
          updated_at = EXCLUDED.updated_at
        `,
                [
                    artist.id,
                    artist.name,
                    artist.avatar_url,
                    artist.bio,
                    artist.created_at,
                    artist.updated_at,
                ]
            );
        }

        for (const song of processedSongs) {
            await client.query(
                `
        INSERT INTO ${schemaSql}.songs (
          id, title, artist_id, genre_id,
          duration, audio_url, thumbnail_url,
          release_date, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (title, artist_id)
        DO UPDATE SET
          genre_id = EXCLUDED.genre_id,
          duration = EXCLUDED.duration,
          audio_url = EXCLUDED.audio_url,
          thumbnail_url = EXCLUDED.thumbnail_url,
          release_date = EXCLUDED.release_date,
          updated_at = EXCLUDED.updated_at
        `,
                [
                    song.id,
                    song.title,
                    song.artist_id,
                    song.genre_id,
                    song.duration,
                    song.audio_url,
                    song.thumbnail_url,
                    song.release_date,
                    song.created_at,
                    song.updated_at,
                ]
            );
        }

        if (data.song_artists) {
            const processedSongIds = new Set(processedSongs.map(s => s.id));

            for (const row of data.song_artists) {
                if (!processedSongIds.has(row.song_id)) continue;

                await client.query(
                    `
          INSERT INTO ${schemaSql}.song_artists (song_id, artist_id)
          VALUES ($1, $2)
          ON CONFLICT (song_id, artist_id) DO NOTHING
          `,
                    [row.song_id, row.artist_id]
                );
            }
        }

        await client.query('COMMIT');

        console.log('Seed completed');
        console.log(`Genres: ${genres.length}`);
        console.log(`Artists: ${artists.length}`);
        console.log(`Songs: ${processedSongs.length}`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Seed failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

seed().catch(async error => {
    console.error('Seed crashed:', error);
    await pool.end();
    process.exit(1);
});
