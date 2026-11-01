# Démonstration d'import manuel et de relecture

Source originale du carnet : `docs/sources/concombre-citron.html`, servie par l'URL raw publique de main. Texte et données CC0 1.0; aucune photo. La recette est destinée au catalogue, sans affirmation de test en cuisine ni de conformité keto.

Commande : `npm run import -- --url https://raw.githubusercontent.com/icosamuel/happy-glycipes/main/docs/sources/concombre-citron.html`.

Le rapport initial est conservé dans `cucumber-import-report.json`. Le brouillon n'est pas construit dans le site. La relecture choisit l'identifiant stable `concombre-citron-menthe` tout en conservant `importId`, l'auteur, les dates, les lignes et étapes source. Elle confirme les deux portions, normalise la menthe en feuilles, valide le lien Concombre, classe le sel au goût comme produit courant, attribue catégorie/tags et reconnaît les données nutritionnelles et durées absentes. Le nom du relecteur indique explicitement une relecture automatisée et une recette non cuisinée.

Un deuxième appel à l'importateur produit seulement une comparaison dans `drafts/concombre-citron-menthe/`; l'empreinte du fichier éditorial reste identique. Aucune adaptation ni rubrique n'est écrasée.

Les 19 tests passent avec les deux recettes. Le build génère 16 sorties et vérifie 179 liens internes/assets. Recherche, catégories/tags et liens entrants sont dérivés du contenu ajouté. La preuve de déploiement est consignée dans les issues #7 et #16 après fusion; les vérifications interactives restent distinctes.
