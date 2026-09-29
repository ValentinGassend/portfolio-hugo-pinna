<?php
// API du CMS Hugo Pinna (remplace FireCMS / Firestore / Firebase Storage).
// - Contenu : <site>/data/content.json (lu par le site, public en lecture)
// - Médias  : <site>/media/<dossier>/<xxxxx>_<nom>
// - Privé   : comptes, sauvegardes, uploads en cours, anti-bruteforce (hors du dossier web)

declare(strict_types=1);

const COLLECTIONS = ['projects', 'gallery', 'landing', 'about', 'contact', 'gallery_part', 'assets'];
const MEDIA_DIRS = ['images', 'gallery', 'Landing', 'assets', 'contact', ''];
const MEDIA_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'avif', 'mp4', 'mov', 'webm', 'glb'];
const MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // 1 Go par fichier (envoi découpé en morceaux)
const MAX_BACKUPS = 100;
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_SECONDS = 900;

$siteRoot = dirname(__DIR__);
$privateDir = getenv('CMS_PRIVATE_DIR') ?: dirname($siteRoot, 2) . '/.hugo-pinna-cms';
$contentFile = $siteRoot . '/data/content.json';
$mediaRoot = $siteRoot . '/media';
$manifestFile = $siteRoot . '/data/media.json';

require __DIR__ . '/lib/optimizer.php';

ini_set('display_errors', '0');
set_exception_handler(function (Throwable $e) {
    error_log('[cms] ' . $e);
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur']);
});

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $status, string $message): never
{
    respond($status, ['error' => $message]);
}

function ensureDir(string $dir): void
{
    if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
        fail(500, "Impossible de créer le dossier $dir");
    }
}

function readJson(string $file, mixed $default): mixed
{
    if (!is_file($file)) {
        return $default;
    }
    $data = json_decode((string)file_get_contents($file), true);
    return $data ?? $default;
}

function writeJsonAtomic(string $file, mixed $data): void
{
    ensureDir(dirname($file));
    $tmp = $file . '.tmp-' . bin2hex(random_bytes(4));
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false || file_put_contents($tmp, $json . "\n") === false || !rename($tmp, $file)) {
        @unlink($tmp);
        fail(500, "Écriture impossible : $file");
    }
}

// Longueur / fin de chaîne UTF-8 sans dépendre de l'extension mbstring
function textLength(string $s): int
{
    return preg_match_all('/./su', $s);
}

function textTail(string $s, int $max): string
{
    preg_match_all('/./su', $s, $chars);
    return implode('', array_slice($chars[0], -$max));
}

function randomId(int $length = 20): string
{
    // Même format que les identifiants Firestore
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    $id = '';
    for ($i = 0; $i < $length; $i++) {
        $id .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    }
    return $id;
}

function input(): array
{
    static $body = null;
    if ($body === null) {
        $raw = file_get_contents('php://input');
        $body = str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') ? (json_decode($raw ?: '[]', true) ?: []) : $_POST;
    }
    return $body;
}

// ── Session ──────────────────────────────────────────────────────────────────
ensureDir($privateDir . '/sessions');
session_save_path($privateDir . '/sessions');
session_name('hp_cms');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/admin/',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Strict',
]);
ini_set('session.gc_maxlifetime', '43200');
ini_set('session.use_strict_mode', '1');
session_start();

$usersFile = $privateDir . '/users.json';
$users = readJson($usersFile, []);

function currentUser(): ?string
{
    return $_SESSION['user'] ?? null;
}

function csrfToken(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function requireAuth(): string
{
    $user = currentUser();
    if ($user === null) {
        fail(401, 'Non connecté');
    }
    return $user;
}

function requireCsrf(): void
{
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($sent) || !hash_equals(csrfToken(), $sent)) {
        fail(403, 'Jeton CSRF invalide, recharge la page');
    }
}

// ── Anti-bruteforce ──────────────────────────────────────────────────────────
function loginAttempts(string $privateDir): array
{
    $recent = [];
    foreach (readJson($privateDir . '/login-attempts.json', []) as $ip => $times) {
        $times = array_values(array_filter((array)$times, fn($t) => $t > time() - LOGIN_WINDOW_SECONDS));
        if ($times) {
            $recent[$ip] = $times;
        }
    }
    return $recent;
}

function recordFailedLogin(string $privateDir, string $ip): void
{
    $all = loginAttempts($privateDir);
    $all[$ip][] = time();
    writeJsonAtomic($privateDir . '/login-attempts.json', $all);
}

function isLocked(string $privateDir, string $ip): bool
{
    return count(loginAttempts($privateDir)[$ip] ?? []) >= LOGIN_MAX_ATTEMPTS;
}

