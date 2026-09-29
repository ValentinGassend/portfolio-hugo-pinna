// Lance l'optimisation des médias directement sur le serveur Infomaniak (SSH), en parallèle.
// Génère les variantes WebP responsive de toutes les images et référence les vidéos compressées.
// Usage : node --env-file=.env.local scripts/optimize-remote.mjs [--force] [--jobs=16]
import {Client} from "ssh2";

const force = process.argv.includes("--force");
const jobs = Number(process.argv.find((a) => a.startsWith("--jobs="))?.split("=")[1] || 16);
const remotePath = (process.env.DEPLOY_REMOTE_PATH || "").replace(/\/$/, "");
for (const key of ["DEPLOY_HOST", "DEPLOY_USER", "DEPLOY_PASSWORD", "DEPLOY_REMOTE_PATH"]) {
    if (!process.env[key]) {
        console.error(`Variable manquante : ${key}`);
        process.exit(1);
    }
}

const quote = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
const shards = Array.from({length: jobs}, (_, i) =>
    `php admin/optimize.php --shard=${i + 1}/${jobs}${force ? " --force" : ""} > /tmp/hp-opt-${i + 1}.log 2>&1 &`).join(" ");
// cd séparé par « ; » : avec « && », le cd ne s'appliquerait qu'au premier processus lancé en arrière-plan
const command = `cd ${quote(remotePath)} || exit 1; ${shards} wait; cat /tmp/hp-opt-*.log | grep -v "^\\[" ; `
    + `rm -f /tmp/hp-opt-*.log; `
    + `php -r '$m=json_decode(file_get_contents("data/media.json"),true); echo count($m["images"])," images et ",count($m["videos"])," vidéos dans le manifeste\\n";'`;

console.log(`⚙️  Optimisation sur le serveur (${jobs} processus${force ? ", régénération complète" : ""})…`);
const started = Date.now();
const conn = new Client();
conn.on("ready", () => {
    conn.exec(command, (err, stream) => {
        if (err) {
            console.error(err.message);
            conn.end();
            process.exitCode = 1;
            return;
        }
        stream.on("data", (d) => process.stdout.write(d));
        stream.stderr.on("data", (d) => process.stderr.write(d));
        stream.on("close", (code) => {
            console.log(`\n✅ Terminé en ${Math.round((Date.now() - started) / 1000)} s (code ${code})`);
            conn.end();
        });
    });
}).on("error", (e) => {
    console.error(`SSH : ${e.message}`);
    process.exitCode = 1;
}).connect({
    host: process.env.DEPLOY_HOST,
    port: Number(process.env.DEPLOY_PORT || 22),
    username: process.env.DEPLOY_USER,
    password: process.env.DEPLOY_PASSWORD,
    readyTimeout: 30_000,
    keepaliveInterval: 15_000,
});
