// Télécharge dans public/media/ tous les fichiers référencés par src/data/content.json,
// depuis l'ancien bucket Firebase Storage (ou toute autre source via MEDIA_SOURCE).
// Usage : node scripts/download-media.mjs          (fichiers utilisés par le site)
//         node scripts/download-media.mjs --all    (tout le bucket)
// Source alternative : MEDIA_SOURCE="https://exemple.com/base/" node scripts/download-media.mjs
import {mkdir, readFile, stat, writeFile} from "node:fs/promises";
import {dirname} from "node:path";

const content = JSON.parse(await readFile(new URL("../src/data/content.json", import.meta.url), "utf8"));
const SOURCE = process.env.MEDIA_SOURCE;
const BUCKET = "https://firebasestorage.googleapis.com/v0/b/portfolio-hugo-pinna.appspot.com/o/";

// Récupère toutes les chaînes qui ressemblent à un chemin de fichier média.
const paths = new Set();
const walk = (v) => {
    if (typeof v === "string") {
        if (/^[^:]+\.(png|jpe?g|webp|gif|svg|mp4|mov|webm|avi|wmv|glb)$/i.test(v)) paths.add(v);
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
};
walk(content);

// --all : télécharge tout le contenu du bucket (variantes redimensionnées et anciens uploads compris)
if (process.argv.includes("--all")) {
    let pageToken = "";
    do {
        const res = await fetch(`${BUCKET}?maxResults=1000${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`);
        if (!res.ok) throw new Error(`Listing du bucket : HTTP ${res.status}`);
        const json = await res.json();
        (json.items || []).forEach((item) => paths.add(item.name));
        pageToken = json.nextPageToken || "";
    } while (pageToken);
}

let ok = 0, skipped = 0;
const failed = [];
for (const path of [...paths].sort()) {
    const target = new URL(`../public/media/${path}`, import.meta.url);
    try {
        await stat(target);
        skipped++;
        continue;
    } catch { /* absent : on télécharge */ }

    const url = SOURCE
        ? SOURCE + path.split("/").map(encodeURIComponent).join("/")
        : BUCKET + encodeURIComponent(path) + "?alt=media";
    const res = await fetch(url);
    if (!res.ok) {
        failed.push(`${res.status} ${path}`);
        continue;
    }
    await mkdir(dirname(target.pathname.replace(/^\/([A-Za-z]:)/, "$1")), {recursive: true});
    await writeFile(target, Buffer.from(await res.arrayBuffer()));
    ok++;
    console.log(`ok ${path}`);
}

console.log(`\n${paths.size} fichiers référencés : ${ok} téléchargés, ${skipped} déjà présents, ${failed.length} en échec`);
if (failed.length) {
    console.log(failed.join("\n"));
    process.exitCode = 1;
}
