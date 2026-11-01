# Proposer une recette

Le lien « Ajouter une recette » ouvre le formulaire GitHub; un compte GitHub est requis. Coller une URL publique, des notes facultatives et les droits connus. L'issue n'exécute aucun code privilégié.

## Mainteneur

Dans Actions, lancer **Prepare recipe proposal** depuis **main**, avec le numéro de l'issue. Équivalent : `gh workflow run proposal.yml -f issue_number=NUMERO`. Si plusieurs Recipe sont signalées, relancer avec `-f recipe_index=INDEX`. Les permissions write/maintain/admin de l'acteur sont vérifiées par l'API avant l'import. Aucun contenu de la proposition n'est interpolé dans une commande shell; le code provient de main.

Le job possède uniquement les écritures nécessaires aux branches/PR/commentaires. La création de PR par Actions doit être autorisée dans Settings → Actions → General → Workflow permissions → Allow GitHub Actions to create and approve pull requests. Le workflow n'appelle jamais l'approbation ou la fusion de PR. Les permissions globales restent en lecture.

Une exécution crée une branche `codex/proposal-NUMERO` et une PR draft contenant seulement le dossier de brouillon. La relance ajoute seulement `comparison.json` sur cette branche; les corrections existantes sont conservées. Une PR fermée est signalée sans nouvelle création. Les courses sur la branche échouent sans force-push; relancer après inspection. Une nouvelle URL dans la même issue produit une comparaison à examiner, pas une autre PR.

L'issue reçoit le statut et le vrai lien de PR. En cas d'erreur réseau, corriger ou réessayer. Une source sans Recipe produit un brouillon manuel. En cas de blocage de création de PR, télécharger l'artefact `recipe-proposal-NUMERO` du run (7 jours), puis ouvrir une PR manuellement sur la branche créée : `gh pr create --draft --head codex/proposal-NUMERO --title "Recette proposée" --body-file description.txt`. Si la branche n'a pas été créée, placer les fichiers de l'artefact sous `drafts/proposals/issue-NUMERO/` dans une branche de contenu et ouvrir une PR. Ne jamais annoncer une PR avant sa création.

Les PR créées avec GITHUB_TOKEN ne déclenchent généralement pas d'autre workflow automatiquement. Le mainteneur pousse les corrections éditoriales avec son accès habituel, ce qui déclenche la CI; il peut aussi lancer **Validate and publish** sur la branche. Suivre ensuite docs/editorial.md, attendre CI, marquer prête et fusionner explicitement. Les brouillons et leurs comparaisons ne sont jamais inclus dans le site.
