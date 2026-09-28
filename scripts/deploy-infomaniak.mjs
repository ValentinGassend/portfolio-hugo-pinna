// Déploie le site (dist/, médias compris) sur hugo-pinna.valentingassend.com (hébergement Infomaniak) par SFTP.
// N'envoie que les fichiers absents ou de taille différente : on peut le relancer sans risque.
// Usage : npm run build && node --env-file=.env.local scripts/deploy-infomaniak.mjs
//
// .env.local (non versionné), mêmes noms que little_and_co :
//   DEPLOY_HOST=xxxx.ftp.infomaniak.com
//   DEPLOY_USER=xxxx
//   DEPLOY_PASSWORD=xxxx
//   DEPLOY_REMOTE_PATH=sites/hugo-pinna.valentingassend.com   (relatif au dossier personnel FTP)
//   DEPLOY_PORT=22            (optionnel)
import SftpClient from "ssh2-sftp-client";
import {readdir, stat} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const SITE_URL = "https://hugo-pinna.valentingassend.com";

const required = ["DEPLOY_HOST", "DEPLOY_USER", "DEPLOY_PASSWORD", "DEPLOY_REMOTE_PATH"];
for (const key of required) {
    if (!process.env[key]) {
        console.error(`Variable manquante : ${key}`);
        process.exit(1);
    }
}
let remoteRoot = process.env.DEPLOY_REMOTE_PATH.replace(/\/$/, "");

// Routage SPA (react-router) + cache long sur les fichiers au nom unique + médias accessibles depuis hugopinna.com
// (compression reprise du .htaccess par défaut d'Infomaniak, sans SetOutputFilter qui compresserait aussi les vidéos)
const HTACCESS = `Options -Indexes
DirectoryIndex index.html

AddOutputFilterByType DEFLATE "application/javascript" "application/json" "application/xml" "font/ttf" "font/opentype" "application/x-font-ttf" "image/svg+xml" "image/x-icon" "text/css" "text/html" "text/javascript" "text/plain" "text/xml"

# SECTION BEGIN GIT PROTECTION
RedirectMatch 404 /\\.git
# SECTION END GIT PROTECTION

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/(media|assets|font|images|lotties)/
    RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
    <If "%{REQUEST_URI} =~ m#^/(media|assets|font)/#">
        Header set Access-Control-Allow-Origin "*"
        Header set Cache-Control "public, max-age=31536000, immutable"
    </If>
    <Files "index.html">
        Header set Cache-Control "no-cache"
    </Files>
</IfModule>
`;

const listFiles = async (dir) => {
    const entries = await readdir(dir, {withFileTypes: true});
    const files = await Promise.all(entries.map((e) => {
        const full = path.join(dir, e.name);
        return e.isDirectory() ? listFiles(full) : [full];
    }));
    return files.flat();
};

const files = await listFiles(distDir).catch(() => {
    console.error("dist/ introuvable : lancer `npm run build` avant le déploiement.");
    process.exit(1);
});
// index.html en dernier : le site ne bascule qu'une fois tous ses fichiers en ligne
files.sort((a, b) => (path.basename(a) === "index.html") - (path.basename(b) === "index.html"));
console.log(`📦 ${files.length} fichiers à synchroniser vers ${process.env.DEPLOY_HOST}:${remoteRoot}`);

const sftp = new SftpClient();
await sftp.connect({
    host: process.env.DEPLOY_HOST,
    port: Number(process.env.DEPLOY_PORT || 22),
    username: process.env.DEPLOY_USER,
    password: process.env.DEPLOY_PASSWORD,
    readyTimeout: 30_000,
});

// Chemin relatif (ex. sites/mon-site) : résolu depuis le dossier personnel du compte FTP
if (!remoteRoot.startsWith("/")) {
    remoteRoot = `${await sftp.cwd()}/${remoteRoot}`;
}
await sftp.mkdir(remoteRoot, true);
await sftp.put(Buffer.from(HTACCESS), `${remoteRoot}/.htaccess`);

let uploaded = 0, skipped = 0;
const failed = [];
const createdDirs = new Set();
for (const file of files) {
    const rel = path.relative(distDir, file).split(path.sep).join("/");
    const remote = `${remoteRoot}/${rel}`;
    try {
        const {size} = await stat(file);
        const remoteStat = await sftp.stat(remote).catch(() => null);
        // index.html change de contenu à chaque build sans forcément changer de taille : toujours renvoyé
        if (remoteStat && remoteStat.size === size && rel !== "index.html") {
            skipped++;
            continue;
        }
        const remoteDir = path.posix.dirname(remote);
        if (!createdDirs.has(remoteDir)) {
            await sftp.mkdir(remoteDir, true);
            createdDirs.add(remoteDir);
        }
        await sftp.fastPut(file, remote);
        uploaded++;
        console.log(`ok ${rel}`);
    } catch (error) {
        failed.push(`${rel} : ${error.message}`);
    }
}
await sftp.end();

console.log(`\n✅ ${uploaded} envoyés, ${skipped} déjà à jour, ${failed.length} en échec`);
if (failed.length) {
    console.log(failed.join("\n"));
    process.exitCode = 1;
}
console.log(`🌐 ${SITE_URL}`);
