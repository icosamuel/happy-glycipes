# Proposition de recettes — décision du propriétaire

Le 1 novembre 2026, le propriétaire a demandé un flux limité à une issue GitHub contenant le lien. Il déclenchera lui-même un agent pour l'ingestion. Le workflow privilégié d'import et de création de PR a été retiré, ses scripts et tests spécifiques aussi. Le formulaire et le lien public restent disponibles.

Le run de démonstration 41345321665 était déjà terminé en échec lors de l'arrêt demandé. Aucune PR automatique n'a été créée. La permission globale Actions reste `read`, avec `can_approve_pull_request_reviews: false`. Le workflow d'import a été désactivé immédiatement en attendant sa suppression fusionnée.

Cette décision remplace les anciens critères S7 d'autorisation par workflow et de création automatique de PR. Le parcours d'import manuel et de relecture reste disponible, documenté et testé séparément.
