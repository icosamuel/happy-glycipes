# Proposer une recette

« Ajouter une recette » ouvre un formulaire d'issue GitHub. Un compte GitHub est requis. Fournir une URL publique ou coller la recette complète dans le champ prévu : ingrédients, quantités et étapes, ainsi que portions, temps et températures si connus. Au moins une des deux sources doit être fournie; une case obligatoire demande de le confirmer. Ajouter des notes facultatives et les droits connus séparément pour texte et photos.

La proposition crée uniquement une issue : aucun workflow d'ingestion, aucun import et aucune PR automatique. Le propriétaire choisit quand déclencher un agent pour traiter les recettes proposées, qu'elles proviennent d'un lien ou du texte de l'issue.

L'agent lancé manuellement suit [la procédure d'ingestion jusqu'à publication](recipe-ingestion.md) : préparation du brouillon depuis le lien ou le texte collé, relecture, tests/build, PR, attente de la CI sur le dernier commit, fusion sans nouvelle confirmation puis vérification Pages et clôture de l'issue. Une consigne explicite de brouillon seulement reste prioritaire. Les adaptations existantes ne sont pas écrasées.

Aucune permission supplémentaire GitHub Actions n'est requise pour proposer une recette. La permission globale de création/approbation de PR par Actions reste désactivée.
