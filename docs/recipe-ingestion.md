# Ingérer une recette jusqu'à sa publication

Cette procédure s'applique quand le propriétaire lance un agent pour traiter une ou plusieurs propositions GitHub. Elle autorise l'agent à préparer et relire la PR, attendre les validations, fusionner et vérifier GitHub Pages **sans nouvelle confirmation humaine**. Une demande explicite limitant le travail à un brouillon ou interdisant la fusion reste prioritaire. Une revue humaine n'est requise que si une protection du dépôt l'impose ou si une décision bloquante ne peut être résolue avec les sources disponibles.

La proposition seule ne déclenche aucun agent ni workflow. L'agent utilise l'accès GitHub déjà autorisé pour sa mission; il ne crée pas de secret et n'active pas l'approbation de PR par Actions.

## 1. Établir le périmètre et la source

Lire [import.md](import.md), [editorial.md](editorial.md), [proposals.md](proposals.md), puis les issues demandées **et leurs commentaires**. Chercher une fiche ou PR existante pour éviter un doublon. Une correction fournie dans le chat doit être consignée dans l'issue avec son origine, puis répercutée uniquement sur les points concernés.

Vérifier la branche, la révision et les modifications locales. Partir du `origin/main` actuel sur une branche `codex/`. Si le checkout est sale ou partagé, créer un worktree propre; ne pas intégrer, écraser ou stasher le travail d'une autre session. Une PR commune convient à un petit lot cohérent; isoler une recette bloquée permet de publier les autres.

Deux entrées sont acceptées :

- **URL externe publique :** utiliser `npm run import -- --url URL`. S'il y a plusieurs Recipe, choisir explicitement avec `--recipe INDEX` après lecture des candidats. Conserver le rapport et les champs source utiles. Sans Recipe exploitable, compléter un brouillon manuellement à partir de la référence lisible.
- **Recette collée dans l'issue :** lire le texte et les commentaires via GitHub, préparer manuellement l'enveloppe version 1 et consigner « ingestion manuelle depuis l'issue ». L'URL de l'issue devient la référence; conserver le texte source utile et les permaliens des précisions. Il n'est pas nécessaire de scraper la page GitHub pour constater l'absence de JSON-LD. Ne pas fabriquer un Recipe source ni prétendre à une extraction automatique.

Le proposant n'est pas nécessairement l'auteur original : les distinguer dans l'attribution. Consigner les décisions et les seules preuves utiles sous `docs/evidence/`, sans HTML complet, secrets ni données personnelles superflues. Les brouillons restent hors des index publics.

## 2. Relire les données éditoriales

Utiliser une fiche actuelle comme exemple de structure et les validateurs du dépôt comme contrat. Renseigner les neuf décisions de `wiki.review.checklist` après examen réel, avec date et identité du relecteur. La relecture par un agent est indiquée comme telle; elle ne signifie pas que la recette a été cuisinée.

- **Quantités et rendement :** conserver les unités et équivalences source sans conversion volume–masse supposée. Distinguer portions repas, tranches et pièces : `recipe.recipeYield` reste la base numérique et `wiki.yieldUnit` précise par exemple `tranches` ou `croquettes`. Conserver les approximations et plages dans les notes. Les 90 croquettes d'un lot ne deviennent pas 90 portions repas.
- **Usages et allocations :** compter chaque ingrédient une seule fois. Une préparation liée ne rajoute pas les ingrédients déjà inclus. Classer l'usage courant selon son rôle et sa quantité; une quantité mesurée importante reste à prévoir. Distinguer provisions de base, variantes, alternatives, garnitures et sauces facultatives; ne pas les cumuler automatiquement.
- **Étapes :** reformuler en conservant le sens, les températures et les incertitudes. Utiliser les références structurées existantes pour les quantités qui doivent suivre ×1/×2/×3, y compris le nombre de tranches ou pièces. Ne pas multiplier les temps, températures et valeurs nutritionnelles par portion, ni remplacer les chiffres dans du texte libre.
- **Rubriques et taxonomie :** réutiliser identifiants et alias; ajouter un article seulement s'il apporte un contenu réutilisable. Les liens dans les étapes peuvent suffire pour une technique : ne pas inventer une allocation pour obtenir un lien entrant. Vérifier les catégories/tags contrôlés et leur régénération.
- **Provenance et droits :** conserver les lignes et étapes source comme provenance, les adaptations dans les données éditoriales. Sans permission de reprise intégrale établie, publier une référence avec notes reformulées (`reference-notes`). Ne pas télécharger de photo sans permission documentée. Le traitement du texte et des photos ne remplace pas l'examen distinct des données nutritionnelles.

