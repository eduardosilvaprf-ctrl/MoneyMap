import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus } from '../types';
import { supabase } from '../lib/supabase';

interface KanbanState {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, newStatus: TaskStatus) => Promise<void>;
  reorderTasks: (tasks: Task[]) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      loadTasks: async () => {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error('Error loading tasks:', error);
          return;
        }

        if (data) {
          const formattedTasks: Task[] = data.map(t => ({
            id: t.id,
            name: t.name,
            amount: Number(t.amount),
            dueDate: t.due_date,
            notes: t.notes || '',
            status: t.status as TaskStatus,
            createdAt: t.created_at
          }));
          set({ tasks: formattedTasks });
        }
      },

      addTask: async (task) => {
        const newTask = {
          id: crypto.randomUUID(),
          name: task.name,
          amount: task.amount,
          due_date: task.dueDate,
          notes: task.notes,
          status: task.status,
        };

        // Optimistic update
        const optimisticTask: Task = {
          ...task,
          id: newTask.id,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          tasks: [...state.tasks, optimisticTask]
        }));

        const { error } = await supabase.from('tasks').insert([newTask]);
        if (error) {
          console.error('Error adding task:', error);
          // Rollback on error
          set((state) => ({
            tasks: state.tasks.filter(t => t.id !== newTask.id)
          }));
        }
      },

      updateTask: async (id, updates) => {
        const currentTasks = get().tasks;
        const taskToUpdate = currentTasks.find(t => t.id === id);
        if (!taskToUpdate) return;

        // Optimistic update
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));

        const supabaseUpdates: any = {};
        if (updates.name !== undefined) supabaseUpdates.name = updates.name;
        if (updates.amount !== undefined) supabaseUpdates.amount = Number(updates.amount);
        if (updates.dueDate !== undefined) supabaseUpdates.due_date = updates.dueDate;
        if (updates.notes !== undefined) supabaseUpdates.notes = updates.notes;
        if (updates.status !== undefined) supabaseUpdates.status = updates.status;

        const { error } = await supabase
          .from('tasks')
          .update(supabaseUpdates)
          .eq('id', id);

        if (error) {
          console.error('Error updating task:', error);
          // Rollback
          set({ tasks: currentTasks });
        }
      },

      deleteTask: async (id) => {
        const currentTasks = get().tasks;
        
        // Optimistic delete
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));

        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting task:', error);
          // Rollback
          set({ tasks: currentTasks });
        }
      },

      moveTask: async (id, newStatus) => {
        const currentTasks = get().tasks;

        // Optimistic move
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task
          ),
        }));

        const { error } = await supabase
          .from('tasks')
          .update({ status: newStatus })
          .eq('id', id);

        if (error) {
          console.error('Error moving task:', error);
          // Rollback
          set({ tasks: currentTasks });
        }
      },

      reorderTasks: (tasks) => set({ tasks }),
    }),
    {
      name: 'kanban-storage',
    }
  )
);
