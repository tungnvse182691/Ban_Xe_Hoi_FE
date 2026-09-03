export interface SavedSearch { id:string; name:string; params: Record<string,string>; email?:string; createdAt:string; }

const KEY='tommycar_saved_searches';

export function getSavedSearches(): SavedSearch[]{
  try{ const raw=localStorage.getItem(KEY); return raw?JSON.parse(raw):[];}catch{return [];}
}
export function saveSavedSearch(s: SavedSearch){
  const cur=getSavedSearches();
  localStorage.setItem(KEY, JSON.stringify([s,...cur]));
}
export function deleteSavedSearch(id:string){
  localStorage.setItem(KEY, JSON.stringify(getSavedSearches().filter(x=>x.id!==id)));
}
export function buildName(params: Record<string,string>){
  const parts=[];
  if(params.brandId) parts.push(`Hãng ${params.brandId}`);
  if(params.condition) parts.push(params.condition==='New'?'Mới':'Cũ');
  if(params.search) parts.push(`"${params.search}"`);
  return parts.join(' • ') || 'Tất cả xe';
}
