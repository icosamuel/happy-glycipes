# Livraison M1

Pour les propositions de recettes courantes, suivre [la procédure d'ingestion jusqu'à publication](recipe-ingestion.md) et l'autorisation permanente de [AGENTS.md](../AGENTS.md). Le flux M1 ci-dessous concerne la livraison du milestone; une ingestion ordinaire n'exige pas de créer un nouveau milestone.

Le dépôt ne contenait ni code, ni instructions AGENTS, ni orchestrateur à sa création. Ce document établit le flux de livraison de ses sept tranches existantes, sans remplacer le plan #1.

1. Conserver chaque issue dans le milestone M1 et respecter ses dépendances.
2. Implémenter une tranche sur une branche `codex/`, avec validations adaptées aux critères de l'issue.
3. Ouvrir une PR décrivant le résultat, les preuves et les limites; examiner le diff et attendre la CI.
4. Fusionner la PR validée; attendre Pages et démontrer le résultat consommable avant de fermer l'issue.
5. Fermer M1 uniquement après la démonstration complète du parcours décrit dans #1.

Une amorce README est nécessaire sur main pour rendre possible la première PR d'un dépôt vide. Les contenus locaux de conception sont conservés et seuls les fichiers nécessaires à la tranche sont ajoutés aux commits.