// ── Contenu ──────────────────────────────────────────────────────────────────
function withContentLock(string $contentFile, string $privateDir, callable $fn): mixed
{
    ensureDir($privateDir);
    $lock = fopen($privateDir . '/content.lock', 'c');
    flock($lock, LOCK_EX);
    try {
        $content = readJson($contentFile, []);
        foreach (COLLECTIONS as $name) {
            $content[$name] ??= [];
        }
        [$newContent, $result] = $fn($content);
        if ($newContent !== null) {
            backupContent($contentFile, $privateDir);
            writeJsonAtomic($contentFile, $newContent);
        }
        return $result;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function backupContent(string $contentFile, string $privateDir): void
{
    if (!is_file($contentFile)) {
        return;
    }
    $dir = $privateDir . '/backups';
    ensureDir($dir);
    copy($contentFile, $dir . '/content-' . date('Ymd-His') . '-' . bin2hex(random_bytes(2)) . '.json');
    $backups = glob($dir . '/content-*.json') ?: [];
    sort($backups);
    foreach (array_slice($backups, 0, max(0, count($backups) - MAX_BACKUPS)) as $old) {
        @unlink($old);
    }
}

function checkCollection(mixed $name): string
{
    if (!is_string($name) || !in_array($name, COLLECTIONS, true)) {
        fail(400, 'Collection inconnue');
    }
    return $name;
}

// ── Médias ───────────────────────────────────────────────────────────────────
function sanitizeFilename(string $name): string
{
    if (!preg_match('//u', $name)) {
        // Nom reçu dans un autre encodage que l'UTF-8 : conversion, sinon on ne garde que l'ASCII
        $converted = function_exists('iconv') ? @iconv('Windows-1252', 'UTF-8//IGNORE', $name) : false;
        $name = $converted !== false ? $converted : preg_replace('/[^\x20-\x7E]/', '', $name);
    }
    $name = basename(str_replace('\\', '/', $name));
    $name = preg_replace('/[\x00-\x1F\/\\\\:*?"<>|]+/u', '', $name) ?? '';
    $name = trim($name, " .");
    return $name === '' ? 'fichier' : textTail($name, 120);
}

// ── Routage ──────────────────────────────────────────────────────────────────
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

if ($method !== 'GET') {
    // Les appels d'écriture ne sont acceptés que depuis le CMS lui-même
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $originHost = parse_url($origin, PHP_URL_HOST) . (parse_url($origin, PHP_URL_PORT) ? ':' . parse_url($origin, PHP_URL_PORT) : '');
    if ($origin !== '' && strtolower($originHost) !== strtolower($_SERVER['HTTP_HOST'] ?? '')) {
        fail(403, 'Origine refusée');
    }
}

switch ("$method $action") {
    case 'GET session':
        respond(200, [
            'user' => currentUser(),
            'csrf' => currentUser() ? csrfToken() : null,
            'needsSetup' => empty($users),
        ]);

    case 'POST setup':
        if (!empty($users)) {
            fail(403, 'Le CMS est déjà configuré');
        }
        $tokenFile = $privateDir . '/setup-token';
        $token = is_file($tokenFile) ? trim((string)file_get_contents($tokenFile)) : '';
        $body = input();
        if ($token === '' || !hash_equals($token, (string)($body['token'] ?? ''))) {
            recordFailedLogin($privateDir, $ip);
            fail(403, "Lien d'installation invalide");
        }
        $username = trim((string)($body['username'] ?? ''));
        $password = (string)($body['password'] ?? '');
        if (!preg_match('/^[\w.@-]{2,64}$/u', $username) || textLength($password) < 12) {
            fail(400, 'Identifiant invalide ou mot de passe trop court (12 caractères minimum)');
        }
        writeJsonAtomic($usersFile, [$username => password_hash($password, PASSWORD_DEFAULT)]);
        @unlink($tokenFile);
        session_regenerate_id(true);
        $_SESSION['user'] = $username;
        respond(200, ['user' => $username, 'csrf' => csrfToken()]);

    case 'POST login':
        if (isLocked($privateDir, $ip)) {
            fail(429, 'Trop de tentatives, réessaie dans 15 minutes');
        }
        $body = input();
        $username = (string)($body['username'] ?? '');
        $password = (string)($body['password'] ?? '');
        $hash = $users[$username] ?? null;
        if (!is_string($hash) || !password_verify($password, $hash)) {
            recordFailedLogin($privateDir, $ip);
            usleep(random_int(200000, 500000));
            fail(401, 'Identifiant ou mot de passe incorrect');
        }
        if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
            $users[$username] = password_hash($password, PASSWORD_DEFAULT);
            writeJsonAtomic($usersFile, $users);
        }
        session_regenerate_id(true);
        $_SESSION['user'] = $username;
        respond(200, ['user' => $username, 'csrf' => csrfToken()]);

    case 'POST logout':
        requireCsrf();
        $_SESSION = [];
        session_destroy();
        respond(200, ['ok' => true]);

    case 'POST add_user':
        requireAuth();
        requireCsrf();
        $body = input();
        $username = trim((string)($body['username'] ?? ''));
        $password = (string)($body['password'] ?? '');
        if (!preg_match('/^[\w.@-]{2,64}$/u', $username) || textLength($password) < 12) {
            fail(400, 'Identifiant invalide ou mot de passe trop court (12 caractères minimum)');
        }
        $users[$username] = password_hash($password, PASSWORD_DEFAULT);
        writeJsonAtomic($usersFile, $users);
        respond(200, ['users' => array_keys($users)]);

    case 'GET users':
        requireAuth();
        respond(200, ['users' => array_keys($users)]);

    case 'POST delete_user':
        $me = requireAuth();
        requireCsrf();
        $username = (string)(input()['username'] ?? '');
        if ($username === $me) {
            fail(400, 'Impossible de supprimer son propre compte');
        }
        unset($users[$username]);
        writeJsonAtomic($usersFile, $users);
        respond(200, ['users' => array_keys($users)]);

    case 'GET content':
        requireAuth();
        $content = readJson($contentFile, []);
        foreach (COLLECTIONS as $name) {
            $content[$name] ??= [];
        }
        respond(200, ['content' => $content]);

    case 'POST save_doc':
        requireAuth();
        requireCsrf();
        $body = input();
        $collection = checkCollection($body['collection'] ?? null);
        $doc = $body['doc'] ?? null;
        if (!is_array($doc) || array_is_list($doc) && $doc !== []) {
            fail(400, 'Document invalide');
        }
        $saved = withContentLock($contentFile, $privateDir, function (array $content) use ($collection, $doc) {
            $id = isset($doc['id']) && is_string($doc['id']) && preg_match('/^[\w-]{1,64}$/', $doc['id']) ? $doc['id'] : randomId();
            $doc = ['id' => $id] + $doc;
            $index = null;
            foreach ($content[$collection] as $i => $existing) {
                if (($existing['id'] ?? null) === $id) {
                    $index = $i;
                    break;
                }
            }
            if ($index === null) {
                $content[$collection][] = $doc;
            } else {
                // Les champs inconnus du formulaire sont conservés
                $content[$collection][$index] = array_merge($content[$collection][$index], $doc);
                $doc = $content[$collection][$index];
            }
            return [$content, $doc];
        });
        respond(200, ['doc' => $saved]);

    case 'POST delete_doc':
        requireAuth();
        requireCsrf();
        $body = input();
        $collection = checkCollection($body['collection'] ?? null);
        $id = (string)($body['id'] ?? '');
        withContentLock($contentFile, $privateDir, function (array $content) use ($collection, $id) {
            $content[$collection] = array_values(array_filter($content[$collection], fn($d) => ($d['id'] ?? null) !== $id));
            return [$content, null];
        });
        respond(200, ['ok' => true]);

    case 'GET backups':
        requireAuth();
        $files = glob($privateDir . '/backups/content-*.json') ?: [];
        rsort($files);
        respond(200, ['backups' => array_map(fn($f) => ['name' => basename($f), 'size' => filesize($f), 'date' => date('c', filemtime($f))], $files)]);

    case 'POST restore_backup':
        requireAuth();
        requireCsrf();
        $name = basename((string)(input()['name'] ?? ''));
        $file = $privateDir . '/backups/' . $name;
        if (!preg_match('/^content-[\w-]+\.json$/', $name) || !is_file($file)) {
            fail(404, 'Sauvegarde introuvable');
        }
        $backup = readJson($file, null);
        if (!is_array($backup)) {
            fail(400, 'Sauvegarde illisible');
        }
        withContentLock($contentFile, $privateDir, fn() => [$backup, null]);
        respond(200, ['ok' => true]);

    case 'POST upload':
        // Envoi découpé : chaque requête porte un morceau ; le dernier finalise le fichier.
        requireAuth();
        requireCsrf();
        $dir = (string)($_POST['dir'] ?? '');
        $uploadId = (string)($_POST['uploadId'] ?? '');
        $index = (int)($_POST['index'] ?? -1);
        $total = (int)($_POST['total'] ?? 0);
        $filename = sanitizeFilename((string)($_POST['filename'] ?? ''));
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        if (!in_array($dir, MEDIA_DIRS, true)) {
            fail(400, 'Dossier de destination invalide');
        }
        if (!in_array($extension, MEDIA_EXTENSIONS, true)) {
            fail(400, "Type de fichier non autorisé (.$extension)");
        }
        if (!preg_match('/^[a-f0-9]{32}$/', $uploadId) || $index < 0 || $total < 1 || $index >= $total || $total > 2000) {
            fail(400, 'Paramètres de découpage invalides');
        }
        if (!isset($_FILES['chunk']) || $_FILES['chunk']['error'] !== UPLOAD_ERR_OK) {
            fail(400, "Morceau manquant (erreur d'envoi " . ($_FILES['chunk']['error'] ?? '?') . ')');
        }
        $tmpDir = $privateDir . '/uploads';
        ensureDir($tmpDir);
        // Nettoyage des envois abandonnés (> 1 jour)
        foreach (glob($tmpDir . '/*.part') ?: [] as $stale) {
            if (filemtime($stale) < time() - 86400) {
                @unlink($stale);
            }
        }
        $part = $tmpDir . '/' . $uploadId . '.part';
        if ($index === 0) {
            @unlink($part);
        } elseif (!is_file($part)) {
            fail(400, 'Envoi interrompu, recommence');
        }
        $out = fopen($part, 'ab');
        $in = fopen($_FILES['chunk']['tmp_name'], 'rb');
        stream_copy_to_stream($in, $out);
        fclose($in);
        fclose($out);
        clearstatcache(true, $part);
        if (filesize($part) > MAX_UPLOAD_BYTES) {
            @unlink($part);
            fail(413, 'Fichier trop lourd (1 Go maximum)');
        }
        if ($index < $total - 1) {
            respond(200, ['received' => $index + 1]);
        }
        // Dernier morceau : contrôle du contenu réel puis rangement dans /media
        if (function_exists('finfo_open')) {
            $mime = (string)finfo_file(finfo_open(FILEINFO_MIME_TYPE), $part);
            $allowed = str_starts_with($mime, 'image/') || str_starts_with($mime, 'video/')
                || ($extension === 'glb' && in_array($mime, ['application/octet-stream', 'model/gltf-binary'], true))
                || ($extension === 'svg' && in_array($mime, ['text/xml', 'application/xml', 'text/plain', 'image/svg+xml'], true));
            if (!$allowed) {
                @unlink($part);
                fail(400, "Contenu non reconnu comme image ou vidéo ($mime)");
            }
        }
        // Nom unique : un média existant (original ou non) n'est jamais écrasé
        do {
            $prefix = substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 5);
            $relative = ($dir === '' ? '' : $dir . '/') . $prefix . '_' . $filename;
            $target = $mediaRoot . '/' . $relative;
        } while (file_exists($target));
        ensureDir(dirname($target));
        if (!rename($part, $target)) {
            fail(500, "Impossible d'enregistrer le fichier");
        }
        chmod($target, 0644);
        // Variantes responsive générées tout de suite (une erreur ici ne fait pas échouer l'envoi)
        $optimized = null;
        try {
            set_time_limit(300);
            $optimized = optProcess($mediaRoot, $manifestFile, $relative);
        } catch (Throwable $e) {
            error_log('[cms] optimisation ' . $relative . ' : ' . $e->getMessage());
        }
        respond(200, ['path' => $relative, 'optimized' => $optimized]);

    case 'GET optimize_status':
        requireAuth();
        $status = optStatus($mediaRoot, $manifestFile);
        $status['pending'] = count($status['pending']);
        respond(200, $status);

    case 'POST optimize_batch':
        // Traite les images non optimisées pendant ~20 s ; le CMS rappelle jusqu'à ce qu'il n'en reste plus
        requireAuth();
        requireCsrf();
        session_write_close();
        set_time_limit(120);
        $force = !empty(input()['force']);
        $pending = $force ? array_values(array_filter(optListMedia($mediaRoot), 'optIsImage')) : optStatus($mediaRoot, $manifestFile)['pending'];
        $offset = $force ? max(0, (int)(input()['offset'] ?? 0)) : 0;
        $start = microtime(true);
        $processed = 0;
        $errors = [];
        for ($i = $offset; $i < count($pending) && microtime(true) - $start < 20; $i++) {
            try {
                optProcess($mediaRoot, $manifestFile, $pending[$i], $force);
            } catch (Throwable $e) {
                $errors[] = $pending[$i] . ' : ' . $e->getMessage();
                if (!$force) {
                    // Évite de reboucler indéfiniment sur un fichier illisible
                    optUpdateManifest($manifestFile, function (array $m) use ($pending, $i) {
                        $m['images'][$pending[$i]] = ['w' => 0, 'h' => 0, 'widths' => [], 'error' => true];
                        return $m;
                    });
                }
            }
            $processed++;
        }
        respond(200, [
            'processed' => $processed,
            'remaining' => max(0, count($pending) - $offset - $processed),
            'nextOffset' => $offset + $processed,
            'errors' => $errors,
        ]);

    default:
        fail(404, 'Action inconnue');
}
