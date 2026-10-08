import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';
const folder=await fs.mkdtemp(path.join(os.tmpdir(),'micro-journal-'));
try {
 for(const name of ['habits','journal']){
  const code=await fs.readFile(new URL('../lib/'+name+'.ts',import.meta.url),'utf8');
  const result=ts.transpileModule(code,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ESNext}});
  await fs.writeFile(path.join(folder,name+'.mjs'),result.outputText.replace("from './habits'","from './habits.mjs'"));
 }
 const data=new Map();let blocked=false;
 globalThis.window={microLocalJournal:true};
 globalThis.localStorage={getItem:k=>data.get(k)??null,setItem:(k,v)=>{if(blocked)throw Error('quota');data.set(k,v);}};
 globalThis.fetch=()=>{throw Error('No server allowed in Pages mode');};
 const {readJournal,writeJournal}=await import('file://'+path.join(folder,'journal.mjs'));
 const {today}=await import('file://'+path.join(folder,'habits.mjs'));
 assert.deepEqual(await readJournal(),{tasks:[],revision:0});
 const tasks=[{id:'one',name:'Lire',icon:'book',color:'#7155e8',startDate:today(),entries:{[today()]:{count:2,note:'Quelques pages'}}}];
 const saved=await writeJournal(tasks,0);assert.equal(saved.revision,1);assert.deepEqual((await readJournal()).tasks,tasks);
 await assert.rejects(writeJournal(tasks,0),/autre onglet/);
 blocked=true;await assert.rejects(writeJournal([],1),/Sauvegarde locale impossible/);assert.deepEqual((await readJournal()).tasks,tasks);
 blocked=false;await assert.rejects(writeJournal([{...tasks[0],name:''}],1),/invalide/);assert.equal((await readJournal()).revision,1);
 data.set('micro-habitudes-pages-v1','broken');await assert.rejects(readJournal(),/Chargement local impossible/);
 console.log('PASS: local save/reload, no server, concurrent change rejection, quota failure retains saved data, validation and corrupt-storage error.');
} finally {await fs.rm(folder,{recursive:true,force:true});}
