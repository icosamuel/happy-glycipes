# Proposer une recette

« Ajouter une recette » ouvre un formulaire d'issue GitHub. Un compte GitHub est requis. Coller une URL publique, des notes facultatives et les droits connus séparément pour texte et photos.

La proposition crée uniquement une issue : aucun workflow d'ingestion, aucun import et aucune PR automatique. Le propriétaire choisit quand déclencher un agent pour traiter les liens proposés.

L'agent lancé manuellement suit [l'importateur](import.md) puis [la relecture éditoriale](editorial.md) et prépare une PR de contenu à valider. Les imports restent des brouillons; les adaptations existantes ne sont pas écrasées.

Aucune permission supplémentaire GitHub Actions n'est requise pour proposer une URL. La permission globale de création/approbation de PR par Actions reste désactivée.
