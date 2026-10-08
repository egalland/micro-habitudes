import {Habit,validateHabits} from './habits';

declare global {interface Window {microLocalJournal?: boolean}}
const key='micro-habitudes-pages-v1';
type Journal={tasks:Habit[];revision:number};
export const localJournal=()=>typeof window!=='undefined'&&window.microLocalJournal===true;

function readLocal():Journal {
 const raw=localStorage.getItem(key);
 if(raw===null)return {tasks:[],revision:0};
 const value=JSON.parse(raw);
 if(value.version!==1||!Number.isSafeInteger(value.revision)||value.revision<0)throw Error('La sauvegarde locale est invalide. Conservez un export avant de la remplacer.');
 return {tasks:validateHabits(value.tasks),revision:value.revision};
}
async function response(r:Response):Promise<Journal> {
 const d=await r.json();if(!r.ok)throw Error(d.error||'Le journal ne répond pas.');
 return {tasks:validateHabits(d.tasks),revision:d.revision};
}
export async function readJournal():Promise<Journal> {
 if(!localJournal())return response(await fetch('/api/journal',{cache:'no-store'}));
 try{return readLocal();}catch(e){throw Error('Chargement local impossible : '+(e instanceof Error?e.message:'stockage indisponible.'));}
}
export async function writeJournal(tasks:Habit[],revision:number):Promise<Journal> {
 if(!localJournal())return response(await fetch('/api/journal',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({tasks,revision})}));
 const current=readLocal();
 if(current.revision!==revision)throw Error('Le journal a changé dans un autre onglet. Exportez votre brouillon, puis rechargez avant de modifier le suivi.');
 const next={version:1,tasks:validateHabits(tasks),revision:revision+1};
 const serialized=JSON.stringify(next);
 try{localStorage.setItem(key,serialized);if(localStorage.getItem(key)!==serialized)throw Error('La vérification de la sauvegarde a échoué.');}
 catch{throw Error('Sauvegarde locale impossible. Exportez vos données et vérifiez le stockage de votre navigateur.');}
 return {tasks:next.tasks,revision:next.revision};
}
