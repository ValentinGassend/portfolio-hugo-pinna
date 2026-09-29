# Hugo Pinna - Portfolio 2024

Ce projet constitue le portfolio d'Hugo Pinna.

## Structure du dossier

<p>

├── .eslintrc.cjs<br/>
├── .gitattributes <br/>
├── .gitignore <br/>
├── config.json <br/>
├── index.html <br/>
├── LICENSE <br/>
├── package.json <br/>
├── README.md <br/>
├── vite.config.js <br/>
├── public <br/>
│ └── vite.svg <br/>
└── src <br/>
├── App.jsx <br/>
├── App.scss <br/>
├── index.scss <br/>
├── main.jsx <br/>
├── assets <br/>
│ ├── react.svg <br/>
│ ├── js <br/>
│ │ ├── firebase.js <br/>
│ │ └── utils <br/>
│ ├── scss <br/>
│ └── utils <br/>
├── components <br/>
└── view <br/>
├── FirebaseView.jsx <br/>
├── ProjectListView.jsx <br/>
└── ProjectView.jsx <br/>
</p>


1. **Dossier Source (src)**:
    - **Composants (components)**: Contient des morceaux de code réutilisables.
    - **Vues (view)**: Comprend des composants UI spécifiques à différentes parties de l'application.


2. **Fichiers Principaux**:
    - **App.jsx et main.jsx**: Les fichiers principaux de l'application, définissant la structure globale et le point d'entrée.
    - **index.html**: La page principale HTML du projet.
    - **index.scss et App.scss**: Fichiers de styles pour l'application.


3. **Dossier Public (public)**:
    - **Contient vite.svg**: Une image statique accessible publiquement.


4. **Dossier Assets (assets)**:


5. **Fichiers Git et Documentation**:
    - **.gitattributes, .gitignore, README.md, LICENSE**: Gestion de versionnement, fichiers à ignorer, documentation et licence du projet.


6. **Autres Fichiers**:
    - **config.json, FolderList.txt**: Configurations supplémentaires, liste des dossiers, et éventuellement un document de sortie.

## Contenu et médias (100 % gratuit, sans Firebase)

- **CMS** : https://hugo-pinna.valentingassend.com/admin/ (remplace FireCMS, code dans `public/admin/`).
  Il modifie `/data/content.json` sur le serveur, lu par le site à chaque visite (pas de rebuild).
  Les fichiers envoyés vont dans `/media/<dossier>/<xxxxx>_<nom>`. Comptes, sessions et sauvegardes
  (100 dernières versions, restaurables depuis Réglages) sont dans `~/.hugo-pinna-cms/` sur le serveur, hors du web.
  Schéma des collections : `public/admin/schema.js`.
- **Optimisation des médias** (les originaux sont toujours conservés, les versions optimisées sont à côté dans `/media/_optimized/`) :
  - Images : variantes WebP 320 → 2560 px générées sur le serveur (Imagick), servies en `srcset`/`sizes`.
    Automatique à chaque upload du CMS ; bouton « Optimiser » dans Réglages, ou `npm run optimize:remote` (16 processus en SSH).
  - Vidéos : `npm run optimize:videos` (ffmpeg en local : H.264, 1920 px max, poster WebP) puis `npm run deploy`
    et `npm run optimize:remote` pour les référencer. Les vidéos envoyées depuis le CMS restent en original tant que ce script n'est pas relancé.
  - Manifeste lu par le site : `/data/media.json`. Polices en WOFF2 (TTF en secours).
- **Snapshot du contenu** : `src/data/content.json`, utilisé en dev et pour initialiser le serveur.
  Un déploiement n'écrase jamais le contenu en ligne.
- **Images / vidéos** : `public/media/<chemin>` (ex. `public/media/images/xxx.png`), servies par Vercel.
  `node scripts/download-media.mjs` télécharge tous les fichiers référencés dans `content.json`
  (depuis l'ancien bucket Firebase, ou une autre source via `MEDIA_SOURCE=https://.../`).
  `public/media` n'est pas versionné (3,3 Go) : il est hébergé sur Infomaniak.
- **Déploiement Infomaniak** (site + médias sur https://hugo-pinna.valentingassend.com) : `npm run deploy`
  (identifiants SFTP dans `.env.local`, voir l'en-tête de `scripts/deploy-infomaniak.mjs`).
- **Vercel** (hugopinna.com) : définir `VITE_MEDIA_BASE_URL=https://hugo-pinna.valentingassend.com/media`.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.


## Comment Exécuter le Projet

1. Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.
2. Clonez ce dépôt en utilisant la commande `git clone https://github.com/ValentinGassend/portfolio-hugo-pinna.git`.
3. Naviguez vers le répertoire du projet.
4. Installez les dépendances en utilisant la commande `npm i` ou `npm install`.
5. Lancez l'application avec `npm run dev`.
5. puis tappez `O` dans le terminal ou cliquez sur l'adresse local visible dans le terminal pour ouvrir le preview sur votre navigateur.