### Valeurs nutritionnelles : examen systématique

Chercher les tableaux et valeurs dans la source, le texte de l'issue **et ses commentaires**, même lorsque l'importateur ne les extrait pas. Relever chaque valeur avec son libellé, son unité, sa provenance et la base annoncée : par portion, tranche, pièce, 100 g ou lot. Vérifier que cette base correspond bien au rendement présenté; ne pas la déduire du seul nombre de pièces de la recette.

- Reprendre les chiffres déclarés, y compris les estimations, signes « environ » et fourchettes. Une méthode de calcul non documentée ou non vérifiée n'est pas une raison de supprimer les valeurs : les présenter comme déclarées/estimées par la source, non recalculées ni validées.
- Si la base est connue, l'afficher explicitement avec les conditions pertinentes, par exemple « par tranche si coupé en 12 ». N'exporter dans `recipe.nutrition` que les données dont la base est explicite et représentable fidèlement par le contrat courant.
- Si la base n'est pas précisée, conserver les valeurs déclarées dans les données wiki et les afficher avec « base non précisée dans la source ». Les exclure du JSON-LD nutritionnel plutôt que leur attribuer une portion inventée. Si le contrat ou le rendu ne permet pas encore cette distinction, ajouter le support minimal avec une validation ciblée; ne pas perdre les données pour contourner cette limite.
- Distinguer glucides totaux, fibres et glucides nets. Les glucides nets restent dans l'extension wiki; ne pas les exporter comme glucides totaux ni calculer un total absent. Conserver les autres champs fournis, dont énergie, protéines, lipides et sodium, avec leurs unités.
- Une donnée absente reste inconnue, jamais zéro. Ne pas créer d'estimation depuis les ingrédients, changer la base, convertir le lot en portion ou recalculer les macros sans une demande distincte. Les contrôles ×1/×2/×3 ne modifient pas les valeurs déclarées par unité de référence. Aucune conformité keto n'est déduite de ces chiffres.

Avant validation, comparer l'inventaire nutritionnel de la source avec la fiche et les données conservées : aucune valeur ne doit disparaître silencieusement. Documenter toute exclusion réellement nécessaire et sa raison, ainsi que les contradictions ou corrections. Supprimer les anciens avertissements devenus faux (« nutrition non reprise », par exemple) sans effacer les autres incertitudes. Consigner l'examen dans la décision `nutrition` de `wiki.review.checklist`.

Une marque, un moule, une texture ou un temps réel non testé peut rester à confirmer explicitement dans `warnings`; cela ne bloque pas à soi seul une référence non testée. En revanche, ne pas transformer une température sans unité en consigne précise supposée, ni rendre une étape dangereuse exécutable par simple ajout d'un avertissement. Si une instruction essentielle ne peut être présentée de façon fiable ou si un champ obligatoire manque, garder la fiche en brouillon et demander la précision ciblée. Continuer les autres recettes. Toute recommandation de sécurité alimentaire ajoutée doit reposer sur une source officielle vérifiée et citée.

Conserver un identifiant stable. Pour un réimport, examiner la comparaison et préserver les corrections, y compris celles déjà publiées; ne pas remplacer le contenu par la dernière extraction. Vérifier cette préservation lorsqu'une fiche existante ou l'importateur est touché, avec un diff ou des empreintes avant/après.

## 3. Valider et ouvrir la PR

Exécuter `npm test` et `npm run build` sur la candidate stable. Le build valide les contenus, génère HTML/JSON-LD/index et vérifie les liens internes. Installer les dépendances verrouillées avec `npm ci` si nécessaire. Adapter l'appel au runtime disponible sans supposer un chemin local spécifique à un poste.

Examiner les pages générées des recettes concernées : provisions et usages courants, rendement et références de quantités, attribution et avertissements, valeurs nutritionnelles fournies avec leurs bases/provenance, JSON-LD cohérent, présence dans la recherche et liens entrants depuis les rubriques. Pour un changement du traitement nutritionnel, couvrir la base connue, la base inconnue, les estimations/fourchettes et la séparation glucides totaux/nets; vérifier le rendu et l'export structuré. Ne pas ajouter un test qui répète simplement chaque champ d'une recette; ajouter un test ciblé lorsqu'un nouveau comportement ou une régression le justifie. Les tests de catalogue ne doivent pas supposer un nombre global fixe de recettes/liens ni leur ordre de fichiers.

