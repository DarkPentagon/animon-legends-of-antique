const KEY='animon-story-progress-v1';
interface Progress { wildWins:number; trainerDefeated:boolean; questClaimed:boolean }
function load():Progress { try { const v=JSON.parse(localStorage.getItem(KEY)??'{}') as Partial<Progress>; return {wildWins:Math.max(0,Math.floor(v.wildWins??0)),trainerDefeated:Boolean(v.trainerDefeated),questClaimed:Boolean(v.questClaimed)}; } catch { return {wildWins:0,trainerDefeated:false,questClaimed:false}; } }
let progress=load();
function save():void { try { localStorage.setItem(KEY,JSON.stringify(progress)); } catch { /* Continue without browser storage. */ } }
export const QuestStore={
 get progress():Progress { return {...progress}; },
 recordWildVictory():void { progress.wildWins+=1; save(); },
 completeTrainer(id:string):void { if(id==='belison-trainer') progress.trainerDefeated=true; save(); },
 claimWildQuest():boolean { if(progress.wildWins<3||progress.questClaimed)return false; progress.questClaimed=true; save(); return true; },
};
