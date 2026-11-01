# Importer une référence

`npm run import -- --url https://site-public/recette` prépare un dossier `drafts/import-…/` avec `recipe.json`, `source.json` (champs Recipe utiles seulement) et `report.json`. Rien n'est publié. Sans Recipe, le résultat est un brouillon manuel. Une erreur réseau est indiquée avec un code de sortie non nul : réessayer ou compléter manuellement.

Avec plusieurs Recipe, lire la liste puis relancer avec `--recipe INDEX` (index à partir de zéro). Les sections d'étapes et les lignes d'ingrédients originales restent dans la source. Les quantités et correspondances proposées doivent être relues. La nutrition et les images ne sont jamais approuvées par l'importateur.

Un réimport du même identifiant produit `comparison.json`; il ne remplace pas le brouillon corrigé. Comparer manuellement avant toute reprise. Les paramètres de suivi connus et fragments ne créent pas une nouvelle identité. Ne pas déplacer un brouillon dans les contenus publiés avant sa relecture.

## Réseau

HTTPS public sur port standard, aucune authentification dans l'URL, limite 1 Mio, 15 secondes et 3 redirections. Chaque destination DNS est contrôlée; la connexion est épinglée à l'adresse vérifiée. Les adresses privées, réservées, locales et IPv4 encapsulées dans IPv6 sont refusées. Aucun script de la page n'est exécuté, aucun média n'est téléchargé.

Les tests utilisent des sources synthétiques réservées aux tests. Une recette d'auteur peut ensuite fournir la démonstration complète sans grossir le catalogue avec des fixtures.
