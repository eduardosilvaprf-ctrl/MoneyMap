/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskDialog } from './components/TaskDialog';
import { Task } from './types';
import { useKanbanStore } from './store/useKanbanStore';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

export default function App() {
  const { i18n } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const { deleteTask } = useKanbanStore();

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.success('Task deleted successfully');
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="kanban-theme">
      <div className="min-h-screen bg-background text-foreground font-sans flex flex-col overflow-hidden select-none transition-colors duration-300">
        <Navbar onAddTask={handleAddTask} />
        
        <main className="flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background/80 via-background to-background dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
          <KanbanBoard 
            onEditTask={handleEditTask} 
            onDeleteTask={handleDeleteTask} 
          />
        </main>

        <footer className="h-10 border-t border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-medium">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Supabase Sync Active</span>
            </div>
            <span className="text-slate-800">|</span>
            <span>Vercel Edge Platform</span>
          </div>
          <div className="text-[10px] text-slate-600 flex items-center gap-1">
            <span>Current Locale:</span>
            <span className="text-slate-400 font-bold uppercase">{i18n.language}</span>
            <span className="mx-2">·</span>
            <span>Version 1.2.0-stable</span>
          </div>
        </footer>

        <TaskDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          task={editingTask}
        />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

