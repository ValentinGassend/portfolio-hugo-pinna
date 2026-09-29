<?php
// Optimisation des médias façon WordPress : variantes WebP responsive + manifeste lu par le site.
// - Images : /media/_optimized/<chemin sans extension>-<largeur>.webp pour chaque largeur < largeur d'origine
// - Vidéos : /media/_optimized/<chemin>.mp4 et .poster.webp (produits en local par scripts/optimize-videos.mjs),
//   simplement référencés ici s'ils existent.
// - Manifeste : /data/media.json  { images: {chemin: {w, h, widths[]}}, videos: {chemin: {src, poster}} }
// Les originaux ne sont jamais modifiés.

declare(strict_types=1);

const OPT_WIDTHS = [320, 640, 960, 1280, 1920, 2560];
const OPT_WEBP_QUALITY = 80;
const OPT_DIR = '_optimized';
const OPT_IMAGE_EXT = ['png', 'jpg', 'jpeg', 'webp'];
const OPT_VIDEO_EXT = ['mp4', 'mov', 'webm'];

function optVariantPath(string $rel, int $width): string
{
    return OPT_DIR . '/' . preg_replace('/\.[^.\/]+$/', '', $rel) . '-' . $width . '.webp';
}

function optIsImage(string $rel): bool
{
    return in_array(strtolower(pathinfo($rel, PATHINFO_EXTENSION)), OPT_IMAGE_EXT, true);
}

function optIsVideo(string $rel): bool
{
    return in_array(strtolower(pathinfo($rel, PATHINFO_EXTENSION)), OPT_VIDEO_EXT, true);
}

/** Génère les variantes d'une image. Retourne l'entrée du manifeste, ou null si non traitable. */
function optOptimizeImage(string $mediaRoot, string $rel, bool $force = false): ?array
{
    $source = $mediaRoot . '/' . $rel;
    if (!optIsImage($rel) || !is_file($source)) {
        return null;
    }

    if (extension_loaded('imagick')) {
        $image = new Imagick($source);
        if ($image->getNumberImages() > 1) {
            $image = $image->coalesceImages();
            $image->setIteratorIndex(0);
        }
        if (method_exists($image, 'autoOrient')) {
            $image->autoOrient();
        }
        $width = $image->getImageWidth();
        $height = $image->getImageHeight();
    } else {
        [$width, $height] = getimagesize($source) ?: [0, 0];
        $image = null;
    }
    if ($width < 1 || $height < 1) {
        return null;
    }

    // Toujours au moins une variante WebP (à la taille d'origine si l'image est petite)
    $widths = array_values(array_filter(OPT_WIDTHS, fn($w) => $w < $width));
    if (!$widths || $width < 2560 && $width > end($widths) * 1.15) {
        $widths[] = min($width, 2560);
    }

    foreach ($widths as $w) {
        $target = $mediaRoot . '/' . optVariantPath($rel, $w);
        if (!$force && is_file($target) && filemtime($target) >= filemtime($source)) {
            continue;
        }
        if (!is_dir(dirname($target))) {
            mkdir(dirname($target), 0755, true);
        }
        $h = (int)round($height * $w / $width);
        if ($image) {
            $variant = clone $image;
            $variant->stripImage();
            $variant->resizeImage($w, $h, Imagick::FILTER_LANCZOS, 1);
            $variant->setImageFormat('webp');
            $variant->setImageCompressionQuality(OPT_WEBP_QUALITY);
            $variant->setOption('webp:method', '5');
            $variant->setOption('webp:alpha-quality', '90');
            $variant->writeImage($target);
            $variant->clear();
        } else {
            $src = imagecreatefromstring((string)file_get_contents($source));
            $dst = imagecreatetruecolor($w, $h);
            imagealphablending($dst, false);
            imagesavealpha($dst, true);
            imagecopyresampled($dst, $src, 0, 0, 0, 0, $w, $h, $width, $height);
            imagewebp($dst, $target, OPT_WEBP_QUALITY);
        }
        chmod($target, 0644);
    }
    $image?->clear();

    sort($widths);
    return ['w' => $width, 'h' => $height, 'widths' => $widths];
}

