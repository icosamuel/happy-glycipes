# Propositions #19 et #20 — décisions éditoriales

Relecture automatisée Codex le 1er novembre 2026. Issues et commentaires lus; aucun commentaire, URL de recette externe ou droit textuel/photographique documenté. jobed85 est le proposant; l’auteur original reste inconnu. Références : https://github.com/icosamuel/happy-glycipes/issues/19 et https://github.com/icosamuel/happy-glycipes/issues/20.

## Import

L’importateur existant `scripts/import.js --url URL_ISSUE` a été exécuté pour chaque proposition. Le premier essai réseau isolé a échoué avec EACCES; la relance autorisée a réussi. Le runtime Node embarqué et `.tools/package/bin/npm-cli.js` servent à exécuter les scripts npm sur ce poste où npm n’est pas dans PATH. Aucun Recipe exploitable : les rapports et brouillons initiaux sont conservés dans les sous-dossiers `proposals-19` et `proposals-20`. `source.json` est vide parce que l’importateur ne récupère que les champs Recipe; les issues restent les sources textuelles, aucune source synthétique n’a été fabriquée.

Les brouillons ont été complétés manuellement puis relus avant publication. Texte reformulé, mode `reference-notes`, aucun média. Les chiffres nutritionnels sources ne sont pas repris : méthode inconnue pour #19 et taille de portion absente pour #20. Aucune validation keto ni test culinaire.

## Pain aux olives

Un petit pain donne environ 12 tranches. Les masses explicites priment sur les équivalences en tasses; aucune densité n’est extrapolée, notamment pour les olives. Les 5 œufs et les liquides ne sont comptés qu’une fois. Options conservées dans les avertissements et exclues des provisions de base. Aucune préparation liée. Rubriques farine d’amande et psyllium reliées. Accompagnement / Au four; le parmesan n’est pas caractérisé quant à sa présure, donc pas de tag végétarien supposé.

À confirmer lors d’un essai : dimensions du moule, calibre des œufs, température de l’eau, type d’herbe, texture et temps de cuisson effectif. Aucun temps total inventé.

## Croquettes de poulet

Les 4 kg désignent le poulet, pas le poids final. Rendement annoncé : environ 90 croquettes, sans conversion en portions repas. Les 10 œufs appartiennent exclusivement au bain de panure. Les 700 g d’amande et 450 g de parmesan sont des provisions pour le lot; surplus et absorption inconnus. La technique liée n’ajoute aucun ingrédient. Huile inconnue classée produit courant; les quantités mesurées de sel et de poivre restent dans la liste visible.

Cayenne, couennes ou parmesan supplémentaire et sauces restent des options hors base. Le parmesan optionnel est un supplément de 200 g, les couennes une alternative de 150–200 g; aucun cumul automatique. Aucune allocation de sauce inventée.

À confirmer : unité de « 375° », état des pièces à la cuisson, dimensions et nombre de fournées. Les 22 minutes restent une indication source non validée, pas un temps de cuisson du lot. Aucun réglage en °F supposé. Un contrôle à cœur à 74 °C a été ajouté avec la référence de Santé Canada dans la rubrique Paner. Ces incertitudes sont visibles dans les notes et étapes publiées; elles n’empêchent pas une publication comme référence non testée.

## Vérifications

22 tests réussis; build : 4 recettes, 23 sorties et 275 liens/assets internes vérifiés. Réimports réels : comparaisons créées dans `drafts/pain-olives/` et `drafts/croquettes-poulet/`; les quatre empreintes des fiches publiées et des brouillons relus restent identiques (voir `proposals-reimport.json`). La CI et le déploiement sont consignés dans la PR. Le champ optionnel `wiki.yieldUnit` précise le rendement affiché et celui du JSON-LD sans changer la base numérique du multiplicateur. Les liens de rubriques dans les étapes alimentent aussi les liens entrants et la recherche. Aucun contenu local préexistant de conception ni ancienne adaptation n’est inclus dans les changements.
