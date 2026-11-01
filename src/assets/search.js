export const normalize = text => String(text??'').toLowerCase().replace(/œ/g,'oe').replace(/[’']/g,'').normalize('NFD').replace(/\p{Diacritic}/gu,'');
export function searchIndex(index,query) {
  const terms=normalize(query).trim().split(/\s+/).filter(Boolean);
  return terms.length ? index.filter(entry=>terms.every(t=>normalize([entry.name,...entry.terms].join(' ')).includes(t))).slice(0,12) : [];
}
export function matchesFilters(recipe,category,tag) {
  return (!category || recipe.category===category) && (!tag || recipe.tags.includes(tag));
}