/** Référence la vidéo optimisée et son poster s'ils ont été produits. */
function optVideoEntry(string $mediaRoot, string $rel): ?array
{
    if (!optIsVideo($rel)) {
        return null;
    }
    $entry = [];
    $video = OPT_DIR . '/' . preg_replace('/\.[^.\/]+$/', '', $rel) . '.mp4';
    $poster = OPT_DIR . '/' . preg_replace('/\.[^.\/]+$/', '', $rel) . '.poster.webp';
    if (is_file($mediaRoot . '/' . $video)) {
        $entry['src'] = $video;
    }
    if (is_file($mediaRoot . '/' . $poster)) {
        $entry['poster'] = $poster;
    }
    return $entry ?: null;
}

/** Tous les médias d'origine (hors dossier _optimized). */
function optListMedia(string $mediaRoot): array
{
    $files = [];
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($mediaRoot, FilesystemIterator::SKIP_DOTS));
    foreach ($it as $file) {
        $rel = str_replace('\\', '/', substr($file->getPathname(), strlen($mediaRoot) + 1));
        if (str_starts_with($rel, OPT_DIR . '/') || str_starts_with(basename($rel), '.')) {
            continue;
        }
        if (optIsImage($rel) || optIsVideo($rel)) {
            $files[] = $rel;
        }
    }
    sort($files);
    return $files;
}

function optReadManifest(string $manifestFile): array
{
    $data = is_file($manifestFile) ? json_decode((string)file_get_contents($manifestFile), true) : null;
    return is_array($data) ? $data + ['images' => [], 'videos' => []] : ['images' => [], 'videos' => []];
}

/** Met à jour le manifeste sous verrou (plusieurs processus peuvent tourner en parallèle). */
function optUpdateManifest(string $manifestFile, callable $fn): array
{
    if (!is_dir(dirname($manifestFile))) {
        mkdir(dirname($manifestFile), 0755, true);
    }
    $lock = fopen($manifestFile . '.lock', 'c');
    flock($lock, LOCK_EX);
    try {
        $manifest = $fn(optReadManifest($manifestFile));
        $manifest['updated'] = date('c');
        ksort($manifest['images']);
        ksort($manifest['videos']);
        $tmp = $manifestFile . '.tmp-' . bin2hex(random_bytes(4));
        file_put_contents($tmp, json_encode($manifest, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        rename($tmp, $manifestFile);
        chmod($manifestFile, 0644);
        return $manifest;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

/** Optimise un média et l'enregistre dans le manifeste. */
function optProcess(string $mediaRoot, string $manifestFile, string $rel, bool $force = false): ?array
{
    $isVideo = optIsVideo($rel);
    $entry = $isVideo ? optVideoEntry($mediaRoot, $rel) : optOptimizeImage($mediaRoot, $rel, $force);
    optUpdateManifest($manifestFile, function (array $m) use ($rel, $entry, $isVideo) {
        $key = $isVideo ? 'videos' : 'images';
        if ($entry === null) {
            unset($m[$key][$rel]);
        } else {
            $m[$key][$rel] = $entry;
        }
        return $m;
    });
    return $entry;
}

/** État : combien de médias sont optimisés / à faire. */
function optStatus(string $mediaRoot, string $manifestFile): array
{
    $manifest = optReadManifest($manifestFile);
    $pending = [];
    $images = 0;
    foreach (optListMedia($mediaRoot) as $rel) {
        if (optIsImage($rel)) {
            $images++;
            $entry = $manifest['images'][$rel] ?? null;
            // Une image illisible (marquée "error") n'est pas retentée à chaque passage
            if (!$entry || (empty($entry['error']) && (!$entry['widths'] || !is_file($mediaRoot . '/' . optVariantPath($rel, (int)end($entry['widths'])))))) {
                $pending[] = $rel;
            }
        }
    }
    return ['images' => $images, 'optimized' => $images - count($pending), 'pending' => $pending, 'videos' => count($manifest['videos'])];
}
