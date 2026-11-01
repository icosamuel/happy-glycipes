# Nutrition des propositions #19 à #21

Correction du 1er novembre 2026 à la demande du propriétaire. Les corps des trois issues GitHub ont été relus, ainsi que les commentaires de #20 pour vérifier la base du tableau des croquettes. Cette décision remplace les omissions nutritionnelles décrites dans les preuves historiques `proposals-19-20.md` et `proposal-21-and-croquettes.md`.

- [Pain aux olives, #19](https://github.com/icosamuel/happy-glycipes/issues/19) : par tranche si le pain est coupé en 12; environ 185 kcal, 15 g de lipides, 7 g de protéines, 6 g de glucides totaux, 4 g de fibres et 2 g de glucides nets.
- [Pain à la citrouille, #21](https://github.com/icosamuel/happy-glycipes/issues/21) : par portion, environ 8 portions; 291 kcal, environ 24 g de lipides, 11 g de glucides totaux, 5 g de fibres, 6 g de glucides nets, 10 g de protéines et 220 mg de sodium.
- [Croquettes, #20](https://github.com/icosamuel/happy-glycipes/issues/20) : 350–390 kcal, 30–35 g de protéines, 22–27 g de lipides, 3–5 g de glucides nets et 2–4 g de fibres. La base n’est précisée ni dans le corps ni dans les commentaires. Valeurs affichées dans la fiche avec cette mention, conservées dans `wiki.reportedNutrition` et exclues du JSON-LD nutritionnel pour ne pas leur attribuer une portion inventée. Aucun total de glucides déduit.

Les estimations et leurs approximations sont reprises avec provenance, sans validation ni recalcul. Le rendu affiche la base source propre à chaque fiche; fibres et sodium portent des libellés français. Les glucides nets restent séparés des glucides totaux. Les avertissements d’omission devenus inexacts sont remplacés; les autres décisions éditoriales sont conservées.

Validation : 24 tests réussis; build de 5 recettes, 26 pages générées et 318 liens/assets internes vérifiés. Les tests couvrent les valeurs affichées, leurs bases, leur attribution et l’absence de nutrition structurée pour la base inconnue des croquettes.
