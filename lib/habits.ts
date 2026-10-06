export type Entry={count:number;note:string};
export type Habit={id:string;name:string;icon:string;color:string;startDate:string;entries:Record<string,Entry>};
export const dayMs=86400000;
export const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export const stamp=(d:string)=>Date.parse(d+'T00:00:00Z');
export const dateKey=(n:number)=>new Date(n).toISOString().slice(0,10);
export function validDate(s:unknown):s is string{return typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(stamp(s))&&dateKey(stamp(s))===s&&s>='1900-01-01'&&s<='2200-12-31'}
export function validateHabits(value:unknown):Habit[]{
 if(!Array.isArray(value))throw Error('Sauvegarde invalide.');
 const ids=new Set<string>();
 return value.map((h)=>{if(!h||typeof h!=='object'||typeof h.id!=='string'||!h.id||h.id.length>100||ids.has(h.id)||typeof h.name!=='string'||!h.name.trim()||h.name.length>80||typeof h.icon!=='string'||h.icon.length>30||typeof h.color!=='string'||!/^#[0-9a-fA-F]{6}$/.test(h.color)||!validDate(h.startDate)||h.startDate>today()||!h.entries||typeof h.entries!=='object'||Array.isArray(h.entries))throw Error('Une tâche est invalide.');
 ids.add(h.id); const entries:Record<string,Entry>={};
 for(const [d,e] of Object.entries(h.entries)){const v=e as Entry;if(!validDate(d)||d<h.startDate||d>today()||!v||!Number.isSafeInteger(v.count)||v.count<0||v.count>1000000000||typeof v.note!=='string'||v.note.length>2000)throw Error('Une journée est invalide.');entries[d]={count:v.count,note:v.note};}
 return {id:h.id,name:h.name.trim(),icon:h.icon,color:h.color,startDate:h.startDate,entries};});
}
export function statistics(h:Habit,year:number,now=today()){
 const end=Math.min(stamp(now),stamp(year+'-12-31')),start=Math.max(stamp(h.startDate),stamp(year+'-01-01'));
 let total=0,active=0,best=0,run=0;
 for(let d=start;d<=end;d+=dayMs){const n=h.entries[dateKey(d)]?.count||0;total+=n;if(n>0){active++;run++;best=Math.max(best,run);}else run=0;}
 let allBest=0,allRun=0,allTotal=0;
 for(let d=stamp(h.startDate);d<=stamp(now);d+=dayMs){const n=h.entries[dateKey(d)]?.count||0;allTotal+=n;allRun=n>0?allRun+1:0;allBest=Math.max(allBest,allRun);}
 let current=0,cursor=stamp(now);if(!(h.entries[now]?.count>0))cursor-=dayMs;
 while(cursor>=stamp(h.startDate)&&(h.entries[dateKey(cursor)]?.count||0)>0){current++;cursor-=dayMs;}
 const elapsed=Math.max(0,Math.floor((stamp(now)-stamp(h.startDate))/dayMs)+1);
 return {total,active,best,allBest,current,mean:elapsed?allTotal/elapsed:0,elapsed};
}
export function level(n:number,mean:number){if(n<=0)return 0;const ratio=mean>0?n/mean:1;return ratio<0.5?1:ratio<1?2:ratio<1.5?3:4;}
export function cellColor(color:string,l:number){if(l===0)return '#e9ebf0';const a=[0,0.24,0.46,0.7,1][l];const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));return '#'+rgb.map(v=>Math.round(255+(v-255)*a).toString(16).padStart(2,'0')).join('');}
export function calendar(year:number){const first=stamp(year+'-01-01');const offset=(new Date(first).getUTCDay()+6)%7;const result:(string|null)[] = Array(offset).fill(null);for(let d=first;d<=stamp(year+'-12-31');d+=dayMs)result.push(dateKey(d));while(result.length%7)result.push(null);return result;}
