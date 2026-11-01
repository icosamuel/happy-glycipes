# Relire et publier

Les états `draft`, `ready`, `published` décrivent l'édition. `experience` décrit une expérience de cuisine (par défaut « non testé »). Publier ne valide ni le goût ni la nutrition ni la conformité keto.

Pour une ingestion confiée à un agent, [la procédure complète](recipe-ingestion.md) autorise la fusion après relecture et CI verte, sans nouvelle confirmation, puis impose la vérification de publication avant clôture des issues. La relecture décrite ici fait partie de cette mission; elle n'ajoute pas une attente d'approbation du propriétaire, sauf consigne explicite ou protection GitHub.

1. Importer avec la commande documentée. Conserver le rapport et les champs source, hors du site public.
2. Relire quantités et portions, étapes, relations/allocations, produits courants, catégorie/tags, attribution, nutrition, droits et ambiguïtés. Les suggestions de liens ne deviennent des liens qu'après validation explicite.
3. Remplacer la reprise non autorisée par des notes reformulées et un lien vers l'original. Indiquer `rights.mode: reference-notes`. Pour un texte original ou licencié, conserver sa preuve dans `rights.evidence`.
4. Renseigner `wiki.review` avec la date, l'identité du relecteur et les neuf décisions explicites. Une ambiguïté reconnue peut rester : elle doit être décrite dans `warnings`, visible dans la fiche. Examiner systématiquement les données nutritionnelles : conserver et afficher les valeurs déclarées avec source, unités, approximations/fourchettes et base. Une base inconnue doit être indiquée et empêche leur export nutritionnel structuré, sans effacer leur affichage comme données rapportées. Les valeurs absentes restent inconnues, jamais mises à zéro. Les glucides nets restent attribués à leur source et séparés des glucides totaux. Voir [le détail nutritionnel de la procédure](recipe-ingestion.md#valeurs-nutritionnelles--examen-systématique).
5. Déplacer seulement le contenu relu dans `content/recipes/ID.json`, état `published`, puis ouvrir une PR. Les brouillons ne sont jamais des données du générateur. Exécuter `npm test` et `npm run build`, examiner le diff et attendre la CI avant fusion.
6. Attendre le déploiement Pages; vérifier la recette, les rubriques et l'index de recherche publics. Un réimport crée une comparaison, pas une mise à jour éditoriale.

## Photos

Aucune photo n'est téléchargée par l'importateur. Avant ajout manuel, documenter séparément crédit, URL source, licence/permission et URL de preuve dans `wiki.media`. Le chemin doit pointer sur un fichier local `assets/media/nom.jpg|png|webp|avif`. Optimiser la taille avant ajout. Le build refuse les métadonnées incomplètes et les fichiers absents. L'illustration SVG du carnet n'est jamais déclarée photo du plat dans le JSON-LD.

Exemple : `{"path":"assets/media/concombre.webp","credit":"Auteur","source":"https://…","permission":{"license":"CC BY 4.0","evidenceUrl":"https://…"}}`.

## Contrat éditorial

L'enveloppe version 1 contient `recipe` (champs Schema.org simples) et `wiki` (usages, étapes structurées, provenance, allocations, décisions de publication). Les instructions et ingrédients du JSON-LD sont dérivés des mêmes données éditoriales que la fiche; ne pas maintenir un second exemplaire modifiable. Les étapes peuvent utiliser des références explicites `{{allocation:pate}}`, `{{ingredient:ID}}`, `{{count:ID}}`, `{{article:ID}}`. Les temps en texte libre ne sont pas multipliés.

Un JSON-LD cohérent n'est pas une promesse de résultats enrichis Google : les exigences des moteurs sont distinctes du contrat du carnet.
