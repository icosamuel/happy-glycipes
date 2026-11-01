# Happy Glycipes

Un carnet de cuisine public en français, publié sur GitHub Pages. Le contenu éditorial versionné fait autorité; les pages et le JSON-LD en sont dérivés. Aucun compte applicatif ni service distant n'est nécessaire pour consulter le carnet.

## Développer

Node 22 ou ultérieur et npm : `npm ci`, `npm test`, `npm run build`, `npm run dev`.
Le serveur local sert le site sous `/happy-glycipes/`. Les fichiers publiés sont dans `_site/`.

## Livraison

Le dépôt étant initialement vide, son flux de livraison est documenté dans [docs/delivery.md](docs/delivery.md). Les PR sont validées avant fusion; seule la branche `main` déclenche le déploiement Pages. Activer Pages avec la source **GitHub Actions** dans les paramètres du dépôt.

Le prototype du propriétaire est archivé dans `docs/design/`. Les exemples de conception ne sont pas des données publiées.
