import { StateCreator } from 'zustand';

export type ActionItem = { 
  id: string; 
  title: string; 
  goalTitle?: string; 
  type:'commitment'|'performance'|'one-time'; 
  time?: string; 
  streak: number; 
  done?: boolean; 
};

export type CompletedAction = {
  id: string;
  actionId: string;
  title: string;
  goalTitle?: string;
  completedAt: Date;
  isPrivate: boolean;
  streak: number;
  type: 'check' | 'photo' | 'audio' | 'milestone';
  mediaUrl?: string;
  category?: string;
};

export type DailySlice = {
  actions: ActionItem[];
  completedActions: CompletedAction[];
  toggleAction: (id:string)=>void;
  addAction: (a:ActionItem)=>void;
  addCompletedAction: (ca: CompletedAction)=>void;
};

export const createDailySlice: StateCreator<DailySlice> = (set) => ({
  actions: [],
  completedActions: [],
  toggleAction: (id) => set((s)=>({ 
    actions: s.actions.map(a => a.id===id ? ({...a, done: !a.done, streak: a.done ? a.streak : a.streak+1}) : a) 
  })),
  addAction: (a) => set((s)=>({ actions: [...s.actions, a] })),
  addCompletedAction: (ca) => set((s)=>({ 
    completedActions: [...s.completedActions, ca] 
  })),
});