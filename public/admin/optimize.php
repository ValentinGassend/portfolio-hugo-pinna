<?php
// Optimisation en masse (ligne de commande uniquement, inaccessible depuis le web).
// Usage (SSH) : php admin/optimize.php [--force] [--shard=1/8]
//   --force     régénère toutes les variantes
//   --shard=i/n ne traite qu'une part des fichiers (pour lancer n processus en parallèle)

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require __DIR__ . '/lib/optimizer.php';

$siteRoot = dirname(__DIR__);
$mediaRoot = $siteRoot . '/media';
$manifestFile = $siteRoot . '/data/media.json';

$force = in_array('--force', $argv, true);
[$shard, $shards] = [1, 1];
foreach ($argv as $arg) {
    if (preg_match('/^--shard=(\d+)\/(\d+)$/', $arg, $m)) {
        [$shard, $shards] = [(int)$m[1], max(1, (int)$m[2])];
    }
}

ini_set('memory_limit', '2048M');
set_time_limit(0);

$files = optListMedia($mediaRoot);
$mine = array_values(array_filter($files, fn($rel, $i) => $i % $shards === $shard - 1, ARRAY_FILTER_USE_BOTH));
$start = microtime(true);
$done = 0;
foreach ($mine as $i => $rel) {
    try {
        $t = microtime(true);
        $entry = optProcess($mediaRoot, $manifestFile, $rel, $force);
        $done++;
        $info = $entry === null ? '—' : (isset($entry['widths']) ? implode(',', $entry['widths']) . 'w' : 'vidéo');
        printf("[%d/%d] %s (%s, %.1fs)\n", $i + 1, count($mine), $rel, $info, microtime(true) - $t);
    } catch (Throwable $e) {
        fprintf(STDERR, "ERREUR %s : %s\n", $rel, $e->getMessage());
    }
}
printf("Terminé : %d fichiers en %.0fs\n", $done, microtime(true) - $start);
