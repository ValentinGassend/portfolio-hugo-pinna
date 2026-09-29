// Compresse les vidéos de public/media avec ffmpeg (le serveur n'en a pas) :
//   public/media/_optimized/<chemin>.mp4          H.264, 1920 px max sur le plus grand côté, sans piste audio (vidéos muettes sur le site), faststart
//   public/media/_optimized/<chemin>.poster.webp  première image, affichée pendant le chargement
// Les originaux ne sont pas modifiés. Si la version compressée n'est pas au moins 10 % plus légère, elle est ignorée.
// Usage : node scripts/optimize-videos.mjs [--force]   puis   npm run deploy   (le serveur référence les fichiers)
import {spawn} from "node:child_process";
import {mkdir, readdir, rm, stat, writeFile} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mediaDir = path.join(rootDir, "public", "media");
const optDir = path.join(mediaDir, "_optimized");
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm"]);
const force = process.argv.includes("--force");
const CONCURRENCY = Math.max(1, Math.min(3, Math.floor(os.cpus().length / 4)));

const run = (args) => new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {stdio: ["ignore", "ignore", "pipe"]});
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.trim() || `ffmpeg code ${code}`))));
});

const listVideos = async (dir) => {
    const entries = await readdir(dir, {withFileTypes: true});
    const out = [];
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
            if (full !== optDir) out.push(...await listVideos(full));
        } else if (VIDEO_EXT.has(path.extname(e.name).toLowerCase())) {
            out.push(full);
        }
    }
    return out;
};

const isFresh = async (target, source) => {
    try {
        return (await stat(target)).mtimeMs >= (await stat(source)).mtimeMs;
    } catch {
        return false;
    }
};

const videos = await listVideos(mediaDir);
console.log(`${videos.length} vidéos, ${CONCURRENCY} en parallèle`);
let savedBytes = 0;
const results = [];

const processOne = async (source) => {
    const rel = path.relative(mediaDir, source);
    const base = path.join(optDir, rel.replace(/\.[^.\\/]+$/, ""));
    const video = base + ".mp4";
    const poster = base + ".poster.webp";
    const skipped = base + ".skip";
    await mkdir(path.dirname(base), {recursive: true});
    // Plus grand côté limité à 1920 px (portrait comme paysage), dimensions paires pour H.264
    const scale = "scale='if(gte(iw,ih),min(1920,iw),-2)':'if(gte(iw,ih),-2,min(1920,ih))'";

    if (force || !(await isFresh(poster, source))) {
        await run(["-ss", "0.1", "-i", source, "-frames:v", "1", "-vf", scale, "-c:v", "libwebp", "-quality", "75", poster]);
    }
    if (!force && ((await isFresh(video, source)) || (await isFresh(skipped, source)))) {
        results.push(`= ${rel} (déjà fait)`);
        return;
    }
    await run(["-i", source, "-an", "-vf", scale, "-c:v", "libx264", "-preset", "slow", "-crf", "26",
        "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", video]);
    const before = (await stat(source)).size;
    const after = (await stat(video)).size;
    if (after > before * 0.9) {
        // Pas de gain significatif : l'original reste servi
        await rm(video);
        await writeFile(skipped, "");
        results.push(`- ${rel} : pas de gain (${(before / 1e6).toFixed(1)} Mo)`);
        return;
    }
    savedBytes += before - after;
    results.push(`✓ ${rel} : ${(before / 1e6).toFixed(1)} Mo → ${(after / 1e6).toFixed(1)} Mo`);
    console.log(results.at(-1));
};

const queue = [...videos];
await Promise.all(Array.from({length: CONCURRENCY}, async () => {
    while (queue.length) {
        const source = queue.shift();
        try {
            await processOne(source);
        } catch (error) {
            results.push(`✗ ${path.relative(mediaDir, source)} : ${error.message}`);
            console.log(results.at(-1));
        }
    }
}));

console.log(`\n${results.filter((r) => r.startsWith("✓")).length} vidéos compressées, ${(savedBytes / 1e6).toFixed(0)} Mo économisés`);
const failures = results.filter((r) => r.startsWith("✗"));
if (failures.length) {
    console.log(failures.join("\n"));
    process.exitCode = 1;
}
