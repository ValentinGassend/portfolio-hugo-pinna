// Déploie le site, le CMS (/admin) et les médias sur hugo-pinna.valentingassend.com (hébergement Infomaniak) par SFTP.
// - Code (html/js/css/php) : toujours renvoyé.
// - Médias : envoyés seulement s'ils sont absents ou de taille différente (relançable sans risque).
// - Contenu (data/content.json) : jamais écrasé, il appartient au CMS. Créé depuis src/data/content.json s'il n'existe pas.
// - Tant qu'aucun compte CMS n'existe, un lien d'installation à usage unique est généré.
// Usage : npm run deploy   (= vite build && node --env-file=.env.local scripts/deploy-infomaniak.mjs)
//
// .env.local (non versionné), mêmes noms que little_and_co :
//   DEPLOY_HOST=xxxx.ftp.infomaniak.com
//   DEPLOY_USER=xxxx
//   DEPLOY_PASSWORD=xxxx
//   DEPLOY_REMOTE_PATH=sites/hugo-pinna.valentingassend.com   (relatif au dossier personnel FTP)
//   DEPLOY_PORT=22            (optionnel)
//   DEPLOY_SITE_URL=https://hugo-pinna.valentingassend.com   (optionnel)
import SftpClient from "ssh2-sftp-client";
import {randomBytes} from "node:crypto";
import {readdir, stat} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const seedContent = path.join(rootDir, "src", "data", "content.json");
const SITE_URL = (process.env.DEPLOY_SITE_URL || "https://hugo-pinna.valentingassend.com").replace(/\/$/, "");
// Dossier privé du CMS (comptes, sauvegardes) : hors du dossier web, cf. public/admin/api.php
const PRIVATE_DIR_NAME = ".hugo-pinna-cms";

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
DirectoryIndex index.html index.php

AddOutputFilterByType DEFLATE "application/javascript" "application/json" "application/xml" "font/ttf" "font/opentype" "application/x-font-ttf" "image/svg+xml" "image/x-icon" "text/css" "text/html" "text/javascript" "text/plain" "text/xml"

# SECTION BEGIN GIT PROTECTION
RedirectMatch 404 /\\.git
# SECTION END GIT PROTECTION

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/(media|assets|font|images|lotties|admin|data)/
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

// Médias : aucun script exécutable, contenu isolé s'il est ouvert directement (ex. SVG)
const MEDIA_HTACCESS = `Options -Indexes
<FilesMatch "\\.(php\\d?|phtml|phar|pl|py|cgi|sh|html?)$">
    Require all denied
</FilesMatch>
RemoveHandler .php .phtml .phar
RemoveType .php .phtml .phar
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set Content-Security-Policy "sandbox; default-src 'none'; img-src 'self' data:; media-src 'self'; style-src 'unsafe-inline'"
</IfModule>
`;

// Contenu et manifeste des médias : lus par le site à chaque visite, jamais mis en cache
const DATA_HTACCESS = `Options -Indexes
<FilesMatch "^(?!(content|media)\\.json$)">
    Require all denied
</FilesMatch>
<IfModule mod_headers.c>
    Header set Cache-Control "no-cache"
    Header set Access-Control-Allow-Origin "*"
</IfModule>
`;

// CMS : pas d'indexation, pas de cache (les mises à jour du CMS sont prises immédiatement)
const ADMIN_HTACCESS = `Options -Indexes
DirectoryIndex index.html
<IfModule mod_headers.c>
    Header set Cache-Control "no-cache"
    Header set X-Robots-Tag "noindex, nofollow"
    Header set X-Frame-Options "DENY"
    Header set Referrer-Policy "same-origin"
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
files.sort((a, b) => (path.relative(distDir, a) === "index.html") - (path.relative(distDir, b) === "index.html"));
console.log(`📦 ${files.length} fichiers à synchroniser vers ${process.env.DEPLOY_HOST}:${remoteRoot}`);

const sftp = new SftpClient();
await sftp.connect({
    host: process.env.DEPLOY_HOST,
    port: Number(process.env.DEPLOY_PORT || 22),
    username: process.env.DEPLOY_USER,
    password: process.env.DEPLOY_PASSWORD,
    readyTimeout: 30_000,
});

const home = await sftp.cwd();
// Chemin relatif (ex. sites/mon-site) : résolu depuis le dossier personnel du compte FTP
if (!remoteRoot.startsWith("/")) {
    remoteRoot = `${home}/${remoteRoot}`;
}
await sftp.mkdir(remoteRoot, true);
for (const dir of ["media", "data", "admin"]) {
    await sftp.mkdir(`${remoteRoot}/${dir}`, true);
}
await sftp.put(Buffer.from(HTACCESS), `${remoteRoot}/.htaccess`);
await sftp.put(Buffer.from(MEDIA_HTACCESS), `${remoteRoot}/media/.htaccess`);
await sftp.put(Buffer.from(DATA_HTACCESS), `${remoteRoot}/data/.htaccess`);
await sftp.put(Buffer.from(ADMIN_HTACCESS), `${remoteRoot}/admin/.htaccess`);

let uploaded = 0, skipped = 0;
const failed = [];
const createdDirs = new Set();
for (const file of files) {
    const rel = path.relative(distDir, file).split(path.sep).join("/");
    const remote = `${remoteRoot}/${rel}`;
    const isMedia = rel.startsWith("media/");
    // Le contenu appartient au CMS : jamais écrasé par un déploiement
    if (rel.startsWith("data/")) continue;
    try {
        if (isMedia) {
            const {size} = await stat(file);
            const remoteStat = await sftp.stat(remote).catch(() => null);
            if (remoteStat && remoteStat.size === size) {
                skipped++;
                continue;
            }
        }
        const remoteDir = path.posix.dirname(remote);
        if (!createdDirs.has(remoteDir)) {
            await sftp.mkdir(remoteDir, true);
            createdDirs.add(remoteDir);
        }
        await sftp.fastPut(file, remote);
        uploaded++;
        if (isMedia) console.log(`ok ${rel}`);
    } catch (error) {
        failed.push(`${rel} : ${error.message}`);
    }
}

// Contenu initial (uniquement s'il n'existe pas encore : ensuite c'est le CMS qui le gère)
const remoteContent = `${remoteRoot}/data/content.json`;
if (await sftp.exists(remoteContent)) {
    console.log("📝 data/content.json déjà présent : conservé (géré par le CMS)");
} else {
    await sftp.fastPut(seedContent, remoteContent);
    console.log("📝 data/content.json créé depuis src/data/content.json");
}

// Dossier privé du CMS + lien d'installation si aucun compte n'existe
const privateDir = `${home}/${PRIVATE_DIR_NAME}`;
await sftp.mkdir(privateDir, true);
await sftp.chmod(privateDir, 0o750).catch(() => null);
let setupUrl = null;
if (!(await sftp.exists(`${privateDir}/users.json`))) {
    const token = randomBytes(24).toString("hex");
    await sftp.put(Buffer.from(token), `${privateDir}/setup-token`);
    setupUrl = `${SITE_URL}/admin/?setup=${token}`;
}
await sftp.end();

console.log(`\n✅ ${uploaded} envoyés, ${skipped} médias déjà à jour, ${failed.length} en échec`);
if (failed.length) {
    console.log(failed.join("\n"));
    process.exitCode = 1;
}
console.log(`🌐 Site : ${SITE_URL}`);
console.log(`🛠️  CMS  : ${SITE_URL}/admin/`);
if (setupUrl) {
    console.log(`\n🔑 Aucun compte CMS : crée le compte administrateur via ce lien (usage unique) :\n   ${setupUrl}`);
}