Relire le diff final : uniquement les contenus, éventuels correctifs nécessaires et preuves de la mission. Corriger les régressions nécessaires sans transformer l'ingestion en refonte. Si du code change, valider son contrat affecté et inclure l'explication dans la PR. Réexécuter les contrôles invalidés par une modification; ne pas répéter les mêmes vérifications sans changement pertinent.

Ouvrir une PR prête à relire, liée aux propositions. Décrire le résultat, les choix éditoriaux, les ambiguïtés publiables, les droits, les validations et les éventuels blocages. Ajouter le lien aux issues. Ne pas employer une fermeture automatique d'issue à la fusion : la clôture attend la vérification Pages.

## 4. Fusionner sans attendre une confirmation

Attendre les contrôles CI requis **sur le SHA exact du dernier commit de la PR** et vérifier que le diff relu est toujours le même. Une CI verte d'un commit antérieur ne suffit pas. Respecter toute revue obligatoire ou protection GitHub existante; ne pas s'auto-approuver ni affaiblir les protections. En l'absence de revue imposée, la relecture éditoriale et du diff par l'agent suffit pour cette procédure.

Si la candidate est valide et qu'aucune décision bloquante ne reste, **fusionner la PR sans demander « puis-je merger ? »**, avec la méthode du dépôt (squash utilisé jusqu'ici) et une vérification du SHA attendu. Si la branche ou main a changé et exige une intégration, mettre à jour proprement et renouveler les preuves affectées. Ne pas forcer une fusion en échec ou ignorer une validation rouge.

Un refus d'accès, une protection exigeant une revue externe ou une panne persistante est un blocage à signaler avec l'action précise attendue. L'autorisation de publier ne permet pas de contourner ces restrictions.

## 5. Prouver la publication, puis clôturer

Après fusion, relever le commit de main et attendre le succès du build **et du déploiement Pages associés à ce commit**. Vérifier sur `https://icosamuel.github.io/happy-glycipes/` :

- l'accès direct aux recettes ajoutées/corrigées et la présence des dernières corrections;
- la source, l'attribution, les avertissements et le rendement correct;
- les valeurs nutritionnelles déclarées, leurs unités, approximations/fourchettes et base visible (y compris « non précisée »), sans ancien message d'omission devenu inexact;
- le JSON-LD analysable, cohérent avec la fiche, sans photo sans permission ni nutrition à base inventée;
- `search-index.json`, les rubriques avec leurs liens entrants et les catégories/tags concernés.

Pour un changement de contenu, ces contrôles HTTP et de données constituent la preuve de publication. Pour une modification d'interface, vérifier aussi les interactions concernées dans un navigateur si disponible. Décrire exactement ce qui a été vérifié; ne pas présenter un contrôle HTTP comme un test de clavier ou de mobile, ni fermer des critères d'interface distincts encore en attente.

Une fusion seule ne termine pas la mission. Si le déploiement échoue ou la page ne contient pas la révision attendue, diagnostiquer et corriger dans le périmètre autorisé; conserver les propositions ouvertes. Après succès, commenter chaque issue avec PR fusionnée, commit/run de déploiement, URL publique et limites éditoriales restantes, puis la clôturer. La clôture signifie « proposition traitée et publiée », sans validation culinaire ou nutritionnelle.

## Prompt court à donner à un agent

> Traite les propositions de recettes #NUMERO et #NUMERO en suivant AGENTS.md et docs/recipe-ingestion.md. Va jusqu'à la fusion et à la publication si les validations passent, puis vérifie Pages et clôture les issues avec les preuves. Ne demande pas de confirmation supplémentaire pour fusionner.

## Cas déjà livrés

Les propositions [#19](https://github.com/icosamuel/happy-glycipes/issues/19), [#20](https://github.com/icosamuel/happy-glycipes/issues/20) et [#21](https://github.com/icosamuel/happy-glycipes/issues/21) étaient des recettes collées dans les issues. Les [PR #22](https://github.com/icosamuel/happy-glycipes/pull/22) et [#24](https://github.com/icosamuel/happy-glycipes/pull/24) ont été fusionnées après CI verte et vérification publique. Elles illustrent les rendements de 12 tranches/90 croquettes, la correction sourcée de 375 °F et les mesures de citrouille sans conversion supposée. Voir les [décisions #19/#20](evidence/proposals-19-20.md) et [#21/croquettes](evidence/proposal-21-and-croquettes.md). Les nombres de tests/pages/liens de ces preuves sont historiques, pas des seuils permanents.
