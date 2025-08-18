import { StateCreator } from 'zustand';

export type Milestone = {
  id: string;
  title: string;
  targetDate: Date;
  targetValue?: number;
  unit?: string;
  completed: boolean;
  order: number;
};

export type Goal = {
  id: string; 
  title: string; 
  metric: string; 
  deadline: string; 
  why?: string;
  consistency: number; 
  status: 'On Track'|'Needs Attention'|'Critical';
  color: string;
  category?: 'fitness' | 'mindfulness' | 'productivity' | 'health' | 'skills' | 'other';
  milestones?: Milestone[];
};

export type GoalsSlice = {
  goals: Goal[];
  addGoal: (g: Goal)=>void;
  updateGoalMilestones: (goalId: string, milestones: Milestone[]) => void;
  toggleMilestoneComplete: (goalId: string, milestoneId: string) => void;
};

export const createGoalsSlice: StateCreator<GoalsSlice> = (set) => ({
  goals: [],
  addGoal: (g) => set((s)=>({ goals: [g, ...s.goals] })),
  updateGoalMilestones: (goalId, milestones) => 
    set((state) => ({
      goals: state.goals.map(g => 
        g.id === goalId ? { ...g, milestones } : g
      )
    })),
  toggleMilestoneComplete: (goalId, milestoneId) =>
    set((state) => ({
      goals: state.goals.map(g => 
        g.id === goalId 
          ? {
              ...g,
              milestones: g.milestones?.map(m =>
                m.id === milestoneId ? { ...m, completed: !m.completed } : m
              )
            }
          : g
      )
    })),
});